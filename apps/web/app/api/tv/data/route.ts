import { NextRequest, NextResponse } from "next/server"
import { TicketStatus } from "@/generated/prisma/client"
import { db } from "@/lib/db"

const OPEN_STATUSES: TicketStatus[] = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.WAITING_FOR_INFO,
]

// Public endpoint — no auth required.
// Accepts ?org=SLUG to identify which organization's data to display.
// Returns 400 when no org slug is provided, 404 when the org is not found,
// and 503 when TV mode is disabled for that org.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const orgSlug = searchParams.get("org")

  if (!orgSlug) {
    return NextResponse.json(
      { error: "Missing required query parameter: org" },
      { status: 400 }
    )
  }

  // Resolve the organization by slug using the raw db (no tenant context — public route)
  const organization = await db.organization.findUnique({
    where: { slug: orgSlug },
    select: { id: true, name: true, isActive: true },
  })

  if (!organization) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 })
  }

  if (!organization.isActive) {
    return NextResponse.json({ error: "Organization is inactive" }, { status: 403 })
  }

  const organizationId = organization.id

  // Check TV config for this org; create a default record if none exists
  let config = await db.tvConfig.findFirst({ where: { organizationId } })
  if (!config) {
    config = await db.tvConfig.create({ data: { organizationId } })
  }

  if (!config.isEnabled) {
    return NextResponse.json({ error: "TV mode is disabled" }, { status: 503 })
  }

  const [developers, ticketCounts, bugCounts] = await Promise.all([
    // All active developers and tech leads with their top assigned ticket
    db.user.findMany({
      where: {
        organizationId,
        role: { in: ["DEVELOPER", "TECH_LEAD"] },
        isActive: true,
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        ninjaAlias: true,
        avatarUrl: true,
        devStatus: true,
        currentTask: true,
        assignedTickets: {
          where: { status: { in: OPEN_STATUSES } },
          take: 1,
          orderBy: { priorityOrder: "asc" },
          select: {
            publicId: true,
            title: true,
            severity: true,
            type: true,
            status: true,
          },
        },
      },
    }),

    // Open ticket counts (TICKET type) by severity
    db.ticket.groupBy({
      by: ["severity"],
      where: {
        organizationId,
        type: "TICKET",
        status: { in: OPEN_STATUSES },
      },
      _count: { _all: true },
    }),

    // Open bug counts (BUG type) by severity
    db.ticket.groupBy({
      by: ["severity"],
      where: {
        organizationId,
        type: "BUG",
        status: { in: OPEN_STATUSES },
      },
      _count: { _all: true },
    }),
  ])

  // Normalize severity counts into a flat object for easy consumption
  function severityCounts(
    rows: Array<{ severity: string; _count: { _all: number } }>
  ): Record<string, number> {
    const result: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
    for (const row of rows) {
      result[row.severity] = row._count._all
    }
    return result
  }

  // Normalize groupBy result to match the expected shape
  const normalizedTicketCounts = ticketCounts.map((r) => ({
    severity: r.severity as string,
    _count: { _all: r._count._all ?? 0 },
  }))
  const normalizedBugCounts = bugCounts.map((r) => ({
    severity: r.severity as string,
    _count: { _all: r._count._all ?? 0 },
  }))

  return NextResponse.json({
    developers: developers.map((d) => ({
      id: d.id,
      name: d.name,
      ninjaAlias: d.ninjaAlias,
      avatarUrl: d.avatarUrl,
      devStatus: d.devStatus,
      currentTask: d.currentTask,
      assignedTicket: d.assignedTickets[0] ?? null,
    })),
    ticketCounts: severityCounts(normalizedTicketCounts),
    bugCounts: severityCounts(normalizedBugCounts),
    refreshInterval: config.refreshInterval,
    organizationName: organization.name,
  })
}
