import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

/**
 * Returns all unacknowledged persistent notifications for the authenticated user.
 * The frontend calls this on mount/refresh to resume the repeat interval for any
 * notifications that were never acknowledged in a previous session.
 */
export async function GET(): Promise<NextResponse> {
  const { session, error } = await requireAuth()
  if (error) return error

  const notifications = await db.notification.findMany({
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
}
