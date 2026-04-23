import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, requireRole } from "@/lib/auth"
import { generateOrgSlug } from "@/lib/invite-code"
import { OrgSelfUpdateSchema } from "@/lib/schemas/organization-schemas"

/**
 * GET /api/organizations/current
 * Returns the current user's organization name, slug, and user count.
 * Auth: any authenticated user.
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireAuth()
  if (error) return error

  const org = await db.organization.findUnique({
    where: { id: session.organizationId },
    include: {
      _count: {
        select: { users: true },
      },
    },
  })

  if (!org) {
    return NextResponse.json(
      { error: "Organização não encontrada." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    organization: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      isActive: org.isActive,
      userCount: org._count.users,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    },
  })
}

/**
 * PATCH /api/organizations/current
 * Allows a TECH_LEAD to update their organization's name.
 * The slug is automatically derived from the new name.
 * Slug uniqueness is checked — returns 409 on conflict.
 * Auth: TECH_LEAD only.
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireRole("TECH_LEAD")
  if (error) return error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 })
  }

  const parsed = OrgSelfUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name } = parsed.data
  const slug = generateOrgSlug(name)

  if (!slug) {
    return NextResponse.json(
      { error: "Nome da organização inválido — não foi possível gerar um slug." },
      { status: 400 }
    )
  }

  // Check slug uniqueness, excluding the current organization
  const conflict = await db.organization.findUnique({ where: { slug } })
  if (conflict && conflict.id !== session.organizationId) {
    return NextResponse.json(
      { error: "Já existe uma organização com um nome similar. Escolha um nome diferente." },
      { status: 409 }
    )
  }

  const updated = await db.organization.update({
    where: { id: session.organizationId },
    data: { name, slug },
  })

  return NextResponse.json({
    organization: {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  })
}
