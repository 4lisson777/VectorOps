"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"
import { useNotifications } from "@/hooks/use-notifications"
import { useSoundAlerts } from "@/hooks/use-sound-alerts"
import { useSSEContext } from "@/lib/sse-context"

// Simple relative time formatter — avoids adding a dependency
function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return "agora mesmo"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

// Maps notification type to a sound tone
function getToneForType(type: string): "A" | "B" | "E" | null {
  if (type === "TICKET_CREATED") return "A"
  if (type === "BUG_CREATED") return "B"
  if (type === "TICKET_DONE" || type === "TICKET_CANCELLED") return "E"
  return null
}

export function NotificationCenter() {
  const router = useRouter()
  const { notifications, unreadCount, isLoading, markRead, markAllRead } =
    useNotifications()
  const { playTone } = useSoundAlerts()
  const { subscribe } = useSSEContext()
  const [open, setOpen] = React.useState(false)

  // Subscribe for sound alerts on new notifications
  React.useEffect(() => {
    return subscribe((event) => {
      if (event.type === "notification:new") {
        const payload = event.payload as { type: string }
        const tone = getToneForType(payload.type)
        if (tone) {
          void playTone(tone)
        }
      }
    })
  }, [subscribe, playTone])

  async function handleNotificationClick(
    id: string,
    publicId: string | null
  ) {
    void markRead(id)
    setOpen(false)
    if (publicId) {
      router.push(`/ticket/${publicId}`)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notificações (${unreadCount} não lidas)`}
          className="relative rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <BellIcon />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-[#E94560] px-0.5 text-[10px] font-semibold text-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Notificações</h2>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Carregando…
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <BellIcon className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Nenhuma notificação ainda</p>
            </div>
          ) : (
            <ul role="list">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() =>
                      void handleNotificationClick(
                        n.id,
                        n.ticket?.publicId ?? null
                      )
                    }
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors hover:bg-muted/60",
                      !n.isRead && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {/* Unread dot */}
                      <span
                        className={cn(
                          "mt-1.5 size-1.5 shrink-0 rounded-full",
                          n.isRead
                            ? "bg-transparent"
                            : "bg-[#E94560]"
                        )}
                        aria-hidden="true"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-xs font-medium">
                          {n.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                          {relativeTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border px-4 py-2.5">
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Marcar todas como lidas
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
