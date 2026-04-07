import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { emitShinobiEvent } from "@/lib/sse-emitter"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { session, error } = await requireAuth()
  if (error) return error

  const { id } = await context.params

  const notification = await db.notification.findUnique({ where: { id } })

  if (!notification || notification.userId !== session.userId) {
    return NextResponse.json(
      { error: "Notificação não encontrada" },
      { status: 404 }
    )
  }

  // Cannot acknowledge a non-persistent notification via this endpoint
  if (!notification.requiresAck) {
    return NextResponse.json(
      { error: "Esta notificação não requer confirmação" },
      { status: 409 }
    )
  }

  if (notification.acknowledgedAt !== null) {
    return NextResponse.json(
      { error: "Notificação já foi confirmada" },
      { status: 409 }
    )
  }

  const updated = await db.notification.update({
    where: { id },
    data: { acknowledgedAt: new Date() },
    include: {
      ticket: { select: { publicId: true } },
    },
  })

  // Emit SSE so all open tabs of this user stop the repeat interval immediately
  emitShinobiEvent({
    type: "notification:acknowledged",
    payload: { notificationId: id, userId: session.userId },
  })

  return NextResponse.json({ notification: updated })
}
