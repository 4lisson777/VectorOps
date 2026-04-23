"use client"

import * as React from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { SeverityBadge } from "@workspace/ui/components/severity-badge"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

export interface DevCardData {
  id: string
  name: string
  ninjaAlias: string
  avatarUrl: string | null
  devStatus: string | null
  currentTask: string | null
  assignedTicket: {
    publicId: string
    title: string
    severity: string
    type: string
  } | null
}

interface DeveloperCardProps {
  dev: DevCardData
  isCurrentUser: boolean
  isAwaitingCheckpoint: boolean
  onStatusChange: (status: string) => Promise<void>
  onTaskChange: (task: string) => Promise<void>
}

// Status display configuration — uses VectorOps carrier status tokens
const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; style: React.CSSProperties }
> = {
  ACTIVE: {
    label: "Ativo",
    dot: "bg-[var(--st-coupled)]",
    style: {
      backgroundColor: "var(--st-coupled-bg)",
      color: "var(--st-coupled)",
      borderColor: "color-mix(in oklab, var(--st-coupled) 30%, transparent)",
    },
  },
  IN_CHECKPOINT: {
    label: "Em Atualização",
    dot: "bg-[var(--st-sampling)]",
    style: {
      backgroundColor: "var(--st-sampling-bg)",
      color: "var(--st-sampling)",
      borderColor: "color-mix(in oklab, var(--st-sampling) 30%, transparent)",
    },
  },
  BLOCKED: {
    label: "Bloqueado",
    dot: "bg-[var(--st-blocked)]",
    style: {
      backgroundColor: "var(--st-blocked-bg)",
      color: "var(--st-blocked)",
      borderColor: "color-mix(in oklab, var(--st-blocked) 30%, transparent)",
    },
  },
  HELPING: {
    label: "Ajudando",
    dot: "bg-[var(--st-resonating)]",
    style: {
      backgroundColor: "var(--st-resonating-bg)",
      color: "var(--st-resonating)",
      borderColor: "color-mix(in oklab, var(--st-resonating) 30%, transparent)",
    },
  },
  AWAY: {
    label: "Ausente",
    dot: "bg-[var(--st-offline)]",
    style: {
      backgroundColor: "var(--st-offline-bg)",
      color: "var(--st-offline)",
      borderColor: "color-mix(in oklab, var(--st-offline) 30%, transparent)",
    },
  },
}

const ALL_STATUSES = ["ACTIVE", "IN_CHECKPOINT", "BLOCKED", "HELPING", "AWAY"] as const

function StatusBadge({
  status,
  className,
}: {
  status: string | null
  className?: string
}) {
  const key = status ?? "ACTIVE"
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG["ACTIVE"]!
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={config.style}
    >
      <span
        className={cn("size-1.5 rounded-full shrink-0", config.dot)}
        style={{
          backgroundColor: "currentColor",
          ...(key === "HELPING" ? { boxShadow: "0 0 0 3px color-mix(in oklab, currentColor 25%, transparent)" } : {})
        }}
      />
      {config.label}
    </span>
  )
}

