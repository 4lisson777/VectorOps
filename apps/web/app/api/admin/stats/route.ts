import { NextResponse } from "next/server"
import { TicketStatus } from "@/generated/prisma/client"
import { db } from "@/lib/db"
import { requireRole } from "@/lib/auth"

const OPEN_STATUSES: TicketStatus[] = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.WAITING_FOR_INFO,
]

const CLOSED_STATUSES: TicketStatus[] = [TicketStatus.DONE, TicketStatus.CANCELLED]

export async function GET(): Promise<NextResponse> {
  const { error } = await requireRole("TECH_LEAD", "QA")
  if (error) return error

  const [
    ticketsByStatus,
    ticketsBySeverity,
    assignedCount,
    unassignedCount,
    resolved7d,
    resolved30d,
    activeDevelopers,
  ] = await Promise.all([
    // Count per status (all statuses)
    db.ticket.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

    // Count per severity for non-closed tickets
    db.ticket.groupBy({
      by: ["severity"],
      where: { status: { in: OPEN_STATUSES } },
      _count: { _all: true },
    }),

    // Assigned open tickets
    db.ticket.count({
      where: {
        status: { in: OPEN_STATUSES },
        assignedToId: { not: null },
      },
    }),

    // Unassigned open tickets
    db.ticket.count({
      where: {
        status: { in: OPEN_STATUSES },
        assignedToId: null,
      },
    }),

    // Tickets resolved in last 7 days
    db.ticket.findMany({
      where: {
        resolvedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        status: { in: CLOSED_STATUSES },
      },
      select: { createdAt: true, resolvedAt: true },
    }),

    // Tickets resolved in last 30 days
    db.ticket.findMany({
      where: {
        resolvedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        status: { in: CLOSED_STATUSES },
      },
      select: { createdAt: true, resolvedAt: true },
    }),

    // Active developers/tech leads for workload calculation
    db.user.findMany({
      where: {
        role: { in: ["DEVELOPER", "TECH_LEAD"] },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        ninjaAlias: true,
        avatarUrl: true,
      },
    }),
  ])

  // Fetch open ticket counts per developer in a single query
  const workloadCounts = await db.ticket.groupBy({
    by: ["assignedToId"],
    where: {
      status: { in: OPEN_STATUSES },
      assignedToId: { not: null, in: activeDevelopers.map((d) => d.id) },
    },
    _count: { _all: true },
  })

  const countByDev = new Map<string, number>(
    workloadCounts
      .filter((r): r is typeof r & { assignedToId: string } => r.assignedToId !== null)
      .map((r) => [r.assignedToId, r._count._all])
  )

  // Compute average resolution times in hours
  function avgHours(records: { createdAt: Date; resolvedAt: Date | null }[]): number {
    const valid = records.filter((r): r is typeof r & { resolvedAt: Date } =>
      r.resolvedAt !== null
    )
    if (valid.length === 0) return 0
    const totalMs = valid.reduce((sum, r) => {
      return sum + (r.resolvedAt.getTime() - r.createdAt.getTime())
    }, 0)
    return Math.round((totalMs / valid.length / 3_600_000) * 10) / 10
  }

  return NextResponse.json({
    ticketsByStatus: ticketsByStatus.map((row) => ({
      status: row.status,
      count: row._count._all,
    })),
    ticketsBySeverity: ticketsBySeverity.map((row) => ({
      severity: row.severity,
      count: row._count._all,
    })),
    assignedCount,
    unassignedCount,
    avgResolutionTime7d: avgHours(resolved7d),
    avgResolutionTime30d: avgHours(resolved30d),
    developerWorkload: activeDevelopers.map((u) => ({
      userId: u.id,
      name: u.name,
      ninjaAlias: u.ninjaAlias,
      avatarUrl: u.avatarUrl,
      openTicketCount: countByDev.get(u.id) ?? 0,
    })),
  })
}
