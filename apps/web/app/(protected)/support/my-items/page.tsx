import { notFound } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { SeverityBadge } from "@workspace/ui/components/severity-badge"
import { Badge } from "@workspace/ui/components/badge"

export const metadata = {
  title: "Meus Itens — VectorOps",
}

const STATUS_ORDER = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_INFO",
  "DONE",
  "CANCELLED",
] as const

type TicketStatus = (typeof STATUS_ORDER)[number]

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Progresso",
  WAITING_FOR_INFO: "Aguardando Info",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
}

const STATUS_BADGE_VARIANT: Record<
  TicketStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  OPEN: "outline",
  IN_PROGRESS: "default",
  WAITING_FOR_INFO: "secondary",
  DONE: "secondary",
  CANCELLED: "destructive",
}

// Server component — fetches all tickets opened by the current user, grouped by status.
export default async function MyItemsPage() {
  const session = await getSession()

  if (!session.userId) {
    notFound()
  }

  const tickets = await db.ticket.findMany({
    where: { openedById: session.userId },
    orderBy: [{ createdAt: "desc" }],
    include: {
      assignedTo: {
        select: { id: true, name: true },
      },
    },
  })

  // Group by status
  const grouped = STATUS_ORDER.reduce<
    Record<TicketStatus, typeof tickets>
  >(
    (acc, status) => {
      acc[status] = tickets.filter((t) => t.status === status)
      return acc
    },
    {
      OPEN: [],
      IN_PROGRESS: [],
      WAITING_FOR_INFO: [],
      DONE: [],
      CANCELLED: [],
    }
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Meus Itens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos os chamados e bugs que você abriu, agrupados por status.
        </p>
      </div>

      {tickets.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Você ainda não abriu nenhum chamado ou bug.{" "}
          <Link
            href="/support"
            className="font-medium underline-offset-4 hover:underline"
          >
            Abrir agora
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {STATUS_ORDER.map((status) => {
          const items = grouped[status]

          return (
            <details key={status} open={status !== "CANCELLED"} className="group">
              <summary className="flex cursor-pointer select-none list-none items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                {/* Chevron icon that rotates when open */}
                <svg
                  className="size-4 shrink-0 rotate-0 transition-transform group-open:rotate-90 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span>{STATUS_LABELS[status]}</span>
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {items.length} {items.length !== 1 ? "itens" : "item"}
                </span>
              </summary>

              <div className="mt-2 flex flex-col gap-1.5">
                {items.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-muted-foreground">
                    Nenhum item {STATUS_LABELS[status].toLowerCase()}.
                  </p>
                ) : (
                  items.map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/ticket/${ticket.publicId}`}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                    >
                      {/* publicId */}
                      <span className="font-mono text-xs text-muted-foreground">
                        {ticket.publicId}
                      </span>

                      {/* Title */}
                      <span className="flex-1 truncate font-medium">
                        {ticket.title}
                      </span>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={ticket.type === "BUG" ? "destructive" : "outline"}
                          className={
                            ticket.type === "BUG"
                              ? "border-[oklch(0.56_0.22_15)] bg-[oklch(0.56_0.22_15)]/10 text-[oklch(0.56_0.22_15)] text-xs"
                              : "border-[oklch(0.18_0.05_265)] text-[oklch(0.18_0.05_265)] dark:border-primary dark:text-primary text-xs"
                          }
                        >
                          {ticket.type === "BUG" ? "Bug" : "Ticket"}
                        </Badge>
                        <SeverityBadge severity={ticket.severity} />
                        <Badge variant={STATUS_BADGE_VARIANT[status]}>
                          {STATUS_LABELS[status]}
                        </Badge>
                      </div>

                      {/* Assignee */}
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {ticket.assignedTo
                          ? ticket.assignedTo.name
                          : "Não Atribuído"}
                      </span>

                      {/* Created date */}
                      <span className="hidden text-xs text-muted-foreground lg:block">
                        {ticket.createdAt.toLocaleDateString("pt-BR", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}
