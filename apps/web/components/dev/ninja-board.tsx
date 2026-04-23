"use client"

import * as React from "react"
import { DeveloperCard } from "@/components/dev/developer-card"
import { SmokeSignalModal } from "@/components/dev/smoke-signal-modal"
import { StatusScrollModal } from "@/components/dev/status-scroll-modal"
import { useSSEContext } from "@/lib/sse-context"
import { cn } from "@workspace/ui/lib/utils"
import type { DevCardData } from "@/components/dev/developer-card"

interface NinjaBoardProps {
  initialDevs: DevCardData[]
  currentUserId: string
  currentUserRole: string
}

interface NewArrivalBanner {
  publicId: string
  type: "TICKET" | "BUG"
}

interface IncomingHelpRequest {
  helpRequestId: string
  requestedById: string
  requesterName: string
  requesterAlias: string
  contextMessage: string
}

interface CheckpointConfigData {
  intervalMinutes: number
  activeHoursStart: string
  activeHoursEnd: string
  isEnabled: boolean
}

export function NinjaBoard({
  initialDevs,
  currentUserId,
  currentUserRole,
}: NinjaBoardProps) {
  const [devs, setDevs] = React.useState<DevCardData[]>(initialDevs)
  const [newArrival, setNewArrival] = React.useState<NewArrivalBanner | null>(null)
  const [incomingHelp, setIncomingHelp] = React.useState<IncomingHelpRequest | null>(null)
  const [smokeSignalOpen, setSmokeSignalOpen] = React.useState(false)
  const [checkpointOpen, setCheckpointOpen] = React.useState(false)
  const [awaitingCheckpoint, setAwaitingCheckpoint] = React.useState<Set<string>>(new Set())
  const [isRespondingHelp, setIsRespondingHelp] = React.useState(false)

  const { subscribe } = useSSEContext()
  const arrivalTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const checkpointPromptTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const isDevRole = currentUserRole === "DEVELOPER" || currentUserRole === "TECH_LEAD"

  const triggerCheckpointPrompt = React.useCallback(() => {
    setCheckpointOpen(true)
    // 4.9 — set 10-minute no-response timer
    if (checkpointPromptTimerRef.current) clearTimeout(checkpointPromptTimerRef.current)
    checkpointPromptTimerRef.current = setTimeout(() => {
      setAwaitingCheckpoint((prev) => new Set(prev).add(currentUserId))
    }, 10 * 60 * 1000)
    // Mark dev as IN_CHECKPOINT
    void fetch("/api/users/me/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devStatus: "IN_CHECKPOINT" }),
    })
  }, [currentUserId])

  async function refetchDevs() {
    try {
      const res = await fetch("/api/users?role=DEVELOPER&isActive=true")
      if (!res.ok) return
      const data = await res.json() as {
        users: Array<DevCardData & { assignedTickets?: DevCardData["assignedTicket"][] }>
      }
      setDevs(
        data.users.map((u) => ({
          ...u,
          assignedTicket: u.assignedTickets?.[0] ?? null,
        }))
      )
    } catch {
      // Silently ignore network errors
    }
  }

  // SSE subscriptions
  React.useEffect(() => {
    return subscribe((event) => {
      // 3.13 — new ticket/bug arrival banner
      if (event.type === "ticket:created") {
        const payload = event.payload as { publicId: string; type: "TICKET" | "BUG" }
        if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current)
        setNewArrival({ publicId: payload.publicId, type: payload.type })
        arrivalTimerRef.current = setTimeout(() => setNewArrival(null), 5000)
      }

      // Developer status/task updated
      if (event.type === "developer:status_changed") {
        const payload = event.payload as {
          userId: string
          devStatus: string
          currentTask: string | null
        }
        setDevs((prev) =>
          prev.map((d) =>
            d.id === payload.userId
              ? { ...d, devStatus: payload.devStatus, currentTask: payload.currentTask }
              : d
          )
        )
        // Clear no-response indicator when dev updates their status
        if (payload.userId === currentUserId && payload.devStatus !== "IN_CHECKPOINT") {
          if (checkpointPromptTimerRef.current) {
            clearTimeout(checkpointPromptTimerRef.current)
          }
          setAwaitingCheckpoint((prev) => {
            const next = new Set(prev)
            next.delete(payload.userId)
            return next
          })
        }
      }

      // Ticket assigned — refetch to update dev cards
      if (event.type === "ticket:assigned") {
        void refetchDevs()
      }

      // 4.4 — incoming help request banner
      if (event.type === "help_request:new") {
        const payload = event.payload as unknown as IncomingHelpRequest
        // Don't show the banner to the requester themselves
        if (payload.requestedById !== currentUserId) {
          setIncomingHelp(payload)
        }
      }

      // 4.6/4.9 — server-pushed checkpoint prompt
      if (event.type === "checkpoint:prompt") {
        const payload = event.payload as { userId: string }
        if (payload.userId === currentUserId) {
          triggerCheckpointPrompt()
        }
      }
    })
  }, [subscribe, currentUserId, triggerCheckpointPrompt])

  // 4.6 — Client-side checkpoint scheduler
  React.useEffect(() => {
    if (!isDevRole) return

    let intervalId: ReturnType<typeof setInterval>

    async function setupScheduler() {
      try {
        const res = await fetch("/api/checkpoints/config")
        if (!res.ok) return
        const { config } = await res.json() as { config: CheckpointConfigData }
        if (!config.isEnabled) return

        const intervalMs = config.intervalMinutes * 60 * 1000

        function isInActiveHours(): boolean {
          const now = new Date()
          const [startH = 0, startM = 0] = config.activeHoursStart.split(":").map(Number)
          const [endH = 23, endM = 59] = config.activeHoursEnd.split(":").map(Number)
          const nowMinutes = now.getHours() * 60 + now.getMinutes()
          return nowMinutes >= startH * 60 + startM && nowMinutes < endH * 60 + endM
        }

        intervalId = setInterval(() => {
          if (isInActiveHours()) {
            triggerCheckpointPrompt()
          }
        }, intervalMs)
      } catch {
        // Silently ignore if config endpoint not reachable
      }
    }

    void setupScheduler()

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isDevRole, currentUserId, triggerCheckpointPrompt])

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current)
      if (checkpointPromptTimerRef.current) clearTimeout(checkpointPromptTimerRef.current)
    }
  }, [])

  async function handleHelpRespond(helpRequestId: string) {
    setIsRespondingHelp(true)
    try {
      const res = await fetch(`/api/help-requests/${helpRequestId}/respond`, {
        method: "POST",
      })
      if (res.ok) {
        setIncomingHelp(null)
      }
    } finally {
      setIsRespondingHelp(false)
    }
  }

  function handleCheckpointSubmitted() {
    // Clear the no-response timer when dev submits the checkpoint
    if (checkpointPromptTimerRef.current) clearTimeout(checkpointPromptTimerRef.current)
    setAwaitingCheckpoint((prev) => {
      const next = new Set(prev)
      next.delete(currentUserId)
      return next
    })
    setCheckpointOpen(false)
  }

  async function handleStatusChange(devId: string, status: string) {
    if (devId !== currentUserId) return
    const res = await fetch("/api/users/me/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devStatus: status }),
    })
    if (res.ok) {
      const data = await res.json() as { devStatus: string | null; currentTask: string | null }
      setDevs((prev) =>
        prev.map((d) =>
          d.id === devId ? { ...d, devStatus: data.devStatus } : d
        )
      )
    }
  }

  async function handleTaskChange(devId: string, task: string) {
    if (devId !== currentUserId) return
    const res = await fetch("/api/users/me/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentTask: task }),
    })
    if (res.ok) {
      const data = await res.json() as { devStatus: string | null; currentTask: string | null }
      setDevs((prev) =>
        prev.map((d) =>
          d.id === devId ? { ...d, currentTask: data.currentTask } : d
        )
      )
    }
  }

  // Stats
  const activeCount = devs.filter((d) => d.devStatus === "ACTIVE" || !d.devStatus).length
  const blockedCount = devs.filter((d) => d.devStatus === "BLOCKED").length
  const inCheckpointCount = devs.filter((d) => d.devStatus === "IN_CHECKPOINT").length
  const helpingCount = devs.filter((d) => d.devStatus === "HELPING").length

  return (
    <div className="flex min-h-full flex-col gap-6 p-6">
      {/* New ticket/bug arrival banner */}
      {newArrival && (
        <div
          className="flex items-center justify-between rounded border px-4 py-2.5 text-sm font-medium"
          style={{
            borderColor: "color-mix(in oklab, var(--warning) 45%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--warning) 10%, transparent)",
            color: "color-mix(in oklab, var(--warning) 60%, var(--foreground))",
          }}
        >
          <span>
            {newArrival.type === "BUG" ? "Novo bug" : "Novo chamado"}{" "}
            <span className="font-mono">{newArrival.publicId}</span> chegou.
          </span>
          <button
            onClick={() => {
              if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current)
              setNewArrival(null)
            }}
            className="ml-4 opacity-60 hover:opacity-100"
            aria-label="Dispensar"
          >
            ✕
          </button>
        </div>
      )}

      {/* Incoming help request banner — flux color (help domain) */}
      {incomingHelp && (
        <div
          className="flex items-start justify-between gap-4 rounded border px-4 py-3 text-sm"
          style={{
            borderColor: "color-mix(in oklab, var(--flux) 50%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--flux) 10%, transparent)",
            color: "color-mix(in oklab, var(--flux) 60%, var(--foreground))",
          }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">
              Pedido de Ajuda — {incomingHelp.requesterAlias}
            </span>
            <span className="opacity-80">{incomingHelp.contextMessage}</span>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => void handleHelpRespond(incomingHelp.helpRequestId)}
              disabled={isRespondingHelp}
              className="rounded px-3 py-1.5 text-xs font-semibold text-[oklch(0.17_0.02_250)] disabled:opacity-50"
              style={{ backgroundColor: "var(--st-resonating)" }}
            >
              Ajudar
            </button>
            <button
              onClick={() => setIncomingHelp(null)}
              className="rounded px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Dispensar
            </button>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral da equipe em tempo real
          </p>
        </div>
        {isDevRole && (
          <button
            onClick={() => setSmokeSignalOpen(true)}
            className="flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: "var(--st-resonating-bg)",
              color: "var(--st-resonating)",
              borderColor: "color-mix(in oklab, var(--st-resonating) 30%, transparent)",
            }}
          >
            Pedir Ajuda
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        <StatPill label="Ativos" count={activeCount} />
        {blockedCount > 0 && (
          <StatPill label="Bloqueados" count={blockedCount} />
        )}
        {inCheckpointCount > 0 && (
          <StatPill label="Em Atualização" count={inCheckpointCount} />
        )}
        {helpingCount > 0 && (
          <StatPill label="Ajudando" count={helpingCount} />
        )}
        <StatPill label="Total" count={devs.length} />
      </div>

      {/* Developer grid */}
      {devs.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">
          Nenhum desenvolvedor ativo encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {devs.map((dev) => (
            <DeveloperCard
              key={dev.id}
              dev={dev}
              isCurrentUser={dev.id === currentUserId}
              isAwaitingCheckpoint={awaitingCheckpoint.has(dev.id)}
              onStatusChange={(status) => handleStatusChange(dev.id, status)}
              onTaskChange={(task) => handleTaskChange(dev.id, task)}
            />
          ))}
        </div>
      )}

      {/* 4.2 — Smoke Signal modal */}
      <SmokeSignalModal
        open={smokeSignalOpen}
        onOpenChange={setSmokeSignalOpen}
      />

      {/* 4.7 — Status Scroll modal */}
      <StatusScrollModal
        open={checkpointOpen}
        onOpenChange={setCheckpointOpen}
        onSubmitted={handleCheckpointSubmitted}
      />
    </div>
  )
}

function StatPill({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline gap-1.5 rounded border border-border bg-card px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
      <span className="font-mono text-[15px] font-bold tracking-normal text-foreground normal-case">{count}</span>
      {label}
    </div>
  )
}