export function DeveloperCard({
  dev,
  isCurrentUser,
  isAwaitingCheckpoint,
  onStatusChange,
  onTaskChange,
}: DeveloperCardProps) {
  const [isEditingTask, setIsEditingTask] = React.useState(false)
  const [taskDraft, setTaskDraft] = React.useState(dev.currentTask ?? "")
  const [isSavingStatus, setIsSavingStatus] = React.useState(false)
  const [isSavingTask, setIsSavingTask] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Keep draft in sync when parent updates dev data
  React.useEffect(() => {
    if (!isEditingTask) {
      setTaskDraft(dev.currentTask ?? "")
    }
  }, [dev.currentTask, isEditingTask])

  function handleEditStart() {
    setTaskDraft(dev.currentTask ?? "")
    setIsEditingTask(true)
    // Focus on next tick after re-render
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  async function handleTaskSave() {
    const trimmed = taskDraft.trim()
    setIsEditingTask(false)
    if (trimmed === (dev.currentTask ?? "")) return
    setIsSavingTask(true)
    try {
      await onTaskChange(trimmed)
    } finally {
      setIsSavingTask(false)
    }
  }

  function handleTaskKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      void handleTaskSave()
    } else if (e.key === "Escape") {
      setTaskDraft(dev.currentTask ?? "")
      setIsEditingTask(false)
    }
  }

  async function handleStatusChange(status: string) {
    setIsSavingStatus(true)
    try {
      await onStatusChange(status)
    } finally {
      setIsSavingStatus(false)
    }
  }

  return (
    <Card
      className={cn("flex flex-col gap-4 p-5", isCurrentUser && "ring-1 ring-ring")}
      style={isCurrentUser ? { boxShadow: "var(--shadow-plasma)" } : undefined}
    >
      <CardContent className="flex flex-col gap-4 p-0">
        {/* Avatar + name + alias */}
        <div className="flex items-center gap-3">
          <UserAvatar name={dev.name} avatarUrl={dev.avatarUrl} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {dev.name}
              {isCurrentUser && (
                <span style={{ fontSize: 10, color: "var(--flux)", marginLeft: 4 }}>(você)</span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {dev.ninjaAlias}
            </p>
          </div>
        </div>

        {/* 4.9 — No-response indicator */}
        {isAwaitingCheckpoint && (
          <div
            className="rounded border px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--st-sampling-bg)",
              color: "var(--st-sampling)",
              borderColor: "color-mix(in oklab, var(--st-sampling) 30%, transparent)",
            }}
          >
            Sem resposta à atualização de status
          </div>
        )}

        {/* Status badge */}
        <div>
          {isCurrentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  disabled={isSavingStatus}
                  className="cursor-pointer"
                  aria-label="Mudar seu status"
                >
                  <StatusBadge status={dev.devStatus} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {ALL_STATUSES.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => void handleStatusChange(s)}
                    className="gap-2"
                  >
                    <span
                      className={cn("size-2 rounded-full", STATUS_CONFIG[s]?.dot)}
                    />
                    {STATUS_CONFIG[s]?.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <StatusBadge status={dev.devStatus} />
          )}
        </div>

        {/* Current task */}
        <div className="min-h-[2rem]">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Tarefa Atual
          </p>
          {isCurrentUser ? (
            isEditingTask ? (
              <input
                ref={inputRef}
                type="text"
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                onBlur={() => void handleTaskSave()}
                onKeyDown={handleTaskKeyDown}
                placeholder="No que você está trabalhando?"
                className="w-full rounded border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            ) : (
              <button
                type="button"
                onClick={handleEditStart}
                disabled={isSavingTask}
                className="w-full text-left"
                aria-label="Clique para editar a tarefa atual"
              >
                <div className="rounded px-2.5 py-2 text-xs leading-[1.45] min-h-[36px] font-sans" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                  {dev.currentTask ?? <span className="italic">Sem tarefa atual</span>}
                </div>
              </button>
            )
          ) : (
            <div className="rounded px-2.5 py-2 text-xs leading-[1.45] min-h-[36px] font-sans" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
              {dev.currentTask ?? <span className="italic">Sem tarefa atual</span>}
            </div>
          )}
        </div>

        {/* Assigned ticket */}
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Ticket Atribuído
          </p>
          {dev.assignedTicket ? (
            <div className="flex items-center gap-2 border-t border-dashed border-border pt-2 min-w-0">
              <SeverityBadge
                severity={
                  dev.assignedTicket.severity as
                    | "LOW"
                    | "MEDIUM"
                    | "HIGH"
                    | "CRITICAL"
                }
              />
              <span className="font-mono text-xs font-medium text-foreground shrink-0">
                {dev.assignedTicket.publicId}
              </span>
              <span className="truncate text-xs text-muted-foreground min-w-0">
                {dev.assignedTicket.title}
              </span>
            </div>
          ) : (
            <p className="px-2 text-xs italic text-muted-foreground">
              Sem missão ativa
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
