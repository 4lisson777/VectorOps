import { NextResponse } from "next/server"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"

export async function PATCH(): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    const tenantDb = getTenantDb()
    const result = await tenantDb.notification.updateMany({
      where: { userId: session.userId, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ count: result.count })
  })
}
