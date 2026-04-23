import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth, requireTenantRole } from "@/lib/auth"

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

const updateSchema = z.object({
  intervalMinutes: z.number().int().min(30).max(480).optional(),
  activeHoursStart: z.string().regex(timePattern, "Must be HH:MM format").optional(),
  activeHoursEnd: z.string().regex(timePattern, "Must be HH:MM format").optional(),
  isEnabled: z.boolean().optional(),
})

async function getOrCreateConfig() {
  const tenantDb = getTenantDb()
  const existing = await tenantDb.checkpointConfig.findFirst()
  if (existing) return existing
  // organizationId is injected by the tenant-db Prisma extension
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tenantDb.checkpointConfig.create({ data: {} as any })
}

export async function GET(): Promise<NextResponse> {
  return requireTenantAuth(async () => {
    const config = await getOrCreateConfig()
    return NextResponse.json({ config })
  })
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
    const body: unknown = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const current = await getOrCreateConfig()
    const tenantDb = getTenantDb()
    const config = await tenantDb.checkpointConfig.update({
      where: { id: current.id },
      data: parsed.data,
    })

    return NextResponse.json({ config })
  })
}
