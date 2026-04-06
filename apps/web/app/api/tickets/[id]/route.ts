import { NextRequest, NextResponse } from "next/server"
import { TicketStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAuth, requireRole } from "@/lib/auth"
import { ticketUpdateSchema } from "@/lib/schemas/ticket-schemas"
import {
  createAndEmitNotifications,
  getNotificationTargets,
} from "@/lib/notifications"
import { emitShinobiEvent } from "@/lib/sse-emitter"

// Fields included for user references in detail responses
const userSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  ninjaAlias: true,
} as const

// Valid status transitions. Keys are current status, values are allowed next statuses.
const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_INFO", "DONE", "CANCELLED"],
  WAITING_FOR_INFO: ["IN_PROGRESS", "DONE", "CANCELLED"],
  DONE: [],
  CANCELLED: [],
}

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { error } = await requireAuth()
  if (error) return error

  const { id } = await context.params

  // Support lookup by publicId (TKT-XXXX / BUG-XXXX) or internal cuid
  const isPublicId = id.startsWith("TKT-") || id.startsWith("BUG-")
  const where = isPublicId ? { publicId: id } : { id }

  const ticket = await db.ticket.findUnique({
    where,
    include: {
      openedBy: { select: userSelect },
      assignedTo: { select: userSelect },
      bugReport: true,
      events: {
        orderBy: { createdAt: "asc" },
        include: {
          actor: {
            select: { ...userSelect, role: true },
          },
        },
      },
      reorderRequests: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
  }

  return NextResponse.json({ ticket })
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  // Status changes require DEVELOPER or TECH_LEAD.
  // Severity/deadline changes require TECH_LEAD.
  // We read the body first, then enforce role based on what's being changed.
  const { session, error } = await requireRole("DEVELOPER", "TECH_LEAD")
  if (error) return error

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = ticketUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { status, severity, deadline } = parsed.data

  // Severity and deadline changes are TECH_LEAD only
  if ((severity !== undefined || deadline !== undefined) && session.role !== "TECH_LEAD") {
    return NextResponse.json(
      { error: "Only TECH_LEAD can change severity or deadline" },
      { status: 403 }
    )
  }

  const existing = await db.ticket.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
  }

  // Validate status transition
  if (status !== undefined) {
    const allowed = ALLOWED_TRANSITIONS[existing.status]
    if (!allowed.includes(status as TicketStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition: ${existing.status} → ${status}`,
          allowed,
        },
        { status: 422 }
      )
    }
  }

  const ticket = await db.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = {}
    if (status !== undefined) updateData.status = status
    if (severity !== undefined) updateData.severity = severity
    if (deadline !== undefined) updateData.deadline = new Date(deadline)
    if (status === "DONE" || status === "CANCELLED") {
      updateData.resolvedAt = new Date()
    }

    const updated = await tx.ticket.update({
      where: { id },
      data: updateData,
      include: {
        openedBy: { select: userSelect },
        assignedTo: { select: userSelect },
        bugReport: true,
      },
    })

    // Emit one TicketEvent per changed field
    if (status !== undefined) {
      await tx.ticketEvent.create({
        data: {
          ticketId: id,
          eventType: "STATUS_CHANGED",
          actorId: session.userId,
          metadata: JSON.stringify({
            oldStatus: existing.status,
            newStatus: status,
          }),
        },
      })

      // Emit terminal events for explicit done/cancelled transitions
      if (status === "DONE") {
        await tx.ticketEvent.create({
          data: {
            ticketId: id,
            eventType: "DONE",
            actorId: session.userId,
            metadata: JSON.stringify({}),
          },
        })
      } else if (status === "CANCELLED") {
        await tx.ticketEvent.create({
          data: {
            ticketId: id,
            eventType: "CANCELLED",
            actorId: session.userId,
            metadata: JSON.stringify({}),
          },
        })
      }
    }

    if (severity !== undefined) {
      await tx.ticketEvent.create({
        data: {
          ticketId: id,
          eventType: "SEVERITY_CHANGED",
          actorId: session.userId,
          metadata: JSON.stringify({
            oldSeverity: existing.severity,
            newSeverity: severity,
          }),
        },
      })
    }

    if (deadline !== undefined) {
      await tx.ticketEvent.create({
        data: {
          ticketId: id,
          eventType: "DEADLINE_CHANGED",
          actorId: session.userId,
          metadata: JSON.stringify({
            oldDeadline: existing.deadline.toISOString(),
            newDeadline: new Date(deadline).toISOString(),
          }),
        },
      })
    }

    return updated
  })

  // Fire-and-forget: emit notifications for status changes without blocking the response
  if (status !== undefined) {
    let notificationType: "TICKET_DONE" | "TICKET_CANCELLED" | "TICKET_STATUS_CHANGED"
    if (status === "DONE") {
      notificationType = "TICKET_DONE"
    } else if (status === "CANCELLED") {
      notificationType = "TICKET_CANCELLED"
    } else {
      notificationType = "TICKET_STATUS_CHANGED"
    }

    // Broad broadcast so Mission Board auto-refreshes for all connected clients
    emitShinobiEvent({
      type: "ticket:status_changed",
      payload: { ticketId: ticket.id, publicId: ticket.publicId, status },
    })

    void getNotificationTargets(notificationType, existing.openedById)
      .then((targetUserIds) =>
        createAndEmitNotifications({
          type: notificationType,
          title: `${ticket.type === "BUG" ? "Bug" : "Missão"} ${status === "DONE" ? "Concluída" : status === "CANCELLED" ? "Cancelada" : "Atualizada"}: ${ticket.title}`,
          body: `O status de ${ticket.publicId} mudou para ${status === "DONE" ? "Concluído" : status === "CANCELLED" ? "Cancelado" : status === "IN_PROGRESS" ? "Em Progresso" : status === "WAITING_FOR_INFO" ? "Aguardando" : "Aberto"}.`,
          ticketId: ticket.id,
          targetUserIds,
        })
      )
      .catch(console.error)
  }

  return NextResponse.json({ ticket })
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { session, error } = await requireRole("TECH_LEAD")
  if (error) return error

  const { id } = await context.params

  const existing = await db.ticket.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
  }

  // Soft-delete: set status to CANCELLED and record the event
  const ticket = await db.$transaction(async (tx) => {
    const updated = await tx.ticket.update({
      where: { id },
      data: {
        status: "CANCELLED",
        resolvedAt: new Date(),
      },
      include: {
        openedBy: { select: userSelect },
        assignedTo: { select: userSelect },
      },
    })

    await tx.ticketEvent.create({
      data: {
        ticketId: id,
        eventType: "CANCELLED",
        actorId: session.userId,
        metadata: JSON.stringify({ reason: "Excluído por TECH_LEAD" }),
      },
    })

    return updated
  })

  return NextResponse.json({ ticket })
}
