# Backend Task: Persistent Sound & Browser Notifications for Ticket Assignment

## Description

Enhance the notification system so that critical notifications (new ticket/bug creation for QA + TECH_LEAD, and ticket assignment for the assigned developer) include a "requires acknowledgment" flag. These notifications should persist (repeat sound + browser notification at intervals) until the recipient explicitly acknowledges them. The backend must support: marking who receives persistent notifications, a new SSE event type for urgent/persistent notifications, and an acknowledgment API endpoint.

## Acceptance Criteria

- [ ] When a ticket or bug is created, QA and TECH_LEAD users receive a persistent notification (not just DEV/TECH_LEAD as currently)
- [ ] When a ticket is assigned to a developer, that developer receives a persistent notification
- [ ] Persistent notifications have a `requiresAck` flag set to `true` in the database
- [ ] A new API endpoint allows a user to acknowledge a notification, setting `acknowledgedAt` timestamp
- [ ] The SSE event payload for persistent notifications includes `requiresAck: true` so the frontend knows to start the repeat interval
- [ ] Acknowledging a notification emits an SSE event so other tabs/windows of the same user stop repeating
- [ ] Non-persistent notifications (status changes, done, cancelled, help requests, etc.) continue working as before with no changes

## Data Model Changes

### Notification table — add two columns:

1. `requiresAck` — Boolean, default `false`. When `true`, the frontend should repeat sound and browser notification until acknowledged.
2. `acknowledgedAt` — DateTime, nullable. Set when the user acknowledges. If `null` and `requiresAck` is `true`, the notification is still pending acknowledgment.

### No new tables needed. No changes to enums.

## API Endpoints

### 1. PATCH `/api/notifications/[id]/acknowledge`

- **Purpose:** Mark a persistent notification as acknowledged
- **Auth:** Requires authenticated user. Must verify the notification belongs to the requesting user.
- **Behavior:**
  - Set `acknowledgedAt` to current timestamp
  - Emit SSE event `notification:acknowledged` with payload `{ notificationId, userId }` so all tabs of that user can stop the repeat interval
  - Return the updated notification
- **Error cases:** 404 if notification not found or doesn't belong to user. 409 if already acknowledged.

### 2. GET `/api/notifications/pending`

- **Purpose:** Fetch all unacknowledged persistent notifications for the current user
- **Auth:** Requires authenticated user
- **Behavior:** Return all notifications where `userId = currentUser`, `requiresAck = true`, `acknowledgedAt = null`
- **Use case:** When the user opens the app or refreshes, the frontend needs to know which persistent notifications are still pending so it can resume the repeat interval immediately

## Business Logic Changes

### Notification targeting changes in `lib/notifications.ts`

#### For `TICKET_CREATED` and `BUG_CREATED`:
- **Current behavior:** Notifies active DEVs/TECH_LEADs with `notifyTickets`/`notifyBugs` enabled
- **New behavior:** Additionally notify active QA users. QA and TECH_LEAD users should receive the notification with `requiresAck: true`. Regular DEV users continue to receive normal (non-persistent) notifications.
- Implementation approach: `getNotificationTargets` should return a richer structure that indicates which users get persistent vs. normal notifications. Consider returning `{ normalUserIds: string[], persistentUserIds: string[] }` or add a second function like `getPersistentNotificationTargets`.

#### For `TICKET_ASSIGNED`:
- **Current behavior:** Notifies the assigned user
- **New behavior:** The assigned developer receives the notification with `requiresAck: true`

### `createAndEmitNotifications` changes

- Accept an optional `requiresAck` parameter (or accept it per-user)
- When creating notification rows, set `requiresAck` accordingly
- When emitting the SSE event, include `requiresAck` in the payload so the frontend can differentiate

## SSE Changes

### New event type to add to `ShinobiEventType` in `lib/sse-emitter.ts`:

- `"notification:acknowledged"` — emitted when a user acknowledges a persistent notification

### Updated payload for `notification:new`:

Add `requiresAck: boolean` to the existing payload. The frontend uses this to decide whether to start the persistent repeat interval.

### SSE route filtering (`app/api/sse/route.ts`):

- `notification:acknowledged` should be filtered the same way as `notification:new` — only forwarded to the intended `userId`

## Rules to Follow

- Keep backward compatibility: all existing notification flows must continue to work unchanged
- Use Prisma migration for schema changes
- Follow the existing fire-and-forget pattern for notification emission (do not block API responses)
- Notifications lib (`lib/notifications.ts`) is the single source of truth for targeting logic
- All API responses should use PT-BR for user-facing error messages (follow existing pattern in assign route)
- Use Zod for request validation on the new endpoints

## Communication File

`.claude/communication/20260407_persistent-notifications.md`
