import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Prisma, Severity, TicketStatus, TicketType } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAuth, requireRole } from "@/lib/auth"
import { generatePublicId } from "@/lib/ticket-id"
import { calculatePriorityOrder } from "@/lib/priority-order"
import {
  ticketCreateSchema,
  bugCreateSchema,
  ticketFilterSchema,
} from "@/lib/schemas/ticket-schemas"
import {
  createAndEmitNotifications,
  getNotificationTargets,
} from "@/lib/notifications"
import { emitShinobiEvent } from "@/lib/sse-emitter"

type BugCreateData = z.infer<typeof bugCreateSchema>

// Fields included for user references in list responses
const userSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  ninjaAlias: true,
} as const

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAuth()
  if (error) return error

  const { searchParams } = request.nextUrl
  const rawParams = Object.fromEntries(searchParams.entries())
  const parsed = ticketFilterSchema.safeParse(rawParams)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const {
    type,
    severity,
    status,
    assignedToId,
    openedById,
    search,
    createdFrom,
    createdTo,
    resolvedFrom,
    resolvedTo,
    sortBy,
    sortOrder,
    page,
    limit,
  } = parsed.data

  const where: Prisma.TicketWhereInput = {}

  if (type) where.type = type as TicketType
  if (severity) where.severity = severity as Severity
  if (status) where.status = status as TicketStatus
  if (assignedToId) where.assignedToId = assignedToId
  if (openedById) where.openedById = openedById
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { publicId: { startsWith: search.toUpperCase() } },
    ]
  }
  if (createdFrom ?? createdTo) {
    where.createdAt = {
      ...(createdFrom ? { gte: new Date(createdFrom) } : {}),
      ...(createdTo ? { lte: new Date(createdTo) } : {}),
    }
  }
  if (resolvedFrom ?? resolvedTo) {
    where.resolvedAt = {
      ...(resolvedFrom ? { gte: new Date(resolvedFrom) } : {}),
      ...(resolvedTo ? { lte: new Date(resolvedTo) } : {}),
    }
  }

  const skip = (page - 1) * limit

  // Build order-by clause; default to priorityOrder ascending
  const orderBy: Prisma.TicketOrderByWithRelationInput = sortBy
    ? { [sortBy]: sortOrder ?? "asc" }
    : { priorityOrder: "asc" }

  const [tickets, total] = await Promise.all([
    db.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        openedBy: { select: userSelect },
        assignedTo: { select: userSelect },
        bugReport: true,
      },
    }),
    db.ticket.count({ where }),
  ])

  return NextResponse.json({ tickets, total, page })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireRole("SUPPORT_MEMBER", "SUPPORT_LEAD")
  if (error) return error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Determine type from request body before schema parse
  const rawBody = body as Record<string, unknown>
  const isBug = rawBody.affectedModule !== undefined

  const schema = isBug ? bugCreateSchema : ticketCreateSchema
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = parsed.data
  const ticketType: TicketType = isBug ? "BUG" : "TICKET"

  const ticket = await db.$transaction(async (tx) => {
    const publicId = await generatePublicId(ticketType, tx)
    const priorityOrder = await calculatePriorityOrder(data.severity as Severity, tx)

    const created = await tx.ticket.create({
      data: {
        publicId,
        title: data.title,
        description: data.description,
        type: ticketType,
        severity: data.severity as Severity,
        deadline: new Date(data.deadline),
        priorityOrder,
        openedById: session.userId,
      },
      include: {
        openedBy: { select: userSelect },
        assignedTo: { select: userSelect },
      },
    })

    // If this is a bug report, create the associated BugReport record
    if (isBug) {
      const bugData = parsed.data as BugCreateData
      await tx.bugReport.create({
        data: {
          ticketId: created.id,
          affectedModule: bugData.affectedModule,
          stepsToReproduce: bugData.stepsToReproduce,
          expectedBehavior: bugData.expectedBehavior,
          actualBehavior: bugData.actualBehavior,
          environment: bugData.environment,
          customerId: bugData.customerId ?? null,
        },
      })
    }

    await tx.ticketEvent.create({
      data: {
        ticketId: created.id,
        eventType: "CREATED",
        actorId: session.userId,
        metadata: JSON.stringify({
          title: created.title,
          type: ticketType,
          severity: created.severity,
          deadline: created.deadline.toISOString(),
        }),
      },
    })

    return created
  })

  // Broadcast to all connected clients so Mission Board auto-refreshes
  emitShinobiEvent({
    type: "ticket:created",
    payload: { ticketId: ticket.id, publicId: ticket.publicId, type: ticket.type },
  })

  // Fire-and-forget: emit per-user notifications without blocking the response
  const notificationType = isBug ? "BUG_CREATED" : "TICKET_CREATED"
  void getNotificationTargets(notificationType)
    .then((targetUserIds) =>
      createAndEmitNotifications({
        type: notificationType,
        title: isBug
          ? `Novo Bug: ${ticket.title}`
          : `Nova Missão: ${ticket.title}`,
        body: `${ticket.publicId} — Severidade ${ticket.severity === "LOW" ? "Baixa" : ticket.severity === "MEDIUM" ? "Média" : ticket.severity === "HIGH" ? "Alta" : "Crítica"}`,
        ticketId: ticket.id,
        targetUserIds,
      })
    )
    .catch(console.error)

  return NextResponse.json({ ticket }, { status: 201 })
}
