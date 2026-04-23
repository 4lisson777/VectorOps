import { NextResponse } from "next/server"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"

/**
 * Returns all unacknowledged persistent notifications for the authenticated user.
 * The frontend calls this on mount/refresh to resume the repeat interval for any
 * notifications that were never acknowledged in a previous session.
 */
export async function GET(): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    const tenantDb = getTenantDb()
    const notifications = await tenantDb.notification.findMany({
      where: {
        userId: session.userId,
        requiresAck: true,
        acknowledgedAt: null,
      },
      orderBy: { createdAt: "desc" },
      include: {
        ticket: { select: { publicId: true } },
      },
    })

    return NextResponse.json({ notifications })
  })
}
