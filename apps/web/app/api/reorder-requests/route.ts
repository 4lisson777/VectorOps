import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth, requireTenantRole } from "@/lib/auth"

const createSchema = z.object({
  ticketId: z.string().min(1),
  requestedPosition: z.number().int().min(1),
  reason: z.string().max(500).optional(),
})

export async function GET(): Promise<NextResponse> {
  return requireTenantRole("SUPPORT_LEAD", "TECH_LEAD", "QA")(async () => {
    const tenantDb = getTenantDb()
    const requests = await tenantDb.reorderRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        ticket: { select: { id: true, publicId: true, title: true, severity: true, priorityOrder: true } },
        requestedBy: { select: { id: true, name: true, ninjaAlias: true } },
      },
    })

    return NextResponse.json({ reorderRequests: requests })
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    if (!["SUPPORT_MEMBER", "SUPPORT_LEAD", "TECH_LEAD", "QA"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const tenantDb = getTenantDb()
    const ticket = await tenantDb.ticket.findUnique({
      where: { id: parsed.data.ticketId },
      select: { id: true, publicId: true },
    })
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Prevent duplicate pending requests for the same ticket
    const existing = await tenantDb.reorderRequest.findFirst({
      where: { ticketId: parsed.data.ticketId, status: "PENDING" },
    })
    if (existing) {
      return NextResponse.json(
        { error: "A pending reorder request already exists for this ticket" },
        { status: 409 }
      )
    }

    const [reorderRequest] = await tenantDb.$transaction(async (tx) => {
      const req = await tx.reorderRequest.create({
        data: {
          ticketId: parsed.data.ticketId,
          requestedById: session.userId,
          requestedPosition: parsed.data.requestedPosition,
          reason: parsed.data.reason ?? null,
        },
      })
      await tx.ticketEvent.create({
        data: {
          ticketId: parsed.data.ticketId,
          eventType: "REORDER_REQUESTED",
          actorId: session.userId,
          metadata: JSON.stringify({ requestedPosition: parsed.data.requestedPosition }),
        },
      })
      return [req]
    })

    return NextResponse.json({ reorderRequest }, { status: 201 })
  })
}
