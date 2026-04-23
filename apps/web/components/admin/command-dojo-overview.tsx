"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

// ---- Types ---------------------------------------------------------------

interface StatEntry {
  status?: string
  severity?: string
  count: number
}

interface DeveloperWorkload {
  userId: string
  name: string
  ninjaAlias: string
  avatarUrl: string | null
  openTicketCount: number
}

interface AdminStats {
  ticketsByStatus: StatEntry[]
  ticketsBySeverity: StatEntry[]
  assignedCount: number
  unassignedCount: number
  avgResolutionTime7d: number
  avgResolutionTime30d: number
  developerWorkload: DeveloperWorkload[]
}

interface TvConfig {
  id: string
  isEnabled: boolean
  refreshInterval: number
}

interface CommandDojoOverviewProps {
  initialStats: AdminStats | null
  initialTvConfig: TvConfig | null
}

// Severity labels (PT-BR product vocabulary)
const SEVERITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Crítica",
}

// Maps to plasma luminance ramp tokens (matches SeverityBadge)
const SEVERITY_MAG: Record<string, "m2" | "m3" | "m4" | "m5"> = {
  LOW: "m2",
  MEDIUM: "m3",
  HIGH: "m4",
  CRITICAL: "m5",
}

function SeverityPill({ severity, count }: { severity: string; count: number }) {
  const m = SEVERITY_MAG[severity] ?? "m2"
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `var(--${m}-bg)`,
        color: `var(--${m}-fg)`,
        borderColor: `var(--${m}-br)`,
      }}
    >
      <span className="font-mono tabular-nums font-bold">{count}</span>
      {SEVERITY_LABELS[severity] ?? severity}
    </span>
  )
}

