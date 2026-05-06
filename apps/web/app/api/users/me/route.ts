import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireTenantAuth } from "@/lib/auth"
import { getTenantDb } from "@/lib/tenant-db"

const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  ninjaAlias: z.string().max(50).optional(),
})

/**
 * GET /api/users/me — returns the current user's profile.
 * This duplicates /api/auth/me to support both callers.
 */
export async function GET(): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    const tenantDb = getTenantDb()
    const user = await tenantDb.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        devStatus: true,
        currentTask: true,
        avatarUrl: true,
        ninjaAlias: true,
        isActive: true,
        notifyTickets: true,
        notifyBugs: true,
        soundEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  })
}

/**
 * PATCH /api/users/me — updates name and/or ninjaAlias for the current user.
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return requireTenantAuth(async (session) => {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = UpdateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, ninjaAlias } = parsed.data

    // Build update payload — only include fields that were provided
    const updateData: { name?: string; ninjaAlias?: string } = {}
    if (name !== undefined) updateData.name = name.trim()
    if (ninjaAlias !== undefined && ninjaAlias.trim()) {
      updateData.ninjaAlias = ninjaAlias.trim()
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      )
    }

    const tenantDb = getTenantDb()
    const user = await tenantDb.user.update({
      where: { id: session.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        devStatus: true,
        currentTask: true,
        avatarUrl: true,
        ninjaAlias: true,
        isActive: true,
        notifyTickets: true,
        notifyBugs: true,
        soundEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 200 })
  })
}
