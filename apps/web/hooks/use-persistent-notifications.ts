"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useSSEContext } from "@/lib/sse-context"
import { useSoundAlerts } from "@/hooks/use-sound-alerts"
import { useBrowserNotifications } from "@/hooks/use-browser-notifications"

// How often sound + browser notification repeats (ms)
const REPEAT_INTERVAL_MS = 30_000

export interface PersistentNotification {
  id: string
  type: string
  title: string
  body: string
  ticketId: string | null
  ticket: { publicId: string } | null
  requiresAck: boolean
  isRead: boolean
  acknowledgedAt: string | null
  createdAt: string
}

// SSE payload shape for notification:new
interface NotificationNewPayload {
  id?: string
  userId: string
  type: string
  title: string
  body: string
  ticketId?: string | null
  ticket?: { publicId: string } | null
  requiresAck?: boolean
  isRead?: boolean
  acknowledgedAt?: string | null
  createdAt?: string
}

// Maps notification type to sound tone for persistent alerts
function getToneForPersistentType(type: string): "A" | "B" {
  if (type === "BUG_CREATED") return "B"
  // TICKET_CREATED and TICKET_ASSIGNED both use Tone A
  return "A"
}

export function usePersistentNotifications() {
  const [pending, setPending] = useState<PersistentNotification[]>([])
  const { subscribe } = useSSEContext()
  const { playTone } = useSoundAlerts()
  const { requestPermission, showNotification } = useBrowserNotifications()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Keep a stable ref to pending so the interval callback always sees current state
  const pendingRef = useRef<PersistentNotification[]>([])

  // Keep ref in sync with state
  useEffect(() => {
    pendingRef.current = pending
  }, [pending])

  // Request browser notification permission once on mount
  useEffect(() => {
    void requestPermission()
  }, [requestPermission])

  // Fetch any unacknowledged persistent notifications on mount (page refresh recovery)
  useEffect(() => {
    async function fetchPending() {
      try {
        const res = await fetch("/api/notifications/pending")
        if (!res.ok) return
        const data = (await res.json()) as { notifications: PersistentNotification[] }
        if (data.notifications.length > 0) {
          setPending(data.notifications)
        }
      } catch {
        // Network error — fail silently; SSE will still deliver new ones
      }
    }

    void fetchPending()
  }, [])

  // Fire one alert cycle (sound + browser notification) for the current pending list
  const fireAlerts = useCallback(
    async (notifications: PersistentNotification[]) => {
      if (notifications.length === 0) return

      // If multiple are pending, use the first one's type for the tone
      const tone = getToneForPersistentType(notifications[0]?.type ?? "TICKET_CREATED")
      void playTone(tone)

      if (notifications.length === 1) {
        const n = notifications[0]!
        await showNotification(n.title, n.body, {
          tag: n.id,
          onClick: () => {
            if (n.ticket?.publicId) {
              window.location.href = `/ticket/${n.ticket.publicId}`
            }
          },
        })
      } else {
        // Aggregate multiple pending notifications into one browser notification
        await showNotification(
          `${notifications.length} notificações pendentes`,
          notifications.map((n) => n.title).join(" • "),
          { tag: "persistent-batch" }
        )
      }
    },
    [playTone, showNotification]
  )

  // Manage the repeat interval: start when there are pending items, stop when empty
  useEffect(() => {
    if (pending.length > 0) {
      // Fire immediately when a new notification is added (before the first tick)
      void fireAlerts(pending)

      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          const current = pendingRef.current
          if (current.length > 0) {
            void fireAlerts(current)
          }
        }, REPEAT_INTERVAL_MS)
      }
    } else {
      // Queue emptied — stop the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      // Cleanup on unmount only (not on every render — interval is managed above)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending.length, fireAlerts])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Subscribe to SSE events for real-time adds and cross-tab acknowledgment
  useEffect(() => {
    return subscribe((event) => {
      if (event.type === "notification:new") {
        const payload = event.payload as unknown as NotificationNewPayload
        if (!payload.requiresAck) return

        const notification: PersistentNotification = {
          id: payload.id ?? `pending-${Date.now()}`,
          type: payload.type,
          title: payload.title,
          body: payload.body,
          ticketId: payload.ticketId ?? null,
          ticket: payload.ticket ?? null,
          requiresAck: true,
          isRead: payload.isRead ?? false,
          acknowledgedAt: payload.acknowledgedAt ?? null,
          createdAt: payload.createdAt ?? new Date().toISOString(),
        }

        setPending((prev) => {
          // Avoid duplicates (e.g., if pending fetch and SSE race)
          if (prev.some((n) => n.id === notification.id)) return prev
          return [notification, ...prev]
        })
      }

      if (event.type === "notification:acknowledged") {
        const payload = event.payload as { notificationId: string }
        setPending((prev) => prev.filter((n) => n.id !== payload.notificationId))
      }
    })
  }, [subscribe])

  // Acknowledge a single notification: call API then remove from local state
  const acknowledge = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/acknowledge`, { method: "PATCH" })
    } catch {
      // Optimistically remove even if the request fails temporarily
    }
    // SSE `notification:acknowledged` will remove it from other tabs;
    // remove it locally immediately for instant UI feedback
    setPending((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const acknowledgeAll = useCallback(async () => {
    const ids = pendingRef.current.map((n) => n.id)
    await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/notifications/${id}/acknowledge`, { method: "PATCH" })
      )
    )
    // Clear locally immediately; SSE will sync other tabs
    setPending([])
  }, [])

  return {
    pending,
    pendingCount: pending.length,
    acknowledge,
    acknowledgeAll,
  }
}
