"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Badge } from "@workspace/ui/components/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

// ---- Types ----------------------------------------------------------------

interface CheckpointConfigData {
  id: string
  intervalMinutes: number
  activeHoursStart: string
  activeHoursEnd: string
  isEnabled: boolean
}

interface CheckpointEntry {
  id: string
  userId: string
  currentTask: string
  isBlocked: boolean
  notes: string | null
  createdAt: string
  user: {
    id: string
    name: string
    ninjaAlias: string
    avatarUrl: string | null
  }
}

interface HistoryResponse {
  checkpoints: CheckpointEntry[]
  total: number
  page: number
}

interface TeamUser {
  id: string
  name: string
  ninjaAlias: string
}

// ---- CheckpointConfig component ------------------------------------------

export function CheckpointConfig() {
  // Config form state
  const [config, setConfig] = React.useState<CheckpointConfigData | null>(null)
  const [isLoadingConfig, setIsLoadingConfig] = React.useState(true)
  const [isEnabled, setIsEnabled] = React.useState(true)
  const [intervalMinutes, setIntervalMinutes] = React.useState("60")
  const [activeHoursStart, setActiveHoursStart] = React.useState("09:00")
  const [activeHoursEnd, setActiveHoursEnd] = React.useState("18:00")
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null)

  // History state
  const [history, setHistory] = React.useState<CheckpointEntry[]>([])
  const [historyTotal, setHistoryTotal] = React.useState(0)
  const [historyPage, setHistoryPage] = React.useState(1)
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(true)
  const [developers, setDevelopers] = React.useState<TeamUser[]>([])
  const [devFilter, setDevFilter] = React.useState<string>("ALL")
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")

  const HISTORY_LIMIT = 20

  async function loadConfig() {
    setIsLoadingConfig(true)
    try {
      const res = await fetch("/api/admin/checkpoints/config")
      if (!res.ok) throw new Error("Falha ao carregar configuração")
      const data = (await res.json()) as { config: CheckpointConfigData }
      setConfig(data.config)
      setIsEnabled(data.config.isEnabled)
      setIntervalMinutes(String(data.config.intervalMinutes))
      setActiveHoursStart(data.config.activeHoursStart)
      setActiveHoursEnd(data.config.activeHoursEnd)
    } catch {
      // Silently fail
    } finally {
      setIsLoadingConfig(false)
    }
  }

  async function loadDevelopers() {
    try {
      const res = await fetch("/api/admin/users?role=DEVELOPER&isActive=true")
      if (!res.ok) return
      const data = (await res.json()) as { users: TeamUser[] }
      setDevelopers(data.users)
    } catch {
      // Silently fail
    }
  }

  async function loadHistory(page: number) {
    setIsLoadingHistory(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", String(HISTORY_LIMIT))
      if (devFilter !== "ALL") params.set("userId", devFilter)
      // Convert date-only strings to full ISO datetime
      if (dateFrom) params.set("from", new Date(dateFrom).toISOString())
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        params.set("to", to.toISOString())
      }
      const res = await fetch(`/api/admin/checkpoints/history?${params.toString()}`)
      if (!res.ok) throw new Error("Falha ao carregar histórico")
      const data = (await res.json()) as HistoryResponse
      setHistory(data.checkpoints)
      setHistoryTotal(data.total)
      setHistoryPage(data.page)
    } catch {
      // Silently fail
    } finally {
      setIsLoadingHistory(false)
    }
  }

  React.useEffect(() => {
    void loadConfig()
    void loadDevelopers()
  }, [])

  React.useEffect(() => {
    void loadHistory(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devFilter, dateFrom, dateTo])

  async function handleSaveConfig() {
    const interval = parseInt(intervalMinutes, 10)
    if (isNaN(interval) || interval < 30 || interval > 480) {
      setSaveMessage("O intervalo deve ter entre 30 e 480 minutos.")
      return
    }
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch("/api/admin/checkpoints/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEnabled,
          intervalMinutes: interval,
          activeHoursStart,
          activeHoursEnd,
        }),
      })
      if (!res.ok) throw new Error("Falha ao salvar")
      const data = (await res.json()) as { config: CheckpointConfigData }
      setConfig(data.config)
      setSaveMessage("Configuração salva.")
    } catch {
      setSaveMessage("Falha ao salvar. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const totalPages = Math.ceil(historyTotal / HISTORY_LIMIT)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações dos Atualizações de Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure solicitações automáticas de Atualizações de Status e reveja o histórico de respostas.
        </p>
      </div>

      {/* Config form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurações Globais</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingConfig ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-8 w-full max-w-xs" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-64" />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Enable toggle */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="checkpoint-enabled" className="font-medium">
                    Ativar Atualizações de Status
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quando ativado, os desenvolvedores recebem solicitações automáticas de Atualizações de Status.
                  </p>
                </div>
                <Switch
                  id="checkpoint-enabled"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </div>

              {/* Interval */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="interval">Intervalo (minutos)</Label>
                <p className="text-xs text-muted-foreground">Intervalo: 30 – 480 minutos</p>
                <Input
                  id="interval"
                  type="number"
                  min={30}
                  max={480}
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(e.target.value)}
                  className="max-w-[140px]"
                />
              </div>

              {/* Active hours */}
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="hours-start">Início (Horário Ativo)</Label>
                  <Input
                    id="hours-start"
                    type="time"
                    value={activeHoursStart}
                    onChange={(e) => setActiveHoursStart(e.target.value)}
                    className="w-36"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="hours-end">Fim (Horário Ativo)</Label>
                  <Input
                    id="hours-end"
                    type="time"
                    value={activeHoursEnd}
                    onChange={(e) => setActiveHoursEnd(e.target.value)}
                    className="w-36"
                  />
                </div>
              </div>

              {saveMessage && (
                <p
                  className={cn(
                    "text-sm",
                    saveMessage === "Configuração salva."
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                  )}
                >
                  {saveMessage}
                </p>
              )}

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => void handleSaveConfig()}
                  disabled={isSaving}
                  className="bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]"
                >
                  {isSaving ? "Salvando…" : "Salvar Configurações"}
                </Button>
                {config && (
                  <Badge variant="outline" className="text-xs">
                    Atual: {config.isEnabled ? "Ativado" : "Desativado"},{" "}
                    {config.intervalMinutes}min,{" "}
                    {config.activeHoursStart}–{config.activeHoursEnd}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Respostas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* History filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={devFilter} onValueChange={setDevFilter}>
              <SelectTrigger className="h-9 w-48">
                <SelectValue placeholder="Todos os desenvolvedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os desenvolvedores</SelectItem>
                {developers.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.ninjaAlias})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="date-from" className="text-xs whitespace-nowrap">
                De
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="date-to" className="text-xs whitespace-nowrap">
                Ate
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-40"
              />
            </div>

            {(dateFrom || dateTo || devFilter !== "ALL") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDevFilter("ALL")
                  setDateFrom("")
                  setDateTo("")
                }}
              >
                Limpar
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Desenvolvedor</TableHead>
                  <TableHead>Tarefa Atual</TableHead>
                  <TableHead>Bloqueado</TableHead>
                  <TableHead className="hidden md:table-cell">Notas</TableHead>
                  <TableHead>Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingHistory ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="size-7 rounded-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-3 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3 w-28" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm italic text-muted-foreground"
                    >
                      Nenhuma resposta de Atualização de Status encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            name={entry.user.name}
                            avatarUrl={entry.user.avatarUrl}
                            size="sm"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {entry.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {entry.user.ninjaAlias}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{entry.currentTask}</span>
                      </TableCell>
                      <TableCell>
                        {entry.isBlocked ? (
                          <Badge
                            variant="outline"
                            className="border-red-500/30 text-red-600 dark:text-red-400"
                          >
                            Bloqueado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Não
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {entry.notes ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleString("pt-BR", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs text-muted-foreground">
                {historyTotal} respostas no total
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={historyPage <= 1 || isLoadingHistory}
                  onClick={() => void loadHistory(historyPage - 1)}
                >
                  Anterior
                </Button>
                <span className="text-xs">
                  Página {historyPage} de {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={historyPage >= totalPages || isLoadingHistory}
                  onClick={() => void loadHistory(historyPage + 1)}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
