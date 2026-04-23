"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

// ---- Types ----------------------------------------------------------------

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
type DevStatus = "ACTIVE" | "IN_CHECKPOINT" | "BLOCKED" | "HELPING"

interface AssignedTicket {
  publicId: string
  title: string
  severity: Severity
  type: string
  status: string
}

interface Developer {
  id: string
  name: string
  ninjaAlias: string
  avatarUrl: string | null
  devStatus: DevStatus | null
  currentTask: string | null
  assignedTicket: AssignedTicket | null
}

interface TvData {
  developers: Developer[]
  ticketCounts: Record<Severity, number>
  bugCounts: Record<Severity, number>
  refreshInterval: number
  /** Organization name returned by the API when scoped by slug */
  organizationName?: string
}

// ---- Severity badge config — plasma luminance ramp ----------------------

const SEVERITY_STYLES: Record<Severity, { label: string; bgVar: string; fgVar: string; brVar: string }> = {
  LOW: {
    label: "Baixa",
    bgVar: "--mag-2-bg", fgVar: "--mag-2-fg", brVar: "--mag-2-br",
  },
  MEDIUM: {
    label: "Média",
    bgVar: "--mag-3-bg", fgVar: "--mag-3-fg", brVar: "--mag-3-br",
  },
  HIGH: {
    label: "Alta",
    bgVar: "--mag-4-bg", fgVar: "--mag-4-fg", brVar: "--mag-4-br",
  },
  CRITICAL: {
    label: "Crítica",
    bgVar: "--mag-5-bg", fgVar: "--mag-5-fg", brVar: "--mag-5-br",
  },
}

// ---- Dev status config — carrier status tokens ---------------------------

const STATUS_STYLES: Record<string, { label: string; tokenColor: string }> = {
  ACTIVE:        { label: "Ativo",           tokenColor: "--st-coupled" },
  IN_CHECKPOINT: { label: "Em Atualização",  tokenColor: "--st-sampling" },
  BLOCKED:       { label: "Bloqueado",       tokenColor: "--st-blocked" },
  HELPING:       { label: "Ajudando",        tokenColor: "--st-resonating" },
}

// ---- VectorOps logo -------------------------------------------------------

function VectorOpsLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded bg-[oklch(0.68_0.22_320)]">
        <svg
          className="size-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <line x1="4" y1="17" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <polyline points="14,5 20,7 18,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="11" y1="13" x2="13" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-2xl font-bold text-white">
        Vector<span className="text-[oklch(0.68_0.22_320)]">Ops</span>
      </span>
    </div>
  )
}

// ---- Severity count badge ------------------------------------------------

function SeverityCountBadge({
  severity,
  count,
  label,
}: {
  severity: Severity
  count: number
  label: string
}) {
  const { bgVar, fgVar, brVar } = SEVERITY_STYLES[severity]
  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded border px-3 py-2"
      style={{
        backgroundColor: `var(${bgVar})`,
        color: `var(${fgVar})`,
        borderColor: `var(${brVar})`,
      }}
    >
      <span className="font-mono text-2xl font-bold tabular-nums leading-none">{count}</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  )
}

// ---- Developer TV card ---------------------------------------------------

function TvDevCard({ dev }: { dev: Developer }) {
  const status = dev.devStatus ?? "ACTIVE"
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES["ACTIVE"]!

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <UserAvatar
          name={dev.name}
          avatarUrl={dev.avatarUrl}
          size="lg"
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-white">{dev.name}</p>
          <p className="truncate text-sm text-white/50">{dev.ninjaAlias}</p>
        </div>
      </div>

      {/* Status badge */}
      <span
        className="inline-flex self-start items-center rounded border px-3 py-1 text-sm font-semibold"
        style={{
          backgroundColor: `color-mix(in oklab, var(${statusStyle.tokenColor}) 12%, transparent)`,
          color: `var(${statusStyle.tokenColor})`,
          borderColor: `color-mix(in oklab, var(${statusStyle.tokenColor}) 30%, transparent)`,
        }}
      >
        {statusStyle.label}
      </span>

      {/* Current task */}
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
          Tarefa Atual
        </p>
        <p className="text-sm text-white/80">
          {dev.currentTask ?? (
            <span className="italic text-white/30">Sem tarefa atual</span>
          )}
        </p>
      </div>

      {/* Assigned ticket */}
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
          Ticket Atribuído
        </p>
        {dev.assignedTicket ? (
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-white/70">
                {dev.assignedTicket.publicId}
              </span>
              <span
                className="inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `var(${SEVERITY_STYLES[dev.assignedTicket.severity]?.bgVar ?? "--mag-2-bg"})`,
                  color: `var(${SEVERITY_STYLES[dev.assignedTicket.severity]?.fgVar ?? "--mag-2-fg"})`,
                  borderColor: `var(${SEVERITY_STYLES[dev.assignedTicket.severity]?.brVar ?? "--mag-2-br"})`,
                }}
              >
                {SEVERITY_STYLES[dev.assignedTicket.severity]?.label}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-white/60">
              {dev.assignedTicket.title}
            </p>
          </div>
        ) : (
          <p className="text-sm italic text-white/30">Sem ticket atribuído</p>
        )}
      </div>
    </div>
  )
}

