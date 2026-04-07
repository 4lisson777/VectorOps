# Short-Term Memory -- Senior Backend Engineer

## Current Task
Feature: Persistent Sound & Browser Notifications (20260407_persistent-notifications) — Complete

## Files Created / Modified

| File | Action |
|------|--------|
| `apps/web/app/api/notifications/[id]/acknowledge/route.ts` | Created -- PATCH acknowledge endpoint |
| `apps/web/app/api/notifications/pending/route.ts` | Created -- GET pending persistent notifications |
| `apps/web/app/api/tickets/route.ts` | Updated -- switched to `createAndEmitNotificationsForTargets` |
| `apps/web/app/api/tickets/[id]/route.ts` | Updated -- switched to `createAndEmitNotificationsForTargets` |
| `apps/web/app/api/tickets/[id]/assign/route.ts` | Updated -- switched to `createAndEmitNotificationsForTargets` |

## DB Actions Applied
- `npx prisma migrate dev` applied migration `20260407000000_add_notification_ack` to SQLite DB
- `npx prisma generate` regenerated Prisma client with `requiresAck` and `acknowledgedAt` on Notification

## Already Done Before Handoff (by Tech Lead)
- `apps/web/lib/notifications.ts` — fully updated (`getNotificationTargets` returns `{ normalUserIds, persistentUserIds }`, new `createAndEmitNotificationsForTargets` wrapper)
- `apps/web/lib/sse-emitter.ts` — `notification:acknowledged` event type added
- `apps/web/app/api/sse/route.ts` — filters `notification:acknowledged` by userId
- `apps/web/prisma/schema.prisma` — `requiresAck` + `acknowledgedAt` already on Notification model
- `apps/web/prisma/migrations/20260407000000_add_notification_ack/migration.sql` — migration file existed
