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
      <span className={cn("size-1.5 rounded-full shrink-0", config.dot)} style={{ backgroundColor: "currentColor" }} />
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
    <Card className="flex flex-col gap-4 p-5">
      <CardContent className="flex flex-col gap-4 p-0">
        {/* Avatar + name + alias */}
        <div className="flex items-center gap-3">
          <UserAvatar name={dev.name} avatarUrl={dev.avatarUrl} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{dev.name}</p>
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
                className="w-full rounded px-2 py-1 text-left text-xs hover:bg-muted/60"
                aria-label="Clique para editar a tarefa atual"
              >
                {dev.currentTask ? (
                  <span className="text-foreground">{dev.currentTask}</span>
                ) : (
                  <span className="italic text-muted-foreground">
                    Sem tarefa atual
                  </span>
                )}
              </button>
            )
          ) : (
            <p className="px-2 text-xs">
              {dev.currentTask ? (
                dev.currentTask
              ) : (
                <span className="italic text-muted-foreground">
                  Sem tarefa atual
                </span>
              )}
            </p>
          )}
        </div>

        {/* Assigned ticket */}
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Ticket Atribuído
          </p>
          {dev.assignedTicket ? (
            <div className="flex flex-col gap-1 rounded-md border border-border bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-foreground">
                  {dev.assignedTicket.publicId}
                </span>
                <SeverityBadge
                  severity={
                    dev.assignedTicket.severity as
                      | "LOW"
                      | "MEDIUM"
                      | "HIGH"
                      | "CRITICAL"
                  }
                />
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {dev.assignedTicket.title}
              </p>
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
