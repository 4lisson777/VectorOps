import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { emitShinobiEvent } from "@/lib/sse-emitter"
import { createAndEmitNotifications } from "@/lib/notifications"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { session, error } = await requireRole("DEVELOPER", "TECH_LEAD")
  if (error) return error

  const { id } = await params

  const helpRequest = await db.helpRequest.findUnique({
    where: { id },
    include: {
      requestedBy: { select: { id: true, name: true, ninjaAlias: true } },
      responses: { select: { responderId: true } },
    },
  })

  if (!helpRequest) {
    return NextResponse.json({ error: "Pedido de ajuda não encontrado" }, { status: 404 })
  }

  if (helpRequest.requestedById === session.userId) {
    return NextResponse.json(
      { error: "Você não pode responder ao seu próprio pedido de ajuda" },
      { status: 400 }
    )
  }

  const alreadyResponded = helpRequest.responses.some(
    (r) => r.responderId === session.userId
  )
  if (alreadyResponded) {
    return NextResponse.json(
      { error: "Você já respondeu a este pedido de ajuda" },
      { status: 409 }
    )
  }

  const [response, responder] = await db.$transaction(async (tx) => {
    const resp = await tx.helpRequestResponse.create({
      data: { helpRequestId: id, responderId: session.userId },
    })
    const user = await tx.user.update({
      where: { id: session.userId },
      data: { devStatus: "HELPING" },
      select: {
        id: true,
        name: true,
        ninjaAlias: true,
        devStatus: true,
        currentTask: true,
      },
    })
    return [resp, user]
  })

  // Broadcast status change so Ninja Board updates live
  emitShinobiEvent({
    type: "developer:status_changed",
    payload: {
      userId: responder.id,
      devStatus: responder.devStatus,
      currentTask: responder.currentTask,
    },
  })

  // Tell SSE consumers the help request has a responder
  emitShinobiEvent({
    type: "help_request:responded",
    payload: {
      helpRequestId: id,
      requestedById: helpRequest.requestedById,
      responderName: responder.name,
      responderAlias: responder.ninjaAlias,
    },
  })

  // Fire-and-forget: in-app notification for the requester
  void createAndEmitNotifications({
    type: "HELP_REQUEST_RESPONDED",
    title: `${responder.ninjaAlias} pode te ajudar`,
    body: `${responder.name} respondeu ao seu Sinal de Fumaça.`,
    targetUserIds: [helpRequest.requestedById],
  }).catch(console.error)

  return NextResponse.json({ response }, { status: 201 })
}
