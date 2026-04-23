import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Role } from "@/generated/prisma/client"
import { db } from "@/lib/db"
import { requireSuperAdmin } from "@/lib/auth"
import { ALL_ROLES } from "@/lib/types"

const listQuerySchema = z.object({
  organizationId: z.string().optional(),
  role: z.enum(ALL_ROLES as [string, ...string[]]).transform((r) => r as Role).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/**
 * GET /api/super-admin/users
 * Returns a paginated list of all users across all organizations.
 * Each user record includes the organization name.
 * Auth: super admin only. Uses raw db (cross-tenant).
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

  const { organizationId, role, search, page, limit } = parsed.data
  const skip = (page - 1) * limit

  const where = {
    ...(organizationId ? { organizationId } : {}),
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ organization: { name: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isSuperAdmin: true,
        avatarUrl: true,
        ninjaAlias: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    }),
    db.user.count({ where }),
  ])

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
