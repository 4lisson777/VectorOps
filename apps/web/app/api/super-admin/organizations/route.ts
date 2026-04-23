import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { requireSuperAdmin } from "@/lib/auth"
import { generateOrgSlug } from "@/lib/invite-code"
import { OrgCreateSchema } from "@/lib/schemas/organization-schemas"
import { ALL_ROLES } from "@/lib/types"

// Default RoleNotificationConfig applied to every new organization (mirrors seed/register)
const DEFAULT_ROLE_NOTIFICATION_CONFIGS = ALL_ROLES.map((role) => ({
  role,
  notifyOnCreation: false,
  notifyOnAssignment: false,
}))

const listQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/**
 * GET /api/super-admin/organizations
 * Returns a paginated list of all organizations with user count, ticket count,
 * and isActive status. Auth: super admin only. Uses raw db (cross-tenant).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireSuperAdmin()
  if (error) return error

  const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries())
  const parsed = listQuerySchema.safeParse(rawParams)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros de consulta inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { search, isActive, page, limit } = parsed.data
  const skip = (page - 1) * limit

  const where = {
    ...(isActive !== undefined ? { isActive } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } },
          ],
        }
      : {}),
  }

  const [organizations, total] = await Promise.all([
    db.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            users: true,
            tickets: true,
          },
        },
      },
    }),
    db.organization.count({ where }),
  ])

  const data = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    isActive: org.isActive,
    userCount: org._count.users,
    ticketCount: org._count.tickets,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
  }))

  return NextResponse.json({
    organizations: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

/**
 * POST /api/super-admin/organizations
 * Creates a new empty organization with default configs.
 * No user is created — users join via invite.
 * Auth: super admin only. Uses raw db (cross-tenant).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireSuperAdmin()
  if (error) return error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 })
  }

  const parsed = OrgCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, slug: slugOverride } = parsed.data

  // Derive slug from name or use the provided override
  const slug = slugOverride ?? generateOrgSlug(name)
  if (!slug) {
    return NextResponse.json(
      { error: "Nome da organização inválido — não foi possível gerar um slug." },
      { status: 400 }
    )
  }

  // Slug must be globally unique
  const existing = await db.organization.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json(
      { error: "Já existe uma organização com este slug. Escolha um nome ou slug diferente." },
      { status: 409 }
    )
  }

  const org = await db.$transaction(async (tx) => {
    const created = await tx.organization.create({
      data: { name, slug },
    })

    // Seed default configs so the org is immediately operational when the first user joins
    await tx.checkpointConfig.create({
      data: { organizationId: created.id },
    })

    await tx.tvConfig.create({
      data: { organizationId: created.id },
    })

    await tx.roleNotificationConfig.createMany({
      data: DEFAULT_ROLE_NOTIFICATION_CONFIGS.map((cfg) => ({
        ...cfg,
        organizationId: created.id,
      })),
    })

    return created
  })

  return NextResponse.json(
    {
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        isActive: org.isActive,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      },
    },
    { status: 201 }
  )
}
