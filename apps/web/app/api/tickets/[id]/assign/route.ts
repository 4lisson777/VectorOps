import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { assignSchema } from "@/lib/schemas/ticket-schemas"
import {
  createAndEmitNotificationsForTargets,
  getNotificationTargets,
} from "@/lib/notifications"
import { emitShinobiEvent } from "@/lib/sse-emitter"

const userSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  ninjaAlias: true,
} as const

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { session, error } = await requireRole("DEVELOPER", "TECH_LEAD", "QA")
  if (error) return error

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 })
  }

  const parsed = assignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { assignedToId } = parsed.data

  // DEVELOPER can only self-assign
  if (session.role === "DEVELOPER" && assignedToId !== session.userId) {
    return NextResponse.json(
      { error: "Desenvolvedores só podem atribuir missões a si mesmos" },
      { status: 403 }
    )
  }

  // Verify the target user exists and has an appropriate developer-level role
  const targetUser = await db.user.findUnique({
    where: { id: assignedToId },
    select: { id: true, name: true, role: true, isActive: true },
  })

  if (!targetUser) {
    return NextResponse.json({ error: "Usuário alvo não encontrado" }, { status: 404 })
  }

  if (!["DEVELOPER", "TECH_LEAD"].includes(targetUser.role)) {
    return NextResponse.json(
      { error: "Missões só podem ser atribuídas a usuários DEVELOPER ou TECH_LEAD" },
      { status: 422 }
    )
  }

  if (!targetUser.isActive) {
    return NextResponse.json({ error: "Target user is inactive" }, { status: 422 })
  }

  const existing = await db.ticket.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
  }

  const ticket = await db.$transaction(async (tx) => {
    const previousAssignedToId = existing.assignedToId
    const isReassignment = previousAssignedToId !== null

    const updated = await tx.ticket.update({
      where: { id },
      data: {
        assignedToId,
        // Automatically move to IN_PROGRESS when assigned from OPEN
        status: existing.status === "OPEN" ? "IN_PROGRESS" : existing.status,
      },
      include: {
        openedBy: { select: userSelect },
        assignedTo: { select: userSelect },
        bugReport: true,
      },
    })

    const eventMetadata: Record<string, string> = {
      assignedToId,
      assignedToName: targetUser.name,
    }
    if (isReassignment && previousAssignedToId) {
      eventMetadata.previousAssignedToId = previousAssignedToId
    }

    await tx.ticketEvent.create({
      data: {
        ticketId: id,
        eventType: isReassignment ? "REASSIGNED" : "ASSIGNED",
        actorId: session.userId,
        metadata: JSON.stringify(eventMetadata),
      },
    })

    // Emit STATUS_CHANGED event if we auto-transitioned from OPEN to IN_PROGRESS
    if (existing.status === "OPEN") {
      await tx.ticketEvent.create({
        data: {
          ticketId: id,
          eventType: "STATUS_CHANGED",
          actorId: session.userId,
          metadata: JSON.stringify({
            oldStatus: "OPEN",
            newStatus: "IN_PROGRESS",
          }),
        },
      })
    }

    return updated
  })

  // Broadcast to all connected clients so NinjaBoard/MissionBoard auto-refreshes
  emitShinobiEvent({
    type: "ticket:assigned",
    payload: { ticketId: ticket.id, publicId: ticket.publicId, assignedToId },
  })

  // Fire-and-forget: notify the assignee (persistent) without blocking the response
  void getNotificationTargets("TICKET_ASSIGNED", undefined, assignedToId)
    .then(({ normalUserIds, persistentUserIds }) =>
      createAndEmitNotificationsForTargets({
        type: "TICKET_ASSIGNED",
        title: `Missão Atribuída: ${ticket.title}`,
        body: `${ticket.publicId} foi atribuída a você`,
        ticketId: ticket.id,
        normalUserIds,
        persistentUserIds,
      })
    )
    .catch(console.error)

  return NextResponse.json({ ticket })
}
