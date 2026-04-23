import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  unread: z
    .string()
    .optional()
    .transform((v) => v === "true"),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    const { searchParams } = request.nextUrl
    const rawParams = Object.fromEntries(searchParams.entries())
    const parsed = querySchema.safeParse(rawParams)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { limit, unread } = parsed.data
    const userId = session.userId

    const where = {
      userId,
      ...(unread ? { isRead: false } : {}),
    }

    const tenantDb = getTenantDb()
    const [notifications, unreadCount] = await Promise.all([
      tenantDb.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          // Include the publicId so the frontend can navigate to /ticket/:publicId
          ticket: { select: { publicId: true } },
        },
      }),
      tenantDb.notification.count({ where: { userId, isRead: false } }),
    ])

    return NextResponse.json({ notifications, unreadCount })
  })
}
