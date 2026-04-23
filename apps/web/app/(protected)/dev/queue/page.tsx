import { notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { MissionBoard } from "@/components/tickets/mission-board"
import type { TicketWithRelations } from "@/components/tickets/mission-board"

export const metadata = {
  title: "Quadro — VectorOps",
}

// Server component — fetches tickets and developer list directly via Prisma.
// Filtering is handled client-side for instant UX.
export default async function DevQueuePage() {
  const session = await getSession()

  if (!session.userId) {
    notFound()
  }

  const [rawTickets, developers] = await Promise.all([
    db.ticket.findMany({
      where: {
        status: { not: "CANCELLED" },
      },
      orderBy: { priorityOrder: "asc" },
      include: {
        openedBy: {
          select: { id: true, name: true, avatarUrl: true, ninjaAlias: true },
        },
        assignedTo: {
          select: { id: true, name: true, avatarUrl: true, ninjaAlias: true },
        },
        reorderRequests: {
          where: { status: "PENDING" },
          select: { id: true },
        },
      },
    }),
    db.user.findMany({
      where: { role: "DEVELOPER", isActive: true },
      select: { id: true, name: true, ninjaAlias: true },
      orderBy: { name: "asc" },
    }),
  ])

  // Serialize dates to strings for client component compatibility
  const tickets: TicketWithRelations[] = rawTickets.map((t) => ({
    ...t,
    deadline: t.deadline.toISOString(),
    createdAt: t.createdAt.toISOString(),
    hasPendingReorder: t.reorderRequests.length > 0,
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Quadro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tickets ativos ordenados por prioridade. Assuma e filtre por tipo, prioridade ou responsável.
        </p>
      </div>
      <MissionBoard
        initialTickets={tickets}
        mode="dev"
        currentUserId={session.userId}
        currentUserRole={session.role}
        developers={developers}
      />
    </div>
  )
}
