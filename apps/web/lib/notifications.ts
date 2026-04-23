import { NotificationType, Role } from "@/generated/prisma/client"
import { getTenantDb } from "@/lib/tenant-db"
import { emitShinobiEvent } from "@/lib/sse-emitter"
import { getTenantIdOptional } from "@/lib/tenant-context"

/**
 * Loads role configs from DB as a Map<Role, { notifyOnCreation, notifyOnAssignment }>.
 * If a role is missing from the DB (fail-closed), defaults to both flags false.
 * Queries are scoped to the current tenant via getTenantDb().
 */
async function getRoleConfigMap(): Promise<
  Map<Role, { notifyOnCreation: boolean; notifyOnAssignment: boolean }>
> {
  const tenantDb = getTenantDb()
  const rows = await tenantDb.roleNotificationConfig.findMany({
    select: { role: true, notifyOnCreation: true, notifyOnAssignment: true },
  })
  const map = new Map<Role, { notifyOnCreation: boolean; notifyOnAssignment: boolean }>()
  for (const row of rows) {
    map.set(row.role, {
      notifyOnCreation: row.notifyOnCreation,
      notifyOnAssignment: row.notifyOnAssignment,
    })
  }
  return map
}

/**
 * Segments notification recipients into two groups:
 * - `normalUserIds`: receive a regular (non-persistent) notification
 * - `persistentUserIds`: receive a persistent notification (`requiresAck: true`)
 *
 * All user queries are scoped to the current tenant via getTenantDb().
 *
 * Targeting rules:
 * - TICKET_CREATED / BUG_CREATED:
 *     * Role must have `notifyOnCreation = true` in RoleNotificationConfig (primary gate).
 *     * User must also have the personal flag (notifyTickets / notifyBugs) set to true.
 *     * QA + TECH_LEAD → persistent; DEVELOPER → normal.
 * - TICKET_ASSIGNED:
 *     * Assignee's role must have `notifyOnAssignment = true` in RoleNotificationConfig.
 *     * If yes → assignee gets a persistent notification.
 * - TICKET_DONE / TICKET_CANCELLED / TICKET_STATUS_CHANGED: ticket opener → normal
 * - HELP_REQUEST_NEW: all active DEVs/TECH_LEADs except requester → normal
 * - HELP_REQUEST_RESPONDED / CHECKPOINT_PROMPT: targeted user → normal
 */
export async function getNotificationTargets(
  type: NotificationType,
  ticketOpenedById?: string,
  assignedToId?: string
): Promise<{ normalUserIds: string[]; persistentUserIds: string[] }> {
  const tenantDb = getTenantDb()

  switch (type) {
    case "TICKET_CREATED": {
      // Load role config map to determine which roles have creation notifications enabled
      const roleConfigMap = await getRoleConfigMap()

      // Collect roles with notifyOnCreation = true
      const eligibleRoles = (["DEVELOPER", "TECH_LEAD", "QA"] as Role[]).filter(
        (role) => roleConfigMap.get(role)?.notifyOnCreation === true
      )

      if (eligibleRoles.length === 0) {
        return { normalUserIds: [], persistentUserIds: [] }
      }

      const users = await tenantDb.user.findMany({
        where: {
          role: { in: eligibleRoles },
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
      const roleConfigMap = await getRoleConfigMap()

      const eligibleRoles = (["DEVELOPER", "TECH_LEAD", "QA"] as Role[]).filter(
        (role) => roleConfigMap.get(role)?.notifyOnCreation === true
      )

      if (eligibleRoles.length === 0) {
        return { normalUserIds: [], persistentUserIds: [] }
      }

      const users = await tenantDb.user.findMany({
        where: {
          role: { in: eligibleRoles },
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

    case "TICKET_ASSIGNED": {
      if (!assignedToId) {
        return { normalUserIds: [], persistentUserIds: [] }
      }

      // Check whether the assignee's role has notifyOnAssignment enabled
      const assignee = await tenantDb.user.findUnique({
        where: { id: assignedToId },
        select: { role: true },
      })

      if (!assignee) {
        return { normalUserIds: [], persistentUserIds: [] }
      }

      const roleConfigMap = await getRoleConfigMap()
      const config = roleConfigMap.get(assignee.role)
      const notifyOnAssignment = config?.notifyOnAssignment ?? false

      return {
        normalUserIds: [],
        persistentUserIds: notifyOnAssignment ? [assignedToId] : [],
      }
    }

    case "HELP_REQUEST_RESPONDED":
    case "CHECKPOINT_PROMPT":
      return {
        normalUserIds: assignedToId ? [assignedToId] : [],
        persistentUserIds: [],
      }

    case "HELP_REQUEST_NEW": {
      // All active devs/tech leads except the requester (ticketOpenedById reused as requesterId)
      const users = await tenantDb.user.findMany({
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
 *
 * Notification rows are created via getTenantDb() so organizationId is auto-injected.
 * The SSE payload includes organizationId for cross-tenant event filtering.
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

  // organizationId is included in SSE payloads for tenant filtering in the SSE route
  const organizationId = getTenantIdOptional()

  const tenantDb = getTenantDb()
  for (const userId of targetUserIds) {
    const notification = await tenantDb.notification.create({
      // organizationId is injected by the tenant-db Prisma extension
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { userId, type, title, body, ticketId: ticketId ?? null, requiresAck } as any,
    })
    emitShinobiEvent({
      type: "notification:new",
      payload: {
        id: notification.id,
        userId,
        type,
        title,
        body,
        ticketId: ticketId ?? null,
        requiresAck,
        organizationId,
      },
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
