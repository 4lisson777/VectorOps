import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string }> }

const patchSchema = z.object({
  role: z.enum(["TECH_LEAD", "DEVELOPER", "SUPPORT_LEAD", "SUPPORT_MEMBER"]).optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async (session) => {
    const { id } = await context.params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Guard: cannot deactivate yourself
    if (parsed.data.isActive === false && id === session.userId) {
      return NextResponse.json(
        { error: "You cannot deactivate your own account" },
        { status: 422 }
      )
    }

    const tenantDb = getTenantDb()
    const target = await tenantDb.user.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updated = await tenantDb.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        ninjaAlias: true,
        isActive: true,
        notifyTickets: true,
        notifyBugs: true,
        soundEnabled: true,
        devStatus: true,
        currentTask: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user: updated })
  })
}
