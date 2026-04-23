import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string }> }

const updatePrefsSchema = z.object({
  notifyTickets: z.boolean().optional(),
  notifyBugs: z.boolean().optional(),
})

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
    const { id } = await context.params

    const tenantDb = getTenantDb()
    const user = await tenantDb.user.findUnique({
      where: { id },
      select: { notifyTickets: true, notifyBugs: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ notifyTickets: user.notifyTickets, notifyBugs: user.notifyBugs })
  })
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
    const { id } = await context.params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = updatePrefsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { notifyTickets, notifyBugs } = parsed.data
    if (notifyTickets === undefined && notifyBugs === undefined) {
      return NextResponse.json(
        { error: "At least one of notifyTickets or notifyBugs must be provided" },
        { status: 400 }
      )
    }

    const tenantDb = getTenantDb()
    const existing = await tenantDb.user.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updateData: Record<string, boolean> = {}
    if (notifyTickets !== undefined) updateData.notifyTickets = notifyTickets
    if (notifyBugs !== undefined) updateData.notifyBugs = notifyBugs

    const updated = await tenantDb.user.update({
      where: { id },
      data: updateData,
      select: { notifyTickets: true, notifyBugs: true },
    })

    return NextResponse.json({ notifyTickets: updated.notifyTickets, notifyBugs: updated.notifyBugs })
  })
}
