"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { TicketCard } from "@/components/tickets/ticket-card"
import { ReorderRequestDialog } from "@/components/mission-board/reorder-request-dialog"

// Shared ticket shape expected by MissionBoard and TicketCard
export interface TicketWithRelations {
  id: string
  publicId: string
  title: string
  type: "TICKET" | "BUG"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_INFO" | "DONE" | "CANCELLED"
  deadline: string | Date
  priorityOrder: number
  openedById: string
  assignedToId: string | null
  createdAt: string | Date
  openedBy: {
    id: string
    name: string
    avatarUrl: string | null
    ninjaAlias: string
  }
  assignedTo: {
    id: string
    name: string
    avatarUrl: string | null
    ninjaAlias: string
  } | null
  hasPendingReorder?: boolean
}

interface MissionBoardProps {
  initialTickets: TicketWithRelations[]
  mode: "support" | "dev"
  currentUserId: string
  currentUserRole: string
  developers?: { id: string; name: string; ninjaAlias: string }[]
}

type TypeFilter = "ALL" | "TICKET" | "BUG"
type SeverityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
type StatusFilter =
  | "ALL"
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_INFO"
  | "DONE"
  | "CANCELLED"

export function MissionBoard({
  initialTickets,
  mode,
  currentUserId,
  currentUserRole,
  developers,
}: MissionBoardProps) {
  const router = useRouter()

  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("ALL")
  const [severityFilter, setSeverityFilter] =
    React.useState<SeverityFilter>("ALL")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL")
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("ALL")
  const [actionMsg, setActionMsg] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)
  const [reorderTicket, setReorderTicket] = React.useState<TicketWithRelations | null>(null)

  // All filtering is client-side on initialTickets
  const filtered = React.useMemo(() => {
    return initialTickets.filter((t) => {
      if (typeFilter !== "ALL" && t.type !== typeFilter) return false
      if (severityFilter !== "ALL" && t.severity !== severityFilter)
        return false
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false
      if (assigneeFilter === "UNASSIGNED" && t.assignedToId !== null)
        return false
      if (
        assigneeFilter !== "ALL" &&
        assigneeFilter !== "UNASSIGNED" &&
        t.assignedToId !== assigneeFilter
      )
        return false
      if (search.trim().length > 0) {
        const q = search.toLowerCase()
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.publicId.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [
    initialTickets,
    typeFilter,
    severityFilter,
    statusFilter,
    assigneeFilter,
    search,
  ])

  function showMsg(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 3000)
  }

  async function handleAssignToMe(ticketId: string) {
    if (isPending) return
    setIsPending(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: currentUserId }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        showMsg(data.error ?? "Failed to assign ticket.")
      } else {
        showMsg("Ticket assigned to you.")
        router.refresh()
      }
    } catch {
      showMsg("Network error. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  async function handleAssignTo(ticketId: string, devId: string) {
    if (isPending) return
    setIsPending(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: devId }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        showMsg(data.error ?? "Failed to assign ticket.")
      } else {
        const dev = developers?.find((d) => d.id === devId)
        showMsg(`Ticket assigned to ${dev?.name ?? "developer"}.`)
        router.refresh()
      }
    } catch {
      showMsg("Network error. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  function handleReorderRequest(ticketId: string) {
    const ticket = initialTickets.find((t) => t.id === ticketId)
    if (ticket) setReorderTicket(ticket)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action message */}
      {actionMsg && (
        <div
          role="status"
          className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
        >
          {actionMsg}
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Buscar por ID ou título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
          {filtered.length} de {initialTickets.length} missões
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type tabs */}
        <Tabs
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as TypeFilter)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="ALL" className="h-7 px-3 text-xs">
              Todos
            </TabsTrigger>
            <TabsTrigger value="TICKET" className="h-7 px-3 text-xs">
              Chamado
            </TabsTrigger>
            <TabsTrigger value="BUG" className="h-7 px-3 text-xs">
              Bug
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Severity select */}
        <Select
          value={severityFilter}
          onValueChange={(v) => setSeverityFilter(v as SeverityFilter)}
        >
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="Severidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as Severidades</SelectItem>
            <SelectItem value="CRITICAL">Crítica</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="MEDIUM">Média</SelectItem>
            <SelectItem value="LOW">Baixa</SelectItem>
          </SelectContent>
        </Select>

        {/* Status select */}
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Status</SelectItem>
            <SelectItem value="OPEN">Aberto</SelectItem>
            <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
            <SelectItem value="WAITING_FOR_INFO">Aguardando Info</SelectItem>
            <SelectItem value="DONE">Concluído</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        {/* Assignee filter (dev mode only) */}
        {mode === "dev" && (
          <Select
            value={assigneeFilter}
            onValueChange={setAssigneeFilter}
          >
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Responsáveis</SelectItem>
              <SelectItem value="UNASSIGNED">Não Atribuído</SelectItem>
              {(developers ?? []).map((dev) => (
                <SelectItem key={dev.id} value={dev.id}>
                  {dev.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Ticket list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            Nenhuma missão corresponde aos filtros atuais.
          </div>
        ) : (
          filtered.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              mode={mode}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              developers={developers}
              onAssignToMe={handleAssignToMe}
              onAssignTo={handleAssignTo}
              onReorderRequest={handleReorderRequest}
            />
          ))
        )}
      </div>

      {/* Reorder dialog */}
      {reorderTicket && (
        <ReorderRequestDialog
          ticket={reorderTicket}
          totalTickets={initialTickets.filter(
            (t) => t.status !== "DONE" && t.status !== "CANCELLED"
          ).length}
          userRole={currentUserRole}
          onClose={() => setReorderTicket(null)}
          onSuccess={() => {
            setReorderTicket(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
