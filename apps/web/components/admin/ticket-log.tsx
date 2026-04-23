"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { SeverityBadge } from "@workspace/ui/components/severity-badge"
import { cn } from "@workspace/ui/lib/utils"

// ---- Types ----------------------------------------------------------------

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
type TicketType = "TICKET" | "BUG"
type Status =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_INFO"
  | "DONE"
  | "CANCELLED"
type SortBy =
  | "createdAt"
  | "resolvedAt"
  | "severity"
  | "status"
  | "priorityOrder"
type SortOrder = "asc" | "desc"

interface TicketSummary {
  id: string
  publicId: string
  title: string
  type: TicketType
  severity: Severity
  status: Status
  openedBy: { id: string; name: string }
  assignedTo: { id: string; name: string } | null
  createdAt: string
  resolvedAt: string | null
}

interface TicketsResponse {
  tickets: TicketSummary[]
  total: number
  page: number
}

const STATUS_LABELS: Record<Status, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Progresso",
  WAITING_FOR_INFO: "Aguardando Info",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
}

const STATUS_VARIANT: Record<Status, "default" | "secondary" | "outline" | "destructive"> = {
  OPEN: "outline",
  IN_PROGRESS: "default",
  WAITING_FOR_INFO: "secondary",
  DONE: "secondary",
  CANCELLED: "destructive",
}

// ---- Sort icon -----------------------------------------------------------

function SortIcon({ direction }: { direction: "asc" | "desc" | null }) {
  if (!direction)
    return (
      <svg
        className="size-3 text-muted-foreground/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12l7-7 7 7" />
      </svg>
    )
  return (
    <svg
      className={cn("size-3", direction === "asc" ? "rotate-0" : "rotate-180")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12l7-7 7 7" />
    </svg>
  )
}

// ---- TicketLog component --------------------------------------------------

const PAGE_LIMIT = 20

export function TicketLog() {
  const router = useRouter()

  const [tickets, setTickets] = React.useState<TicketSummary[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)

  // Filters
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL")
  const [severityFilter, setSeverityFilter] = React.useState<string>("ALL")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [createdFrom, setCreatedFrom] = React.useState("")
  const [createdTo, setCreatedTo] = React.useState("")

  // Sorting
  const [sortBy, setSortBy] = React.useState<SortBy>("createdAt")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc")

  async function loadTickets(targetPage: number) {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(targetPage))
      params.set("limit", String(PAGE_LIMIT))
      params.set("sortBy", sortBy)
      params.set("sortOrder", sortOrder)
      if (search) params.set("search", search)
      if (typeFilter !== "ALL") params.set("type", typeFilter)
      if (severityFilter !== "ALL") params.set("severity", severityFilter)
      if (statusFilter !== "ALL") params.set("status", statusFilter)
      if (createdFrom) params.set("createdFrom", new Date(createdFrom).toISOString())
      if (createdTo) {
        const to = new Date(createdTo)
        to.setHours(23, 59, 59, 999)
        params.set("createdTo", to.toISOString())
      }

      const res = await fetch(`/api/tickets?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to load tickets")
      const data = (await res.json()) as TicketsResponse
      setTickets(data.tickets)
      setTotal(data.total)
      setPage(data.page)
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce search
  const searchDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      void loadTickets(1)
    }, 300)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    typeFilter,
    severityFilter,
    statusFilter,
    createdFrom,
    createdTo,
    sortBy,
    sortOrder,
  ])

  function handleSort(column: SortBy) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  function getSortDirection(column: SortBy): "asc" | "desc" | null {
    return sortBy === column ? sortOrder : null
  }

  const totalPages = Math.ceil(total / PAGE_LIMIT)

  function clearFilters() {
    setSearch("")
    setTypeFilter("ALL")
    setSeverityFilter("ALL")
    setStatusFilter("ALL")
    setCreatedFrom("")
    setCreatedTo("")
  }

  const hasFilters =
    search ||
    typeFilter !== "ALL" ||
    severityFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    createdFrom ||
    createdTo

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registro de Missões</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Histórico completo de todos os chamados e bugs.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <Input
          type="search"
          placeholder="Buscar por ID ou título…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 max-w-xs"
        />

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os tipos</SelectItem>
            <SelectItem value="TICKET">Chamado</SelectItem>
            <SelectItem value="BUG">Bug</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Severidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as severidades</SelectItem>
            <SelectItem value="LOW">Baixa</SelectItem>
            <SelectItem value="MEDIUM">Média</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="CRITICAL">Crítica</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            <SelectItem value="OPEN">Aberto</SelectItem>
            <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
            <SelectItem value="WAITING_FOR_INFO">Aguardando Info</SelectItem>
            <SelectItem value="DONE">Concluído</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Label htmlFor="log-from" className="text-xs whitespace-nowrap">
            De
          </Label>
          <Input
            id="log-from"
            type="date"
            value={createdFrom}
            onChange={(e) => setCreatedFrom(e.target.value)}
            className="h-9 w-36"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="log-to" className="text-xs whitespace-nowrap">
            Ate
          </Label>
          <Input
            id="log-to"
            type="date"
            value={createdTo}
            onChange={(e) => setCreatedTo(e.target.value)}
            className="h-9 w-36"
          />
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">ID</TableHead>
              <TableHead className="min-w-[200px]">Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("severity")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Severidade
                  <SortIcon direction={getSortDirection("severity")} />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Status
                  <SortIcon direction={getSortDirection("status")} />
                </button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Aberto por</TableHead>
              <TableHead className="hidden xl:table-cell">Atribuído a</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Criado
                  <SortIcon direction={getSortDirection("createdAt")} />
                </button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <button
                  type="button"
                  onClick={() => handleSort("resolvedAt")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Resolvido
                  <SortIcon direction={getSortDirection("resolvedAt")} />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-sm italic text-muted-foreground"
                >
                  Nenhuma missão encontrada.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/ticket/${ticket.publicId}`)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/ticket/${ticket.publicId}`)
                    }
                  }}
                >
                  <TableCell>
                    <span className="font-mono text-xs font-medium">
                      {ticket.publicId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-1 text-sm">{ticket.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ticket.type === "BUG" ? "destructive" : "outline"}
                      className={cn(
                        "text-xs",
                        ticket.type === "BUG"
                          ? "border-[oklch(0.68_0.22_320)] bg-[oklch(0.68_0.22_320)]/10 text-[oklch(0.68_0.22_320)]"
                          : ""
                      )}
                    >
                      {ticket.type === "BUG" ? "Bug" : "Chamado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={ticket.severity} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[ticket.status] ?? "outline"}
                      className="text-xs"
                    >
                      {STATUS_LABELS[ticket.status] ?? ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs">{ticket.openedBy.name}</span>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {ticket.assignedTo?.name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {ticket.resolvedAt
                        ? new Date(ticket.resolvedAt).toLocaleDateString("pt-BR", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {total} resultados no total
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => void loadTickets(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-xs">
              Página {page} de {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => void loadTickets(page + 1)}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
