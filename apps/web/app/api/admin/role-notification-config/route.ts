import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { getTenantId } from "@/lib/tenant-context"
import { requireTenantRole } from "@/lib/auth"
import { Role } from "@/generated/prisma/client"

// All roles that must have a config row
const ALL_ROLES: Role[] = [
  "TECH_LEAD",
  "DEVELOPER",
  "QA",
  "SUPPORT_LEAD",
  "SUPPORT_MEMBER",
]

// Default values per role per spec
const ROLE_DEFAULTS: Record<Role, { notifyOnCreation: boolean; notifyOnAssignment: boolean }> = {
  TECH_LEAD: { notifyOnCreation: true, notifyOnAssignment: true },
  DEVELOPER: { notifyOnCreation: true, notifyOnAssignment: true },
  QA: { notifyOnCreation: true, notifyOnAssignment: false },
  SUPPORT_LEAD: { notifyOnCreation: false, notifyOnAssignment: false },
  SUPPORT_MEMBER: { notifyOnCreation: false, notifyOnAssignment: false },
}

/**
 * Ensures all 5 role config rows exist in the DB for the current tenant.
 * Inserts only the missing ones, preserving existing customizations.
 * Called on every GET so that adding a new role to the enum auto-provisions its row.
 */
async function ensureDefaultConfigsExist(): Promise<void> {
  const tenantDb = getTenantDb()
  const existing = await tenantDb.roleNotificationConfig.findMany({
    select: { role: true },
  })
  const existingRoles = new Set(existing.map((r) => r.role))

  const missing = ALL_ROLES.filter((role) => !existingRoles.has(role))
  if (missing.length === 0) return

  const organizationId = getTenantId()
  await tenantDb.roleNotificationConfig.createMany({
    data: missing.map((role) => ({
      role,
      notifyOnCreation: ROLE_DEFAULTS[role].notifyOnCreation,
      notifyOnAssignment: ROLE_DEFAULTS[role].notifyOnAssignment,
      organizationId,
    })),
  })
}

const patchSchema = z.object({
  configs: z
    .array(
      z.object({
        role: z.enum(["TECH_LEAD", "DEVELOPER", "QA", "SUPPORT_LEAD", "SUPPORT_MEMBER"]),
        notifyOnCreation: z.boolean().optional(),
        notifyOnAssignment: z.boolean().optional(),
      })
    )
    .min(1, "At least one config entry is required"),
})

export async function GET(): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
    await ensureDefaultConfigsExist()

    const tenantDb = getTenantDb()
    const configs = await tenantDb.roleNotificationConfig.findMany({
      select: { role: true, notifyOnCreation: true, notifyOnAssignment: true },
    })
    // MySQL sorts enums by definition order, not alphabetically — sort in JS
    configs.sort((a, b) => a.role.localeCompare(b.role))

    return NextResponse.json({ configs })
  })
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
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

    // Ensure default rows exist before patching so upsert won't fail on missing rows
    await ensureDefaultConfigsExist()

    const tenantDb = getTenantDb()

    // Apply each config update; use the compound unique key organizationId_role for upsert
    await Promise.all(
      parsed.data.configs.map(async (entry) => {
        const { role, ...fields } = entry
        // Only include fields that were actually provided in the request
        const updateData: { notifyOnCreation?: boolean; notifyOnAssignment?: boolean } = {}
        if (fields.notifyOnCreation !== undefined) updateData.notifyOnCreation = fields.notifyOnCreation
        if (fields.notifyOnAssignment !== undefined) updateData.notifyOnAssignment = fields.notifyOnAssignment

        // Find existing record by role (scoped to current tenant via tenantDb)
        const existing = await tenantDb.roleNotificationConfig.findFirst({ where: { role } })
        return tenantDb.roleNotificationConfig.upsert({
          where: { id: existing?.id ?? "" },
          update: updateData,
          create: {
            role,
            notifyOnCreation: fields.notifyOnCreation ?? ROLE_DEFAULTS[role].notifyOnCreation,
            notifyOnAssignment: fields.notifyOnAssignment ?? ROLE_DEFAULTS[role].notifyOnAssignment,
            organizationId: getTenantId(),
          },
        })
      })
    )

    // Return the full updated list so the frontend can refresh its state in one round trip
    const configs = await tenantDb.roleNotificationConfig.findMany({
      select: { role: true, notifyOnCreation: true, notifyOnAssignment: true },
    })
    configs.sort((a, b) => a.role.localeCompare(b.role))

    return NextResponse.json({ configs })
  })
}
