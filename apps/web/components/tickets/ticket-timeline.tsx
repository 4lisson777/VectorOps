import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

export interface TicketEventWithActor {
  id: string
  eventType: string
  actorId: string
  metadata: string
  createdAt: string | Date
  actor: {
    id: string
    name: string
    avatarUrl: string | null
    ninjaAlias: string
  }
}

interface TicketTimelineProps {
  events: TicketEventWithActor[]
}

function parseMetadata(raw: string): Record<string, string> {
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Progresso",
  WAITING_FOR_INFO: "Aguardando Info",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
}

const SEVERITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Crítica",
}

function translateStatus(val: string | undefined): string {
  if (!val) return "?"
  return STATUS_LABELS[val] ?? val
}

function translateSeverity(val: string | undefined): string {
  if (!val) return "?"
  return SEVERITY_LABELS[val] ?? val
}

function getEventLabel(
  eventType: string,
  actorName: string,
  meta: Record<string, string>
): string {
  switch (eventType) {
    case "CREATED":
      return `Aberto por ${actorName}`
    case "STATUS_CHANGED":
      return `Status alterado de ${translateStatus(meta.oldStatus ?? meta.from)} para ${translateStatus(meta.newStatus ?? meta.to)} por ${actorName}`
    case "ASSIGNED":
      return `Atribuído a ${meta.assigneeName ?? meta.assigneeId ?? "alguém"} por ${actorName}`
    case "REASSIGNED":
      return `Reatribuído de ${meta.fromName ?? meta.fromId ?? "?"} para ${meta.toName ?? meta.toId ?? "?"} por ${actorName}`
    case "SEVERITY_CHANGED":
      return `Severidade alterada de ${translateSeverity(meta.oldSeverity ?? meta.from)} para ${translateSeverity(meta.newSeverity ?? meta.to)} por ${actorName}`
    case "DEADLINE_CHANGED":
      return `Prazo atualizado por ${actorName}`
    case "PRIORITY_REORDERED":
      return `Prioridade reordenada por ${actorName}`
    case "REORDER_REQUESTED":
      return `Reordenação de prioridade solicitada por ${actorName}`
    case "REORDER_APPROVED":
      return `Solicitação de reordenação aprovada por ${actorName}`
    case "REORDER_DECLINED":
      return `Solicitação de reordenação recusada por ${actorName}`
    case "DONE":
      return `Resolvido por ${actorName}`
    case "CANCELLED":
      return `Cancelado por ${actorName}`
    default:
      return `${eventType.replace(/_/g, " ")} por ${actorName}`
  }
}

// Icon per event type — simple SVG icons
function EventIcon({ eventType }: { eventType: string }) {
  const base = "size-3.5 shrink-0"

  switch (eventType) {
    case "CREATED":
      // Plus circle
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      )
    case "STATUS_CHANGED":
    case "DONE":
    case "CANCELLED":
      // Arrow right circle
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8l4 4-4 4" />
        </svg>
      )
    case "ASSIGNED":
    case "REASSIGNED":
      // User check
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
          <path d="M15 19l2 2 4-4" />
        </svg>
      )
    case "SEVERITY_CHANGED":
      // Alert triangle
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      )
    case "DEADLINE_CHANGED":
      // Calendar
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )
    case "PRIORITY_REORDERED":
    case "REORDER_REQUESTED":
    case "REORDER_APPROVED":
    case "REORDER_DECLINED":
      // Sort
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 6h18M7 12h10M11 18h2" />
        </svg>
      )
    default:
      // Circle dot
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      )
  }
}

function RelativeTime({ date }: { date: string | Date }) {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  let relative: string
  if (diffMins < 1) relative = "agora mesmo"
  else if (diffMins < 60) relative = `${diffMins}min atrás`
  else if (diffHours < 24) relative = `${diffHours}h atrás`
  else if (diffDays < 7) relative = `${diffDays}d atrás`
  else
    relative = d.toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  const absolute = d.toLocaleString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <time dateTime={d.toISOString()} title={absolute} className="text-xs text-muted-foreground">
      {relative}
    </time>
  )
}

export function TicketTimeline({ events }: TicketTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhuma entrada no registro de missões ainda.</p>
    )
  }

  return (
    <ol className="flex flex-col gap-0">
      {events.map((event, index) => {
        const meta = parseMetadata(event.metadata)
        const label = getEventLabel(event.eventType, event.actor.name, meta)
        const isLast = index === events.length - 1

        return (
          <li key={event.id} className="flex gap-3">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground",
                  event.eventType === "CREATED" &&
                    "border-[oklch(0.18_0.05_265)] bg-[oklch(0.18_0.05_265)]/10 text-[oklch(0.18_0.05_265)] dark:border-primary dark:text-primary",
                  (event.eventType === "DONE") &&
                    "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400",
                  event.eventType === "CANCELLED" &&
                    "border-destructive/40 bg-destructive/10 text-destructive"
                )}
              >
                <EventIcon eventType={event.eventType} />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border my-1" />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex flex-col gap-1 pb-4", isLast && "pb-0")}>
              <div className="flex flex-wrap items-center gap-2">
                <UserAvatar
                  name={event.actor.name}
                  avatarUrl={event.actor.avatarUrl}
                  size="sm"
                  className="size-5"
                />
                <span className="text-sm">{label}</span>
              </div>
              <RelativeTime date={event.createdAt} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
