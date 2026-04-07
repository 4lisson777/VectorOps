"use client"

import { usePersistentNotifications } from "@/hooks/use-persistent-notifications"
import { PersistentNotificationBanner } from "@/components/notifications/persistent-notification-banner"

/*
 * PersistentNotificationManager
 *
 * Mounted at the layout level (inside SSEProvider via AppShell).
 * Orchestrates the full persistent notification lifecycle:
 *   1. Fetches unacknowledged notifications on mount (page refresh recovery)
 *   2. Subscribes to SSE `notification:new` and `notification:acknowledged` events
 *   3. Manages the 30-second repeat interval for sound + browser notifications
 *   4. Renders the banner overlay when there are pending items
 *
 * This component renders nothing visible when the queue is empty.
 */
export function PersistentNotificationManager() {
  const { pending, acknowledge, acknowledgeAll } = usePersistentNotifications()

  if (pending.length === 0) return null

  return (
    <PersistentNotificationBanner
      notifications={pending}
      onAcknowledge={acknowledge}
      onAcknowledgeAll={acknowledgeAll}
    />
  )
}
