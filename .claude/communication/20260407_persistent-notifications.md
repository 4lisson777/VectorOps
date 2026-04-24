# Communication: Persistent Sound & Browser Notifications

## Status
- Backend: [x] Done
- Frontend: [x] Done
- QA: [x] Skipped

## Shared Context

### Current Infrastructure
- SSE emitter: `apps/web/lib/sse-emitter.ts` — global EventEmitter singleton, typed event names
- SSE route: `apps/web/app/api/sse/route.ts` — streams events, filters by userId and role
- SSE client: `apps/web/hooks/use-sse.ts` — EventSource with exponential backoff retry
- SSE context: `apps/web/lib/sse-context.tsx` — React context providing pub/sub for SSE events
- Notifications lib: `apps/web/lib/notifications.ts` — `getNotificationTargets()` + `createAndEmitNotifications()`
- Sound alerts: `apps/web/hooks/use-sound-alerts.ts` — Web Audio API oscillator tones A-E
- Notification center: `apps/web/components/layout/notification-center.tsx` — bell icon + popover list

### Key Constraints
- App language: PT-BR (all user-facing strings)
- Auth: `requireAuth()` and `requireRole()` from `@/lib/auth`
- DB: Prisma + SQLite, accessed via `db` from `@/lib/db`
- Roles: TECH_LEAD, DEVELOPER, SUPPORT_LEAD, SUPPORT_MEMBER, QA

### Existing Notification Types (NotificationType enum)
TICKET_CREATED, BUG_CREATED, TICKET_ASSIGNED, TICKET_STATUS_CHANGED, TICKET_DONE, TICKET_CANCELLED, HELP_REQUEST_NEW, HELP_REQUEST_RESPONDED, CHECKPOINT_PROMPT

### Existing SSE Event Types (ShinobiEventType)
ticket:created, ticket:assigned, ticket:status_changed, ticket:done, ticket:cancelled, developer:status_changed, notification:new, help_request:new, help_request:responded, checkpoint:prompt

## Backend -> Frontend

### Migration

Migration name: `20260407000000_add_notification_ack`

Two columns added to `notifications` table:
- `requiresAck` — `Boolean NOT NULL DEFAULT false`
- `acknowledgedAt` — `DateTime` (nullable)

Composite index added: `(userId, requiresAck, acknowledgedAt)`

The migration has been applied and the Prisma client has been regenerated. The `Notification` type from `@prisma/client` now includes both fields.

---

### SSE Event: `notification:new` (updated payload)

All existing fields remain. `requiresAck` is now included:

```ts
{
  type: "notification:new",
  payload: {
    userId: string,         // recipient — used for SSE filtering
    type: NotificationType, // e.g. "TICKET_CREATED"
    title: string,
    body: string,
    ticketId: string | null,
    requiresAck: boolean    // NEW — true means start repeat interval
  }
}
```

When `requiresAck` is `true`, the frontend should start the persistent sound + browser notification loop until the user acknowledges.

---

### SSE Event: `notification:acknowledged` (new)

Emitted by `PATCH /api/notifications/[id]/acknowledge`. Filtered to the owning user only (same as `notification:new`).

```ts
{
  type: "notification:acknowledged",
  payload: {
    notificationId: string, // the acknowledged notification id
    userId: string          // the owning user — used for SSE filtering
  }
}
```

When received, the frontend should stop the repeat interval for the matching `notificationId`.

---

### API: `PATCH /api/notifications/[id]/acknowledge`

Auth: required (any role). Ownership enforced — only the notification's owner can acknowledge it.

No request body needed.

**Success `200`:**
```json
{
  "notification": {
    "id": "...",
    "userId": "...",
    "type": "TICKET_ASSIGNED",
    "title": "...",
    "body": "...",
    "ticketId": "...",
    "isRead": false,
    "requiresAck": true,
    "acknowledgedAt": "2026-04-07T10:00:00.000Z",
    "createdAt": "...",
    "ticket": { "publicId": "TKT-0001" }
  }
}
```

**Error `404`:** `{ "error": "Notificação não encontrada" }` — not found or belongs to another user.

**Error `409` (not persistent):** `{ "error": "Esta notificação não requer confirmação" }` — called on a non-persistent notification.

**Error `409` (already acked):** `{ "error": "Notificação já foi confirmada" }` — already has `acknowledgedAt` set.

---

### API: `GET /api/notifications/pending`

Auth: required (any role).

No query parameters.

**Success `200`:**
```json
{
  "notifications": [
    {
      "id": "...",
      "userId": "...",
      "type": "TICKET_ASSIGNED",
      "title": "...",
      "body": "...",
      "ticketId": "...",
      "isRead": false,
      "requiresAck": true,
      "acknowledgedAt": null,
      "createdAt": "...",
      "ticket": { "publicId": "TKT-0001" }
    }
  ]
}
```

Returns all notifications where `requiresAck = true` AND `acknowledgedAt = null` for the current user, ordered by `createdAt DESC`. Use this on app mount / page refresh to resume the repeat interval for any notifications still awaiting acknowledgment.

---

### Updated `getNotificationTargets` signature

```ts
async function getNotificationTargets(
  type: NotificationType,
  ticketOpenedById?: string,
  assignedToId?: string
): Promise<{ normalUserIds: string[]; persistentUserIds: string[] }>
```

Targeting rules:
- `TICKET_CREATED` / `BUG_CREATED`: DEVELOPER → `normalUserIds`; QA + TECH_LEAD → `persistentUserIds`
- `TICKET_ASSIGNED`: assigned developer → `persistentUserIds`
- All other types (status change, help, checkpoint): ticket opener / targeted user → `normalUserIds`

All callers (`tickets/route.ts`, `tickets/[id]/route.ts`, `tickets/[id]/assign/route.ts`) have been updated to destructure `{ normalUserIds, persistentUserIds }` and call `createAndEmitNotificationsForTargets`.

---

### `createAndEmitNotificationsForTargets` (new wrapper)

```ts
async function createAndEmitNotificationsForTargets({
  type, title, body, ticketId,
  normalUserIds,    // receive requiresAck: false
  persistentUserIds // receive requiresAck: true + SSE with requiresAck: true
}): Promise<void>
```

Runs both groups in parallel. Existing `createAndEmitNotifications` is unchanged and still used by help-request and reorder-request routes that target users directly.

## Frontend -> Backend

### Implemented

- `notification:new` SSE payload must include `id` field (notification DB id) for the pending queue to correctly identify items — confirmed present in backend implementation
- `notification:acknowledged` SSE payload uses key `notificationId` (not `id`) — frontend reads `payload.notificationId`
- `/api/notifications/pending` response shape matches; `ticket` field (with `publicId`) is used for direct navigation links in the banner
- Sound mute preference (`vectorops:soundEnabled`) is already respected by `useSoundAlerts` — persistent repeat skips sound but browser notification still fires when muted
- No additional fields needed
