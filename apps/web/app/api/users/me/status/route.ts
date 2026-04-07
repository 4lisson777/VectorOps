import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { emitShinobiEvent } from "@/lib/sse-emitter"

const devStatusValues = ["ACTIVE", "IN_CHECKPOINT", "BLOCKED", "HELPING", "AWAY"] as const

const statusSchema = z.object({
  devStatus: z.enum(devStatusValues).optional(),
  currentTask: z.string().max(500).optional(),
})

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireRole("DEVELOPER", "TECH_LEAD", "QA")
  if (error) return error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = statusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { devStatus, currentTask } = parsed.data
  if (devStatus === undefined && currentTask === undefined) {
    return NextResponse.json(
      { error: "At least one of devStatus or currentTask must be provided" },
      { status: 400 }
    )
  }

  const updateData: Record<string, string | null> = {}
  if (devStatus !== undefined) updateData.devStatus = devStatus
  if (currentTask !== undefined) updateData.currentTask = currentTask

  const updated = await db.user.update({
    where: { id: session.userId },
    data: updateData,
    select: {
      id: true,
      devStatus: true,
      currentTask: true,
    },
  })

  // Broadcast the status change to all connected DEV/TECH_LEAD clients
  emitShinobiEvent({
    type: "developer:status_changed",
    payload: {
      userId: updated.id,
      devStatus: updated.devStatus,
      currentTask: updated.currentTask,
    },
  })

  return NextResponse.json({
    devStatus: updated.devStatus,
    currentTask: updated.currentTask,
  })
}
