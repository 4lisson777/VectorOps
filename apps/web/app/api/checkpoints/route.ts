import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"
import { emitShinobiEvent } from "@/lib/sse-emitter"

const createSchema = z.object({
  currentTask: z.string().min(1).max(500),
  isBlocked: z.boolean(),
  notes: z.string().max(1000).optional(),
})

const querySchema = z.object({
  userId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("DEVELOPER", "TECH_LEAD")(async (session) => {
    const body: unknown = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { currentTask, isBlocked, notes } = parsed.data

    const tenantDb = getTenantDb()
    const [checkpoint, updatedUser] = await tenantDb.$transaction(async (tx) => {
      const cp = await tx.checkpoint.create({
        // organizationId is injected by the tenant-db Prisma extension
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: {
          userId: session.userId,
          currentTask,
          isBlocked,
          notes: notes ?? null,
        } as any,
      })
      const user = await tx.user.update({
        where: { id: session.userId },
        data: {
          currentTask,
          devStatus: isBlocked ? "BLOCKED" : "ACTIVE",
        },
        select: { id: true, devStatus: true, currentTask: true },
      })
      return [cp, user]
    })

    emitShinobiEvent({
      type: "developer:status_changed",
      payload: {
        userId: updatedUser.id,
        devStatus: updatedUser.devStatus,
        currentTask: updatedUser.currentTask,
        organizationId: session.organizationId,
      },
    })

    return NextResponse.json({ checkpoint }, { status: 201 })
  })
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
    const { searchParams } = request.nextUrl
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()))
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query params", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { userId, limit } = parsed.data

    const tenantDb = getTenantDb()
    const checkpoints = await tenantDb.checkpoint.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true, ninjaAlias: true } },
      },
    })

    return NextResponse.json({ checkpoints })
  })
}
