import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"
import { runWithTenant } from "@/lib/tenant-context"
import { createAndEmitNotifications } from "@/lib/notifications"

const actionSchema = z.object({
  action: z.enum(["approve", "decline"]),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  return requireTenantRole("SUPPORT_LEAD", "TECH_LEAD", "QA")(async (session) => {
    const { id } = await params

    const body: unknown = await request.json()
    const parsed = actionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const tenantDb = getTenantDb()
    const reorderRequest = await tenantDb.reorderRequest.findUnique({
      where: { id },
      include: {
        ticket: { select: { id: true, publicId: true, priorityOrder: true } },
        requestedBy: { select: { id: true, name: true } },
      },
    })

    if (!reorderRequest) {
      return NextResponse.json({ error: "Pedido de reordenação não encontrado" }, { status: 404 })
    }
    if (reorderRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "O pedido de reordenação não está mais pendente" },
        { status: 409 }
      )
    }

    const { action } = parsed.data
    const now = new Date()

    if (action === "decline") {
      const updated = await tenantDb.$transaction(async (tx) => {
        const req = await tx.reorderRequest.update({
          where: { id },
          data: { status: "DECLINED", resolvedById: session.userId, resolvedAt: now },
        })
        await tx.ticketEvent.create({
          data: {
            ticketId: reorderRequest.ticketId,
            eventType: "REORDER_DECLINED",
            actorId: session.userId,
            metadata: { reorderRequestId: id },
          },
        })
        return req
      })

      void runWithTenant(session.organizationId, () =>
        createAndEmitNotifications({
          type: "TICKET_STATUS_CHANGED",
          title: "Pedido de reordenação recusado",
          body: `Seu pedido de reordenação para ${reorderRequest.ticket.publicId} foi recusado.`,
          ticketId: reorderRequest.ticketId,
          targetUserIds: [reorderRequest.requestedById],
        })
      ).catch(console.error)

      return NextResponse.json({ reorderRequest: updated })
    }

    // Approve: shift tickets to make room at the requested position
    const targetPosition = reorderRequest.requestedPosition
    const ticketId = reorderRequest.ticketId

    const updated = await tenantDb.$transaction(async (tx) => {
      // Shift all tickets at or after the target position down by 1,
      // excluding the ticket being reordered
      await tx.ticket.updateMany({
        where: {
          id: { not: ticketId },
          priorityOrder: { gte: targetPosition },
          status: { notIn: ["DONE", "CANCELLED"] },
        },
        data: { priorityOrder: { increment: 1 } },
      })

      const ticket = await tx.ticket.update({
        where: { id: ticketId },
        data: { priorityOrder: targetPosition },
      })

      const req = await tx.reorderRequest.update({
        where: { id },
        data: { status: "APPROVED", resolvedById: session.userId, resolvedAt: now },
      })

      await tx.ticketEvent.create({
        data: {
          ticketId,
          eventType: "REORDER_APPROVED",
          actorId: session.userId,
          metadata: { newPosition: targetPosition, reorderRequestId: id },
        },
      })

      return { ticket, req }
    })

    void runWithTenant(session.organizationId, () =>
      createAndEmitNotifications({
        type: "TICKET_STATUS_CHANGED",
        title: "Pedido de reordenação aprovado",
        body: `Seu pedido de reordenação para ${reorderRequest.ticket.publicId} foi aprovado. Agora está na posição ${targetPosition}.`,
        ticketId: reorderRequest.ticketId,
        targetUserIds: [reorderRequest.requestedById],
      })
    ).catch(console.error)

    return NextResponse.json({ reorderRequest: updated.req, ticket: updated.ticket })
  })
}
