"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import type { PersistentNotification } from "@/hooks/use-persistent-notifications"

// Bell icon — flux color (notifications live in the flux domain)
function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-3 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

// Maps notification type to PT-BR label (product vocabulary — no physics)
function typeLabel(type: string): string {
  if (type === "TICKET_CREATED") return "Novo Chamado"
  if (type === "BUG_CREATED") return "Novo Bug"
  if (type === "TICKET_ASSIGNED") return "Ticket Atribuído"
  return "Notificação"
}

interface NotificationItemProps {
  notification: PersistentNotification
  onAcknowledge: (id: string) => void
  isAcknowledging: boolean
}

function NotificationItem({
  notification,
  onAcknowledge,
  isAcknowledging,
}: NotificationItemProps) {
  const { id, type, title, body, ticket } = notification

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded border border-[oklch(0.78_0.17_195)]/30 bg-background p-4",
        "dark:border-[oklch(0.78_0.17_195)]/40 dark:bg-[oklch(0.22_0.02_250)]"
      )}
    >
      {/* Type badge — flux color (notification domain) */}
      <div className="flex items-center gap-1.5">
        <BellIcon className="text-[oklch(0.78_0.17_195)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.78_0.17_195)]">
          {typeLabel(type)}
        </span>
      </div>

      <p className="text-sm font-semibold leading-snug text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{body}</p>

      {ticket?.publicId && (
        <Link
          href={`/ticket/${ticket.publicId}`}
          className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[oklch(0.78_0.17_195)] underline-offset-2 hover:underline"
        >
          Ver {ticket.publicId}
          <ExternalLinkIcon />
        </Link>
      )}

      <button
        type="button"
        onClick={() => onAcknowledge(id)}
        disabled={isAcknowledging}
        className={cn(
          "mt-1 w-full rounded bg-[oklch(0.78_0.17_195)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.17_0.02_250)]",
          "transition-opacity hover:opacity-90 active:opacity-80",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {isAcknowledging ? "Confirmando…" : "Entendido"}
      </button>
    </div>
  )
}

interface PersistentNotificationBannerProps {
  notifications: PersistentNotification[]
  onAcknowledge: (id: string) => void
  onAcknowledgeAll: () => void
}

export function PersistentNotificationBanner({
  notifications,
  onAcknowledge,
  onAcknowledgeAll,
}: PersistentNotificationBannerProps) {
  const [acknowledgingId, setAcknowledgingId] = React.useState<string | null>(null)
  const [acknowledgingAll, setAcknowledgingAll] = React.useState(false)

  if (notifications.length === 0) return null

  async function handleAcknowledge(id: string) {
    setAcknowledgingId(id)
    try {
      await onAcknowledge(id)
    } finally {
      setAcknowledgingId(null)
    }
  }

  async function handleAcknowledgeAll() {
    setAcknowledgingAll(true)
    try {
      await onAcknowledgeAll()
    } finally {
      setAcknowledgingAll(false)
    }
  }

  const multiple = notifications.length > 1

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-label="Notificações que requerem confirmação"
      className={cn(
        "fixed right-4 top-16 z-[9999] flex w-80 flex-col gap-2",
        "animate-in slide-in-from-top-4 duration-300"
      )}
    >
      {multiple && (
        <div
          className={cn(
            "flex items-center justify-between rounded border border-[oklch(0.78_0.17_195)] px-4 py-2.5",
            "bg-[oklch(0.78_0.17_195)]/10 dark:bg-[oklch(0.78_0.17_195)]/15"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-[oklch(0.78_0.17_195)]">
            <BellIcon />
            {notifications.length} notificações pendentes
          </div>
          <button
            type="button"
            onClick={() => void handleAcknowledgeAll()}
            disabled={acknowledgingAll}
            className={cn(
              "rounded bg-[oklch(0.78_0.17_195)] px-2.5 py-1 text-[11px] font-semibold text-[oklch(0.17_0.02_250)]",
              "transition-opacity hover:opacity-90 active:opacity-80",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {acknowledgingAll ? "Confirmando…" : "Reconhecer Todas"}
          </button>
        </div>
      )}

      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onAcknowledge={(id) => void handleAcknowledge(id)}
          isAcknowledging={acknowledgingId === notification.id || acknowledgingAll}
        />
      ))}
    </div>
  )
}
