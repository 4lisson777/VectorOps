"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

export interface TicketForActions {
  id: string
  publicId: string
  status: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_INFO" | "DONE" | "CANCELLED"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  deadline: string | Date
  assignedToId: string | null
}

interface TicketActionsProps {
  ticket: TicketForActions
  currentUserId: string
  currentUserRole: string
  developers?: { id: string; name: string; ninjaAlias: string }[]
}

// Valid status transitions per role
const DEV_TRANSITIONS: Record<
  TicketForActions["status"],
  TicketForActions["status"][]
> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_INFO", "DONE", "CANCELLED"],
  WAITING_FOR_INFO: ["IN_PROGRESS", "DONE", "CANCELLED"],
  DONE: [],
  CANCELLED: [],
}

const LEAD_TRANSITIONS: TicketForActions["status"][] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_INFO",
  "DONE",
  "CANCELLED",
]

const STATUS_LABELS: Record<TicketForActions["status"], string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Progresso",
  WAITING_FOR_INFO: "Aguardando Info",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
}

const SEVERITY_OPTIONS: {
  value: TicketForActions["severity"]
  label: string
}[] = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "CRITICAL", label: "Crítica" },
]

export function TicketActions({
  ticket,
  currentUserId,
  currentUserRole,
  developers,
}: TicketActionsProps) {
  const router = useRouter()

  const [statusValue, setStatusValue] = React.useState<
    TicketForActions["status"]
  >(ticket.status)
  const [severityValue, setSeverityValue] = React.useState<
    TicketForActions["severity"]
  >(ticket.severity)
  const [deadlineValue, setDeadlineValue] = React.useState<string>(
    typeof ticket.deadline === "string"
      ? ticket.deadline.slice(0, 10)
      : ticket.deadline.toISOString().slice(0, 10)
  )
  const [assigneeValue, setAssigneeValue] = React.useState<string>(
    ticket.assignedToId ?? "UNASSIGNED"
  )

  const [isPending, setIsPending] = React.useState(false)
  const [actionMsg, setActionMsg] = React.useState<string | null>(null)

  const isTechLead = currentUserRole === "TECH_LEAD"
  const isDeveloper = currentUserRole === "DEVELOPER"
  const isQA = currentUserRole === "QA"
  const isOwnTicket = ticket.assignedToId === currentUserId
  const isUnassigned = !ticket.assignedToId

  // Developers can only act on tickets assigned to them (or unassigned — assign-to-me)
  const canActAsdev = isDeveloper && (isOwnTicket || isUnassigned)

  if (!isTechLead && !canActAsdev && !isQA) {
    return null
  }

  function showMsg(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 3000)
  }

  async function patchTicket(body: Record<string, unknown>) {
    if (isPending) return
    setIsPending(true)
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        showMsg(data.error ?? "Falha ao atualizar o chamado.")
      } else {
        showMsg("Chamado atualizado.")
        router.refresh()
      }
    } catch {
      showMsg("Erro de rede. Tente novamente.")
    } finally {
      setIsPending(false)
    }
  }

  async function handleAssignToMe() {
    if (isPending) return
    setIsPending(true)
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: currentUserId }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        showMsg(data.error ?? "Falha ao atribuir o chamado.")
      } else {
        showMsg("Chamado atribuído a você.")
        router.refresh()
      }
    } catch {
      showMsg("Erro de rede. Tente novamente.")
    } finally {
      setIsPending(false)
    }
  }

  async function handleReassign(devId: string) {
    if (isPending) return
    setIsPending(true)
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: devId === "UNASSIGNED" ? null : devId }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        showMsg(data.error ?? "Falha ao reatribuir o chamado.")
      } else {
        showMsg("Chamado reatribuído.")
        router.refresh()
      }
    } catch {
      showMsg("Erro de rede. Tente novamente.")
    } finally {
      setIsPending(false)
    }
  }

  const statusOptions = isTechLead
    ? LEAD_TRANSITIONS
    : DEV_TRANSITIONS[ticket.status]

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Ações</h3>

      {actionMsg && (
        <div
          role="status"
          className="rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground"
        >
          {actionMsg}
        </div>
      )}

      {/* Assign to me (developer on unassigned ticket) */}
      {isDeveloper && isUnassigned && (
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={handleAssignToMe}
          className="w-full bg-[oklch(0.18_0.05_265)] text-white hover:bg-[oklch(0.24_0.06_265)] dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
        >
          Atribuir a mim
        </Button>
      )}

      {/* QA: assignment dropdown only — no status, severity, or deadline controls */}
      {isQA && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Responsável</Label>
          <Select
            value={assigneeValue}
            onValueChange={(v) => {
              setAssigneeValue(v)
              void handleReassign(v)
            }}
            disabled={isPending}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Não Atribuído" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNASSIGNED">Não Atribuído</SelectItem>
              {(developers ?? []).map((dev) => (
                <SelectItem key={dev.id} value={dev.id}>
                  {dev.name}
                  {dev.ninjaAlias !== dev.name && (
                    <span className="ml-1 text-muted-foreground">
                      ({dev.ninjaAlias})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Status dropdown */}
      {statusOptions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            value={statusValue}
            onValueChange={(v) => {
              const s = v as TicketForActions["status"]
              setStatusValue(s)
              void patchTicket({ status: s })
            }}
            disabled={isPending}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* Always show current status as an option */}
              <SelectItem value={ticket.status}>
                {STATUS_LABELS[ticket.status]}
              </SelectItem>
              {statusOptions
                .filter((s) => s !== ticket.status)
                .map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tech Lead only: severity + deadline + reassign */}
      {isTechLead && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Severidade</Label>
            <Select
              value={severityValue}
              onValueChange={(v) => {
                const s = v as TicketForActions["severity"]
                setSeverityValue(s)
                void patchTicket({ severity: s })
              }}
              disabled={isPending}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="action-deadline" className="text-xs">
              Prazo
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="action-deadline"
                type="date"
                value={deadlineValue}
                onChange={(e) => setDeadlineValue(e.target.value)}
                disabled={isPending}
                className={cn(
                  "flex h-8 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "[color-scheme:light] dark:[color-scheme:dark]"
                )}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending || deadlineValue === (
                  typeof ticket.deadline === "string"
                    ? ticket.deadline.slice(0, 10)
                    : ticket.deadline.toISOString().slice(0, 10)
                )}
                onClick={() => void patchTicket({ deadline: deadlineValue })}
                className="h-8 text-xs"
              >
                Salvar
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Responsável</Label>
            <Select
              value={assigneeValue}
              onValueChange={(v) => {
                setAssigneeValue(v)
                void handleReassign(v)
              }}
              disabled={isPending}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Não Atribuído" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNASSIGNED">Não Atribuído</SelectItem>
                {(developers ?? []).map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name}
                    {dev.ninjaAlias !== dev.name && (
                      <span className="ml-1 text-muted-foreground">
                        ({dev.ninjaAlias})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}
