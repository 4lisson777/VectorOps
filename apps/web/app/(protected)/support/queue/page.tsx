import { notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { MissionBoard } from "@/components/tickets/mission-board"
import type { TicketWithRelations } from "@/components/tickets/mission-board"

export const metadata = {
  title: "Fila de Chamados — VectorOps",
}

// Server component — fetches tickets directly via Prisma and passes them to the
// client-side MissionBoard. Filtering is handled client-side for instant UX.
export default async function SupportQueuePage() {
  const session = await getSession()

  if (!session.userId) {
    notFound()
  }

  const rawTickets = await db.ticket.findMany({
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
  })

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
        <h1 className="text-2xl font-bold tracking-tight">Fila de Chamados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos os chamados ativos, ordenados por prioridade. Cancelados estão ocultos.
        </p>
      </div>
      <MissionBoard
        initialTickets={tickets}
        mode="support"
        currentUserId={session.userId}
        currentUserRole={session.role}
      />
    </div>
  )
}
