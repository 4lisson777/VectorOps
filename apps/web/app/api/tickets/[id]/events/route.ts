import { NextRequest, NextResponse } from "next/server"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantAuth(async () => {
    const { id } = await context.params

    const tenantDb = getTenantDb()

    // Verify the ticket exists before returning events
    const ticket = await tenantDb.ticket.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const events = await tenantDb.ticketEvent.findMany({
      where: { ticketId: id },
      orderBy: { createdAt: "asc" },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            ninjaAlias: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ events })
  })
}
