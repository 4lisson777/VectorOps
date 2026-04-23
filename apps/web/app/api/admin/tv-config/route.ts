import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"

const patchSchema = z.object({
  isEnabled: z.boolean().optional(),
  refreshInterval: z.number().int().min(10).max(300).optional(),
})

async function getOrCreateTvConfig() {
  const tenantDb = getTenantDb()
  const existing = await tenantDb.tvConfig.findFirst()
  if (existing) return existing
  // organizationId is injected by the tenant-db Prisma extension
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tenantDb.tvConfig.create({ data: {} as any })
}

export async function GET(): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD", "QA")(async () => {
    const config = await getOrCreateTvConfig()
    return NextResponse.json({ config })
  })
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD", "QA")(async () => {
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

    const current = await getOrCreateTvConfig()
    const tenantDb = getTenantDb()
    const config = await tenantDb.tvConfig.update({
      where: { id: current.id },
      data: parsed.data,
    })

    return NextResponse.json({ config })
  })
}
