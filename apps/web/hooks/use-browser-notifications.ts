"use client"
import { useCallback, useRef } from "react"

interface ShowNotificationOptions {
  tag?: string
  icon?: string
  onClick?: () => void
}

export function useBrowserNotifications() {
  // Track active notification objects so we can retrigger them on interval ticks.
  // Using a map from tag -> Notification lets repeated calls replace OS stacking.
  const activeNotificationsRef = useRef<Map<string, Notification>>(new Map())

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) return false
    if (Notification.permission === "granted") return true
    if (Notification.permission === "denied") return false

    const result = await Notification.requestPermission()
    return result === "granted"
  }, [])

  const showNotification = useCallback(
    async (
      title: string,
      body: string,
      options: ShowNotificationOptions = {}
    ): Promise<void> => {
      if (typeof window === "undefined" || !("Notification" in window)) return
      if (Notification.permission !== "granted") return

      const tag = options.tag ?? title
      const icon = options.icon ?? "/favicon.ico"

      // Close any existing notification with the same tag before showing a new one.
      // This prevents OS-level stacking while still triggering the alert again.
      const existing = activeNotificationsRef.current.get(tag)
      if (existing) {
        existing.close()
        activeNotificationsRef.current.delete(tag)
      }

      const notification = new Notification(title, { body, icon, tag })

      if (options.onClick) {
        notification.onclick = () => {
          // Bring the app tab into focus when the user clicks the OS notification
          window.focus()
          options.onClick!()
          notification.close()
        }
      } else {
        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      }

      activeNotificationsRef.current.set(tag, notification)

      // Auto-cleanup the ref entry once the notification closes naturally
      notification.onclose = () => {
        activeNotificationsRef.current.delete(tag)
      }
    },
    []
  )

  const closeNotification = useCallback((tag: string) => {
    const notification = activeNotificationsRef.current.get(tag)
    if (notification) {
      notification.close()
      activeNotificationsRef.current.delete(tag)
    }
  }, [])

  return { requestPermission, showNotification, closeNotification }
}
