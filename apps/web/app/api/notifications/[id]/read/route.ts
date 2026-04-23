import { NextRequest, NextResponse } from "next/server"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    const { id } = await context.params

    const tenantDb = getTenantDb()
    const notification = await tenantDb.notification.findUnique({ where: { id } })
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Ownership check — users may only mark their own notifications as read
    if (notification.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await tenantDb.notification.update({
      where: { id },
      data: { isRead: true },
      include: {
        ticket: { select: { publicId: true } },
      },
    })

    return NextResponse.json({ notification: updated })
  })
}
