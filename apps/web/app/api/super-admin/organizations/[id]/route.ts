import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireSuperAdmin } from "@/lib/auth"
import { generateOrgSlug } from "@/lib/invite-code"
import { OrgUpdateSchema } from "@/lib/schemas/organization-schemas"

/**
 * GET /api/super-admin/organizations/[id]
 * Returns full details for a single organization including user list,
 * active ticket count, and config summary.
 * Auth: super admin only. Uses raw db (cross-tenant).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { error } = await requireSuperAdmin()
  if (error) return error

  const { id } = await params

  const org = await db.organization.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          isSuperAdmin: true,
          createdAt: true,
        },
        orderBy: { name: "asc" },
      },
      _count: {
        select: {
          tickets: true,
        },
      },
      checkpointConfigs: {
        select: {
          intervalMinutes: true,
          isEnabled: true,
        },
        take: 1,
      },
      tvConfigs: {
        select: {
          isEnabled: true,
        },
        take: 1,
      },
    },
  })

  if (!org) {
    return NextResponse.json(
      { error: "Organização não encontrada." },
      { status: 404 }
    )
  }

  // Count only active tickets (not DONE and not CANCELLED)
  const activeTicketCount = await db.ticket.count({
    where: {
      organizationId: id,
      status: { notIn: ["DONE", "CANCELLED"] },
    },
  })

  return NextResponse.json({
    organization: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      isActive: org.isActive,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      userCount: org.users.length,
      totalTicketCount: org._count.tickets,
      activeTicketCount,
      users: org.users,
      config: {
        checkpoint: org.checkpointConfigs[0] ?? null,
        tv: org.tvConfigs[0] ?? null,
      },
    },
  })
}

/**
 * PATCH /api/super-admin/organizations/[id]
 * Updates name, slug, and/or isActive for any organization.
 * Slug changes check uniqueness (409 on conflict).
 * Deactivating an org prevents its users from logging in.
 * Auth: super admin only. Uses raw db (cross-tenant).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { error } = await requireSuperAdmin()
  if (error) return error

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 })
  }

  const parsed = OrgUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, slug: slugInput, isActive } = parsed.data

  // Verify the org exists before attempting the update
  const existing = await db.organization.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json(
      { error: "Organização não encontrada." },
      { status: 404 }
    )
  }

  // Determine the effective slug: explicit override → derived from new name → keep existing
  let slug: string | undefined
  if (slugInput !== undefined) {
    slug = slugInput
  } else if (name !== undefined) {
    slug = generateOrgSlug(name)
  }

  // If slug changes, ensure it remains unique
  if (slug !== undefined && slug !== existing.slug) {
    const conflict = await db.organization.findUnique({ where: { slug } })
    if (conflict) {
      return NextResponse.json(
        { error: "Já existe uma organização com este slug. Escolha um slug diferente." },
        { status: 409 }
      )
    }
  }

  const updated = await db.organization.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
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
