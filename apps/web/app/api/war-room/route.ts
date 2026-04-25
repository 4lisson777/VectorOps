import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth, requireTenantRole } from "@/lib/auth"
import { getTenantDb } from "@/lib/tenant-db"
import { emitShinobiEvent } from "@/lib/sse-emitter"
import { getWarRoom, setWarRoom, clearWarRoom } from "@/lib/war-room-state"

const startSchema = z.object({
  title: z.string().min(1).max(100).default("War Room"),
  message: z.string().max(300).nullish(),
})

export async function GET(_request: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireAuth()
  if (error) return error

  const warRoom = getWarRoom(session.organizationId ?? "")
  return NextResponse.json({ warRoom })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async (session) => {
    const body: unknown = await request.json()
    const parsed = startSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const tenantDb = getTenantDb()
    const user = await tenantDb.user.findUnique({
      where: { id: session.userId },
      select: { name: true },
    })

    const data = {
      organizationId: session.organizationId,
      title: parsed.data.title,
      message: parsed.data.message ?? null,
      startedAt: new Date().toISOString(),
      startedById: session.userId,
      startedByName: user?.name ?? "Tech Lead",
    }

    setWarRoom(data)
    emitShinobiEvent({ type: "war_room:started", payload: { ...data } })

    return NextResponse.json({ warRoom: data })
  })
}

export async function DELETE(): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async (session) => {
    clearWarRoom(session.organizationId)
    emitShinobiEvent({
      type: "war_room:ended",
      payload: { organizationId: session.organizationId },
    })
    return NextResponse.json({ success: true })
  })
}
