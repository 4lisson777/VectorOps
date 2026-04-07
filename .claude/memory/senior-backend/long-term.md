# Long-Term Memory — Senior Backend Engineer

## Project: ShinobiOps

### Tech Stack
- Next.js 16 (App Router), TypeScript strict mode
- Prisma ORM + SQLite 3 (WAL mode)
- iron-session v8 for encrypted HTTP-only cookie sessions
- bcryptjs (cost 12) for password hashing
- Zod for all input validation at API route boundaries

### Key Patterns

#### Singleton Prisma Client
`apps/web/lib/db.ts` exports `db` as a global singleton.
SQLite pragmas are applied via `$on("connect")` event.
Dev-mode: assigned to `globalThis.__prisma` to survive HMR.

#### Session Shape
```ts
interface SessionData { userId: string; role: string; name: string }
```
Cookie name: `shinobiops_session`
Session max-age: 7 days

#### Iron-session in Middleware
Middleware cannot use `next/headers` (cookies()). Instead, use `unsealData()` from `iron-session`
to manually decrypt the cookie value from `request.cookies.get(COOKIE_NAME)?.value`.

#### Auth Guards
`lib/auth.ts` exposes `requireAuth()` and `requireRole(...roles)`.
Both return `{ session, error }` objects — callers do `if (error) return error`.

#### API Response Patterns
- Validation errors → 400 with `{ error, details: fieldErrors }`
- Conflict (duplicate email) → 409
- Auth failure → 401
- Forbidden role → 403
- Success create → 201
- Success read/update → 200
- Never expose passwordHash in responses

#### Middleware Route Guards
Public paths: `/login`, `/register`, `/dev/tv`, `/api/auth/*`, `/api/health`
Role guards (checked in order):
- `/admin` → TECH_LEAD only
- `/support` → SUPPORT_MEMBER, SUPPORT_LEAD, TECH_LEAD
- `/dev` → DEVELOPER, TECH_LEAD

### Dependency Versions (added in Phase 1)
- `@prisma/client`: ^6.0.0
- `prisma` (dev): ^6.0.0
- `iron-session`: ^8.0.4
- `bcryptjs`: ^2.4.3
- `@types/bcryptjs` (dev): ^2.4.6
- `zod`: ^3.25.0
- `tsx` (dev): ^4.19.0 — used for seed script

### Seed Credentials (dev only)
| Role | Email | Password |
|------|-------|----------|
| TECH_LEAD | techlead@shinobiops.dev | Password123! |
| DEVELOPER | developer@shinobiops.dev | Password123! |
| SUPPORT_LEAD | supportlead@shinobiops.dev | Password123! |
| SUPPORT_MEMBER | support@shinobiops.dev | Password123! |

### Migration Notes
- Migration SQL is hand-written (Prisma CLI not available at write time)
- To run properly: `npx prisma migrate dev --name init` from `apps/web/`
- Or apply manually with `npx prisma migrate deploy`

### Phase 2 Patterns

#### Ticket Creation Transaction
POST /api/tickets uses a db.$transaction that: (1) generatePublicId, (2) calculatePriorityOrder, (3) ticket.create, (4) bugReport.create if BUG, (5) ticketEvent.create(CREATED).

#### Type Detection in POST /api/tickets
BUG vs TICKET is determined by presence of `affectedModule` field in request body before schema selection.

#### publicId Lookup Pattern
GET /api/tickets/[id] detects publicId by prefix: `id.startsWith("TKT-") || id.startsWith("BUG-")` and switches `where` clause accordingly.

#### Status Transition Validation
Allowed transitions stored as `Record<TicketStatus, TicketStatus[]>`. Transitions not in the allowed list return 422 with `{ error, allowed }`.

#### DEVELOPER Role Restriction on Assign
DEVELOPER can only set `assignedToId === session.userId`. TECH_LEAD can assign to any valid user.

#### Auto-Status Change on Assign
When a ticket is OPEN and gets assigned, status auto-transitions to IN_PROGRESS. A STATUS_CHANGED event is also emitted.

#### RouteContext Type (Next.js App Router)
```typescript
type RouteContext = { params: Promise<{ id: string }> }
// Always: const { id } = await context.params
```
params is a Promise in Next.js 15+.

#### TicketEvent metadata
Always stored as `JSON.stringify({...})` string. Frontend must `JSON.parse(event.metadata)` to read.

#### resolvedAt
Set when status becomes DONE or CANCELLED. Set on both PATCH and DELETE (soft-delete) paths.

### Phase 3 Patterns

#### SSE Emitter Singleton
`lib/sse-emitter.ts` exports `sseEmitter` as a `globalThis.__sseEmitter` guard (same pattern as `lib/db.ts`).
`setMaxListeners(200)` — supports up to 200 concurrent SSE connections.
`emitShinobiEvent({ type, payload })` — call from any route to push events.

#### SSE Route
`app/api/sse/route.ts` — returns a `ReadableStream` with `Content-Type: text/event-stream`.
Filtering: `notification:new` → only to matching `userId`; `developer:status_changed` → only DEVELOPER/TECH_LEAD.
Heartbeat: `": heartbeat\n\n"` every 25s via `setInterval`. Cleanup via `ReadableStream.cancel()`.

