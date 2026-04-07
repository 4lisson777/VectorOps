# Frontend Task: Persistent Sound & Browser Notifications for Ticket Assignment

## Description

Build a persistent notification system on the frontend that repeats sound alerts and Chrome browser notifications at a configurable interval (every 30 seconds) until the user explicitly acknowledges them. This applies to two scenarios: (1) QA/TECH_LEAD users when a new ticket or bug is created, and (2) a developer when a ticket is assigned to them. The existing notification center (bell icon, notification list) continues to work as-is; this task adds the persistence layer on top.

## Acceptance Criteria

- [ ] When a persistent notification arrives via SSE (payload includes `requiresAck: true`), the app plays the appropriate sound tone AND shows a Chrome browser notification
- [ ] The sound and browser notification repeat every 30 seconds until the user acknowledges
- [ ] A visible, prominent "acknowledge" UI appears (modal or banner) showing the notification details with an "Entendido" (Understood) button
- [ ] Clicking "Entendido" calls `PATCH /api/notifications/[id]/acknowledge` and stops the repeat interval
- [ ] If the user has multiple tabs open, acknowledging in one tab stops the repeat in all tabs (via `notification:acknowledged` SSE event)
- [ ] On page load/refresh, the app fetches `GET /api/notifications/pending` and resumes the repeat interval for any unacknowledged persistent notifications
- [ ] The Chrome Notifications API permission is requested once on first persistent notification (or on app load for QA/TECH_LEAD/DEV roles)
- [ ] If the user has sound muted (`shinobiops:soundEnabled === "false"`), only the browser notification repeats (not the sound)
- [ ] The acknowledge modal/banner shows: notification title, body, and a link to the ticket if applicable
- [ ] Multiple pending persistent notifications should stack (show a count and allow acknowledging individually or all at once)

## Pages / Components

### New Components

#### 1. `apps/web/components/notifications/persistent-notification-manager.tsx`
- Client component (`"use client"`)
- Renders at the layout level (inside the protected layout, alongside SSEProvider)
- Subscribes to SSE events via `useSSEContext`
- On receiving `notification:new` with `requiresAck: true`, adds it to the pending queue
- On receiving `notification:acknowledged`, removes it from the pending queue (handles cross-tab sync)
- On mount, fetches `/api/notifications/pending` to restore any unacknowledged notifications
- Manages the 30-second repeat interval via `setInterval`
- Renders the acknowledge overlay/banner when there are pending items

#### 2. `apps/web/components/notifications/persistent-notification-banner.tsx`
- The visual UI for pending persistent notifications
- Positioned as a fixed overlay (top-center or bottom-right, similar to toast but more prominent)
- Shows notification count if multiple, with "Reconhecer Todas" (Acknowledge All) button
- Each notification item shows title, body, ticket link, and individual "Entendido" button
- Uses the project's crimson accent color (`#E94560`) for urgency styling
- Animated entrance (slide in from top or fade in)

### New Hooks

#### 3. `apps/web/hooks/use-persistent-notifications.ts`
- Central state management for persistent notifications
- State: array of pending persistent notifications
- Actions: add, remove (by id), remove all, acknowledge (calls API + removes)
- Integrates with SSE context for real-time additions and cross-tab acknowledgment
- On mount: fetches pending notifications from API
- Exposes `pendingCount` for use by other components if needed

#### 4. `apps/web/hooks/use-browser-notifications.ts`
- Wraps the Chrome Notifications API
- `requestPermission()` — prompts user for notification permission
- `showNotification(title, body, options)` — shows a Chrome notification if permission is granted
- Handles the case where permission is denied gracefully (no error, just skip)
- The Chrome notification's `onclick` should focus the app tab and navigate to the relevant ticket

### Modified Components

#### 5. `apps/web/app/(protected)/layout.tsx`
- Add `PersistentNotificationManager` inside the SSEProvider so it has access to SSE events
- This ensures the persistent notification system runs on every protected page

#### 6. `apps/web/components/layout/notification-center.tsx`
- No major changes needed. The existing notification center already handles `notification:new` events for the bell icon and list.
- Minor enhancement: persistent notifications in the list could show a small badge/icon indicating they require acknowledgment (optional, low priority).

## Sound & Browser Notification Repeat Logic

### Interval Behavior
- When a persistent notification is added to the queue, start a single shared `setInterval` (30 seconds)
- On each interval tick: play the sound tone (Tone A for tickets, Tone B for bugs, Tone A for assignments) AND show a Chrome browser notification
- When the queue becomes empty (all acknowledged), clear the interval
- The interval is shared across all pending notifications (one tick plays sound once and shows one aggregated browser notification if multiple are pending)

### Sound Tone Mapping for Persistent Notifications
- `TICKET_CREATED` -> Tone A (existing)
- `BUG_CREATED` -> Tone B (existing)
- `TICKET_ASSIGNED` -> Tone A (reuse the ticket tone — it is a mission being assigned)

### Browser Notification Content
- Title: The notification title (e.g., "Nova Missao: Fix login bug")
- Body: The notification body (e.g., "TKT-0042 — Severidade Alta")
- Icon: Use the app's favicon or a custom ninja icon if available
- Tag: Use the notification ID as the tag so repeated notifications replace (not stack) in the OS notification area

## Mock Data

During initial development before backend integration, use this mock data:

```typescript
const mockPersistentNotification = {
  id: "mock-1",
  type: "TICKET_CREATED",
  title: "Nova Missao: Corrigir bug de login",
  body: "TKT-0042 — Severidade Alta",
  ticketId: "clxyz123",
  ticket: { publicId: "TKT-0042" },
  requiresAck: true,
  isRead: false,
  acknowledgedAt: null,
  createdAt: new Date().toISOString(),
}
```

## Design Reference

- Use existing design tokens from `@workspace/ui` (colors, spacing, typography)
- The banner should feel urgent but not block the entire screen — a fixed-position card/toast area
- Use crimson accent (`#E94560`) for the acknowledge button and notification border
- Dark mode support required (use `dark:` prefixes)
- Keep the ninja theme: consider using shuriken or alert-themed iconography
- Reference: `ai-driven-project/utilities/ui-system.md` for full design token list

## Rules to Follow

- All user-facing text must be in PT-BR (the app is fully translated)
- Use `"use client"` directive only on components that need it (hooks, state, effects)
- Import shared UI components from `@workspace/ui/components/*`
- Use `cn()` from `@workspace/ui/lib/utils` for Tailwind class merging
- Follow existing patterns in `hooks/use-notifications.ts` and `hooks/use-sound-alerts.ts`
- Do not introduce new npm dependencies for this feature — use native Web APIs (Notifications API, setInterval, Web Audio API which is already integrated)
- The `AudioContext` resume requirement (browser gesture) is already handled in `use-sound-alerts.ts` — reuse that hook
- Keep the persistent notification state client-side in React state; the source of truth for "is it acknowledged" is the backend, but the repeat interval is purely a frontend concern

## Communication File

`.claude/communication/20260407_persistent-notifications.md`
