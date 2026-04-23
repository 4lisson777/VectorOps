"use client"

import * as React from "react"
import Link from "next/link"
import { SeverityBadge } from "@workspace/ui/components/severity-badge"
import { Badge } from "@workspace/ui/components/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"
import type { TicketWithRelations } from "@/components/tickets/mission-board"

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

interface TicketCardProps {
  ticket: TicketWithRelations
  mode: "support" | "dev"
  currentUserId: string
  currentUserRole: string
  developers?: { id: string; name: string; ninjaAlias: string }[]
  onAssignToMe?: (ticketId: string) => void
  onAssignTo?: (ticketId: string, devId: string) => void
  onReorderRequest?: (ticketId: string) => void
}

export function TicketCard({
  ticket,
  mode,
  currentUserId,
  currentUserRole,
  developers,
  onAssignToMe,
  onAssignTo,
  onReorderRequest,
}: TicketCardProps) {
  const [copied, setCopied] = React.useState(false)

  const isPastDue =
    ticket.status !== "DONE" &&
    ticket.status !== "CANCELLED" &&
    new Date(ticket.deadline) < new Date()

  function handleCopyId() {
    navigator.clipboard.writeText(ticket.publicId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const isTechLead = currentUserRole === "TECH_LEAD"
  const isDeveloper = currentUserRole === "DEVELOPER"
  const isUnassigned = !ticket.assignedToId

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-xs hover:border-[color-mix(in_oklab,var(--ring)_40%,var(--border))] transition-colors sm:flex-row sm:items-center sm:gap-4">
      {/* Left: severity + publicId + title */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={ticket.severity} />
          <button
            type="button"
            onClick={handleCopyId}
            title="Clique para copiar o ID"
            className={cn(
              "font-mono text-xs font-medium tabular-nums rounded px-1.5 py-0.5 transition-colors",
              copied
                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {copied ? "Copiado!" : ticket.publicId}
          </button>
          <Badge
            variant={ticket.type === "BUG" ? "destructive" : "outline"}
            className={
              ticket.type === "BUG"
                ? "border-[oklch(0.68_0.22_320)] bg-[oklch(0.68_0.22_320)]/10 text-[oklch(0.68_0.22_320)]"
                : "border-[oklch(0.18_0.05_265)] text-[oklch(0.18_0.05_265)] dark:border-primary dark:text-primary"
            }
          >
            {ticket.type === "BUG" ? "Bug" : "Chamado"}
          </Badge>
          <Badge variant={STATUS_VARIANT[ticket.status] ?? "outline"}>
            {STATUS_LABELS[ticket.status] ?? ticket.status}
          </Badge>
          {ticket.hasPendingReorder && (
            <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              Reordenação Pendente
            </Badge>
          )}
        </div>
        <Link
          href={`/ticket/${ticket.publicId}`}
          className="truncate text-sm font-medium hover:underline"
          title={ticket.title}
        >
          {ticket.title}
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>
            Aberto por{" "}
            <span className="font-medium text-foreground">
              {ticket.openedBy.name}
            </span>
          </span>
          <span
            className={cn(
              "font-medium",
              isPastDue ? "text-[var(--warning)]" : "text-muted-foreground"
            )}
          >
            Prazo{" "}
            {new Date(ticket.deadline).toLocaleDateString("pt-BR", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {isPastDue && " — ATRASADO"}
          </span>
        </div>
      </div>

      {/* Right: assignee + actions */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Assignee */}
        {ticket.assignedTo ? (
          <div className="flex items-center gap-2">
            <UserAvatar
              name={ticket.assignedTo.name}
              avatarUrl={ticket.assignedTo.avatarUrl}
              size="sm"
            />
            <span className="hidden text-xs sm:block">
              {ticket.assignedTo.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Não Atribuído</span>
        )}

        {/* Actions */}
        {mode === "support" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReorderRequest?.(ticket.id)}
            className="text-xs"
          >
            Solicitar Reordenação
          </Button>
        )}

        {mode === "dev" && isDeveloper && isUnassigned && (
          <Button
            type="button"
            size="sm"
            onClick={() => onAssignToMe?.(ticket.id)}
            className="text-xs bg-[oklch(0.18_0.05_265)] text-white hover:bg-[oklch(0.24_0.06_265)] dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
          >
            Atribuir a mim
          </Button>
        )}

        {mode === "dev" && isTechLead && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="text-xs">
                Atribuir a...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(developers ?? []).map((dev) => (
                <DropdownMenuItem
                  key={dev.id}
                  onClick={() => onAssignTo?.(ticket.id, dev.id)}
                >
                  {dev.name}
                  {dev.ninjaAlias !== dev.name && (
                    <span className="ml-1 text-muted-foreground">
                      ({dev.ninjaAlias})
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