#### Notification Fire-and-Forget Pattern
```typescript
void getNotificationTargets(type, openedById?, assignedToId?)
  .then((targetUserIds) => createAndEmitNotifications({ type, title, body, ticketId, targetUserIds }))
  .catch(console.error)
```
Never `await` notification creation from ticket routes — don't block the response.

#### Prisma Client Sync (Monorepo Gotcha)
The schema `output = "../node_modules/.prisma/client"` puts the generated client in `apps/web/node_modules/.prisma/client`.
TypeScript resolves `@prisma/client` from the root `node_modules/@prisma/client` → which re-exports from root `node_modules/.prisma/client`.
After every `prisma generate`, copy: `cp -r apps/web/node_modules/.prisma/client/* node_modules/.prisma/client/`
Without this, TypeScript won't find new enum types added after migration.

#### NinjaBoard Data Gap (Frontend Note)
`GET /api/users` currently returns basic user fields (no `devStatus`, `currentTask`, no assigned ticket). Frontend will need either:
1. Backend to add these fields to the users list response, or
2. Frontend to fetch them separately per user

### Phase 5 Patterns

#### Prisma groupBy _count typing gotcha
When using `db.ticket.groupBy({ _count: { _all: true } })`, the TS type of `_count` is `true | { ... } | undefined`.
To safely access `_count._all`, either:
- Normalize the array: `rows.map(r => ({ ..., _count: { _all: r._count._all ?? 0 } }))`
- Use a type assertion: `(r._count as { _all: number })._all`
Never pass groupBy results directly to typed function parameters expecting `{ _count: { _all: number } }[]`.

#### Prisma `_count` in select vs include
`db.user.findMany({ select: { ..., _count: { select: { assignedTickets: { where: ... } } } } })` does NOT work.
Prisma does not support WHERE conditions inside `_count` when using `select`.
Workaround: fetch users with `findMany`, then separately `groupBy` tickets with `assignedToId: { in: [...userIds] }`, and join in memory with a Map.

#### In-memory rate limiter singleton
`lib/rate-limit.ts` uses `globalThis.__rateLimitStore` pattern (same as Prisma DB singleton) to survive HMR in dev.
Applied to: `POST /api/auth/login` and `POST /api/auth/register` — 5 req/60s per IP.
Key format: `"login:{ip}"` / `"register:{ip}"` to avoid cross-endpoint bucket sharing.

#### Avatar upload
`POST /api/admin/users/[id]/avatar` uses `sharp` to resize to max 256x256 and convert to WebP.
Files stored at `public/avatars/{userId}.webp` (accessible via Next.js static file serving).
`avatarUrl` in DB is set to `/avatars/{userId}.webp`.
`sharp` is a runtime dependency (not dev-only) — was added with `npm install sharp --workspace=web`.

#### Docker + Next.js standalone
`next.config.mjs` must have `output: "standalone"` for the Dockerfile COPY of `.next/standalone` to work.
Entrypoint: runs `prisma migrate deploy` before starting the server (safe to run on every container start — idempotent).

#### Environment validation at startup
`lib/env.ts` throws immediately if `SESSION_SECRET` or `DATABASE_URL` are missing.
Imported as a side-effect in `app/layout.tsx` via `import "@/lib/env"`.

### Persistent Notifications Pattern (feature: 20260407_persistent-notifications)

#### `getNotificationTargets` returns `{ normalUserIds, persistentUserIds }` (not a flat array)
All callers must destructure and call `createAndEmitNotificationsForTargets` (not `createAndEmitNotifications`).
Routes that pass `targetUserIds` directly (reorder-requests, help-requests) still use `createAndEmitNotifications` — that's correct.

#### How to acknowledge a notification
`PATCH /api/notifications/[id]/acknowledge` — no body needed.
Sets `acknowledgedAt = new Date()`, emits `notification:acknowledged` SSE event.
Returns 409 if already acked or if `requiresAck` is false.

#### Prisma generate must be run when migration adds new columns to existing models
The old generated client won't have the new fields. Run `npx prisma generate` (from `apps/web/`) after applying migrations.

### Gotchas
- The monorepo uses `"type": "module"` in `apps/web/package.json` — imports use ESM
- SQLite enums are stored as TEXT in the DB (SQLite has no native enum type)
- `$on("connect")` on PrismaClient emits events but may not be reliable across all Prisma versions — verify once installed
- iron-session v8: `SessionOptions` (not `IronSessionOptions`) is the correct type name
- Next.js 15+ App Router: `context.params` is a Promise — must `await context.params`
- `Array.split()[index]` returns `string | undefined` in strict TS — always guard with `parts[i] !== undefined`
- Prisma `readonly` arrays: `const x = ["OPEN", "IN_PROGRESS"] as const` creates a `readonly` tuple. Prisma's `{ in: TicketStatus[] }` requires a mutable array. Use `TicketStatus[]` typed variables with `= [TicketStatus.OPEN, ...]` to avoid the TS4104 error.
