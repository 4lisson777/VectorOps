import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"

const reorderSchema = z.object({
  targetPosition: z.number().int().min(1),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  return requireTenantRole("SUPPORT_LEAD", "TECH_LEAD")(async (session) => {
    const { id } = await params

    const body: unknown = await request.json()
    const parsed = reorderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const tenantDb = getTenantDb()

    const ticket = await tenantDb.ticket.findUnique({
      where: { id },
      select: { id: true, publicId: true, priorityOrder: true, status: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    if (ticket.status === "DONE" || ticket.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cannot reorder a closed ticket" },
        { status: 400 }
      )
    }

    const targetPosition = parsed.data.targetPosition

    const updated = await tenantDb.$transaction(async (tx) => {
      // Shift other active tickets at or after target position down
      await tx.ticket.updateMany({
        where: {
          id: { not: id },
          priorityOrder: { gte: targetPosition },
          status: { notIn: ["DONE", "CANCELLED"] },
        },
        data: { priorityOrder: { increment: 1 } },
      })

      const t = await tx.ticket.update({
        where: { id },
        data: { priorityOrder: targetPosition },
      })

      await tx.ticketEvent.create({
        data: {
          ticketId: id,
          eventType: "PRIORITY_REORDERED",
          actorId: session.userId,
          metadata: JSON.stringify({
            newPosition: targetPosition,
            reorderedByLead: true,
          }),
        },
      })

      return t
    })

    return NextResponse.json({ ticket: updated })
  })
}
