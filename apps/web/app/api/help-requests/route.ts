import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"
import { emitShinobiEvent } from "@/lib/sse-emitter"
import { createAndEmitNotifications } from "@/lib/notifications"

const createSchema = z.object({
  contextMessage: z.string().min(1).max(280),
})

export async function GET(): Promise<NextResponse> {
  return requireTenantRole("DEVELOPER", "TECH_LEAD")(async () => {
    const tenantDb = getTenantDb()
    const requests = await tenantDb.helpRequest.findMany({
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
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("DEVELOPER", "TECH_LEAD", "QA")(async (session) => {
    const body: unknown = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const tenantDb = getTenantDb()
    const helpRequest = await tenantDb.helpRequest.create({
      // organizationId is injected by the tenant-db Prisma extension
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        requestedById: session.userId,
        contextMessage: parsed.data.contextMessage,
      } as any,
      include: {
        requestedBy: { select: { id: true, name: true, ninjaAlias: true } },
      },
    }) as any as {
      id: string
      requestedById: string
      contextMessage: string
      requestedBy: { id: string; name: string; ninjaAlias: string }
    }

    // Broadcast to all devs via SSE
    emitShinobiEvent({
      type: "help_request:new",
      payload: {
        helpRequestId: helpRequest.id,
        requestedById: helpRequest.requestedById,
        requesterName: helpRequest.requestedBy.name,
        requesterAlias: helpRequest.requestedBy.ninjaAlias,
        contextMessage: helpRequest.contextMessage,
        organizationId: session.organizationId,
      },
    })

    // Fire-and-forget: create in-app notifications for all other devs in the same org
    void (async () => {
      const targets = await tenantDb.user.findMany({
        where: {
          role: { in: ["DEVELOPER", "TECH_LEAD"] },
          isActive: true,
          id: { not: session.userId },
        },
        select: { id: true },
      })
      await createAndEmitNotifications({
        type: "HELP_REQUEST_NEW",
        title: `Pedido de ajuda de ${helpRequest.requestedBy.ninjaAlias}`,
        body: helpRequest.contextMessage,
        targetUserIds: targets.map((u) => u.id),
      })
    })().catch(console.error)

    return NextResponse.json({ helpRequest }, { status: 201 })
  })
}
