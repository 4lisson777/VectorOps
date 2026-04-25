import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"
import { emitShinobiEvent } from "@/lib/sse-emitter"

type RouteContext = { params: Promise<{ id: string }> }

// Fields returned in GET and after PATCH — never expose passwordHash
const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  ninjaAlias: true,
  isActive: true,
  devStatus: true,
  currentTask: true,
  notifyTickets: true,
  notifyBugs: true,
  soundEnabled: true,
  createdAt: true,
  updatedAt: true,
} as const

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  ninjaAlias: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  newPassword: z.string().min(8).max(100).optional(),
})

/**
 * GET /api/users/[id]
 * Returns a user's profile. TECH_LEAD can fetch any user; others can only fetch themselves.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    const { id } = await context.params

    // Non-TECH_LEAD callers may only fetch their own profile
    if (session.role !== "TECH_LEAD" && session.userId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const tenantDb = getTenantDb()
    const user = await tenantDb.user.findUnique({
      where: { id },
      select: userSelect,
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  })
}

/**
 * PATCH /api/users/[id]
 * Updates user profile fields.
 * - name, ninjaAlias, avatarUrl: TECH_LEAD or self
 * - newPassword: self (own password change) or TECH_LEAD (admin reset)
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    const { id } = await context.params

    const isTechLead = session.role === "TECH_LEAD"
    const isSelf = session.userId === id

    // Only TECH_LEAD or the user themselves may update the profile
    if (!isTechLead && !isSelf) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, ninjaAlias, avatarUrl, newPassword } = parsed.data

    if (name === undefined && ninjaAlias === undefined && avatarUrl === undefined && newPassword === undefined) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const tenantDb = getTenantDb()
    const target = await tenantDb.user.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Build the update payload incrementally
    const updateData: Record<string, unknown> = {}

    if (name !== undefined) updateData.name = name.trim()
    if (ninjaAlias !== undefined) updateData.ninjaAlias = ninjaAlias.trim()
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl

    // Hash and set password — self may change their own; TECH_LEAD may reset anyone's
    if (newPassword !== undefined) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 12)
    }

    const user = await tenantDb.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    })

    // Emit a developer:status_changed event so the Ninja Board reflects the update
    // in real-time when a developer's profile is touched.
    if (user.role === "DEVELOPER" || target.role === "DEVELOPER") {
      emitShinobiEvent({
        type: "developer:status_changed",
        payload: {
          userId: user.id,
          organizationId: session.organizationId,
        },
      })
    }

    return NextResponse.json({ user })
  })
}