// ---- Clock ---------------------------------------------------------------

function LiveClock() {
  const [time, setTime] = React.useState("")

  React.useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="font-mono text-lg font-semibold text-white/70">{time}</span>
  )
}

// ---- TvBoard component ---------------------------------------------------

interface TvBoardProps {
  /** Organization slug — passed from ?org=SLUG URL query parameter. Required by the API. */
  orgSlug?: string
}

export function TvBoard({ orgSlug }: TvBoardProps) {
  const [data, setData] = React.useState<TvData | null>(null)
  const [orgName, setOrgName] = React.useState<string | null>(null)
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchData() {
    try {
      const url = orgSlug
        ? `/api/tv/data?org=${encodeURIComponent(orgSlug)}`
        : "/api/tv/data"
      const res = await fetch(url)
      if (res.status === 503) {
        setIsDisabled(true)
        return
      }
      if (!res.ok) return
      const json = (await res.json()) as TvData
      setData(json)
      setLastUpdated(new Date())
      setIsDisabled(false)
      if (json.organizationName) setOrgName(json.organizationName)

      // Update polling interval dynamically based on server config
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      const ms = (json.refreshInterval ?? 30) * 1000
      intervalRef.current = setInterval(() => {
        void fetchData()
      }, ms)
    } catch {
      // Silently ignore fetch errors — will retry on next interval
    }
  }

  React.useEffect(() => {
    void fetchData()
    // Default 30s until first response tells us the actual interval
    intervalRef.current = setInterval(() => {
      void fetchData()
    }, 30_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- TV disabled state --------------------------------------------------
  if (isDisabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[oklch(0.17_0.02_250)] p-8 text-center">
        <VectorOpsLogo />
        <p className="mt-4 text-lg font-semibold text-white/60">
          O Modo TV está desativado no momento.
        </p>
        <p className="text-sm text-white/30">
          Um Tech Lead pode ativá-lo no Painel Geral.
        </p>
      </div>
    )
  }

  const severities: Severity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

  return (
    <div className="min-h-screen bg-[oklch(0.17_0.02_250)] p-6 flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <VectorOpsLogo />
          {orgName && (
            <span className="text-xs text-white/40 pl-1">{orgName}</span>
          )}
        </div>

        {/* Severity counts */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Tickets
            </p>
            <div className="flex gap-2">
              {severities.map((sev) => (
                <SeverityCountBadge
                  key={sev}
                  severity={sev}
                  count={data?.ticketCounts[sev] ?? 0}
                  label={SEVERITY_STYLES[sev].label}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Bugs
            </p>
            <div className="flex gap-2">
              {severities.map((sev) => (
                <SeverityCountBadge
                  key={sev}
                  severity={sev}
                  count={data?.bugCounts[sev] ?? 0}
                  label={SEVERITY_STYLES[sev].label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Clock + last updated */}
        <div className="flex flex-col items-end gap-1">
          <LiveClock />
          {lastUpdated && (
            <span className="text-xs text-white/30">
              Atualizado às{" "}
              {lastUpdated.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Developer cards grid */}
      {!data ? (
        // Loading skeleton
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-full bg-white/10" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-28 rounded bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/10" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-16 w-full rounded-lg bg-white/10" />
            </div>
          ))}
        </div>
      ) : data.developers.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-lg italic text-white/30">
            Nenhum desenvolvedor ativo no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.developers.map((dev) => (
            <TvDevCard key={dev.id} dev={dev} />
          ))}
        </div>
      )}
    </div>
  )
}
