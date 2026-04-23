import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"

const historyQuerySchema = z.object({
  userId: z.string().optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
    const { searchParams } = request.nextUrl
    const rawParams = Object.fromEntries(searchParams.entries())
    const parsed = historyQuerySchema.safeParse(rawParams)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { userId, from, to, page, limit } = parsed.data

    const where = {
      ...(userId ? { userId } : {}),
      ...((from ?? to)
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    }

    const skip = (page - 1) * limit

    const tenantDb = getTenantDb()
    const [checkpoints, total] = await Promise.all([
      tenantDb.checkpoint.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              ninjaAlias: true,
              avatarUrl: true,
            },
          },
        },
      }),
      tenantDb.checkpoint.count({ where }),
    ])

    return NextResponse.json({ checkpoints, total, page })
  })
}
