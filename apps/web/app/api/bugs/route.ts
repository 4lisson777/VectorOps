import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Prisma, Severity, TicketStatus, TicketType } from "@/generated/prisma/client"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth, requireTenantRole } from "@/lib/auth"
import { runWithTenant } from "@/lib/tenant-context"
import { generatePublicId } from "@/lib/ticket-id"
import { calculatePriorityOrder } from "@/lib/priority-order"
import { bugCreateSchema, ticketFilterSchema } from "@/lib/schemas/ticket-schemas"
import {
  createAndEmitNotificationsForTargets,
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
  return requireTenantAuth(async () => {
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

    // Force type to BUG — this endpoint only returns bug reports
    const where: Prisma.TicketWhereInput = { type: TicketType.BUG }

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

    const orderBy: Prisma.TicketOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder ?? "asc" }
      : { priorityOrder: "asc" }

    const tenantDb = getTenantDb()
    const [bugs, total] = await Promise.all([
      tenantDb.ticket.findMany({
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
      tenantDb.ticket.count({ where }),
    ])

    return NextResponse.json({ bugs, total, page })
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("SUPPORT_MEMBER", "SUPPORT_LEAD", "QA")(async (session) => {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = bugCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data as BugCreateData

    const tenantDb = getTenantDb()
    const bug = await tenantDb.$transaction(async (tx) => {
      const publicId = await generatePublicId("BUG", tx)
      const priorityOrder = await calculatePriorityOrder(data.severity as Severity, tx)

      const created = await tx.ticket.create({
        data: {
          publicId,
          title: data.title,
          description: data.description,
          type: TicketType.BUG,
          severity: data.severity as Severity,
          deadline: new Date(data.deadline),
          priorityOrder,
          openedById: session.userId,
          organizationId: session.organizationId,
        },
        include: {
          openedBy: { select: userSelect },
          assignedTo: { select: userSelect },
        },
      })

      await tx.bugReport.create({
        data: {
          ticketId: created.id,
          affectedModule: data.affectedModule,
          stepsToReproduce: data.stepsToReproduce,
          expectedBehavior: data.expectedBehavior,
          actualBehavior: data.actualBehavior,
          environment: data.environment,
          customerId: data.customerId ?? null,
        },
      })

      await tx.ticketEvent.create({
        data: {
          ticketId: created.id,
          eventType: "CREATED",
          actorId: session.userId,
          metadata: {
            title: created.title,
            type: TicketType.BUG,
            severity: created.severity,
            deadline: created.deadline.toISOString(),
          },
        },
      })

      return created
    })

    emitShinobiEvent({
      type: "ticket:created",
      payload: {
        ticketId: bug.id,
        publicId: bug.publicId,
        type: bug.type,
        organizationId: session.organizationId,
      },
    })

    // Fire-and-forget: emit per-user notifications without blocking the response.
    // runWithTenant ensures the tenant context survives the async chain.
    const severityLabel =
      bug.severity === "LOW"
        ? "Baixa"
        : bug.severity === "MEDIUM"
          ? "Média"
          : bug.severity === "HIGH"
            ? "Alta"
            : "Crítica"
    void runWithTenant(session.organizationId, () =>
      getNotificationTargets("BUG_CREATED")
        .then(({ normalUserIds, persistentUserIds }) =>
          createAndEmitNotificationsForTargets({
            type: "BUG_CREATED",
            title: `Novo Bug: ${bug.title}`,
            body: `${bug.publicId} — Severidade ${severityLabel}`,
            ticketId: bug.id,
            normalUserIds,
            persistentUserIds,
          })
        )
    ).catch(console.error)

    return NextResponse.json({ bug }, { status: 201 })
  })
}
