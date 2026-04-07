# Tech Leader -- Short-Term Memory

## Current Task
- **Name:** Persistent Sound & Browser Notifications for Ticket Assignment
- **Plan folder:** `ai-driven-project/prompt-engineering/20260407_persistent-notifications/`
- **Scope:** Full-stack
- **Status:** COMPLETE (backend + frontend done, QA skipped)

## Key Decisions
- QA and TECH_LEAD receive persistent (repeating) notifications when tickets/bugs are created — not just regular notifications
- DEV users assigned a ticket receive persistent notifications
- Regular DEV users still get normal (non-persistent) notifications for new tickets/bugs per existing behavior
- Two new columns on Notification model: `requiresAck` (Boolean) and `acknowledgedAt` (DateTime?)
- New SSE event type: `notification:acknowledged` for cross-tab sync
- New API endpoints: `PATCH /api/notifications/[id]/acknowledge` and `GET /api/notifications/pending`
- 30-second repeat interval on frontend (shared interval for all pending notifications)
- Uses existing Web Audio API and adds Chrome Notifications API (no new dependencies)
- `getNotificationTargets` needs refactoring to return persistent vs. normal user lists

## Architecture Notes
- Notification center (`notification-center.tsx`) already handles sound via `useSoundAlerts` and subscribes to SSE
- `lib/notifications.ts` has `getNotificationTargets()` and `createAndEmitNotifications()` — both need modification
- SSE route already filters `notification:new` by userId — same filter needed for `notification:acknowledged`
- Ticket creation (`POST /api/tickets`) and assignment (`POST /api/tickets/[id]/assign`) already call `createAndEmitNotifications` — these just need to pass `requiresAck` flag
- Backend should be done first so frontend can integrate with real endpoints

## Plan Files
- Backend: `ai-driven-project/prompt-engineering/20260407_persistent-notifications/task-request-backend.md`
- Frontend: `ai-driven-project/prompt-engineering/20260407_persistent-notifications/task-request-frontend.md`
- Communication: `.claude/communication/20260407_persistent-notifications.md`
