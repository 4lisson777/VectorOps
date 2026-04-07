import { NotificationType } from "@prisma/client"
import { db } from "@/lib/db"
import { emitShinobiEvent } from "@/lib/sse-emitter"

/**
 * Segments notification recipients into two groups:
 * - `normalUserIds`: receive a regular (non-persistent) notification
 * - `persistentUserIds`: receive a persistent notification (`requiresAck: true`)
 *
 * Targeting rules:
 * - TICKET_CREATED / BUG_CREATED:
 *     * QA + TECH_LEAD with the relevant notify flag → persistent
 *     * DEVELOPER with the relevant notify flag → normal
 * - TICKET_ASSIGNED: assigned developer → persistent
 * - TICKET_DONE / TICKET_CANCELLED / TICKET_STATUS_CHANGED: ticket opener → normal
 * - HELP_REQUEST_NEW: all active DEVs/TECH_LEADs except requester → normal
 * - HELP_REQUEST_RESPONDED / CHECKPOINT_PROMPT: targeted user → normal
 */
export async function getNotificationTargets(
  type: NotificationType,
  ticketOpenedById?: string,
  assignedToId?: string
): Promise<{ normalUserIds: string[]; persistentUserIds: string[] }> {
  switch (type) {
    case "TICKET_CREATED": {
      const users = await db.user.findMany({
        where: {
          role: { in: ["DEVELOPER", "TECH_LEAD", "QA"] },
          notifyTickets: true,
          isActive: true,
        },
        select: { id: true, role: true },
      })
      const normalUserIds: string[] = []
      const persistentUserIds: string[] = []
      for (const u of users) {
        if (u.role === "QA" || u.role === "TECH_LEAD") {
          persistentUserIds.push(u.id)
        } else {
          normalUserIds.push(u.id)
        }
      }
      return { normalUserIds, persistentUserIds }
    }

    case "BUG_CREATED": {
      const users = await db.user.findMany({
        where: {
          role: { in: ["DEVELOPER", "TECH_LEAD", "QA"] },
          notifyBugs: true,
          isActive: true,
        },
        select: { id: true, role: true },
      })
      const normalUserIds: string[] = []
      const persistentUserIds: string[] = []
      for (const u of users) {
        if (u.role === "QA" || u.role === "TECH_LEAD") {
          persistentUserIds.push(u.id)
        } else {
          normalUserIds.push(u.id)
        }
      }
      return { normalUserIds, persistentUserIds }
    }

    case "TICKET_DONE":
    case "TICKET_CANCELLED":
    case "TICKET_STATUS_CHANGED":
      return {
        normalUserIds: ticketOpenedById ? [ticketOpenedById] : [],
        persistentUserIds: [],
      }

    case "TICKET_ASSIGNED":
      // Assigned developer always gets a persistent notification
      return {
        normalUserIds: [],
        persistentUserIds: assignedToId ? [assignedToId] : [],
      }

    case "HELP_REQUEST_RESPONDED":
    case "CHECKPOINT_PROMPT":
      return {
        normalUserIds: assignedToId ? [assignedToId] : [],
        persistentUserIds: [],
      }

    case "HELP_REQUEST_NEW": {
      // All active devs/tech leads except the requester (ticketOpenedById reused as requesterId)
      const users = await db.user.findMany({
        where: {
          role: { in: ["DEVELOPER", "TECH_LEAD"] },
          isActive: true,
          id: { not: ticketOpenedById },
        },
        select: { id: true },
      })
      return {
        normalUserIds: users.map((u) => u.id),
        persistentUserIds: [],
      }
    }

    default:
      return { normalUserIds: [], persistentUserIds: [] }
  }
}

interface CreateNotificationsParams {
  type: NotificationType
  title: string
  body: string
  ticketId?: string
  targetUserIds: string[]
  requiresAck?: boolean
}

/**
 * Bulk-creates Notification rows for all target users and emits an SSE
 * "notification:new" event per recipient so connected clients update in real time.
 * When `requiresAck` is true, the notification is marked as persistent and the
 * SSE payload includes `requiresAck: true` so the frontend can start the repeat interval.
 */
export async function createAndEmitNotifications({
  type,
  title,
  body,
  ticketId,
  targetUserIds,
  requiresAck = false,
}: CreateNotificationsParams): Promise<void> {
  if (targetUserIds.length === 0) return

  await db.notification.createMany({
    data: targetUserIds.map((userId) => ({
      userId,
      type,
      title,
      body,
      ticketId: ticketId ?? null,
      requiresAck,
    })),
  })

  for (const userId of targetUserIds) {
    emitShinobiEvent({
      type: "notification:new",
      payload: { userId, type, title, body, ticketId: ticketId ?? null, requiresAck },
    })
  }
}

/**
 * Convenience wrapper: creates and emits notifications for both normal and persistent
 * recipients of a single notification event in one call.
 * Used by routes that call `getNotificationTargets` (which now returns both groups).
 */
export async function createAndEmitNotificationsForTargets({
  type,
  title,
  body,
  ticketId,
  normalUserIds,
  persistentUserIds,
}: {
  type: NotificationType
  title: string
  body: string
  ticketId?: string
  normalUserIds: string[]
  persistentUserIds: string[]
}): Promise<void> {
  await Promise.all([
    createAndEmitNotifications({
      type,
      title,
      body,
      ticketId,
      targetUserIds: normalUserIds,
      requiresAck: false,
    }),
    createAndEmitNotifications({
      type,
      title,
      body,
      ticketId,
      targetUserIds: persistentUserIds,
      requiresAck: true,
    }),
  ])
}
