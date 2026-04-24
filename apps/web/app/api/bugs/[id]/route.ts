import { NextRequest, NextResponse } from "next/server"
import { TicketStatus } from "@/generated/prisma/client"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth, requireTenantRole } from "@/lib/auth"
import { ticketUpdateSchema } from "@/lib/schemas/ticket-schemas"
import {
  createAndEmitNotificationsForTargets,
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
  return requireTenantAuth(async () => {
    const { id } = await context.params

    // Support lookup by publicId (BUG-XXXX) or internal cuid
    const isPublicId = id.startsWith("BUG-")
    const where = isPublicId ? { publicId: id } : { id }

    const tenantDb = getTenantDb()
    const bug = await tenantDb.ticket.findUnique({
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

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    // This endpoint is scoped to bugs only
    if (bug.type !== "BUG") {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    return NextResponse.json({ bug })
  })
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  // Status changes require DEVELOPER, TECH_LEAD or QA.
  // Severity/deadline changes require TECH_LEAD or QA.
  return requireTenantRole("DEVELOPER", "TECH_LEAD", "QA")(async (session) => {
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

    // Severity and deadline changes are TECH_LEAD or QA only
    if ((severity !== undefined || deadline !== undefined) && !["TECH_LEAD", "QA"].includes(session.role)) {
      return NextResponse.json(
        { error: "Apenas TECH_LEAD ou QA podem alterar a severidade ou o prazo" },
        { status: 403 }
      )
    }

    const tenantDb = getTenantDb()
    const existing = await tenantDb.ticket.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    // This endpoint is scoped to bugs only
    if (existing.type !== "BUG") {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
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

    const bug = await tenantDb.$transaction(async (tx) => {
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

      emitShinobiEvent({
        type: "ticket:status_changed",
        payload: {
          ticketId: bug.id,
          publicId: bug.publicId,
          status,
          organizationId: session.organizationId,
        },
      })

      void getNotificationTargets(notificationType, existing.openedById)
        .then(({ normalUserIds, persistentUserIds }) =>
          createAndEmitNotificationsForTargets({
            type: notificationType,
            title: `Bug ${status === "DONE" ? "Concluído" : status === "CANCELLED" ? "Cancelado" : "Atualizado"}: ${bug.title}`,
            body: `O status de ${bug.publicId} mudou para ${status === "DONE" ? "Concluído" : status === "CANCELLED" ? "Cancelado" : status === "IN_PROGRESS" ? "Em Progresso" : status === "WAITING_FOR_INFO" ? "Aguardando" : "Aberto"}.`,
            ticketId: bug.id,
            normalUserIds,
            persistentUserIds,
          })
        )
        .catch(console.error)
    }

    return NextResponse.json({ bug })
  })
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantRole("SUPPORT_MEMBER", "SUPPORT_LEAD", "TECH_LEAD", "QA")(async (session) => {
    const { id } = await context.params

    const tenantDb = getTenantDb()
    const existing = await tenantDb.ticket.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    // This endpoint is scoped to bugs only
    if (existing.type !== "BUG") {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    // Only bugs in OPEN status can be cancelled via DELETE
    if (existing.status !== "OPEN") {
      return NextResponse.json(
        { error: "Only OPEN bugs can be cancelled. Use PATCH for in-progress status transitions." },
        { status: 422 }
      )
    }

    const bug = await tenantDb.$transaction(async (tx) => {
      const updated = await tx.ticket.update({
        where: { id },
        data: {
          status: "CANCELLED",
          resolvedAt: new Date(),
        },
        include: {
          openedBy: { select: userSelect },
          assignedTo: { select: userSelect },
          bugReport: true,
        },
      })

      await tx.ticketEvent.create({
        data: {
          ticketId: id,
          eventType: "CANCELLED",
          actorId: session.userId,
          metadata: JSON.stringify({ reason: `Cancelado por ${session.role}` }),
        },
      })

      return updated
    })

    emitShinobiEvent({
      type: "ticket:cancelled",
      payload: {
        ticketId: bug.id,
        publicId: bug.publicId,
        organizationId: session.organizationId,
      },
    })

    return NextResponse.json({ bug })
  })
}
