import { notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { SeverityBadge } from "@workspace/ui/components/severity-badge"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { UserAvatar } from "@/components/user-avatar"
import {
  TicketTimeline,
  type TicketEventWithActor,
} from "@/components/tickets/ticket-timeline"
import {
  TicketActions,
  type TicketForActions,
} from "@/components/tickets/ticket-actions"
import { CopyIdButton } from "@/components/tickets/copy-id-button"
import { ClickUpCopyButton } from "@/components/tickets/clickup-copy-button"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>
}) {
  const { publicId } = await params
  return { title: `${publicId} — VectorOps` }
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Progresso",
  WAITING_FOR_INFO: "Aguardando Info",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
}

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  OPEN: "outline",
  IN_PROGRESS: "default",
  WAITING_FOR_INFO: "secondary",
  DONE: "secondary",
  CANCELLED: "destructive",
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ publicId: string }>
}) {
  const { publicId } = await params
  const session = await getSession()

  if (!session.userId) {
    notFound()
  }

  const ticket = await db.ticket.findFirst({
    where: {
      OR: [{ publicId }, { id: publicId }],
    },
    include: {
      openedBy: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          ninjaAlias: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          ninjaAlias: true,
          role: true,
        },
      },
      bugReport: true,
      events: {
        orderBy: { createdAt: "asc" },
        include: {
          actor: {
            select: { id: true, name: true, avatarUrl: true, ninjaAlias: true },
          },
        },
      },
    },
  })

  if (!ticket) {
    notFound()
  }

  // Fetch developers for Tech Lead and QA assignment actions
  const developers =
    session.role === "TECH_LEAD" || session.role === "QA"
      ? await db.user.findMany({
          where: { role: { in: ["DEVELOPER", "TECH_LEAD"] }, isActive: true },
          select: { id: true, name: true, ninjaAlias: true },
          orderBy: { name: "asc" },
        })
      : undefined

  const isPastDue =
    ticket.status !== "DONE" &&
    ticket.status !== "CANCELLED" &&
    ticket.deadline < new Date()

  // Serialize for client components
  const ticketForActions: TicketForActions = {
    id: ticket.id,
    publicId: ticket.publicId,
    status: ticket.status,
    severity: ticket.severity,
    deadline: ticket.deadline.toISOString(),
    assignedToId: ticket.assignedToId,
  }

  const timelineEvents: TicketEventWithActor[] = ticket.events.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main content */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3">
            {/* Row 1: publicId, type, severity, status */}
            <div className="flex flex-wrap items-center gap-2">
              <CopyIdButton publicId={ticket.publicId} />
              <Badge
                variant={ticket.type === "BUG" ? "destructive" : "outline"}
                className={
                  ticket.type === "BUG"
                    ? "border-[oklch(0.56_0.22_15)] bg-[oklch(0.56_0.22_15)]/10 text-[oklch(0.56_0.22_15)]"
                    : "border-[oklch(0.18_0.05_265)] text-[oklch(0.18_0.05_265)] dark:border-primary dark:text-primary"
                }
              >
                {ticket.type === "BUG" ? "Bug" : "Ticket"}
              </Badge>
              <SeverityBadge severity={ticket.severity} />
              <Badge variant={STATUS_VARIANT[ticket.status] ?? "outline"}>
                {STATUS_LABELS[ticket.status] ?? ticket.status}
              </Badge>
            </div>

            {/* Row 2: title */}
            <h1 className="text-2xl font-bold leading-snug">{ticket.title}</h1>

            {/* Row 3: opener, assignee, dates */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <UserAvatar
                  name={ticket.openedBy.name}
                  avatarUrl={ticket.openedBy.avatarUrl}
                  size="sm"
                  className="size-5"
                />
                <span>
                  Aberto por{" "}
                  <span className="font-medium text-foreground">
                    {ticket.openedBy.name}
                  </span>
                </span>
              </span>

              {ticket.assignedTo ? (
                <span className="flex items-center gap-1.5">
                  <UserAvatar
                    name={ticket.assignedTo.name}
                    avatarUrl={ticket.assignedTo.avatarUrl}
                    size="sm"
                    className="size-5"
                  />
                  <span>
                    Atribuído a{" "}
                    <span className="font-medium text-foreground">
                      {ticket.assignedTo.name}
                    </span>
                  </span>
                </span>
              ) : (
                <span className="italic">Não Atribuído</span>
              )}

              <span>
                Criado em{" "}
                {ticket.createdAt.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <span className={isPastDue ? "font-medium text-destructive" : ""}>
                Prazo{" "}
                {ticket.deadline.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {isPastDue && " — ATRASADO"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Descrição
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Bug-specific details */}
          {ticket.type === "BUG" && ticket.bugReport && (
            <>
              <Separator />
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Detalhes do Bug
                </h2>

                {/* Module, Environment, Customer */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Módulo Afetado
                    </p>
                    <p className="text-sm">{ticket.bugReport.affectedModule}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Ambiente
                    </p>
                    <p className="text-sm capitalize">
                      {ticket.bugReport.environment.toLowerCase()}
                    </p>
                  </div>
                  {ticket.bugReport.customerId && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Cliente
                      </p>
                      <p className="text-sm">{ticket.bugReport.customerId}</p>
                    </div>
                  )}
                </div>

                {/* Steps to Reproduce */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Passos para Reproduzir
                  </p>
                  <ol className="ml-4 flex flex-col gap-1 text-sm">
                    {ticket.bugReport.stepsToReproduce
                      .split("\n")
                      .filter((line) => line.trim().length > 0)
                      .map((step, i) => (
                        <li key={i} className="list-decimal">
                          {step.replace(/^\d+\.\s*/, "")}
                        </li>
                      ))}
                  </ol>
                </div>

                {/* Expected vs Actual */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                    <p className="mb-1 text-xs font-medium text-green-700 dark:text-green-400">
                      Comportamento Esperado
                    </p>
                    <p className="whitespace-pre-wrap text-sm">
                      {ticket.bugReport.expectedBehavior}
                    </p>
                  </div>
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                    <p className="mb-1 text-xs font-medium text-destructive">
                      Comportamento Atual
                    </p>
                    <p className="whitespace-pre-wrap text-sm">
                      {ticket.bugReport.actualBehavior}
                    </p>
                  </div>
                </div>

                {/* ClickUp copy */}
                <ClickUpCopyButton
                  bug={{
                    publicId: ticket.publicId,
                    title: ticket.title,
                    affectedModule: ticket.bugReport.affectedModule,
                    stepsToReproduce: ticket.bugReport.stepsToReproduce,
                    expectedBehavior: ticket.bugReport.expectedBehavior,
                    actualBehavior: ticket.bugReport.actualBehavior,
                    severity: ticket.severity,
                    deadline: ticket.deadline.toISOString().slice(0, 10),
                    environment: ticket.bugReport.environment,
                    customerId: ticket.bugReport.customerId ?? undefined,
                  }}
                />
              </div>
            </>
          )}

          <Separator />

          {/* Timeline */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Histórico
            </h2>
            <TicketTimeline events={timelineEvents} />
          </div>
        </div>

        {/* Sidebar: actions */}
        <div className="flex flex-col gap-4">
          <TicketActions
            ticket={ticketForActions}
            currentUserId={session.userId}
            currentUserRole={session.role}
            developers={developers}
          />
        </div>
      </div>
    </div>
  )
}
