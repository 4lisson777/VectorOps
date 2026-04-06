import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { emitShinobiEvent } from "@/lib/sse-emitter"
import { createAndEmitNotifications } from "@/lib/notifications"

const createSchema = z.object({
  contextMessage: z.string().min(1).max(280),
})

export async function GET(): Promise<NextResponse> {
  const { session, error } = await requireRole("DEVELOPER", "TECH_LEAD")
  if (error) return error

  void session

  const requests = await db.helpRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      requestedBy: { select: { id: true, name: true, ninjaAlias: true } },
      responses: {
        include: {
          responder: { select: { id: true, name: true, ninjaAlias: true } },
        },
      },
    },
  })

  return NextResponse.json({ helpRequests: requests })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireRole("DEVELOPER", "TECH_LEAD")
  if (error) return error

  const body: unknown = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const helpRequest = await db.helpRequest.create({
    data: {
      requestedById: session.userId,
      contextMessage: parsed.data.contextMessage,
    },
    include: {
      requestedBy: { select: { id: true, name: true, ninjaAlias: true } },
    },
  })

  // Broadcast to all devs via SSE
  emitShinobiEvent({
    type: "help_request:new",
    payload: {
      helpRequestId: helpRequest.id,
      requestedById: helpRequest.requestedById,
      requesterName: helpRequest.requestedBy.name,
      requesterAlias: helpRequest.requestedBy.ninjaAlias,
      contextMessage: helpRequest.contextMessage,
    },
  })

  // Fire-and-forget: create in-app notifications for all other devs
  void (async () => {
    const targets = await db.user.findMany({
      where: {
        role: { in: ["DEVELOPER", "TECH_LEAD"] },
        isActive: true,
        id: { not: session.userId },
      },
      select: { id: true },
    })
    await createAndEmitNotifications({
      type: "HELP_REQUEST_NEW",
      title: `Sinal de Fumaça de ${helpRequest.requestedBy.ninjaAlias}`,
      body: helpRequest.contextMessage,
      targetUserIds: targets.map((u) => u.id),
    })
  })().catch(console.error)

  return NextResponse.json({ helpRequest }, { status: 201 })
}