// ---- RefreshIcon ----------------------------------------------------------

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      className={cn("size-4", spinning && "animate-spin")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

// ---- Main component -------------------------------------------------------

export function CommandDojoOverview({
  initialStats,
  initialTvConfig,
}: CommandDojoOverviewProps) {
  const [stats, setStats] = React.useState<AdminStats | null>(initialStats)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date())
  const [error, setError] = React.useState<string | null>(null)

  // TV Config state
  const [tvConfig, setTvConfig] = React.useState<TvConfig | null>(initialTvConfig)
  const [tvEnabled, setTvEnabled] = React.useState(initialTvConfig?.isEnabled ?? true)
  const [tvInterval, setTvInterval] = React.useState(
    String(initialTvConfig?.refreshInterval ?? 30)
  )
  const [isSavingTv, setIsSavingTv] = React.useState(false)
  const [tvSaveMessage, setTvSaveMessage] = React.useState<string | null>(null)

  async function fetchStats() {
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/stats")
      if (!res.ok) throw new Error("Failed to load stats")
      const data = (await res.json()) as AdminStats
      setStats(data)
      setLastUpdated(new Date())
    } catch {
      setError("Could not load stats. Please try again.")
    } finally {
      setIsRefreshing(false)
    }
  }

  async function fetchTvConfig() {
    try {
      const res = await fetch("/api/admin/tv-config")
      if (!res.ok) return
      const data = (await res.json()) as { config: TvConfig }
      setTvConfig(data.config)
      setTvEnabled(data.config.isEnabled)
      setTvInterval(String(data.config.refreshInterval))
    } catch {
      // Silently fail
    }
  }

  // Initial data load on mount (when no server-side data provided)
  React.useEffect(() => {
    if (!initialStats) void fetchStats()
    if (!initialTvConfig) void fetchTvConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-refresh every 60 seconds
  React.useEffect(() => {
    const id = setInterval(() => {
      void fetchStats()
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  async function handleSaveTvConfig() {
    const interval = parseInt(tvInterval, 10)
    if (isNaN(interval) || interval < 10 || interval > 300) {
      setTvSaveMessage("O intervalo deve ser entre 10 e 300 segundos.")
      return
    }
    setIsSavingTv(true)
    setTvSaveMessage(null)
    try {
      const res = await fetch("/api/admin/tv-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: tvEnabled, refreshInterval: interval }),
      })
      if (!res.ok) throw new Error("Failed to save TV config")
      const data = (await res.json()) as { config: TvConfig }
      setTvConfig(data.config)
      setTvSaveMessage("Salvo com sucesso.")
    } catch {
      setTvSaveMessage("Falha ao salvar. Tente novamente.")
    } finally {
      setIsSavingTv(false)
    }
  }

  // Derived stats
  const ticketsBySeverity = stats?.ticketsBySeverity ?? []
  const openTickets = ticketsBySeverity.reduce((sum, e) => sum + e.count, 0)

  const maxWorkload = Math.max(
    1,
    ...(stats?.developerWorkload.map((d) => d.openTicketCount) ?? [0])
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel Geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral da equipe e métricas em tempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Atualizado às{" "}
            {lastUpdated.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void fetchStats()}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshIcon spinning={isRefreshing} />
            Recarregar
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Open Tickets by Severity */}
        <Card className="col-span-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets / Bugs Abertos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isRefreshing && !stats ? (
              <>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </>
            ) : ticketsBySeverity.length === 0 ? (
              <span className="text-sm text-muted-foreground italic">Nenhum item aberto</span>
            ) : (
              <>
                <span className="text-2xl font-bold tabular-nums">{openTickets}</span>
                <div className="flex flex-wrap gap-1.5 self-center">
                  {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((sev) => {
                    const entry = ticketsBySeverity.find((e) => e.severity === sev)
                    return (
                      <SeverityPill key={sev} severity={sev} count={entry?.count ?? 0} />
                    )
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Assigned vs Unassigned */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atribuídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing && !stats ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <span className="text-2xl font-bold tabular-nums">
                {stats?.assignedCount ?? 0}
              </span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Não Atribuídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing && !stats ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <span className="text-2xl font-bold tabular-nums text-[oklch(0.68_0.22_320)]">
                {stats?.unassignedCount ?? 0}
              </span>
            )}
          </CardContent>
        </Card>

        {/* Avg Resolution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Méd. Resolução (7d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing && !stats ? (
              <Skeleton className="h-8 w-20" />
            ) : stats?.avgResolutionTime7d != null ? (
              <span className="text-2xl font-bold tabular-nums">
                {stats.avgResolutionTime7d.toFixed(1)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">h</span>
              </span>
            ) : (
              <span className="text-sm italic text-muted-foreground">Sem dados</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Méd. Resolução (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing && !stats ? (
              <Skeleton className="h-8 w-20" />
            ) : stats?.avgResolutionTime30d != null ? (
              <span className="text-2xl font-bold tabular-nums">
                {stats.avgResolutionTime30d.toFixed(1)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">h</span>
              </span>
            ) : (
              <span className="text-sm italic text-muted-foreground">Sem dados</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-developer workload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Carga de Trabalho por Desenvolvedor</CardTitle>
        </CardHeader>
        <CardContent>
          {isRefreshing && !stats ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-full" />
                  </div>
                  <Skeleton className="h-3 w-6" />
                </div>
              ))}
            </div>
          ) : !stats?.developerWorkload.length ? (
            <p className="py-4 text-center text-sm italic text-muted-foreground">
              Nenhum desenvolvedor encontrado.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {stats.developerWorkload.map((dev) => (
                <div key={dev.userId} className="flex items-center gap-3">
                  <UserAvatar
                    name={dev.name}
                    avatarUrl={dev.avatarUrl}
                    size="sm"
                  />
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{dev.name}</span>
                      <span className="shrink-0 tabular-nums text-xs font-semibold">
                        {dev.openTicketCount}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[oklch(0.68_0.22_320)] transition-all"
                        style={{
                          width: `${Math.round((dev.openTicketCount / maxWorkload) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {dev.ninjaAlias}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TV Mode settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurações do Modo TV</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="tv-enabled" className="font-medium">
                Ativar Modo TV
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quando desativado, <code>/dev/tv</code> mostrará um erro 503.
              </p>
            </div>
            <Switch
              id="tv-enabled"
              checked={tvEnabled}
              onCheckedChange={setTvEnabled}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tv-interval">Intervalo de Atualização (segundos)</Label>
            <p className="text-xs text-muted-foreground">Intervalo permitido: 10 – 300</p>
            <Input
              id="tv-interval"
              type="number"
              min={10}
              max={300}
              value={tvInterval}
              onChange={(e) => setTvInterval(e.target.value)}
              className="max-w-[140px]"
            />
          </div>

          {tvSaveMessage && (
            <p
              className={cn(
                "text-sm",
                tvSaveMessage.startsWith("Salvo")
                  ? "text-green-600 dark:text-green-400"
                  : "text-destructive"
              )}
            >
              {tvSaveMessage}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => void handleSaveTvConfig()}
              disabled={isSavingTv}
              className="bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]"
            >
              {isSavingTv ? "Salvando…" : "Salvar Configurações da TV"}
            </Button>
            {tvConfig && (
              <Badge variant="outline" className="self-center">
                Atual: {tvConfig.isEnabled ? "Ativado" : "Desativado"},{" "}
                {tvConfig.refreshInterval}s
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
