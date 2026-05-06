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
| TECH_LEAD | techlead@vectorops.dev | Password123! |
| DEVELOPER | developer@vectorops.dev | Password123! |
| SUPPORT_LEAD | supportlead@vectorops.dev | Password123! |
| SUPPORT_MEMBER | support@vectorops.dev | Password123! |

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

### Role Notification Config Pattern (feature: 20260423_role-notification-config)

#### RoleNotificationConfig as a primary notification gate
`RoleNotificationConfig` has one row per role (5 rows). `notifyOnCreation` gates TICKET_CREATED/BUG_CREATED; `notifyOnAssignment` gates TICKET_ASSIGNED.
For creation notifications: both the role gate AND the user's personal flag (`notifyTickets`/`notifyBugs`) must be true.
For assignment notifications: only the role gate is checked (no per-user override).
Fail-closed: if a role config row is missing, treat both flags as false.

#### ensureDefaultConfigsExist utility
`GET /api/admin/role-notification-config` calls `ensureDefaultConfigsExist()` which queries existing roles and inserts missing ones with `createMany`. This auto-provisions new roles added to the enum without requiring a re-seed.

#### getRoleConfigMap helper in notifications.ts
Loads all `RoleNotificationConfig` rows in a single query and returns a `Map<Role, {...}>`.
Used inside `getNotificationTargets()`. Avoids N+1 — one DB call for all 5 config rows.

#### PATCH pattern for multi-row config updates
The PATCH endpoint accepts an array of `{ role, notifyOnCreation?, notifyOnAssignment? }` entries.
Uses `Promise.all` + `upsert` per entry — no transaction needed since each row is independent (unique on `role`).
Returns the full list after update so the frontend can refresh in one round trip.

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

### Phase MT-1 Patterns (Multitenancy Schema & Data Layer)

#### organizationId columns are NOW non-nullable (completed in MT-5)
All organizationId fields are `String` (non-nullable) in the Prisma schema as of migration `20260423093841_make_org_id_required`. The data migration ran before this, ensuring zero null values existed. Routes that create records must now always include organizationId — this is the source of ~15 TS errors to be fixed in MT-3.

#### Tenant Context Infrastructure
- `lib/tenant-context.ts`: AsyncLocalStorage wrapper. `runWithTenant(orgId, fn)` sets context; `getTenantId()` throws if not set; `getTenantIdOptional()` returns null if not set.
- `lib/tenant-db.ts`: `getTenantDb()` returns a Prisma extension that auto-injects `organizationId` in where/data for all 9 tenant-scoped models. Does NOT touch Organization, Invite, BugReport, TicketEvent, ReorderRequest.
- Middleware must call `runWithTenant` BEFORE any route handler that uses `getTenantDb()`.

#### Compound unique constraints break findUnique({ where: { singleField } })
When you change `@unique` on a field to `@@unique([organizationId, field])`, Prisma removes the single-field unique index. `findUnique({ where: { field } })` breaks with a TS type error. Fix: use `findFirst({ where: { field } })` as a stopgap until the route is refactored to include organizationId.

#### SQLite database is locked by Next.js dev server
Running `prisma migrate dev` while the dev server is running always fails with "database is locked". Steps to fix:
1. `fuser /path/to/vectorops.db` to find the PID
2. Kill the next-server process (and turbo/node procs)
3. Run the migration
4. Restart dev server

#### Invite model relations
Invite has two FKs to User: `usedById` (User who used it) and `createdById` (User who created it). Both require named relation fields in Prisma:
- `usedBy User? @relation("UsedInvites", ...)`
- `createdBy User @relation("CreatedInvites", ...)`
User model must declare `usedInvites Invite[] @relation("UsedInvites")` and `createdInvites Invite[] @relation("CreatedInvites")`.

#### Data migration script lives in prisma/migrations/ (not prisma/)
Prisma CLI ignores .ts files in the migrations directory (it only runs .sql files). The data migration script must be run manually with `npx tsx`.

### Phase MT-5 Patterns (Data Migration & Seed)

#### Two-step nullable → non-nullable migration pattern
1. Add column as nullable (String?) in the first migration — existing rows are not affected
2. Run a data migration script to backfill all nulls
3. Verify zero nulls in the DB
4. Change column to non-nullable (String) in schema; run second migration

#### RoleNotificationConfig compound unique upsert syntax
After `@@unique([organizationId, role])`, the upsert where clause is:
`where: { organizationId_role: { organizationId, role } }` — Prisma auto-generates the compound unique key name as `{field1}_{field2}`.

#### Data migration script: use $executeRawUnsafe when the field type changes
Once organizationId is non-nullable, Prisma's type system rejects `where: { organizationId: null }`. Use raw SQL `WHERE "organizationId" IS NULL` via `$executeRawUnsafe` to keep the script safe. SQLite uses `?` positional placeholders.

#### Seed script super-admin update pattern
When upsert must set `isSuperAdmin: true` on an existing user:
```ts
update: seedUser.isSuperAdmin ? { isSuperAdmin: true } : {},
```
The `update: {}` pattern (no-op on existing) is fine for most fields but not for flags that should be enforced by the seed.

#### db:migrate:mt script
`apps/web/package.json` has `"db:migrate:mt": "tsx prisma/migrations/data-migration-multitenancy.ts"` for running the data migration. From root: `npm run db:migrate:mt -w web`.

### Phase MT-2 Patterns (Auth, Session & Invite System)

#### SessionData now includes organizationId and isSuperAdmin
```ts
interface SessionData { userId, role, name, organizationId, isSuperAdmin }
```
Existing sessions created before MT-2 are stale — users will be automatically logged out on next request since the new fields are missing and iron-session won't deserialize them correctly. This is expected and acceptable.

#### requireTenantAuth pattern
`requireTenantAuth(handler)` is a higher-order guard that combines `requireAuth()` + `runWithTenant(session.organizationId, handler)`. Use it in all tenant-scoped routes so `getTenantDb()` works safely inside the handler.

#### Login multi-org disambiguation
Login now uses `findMany` (not `findFirst`) on email to detect users registered in multiple orgs under the same email. If >1 match and no `organizationSlug` provided: 409 with `{ organizations: [{ name, slug }] }`. Frontend re-submits with `organizationSlug`.

#### Register two-mode pattern
Register detects mode from presence of `organizationName` key (create-org) vs `inviteCode` key (join-org) in the request body. Exactly one must be present or 400 is returned. Mode detection is done before schema parsing so we pick the right Zod schema.

#### Org creation seeds default configs
When creating a new org in register, a `$transaction` creates: Organization, User, CheckpointConfig, TvConfig, and 5 RoleNotificationConfig records. All with `organizationId`. This matches the seed script defaults.

#### Invite code generation
`generateInviteCode()` in `lib/invite-code.ts` uses `randomBytes(8)` + modulo over `"ABCDEFGHJKMNPQRSTUVWXYZ23456789"` (excludes 0/O/1/I/L). Codes are stored and compared uppercase. The code lookup in GET/register normalizes to `.toUpperCase()`.

#### Array.find() returns T | undefined — TypeScript strict mode requires handling
When `user = arr.find(...)` is followed by `if (!user) return`, TypeScript does NOT narrow `user` to non-undefined after the if block if the assignment and guard are inside a conditional branch. Workaround: extract into a helper function that returns `T | NextResponse` — TypeScript narrows correctly in the caller after `instanceof NextResponse` check.

#### Invite revocation is soft-delete
DELETE /api/organizations/[id]/invites/[inviteId] sets `expiresAt = new Date()` (now), making the invite immediately invalid without hard-deleting it for audit purposes.

#### generateOrgSlug
`lib/invite-code.ts` exports `generateOrgSlug(name)`: lowercase, replace `\s+` with `-`, remove `[^a-z0-9-]`, trim hyphens from edges. Returns empty string if the entire name was non-alphanumeric — register route returns 400 in that case.

### Phase MT-3 Patterns (API Route Updates & SSE Scoping)

#### requireTenantRole curried helper pattern
```ts
requireTenantRole(...roles)(async (session) => { ... })
```
Defined in `lib/auth.ts`. Combines `requireRole()` + `runWithTenant(session.organizationId, handler)`. Use for all tenant-scoped routes that also need a role check. `requireTenantAuth` is for any-authenticated routes.

#### Extended client's `$transaction` tx type is NOT `Prisma.TransactionClient`
Helper functions that accept `Prisma.TransactionClient` can't be called with the extended client's tx argument. Fix: define a minimal interface matching only the methods you call (e.g., `{ ticket: { count(args?: any): Promise<number | object> } }`) — both the raw and extended transaction clients satisfy it.

#### Extended client `create` calls still require `organizationId` at TypeScript level
Even though the Prisma extension injects `organizationId` at runtime, the generated types still demand it. Pattern: add `as any` cast to the `data` field with an explanatory comment `// organizationId is injected by the tenant-db Prisma extension`. Do NOT add organizationId manually — it creates a double-injection risk.

#### Extended client `count` returns `number | {}` (not `number`)
The Prisma extended client widens `count()` return type. Coerce: `typeof result === "number" ? result : 0` when computing arithmetic on the result.

#### SSE event filtering by organizationId
Pattern: events that include `payload.organizationId` are filtered in `sse/route.ts` — if the event's org doesn't match the session's org, the event is dropped. Events without `organizationId` in payload pass through (backward compat for any unmodified emitters). Always include `organizationId: session.organizationId` in all `emitShinobiEvent()` calls.

#### TV route is public — use raw `db` with explicit organizationId scoping
`/api/tv/data` has no session. It accepts `?org=SLUG`, resolves the org via `db.organization.findUnique({ where: { slug } })`, then uses the org's `id` explicitly in all `where` clauses. Do NOT use `getTenantDb()` here since there's no tenant context available (no session).

#### help-requests POST — in-app target query
The fire-and-forget block for in-app notifications in `POST /api/help-requests` previously used raw `db.user.findMany`. Now it uses `tenantDb.user.findMany` (captured before the fire-and-forget). The tenantDb is created in the same request context where `runWithTenant` is active, so it works correctly.

#### HelpRequestResponse needs `organizationId` injected
`HelpRequestResponse` IS in `TENANT_SCOPED_MODELS` in `tenant-db.ts`. So creating with `data: { helpRequestId, responderId }` requires the `as any` cast, like all other tenant-scoped creates.

### Phase MT-4 Patterns (Middleware & Super Admin)

#### Middleware super-admin guard
Middleware reads `isSuperAdmin` from the decrypted session. The `/super-admin` prefix check runs BEFORE the ROLE_GUARDS loop with an early return, so super-admins bypass role checks for that path group. Non-super-admins are redirected to their role home. Both the middleware (early redirect) and the layout (server-component defense in depth) guard this path.

#### x-organization-id header in middleware
Middleware sets `x-organization-id` response header for all authenticated requests. This allows server components and SSE handlers that cannot use AsyncLocalStorage directly to read the org from the header.

#### Super-admin routes use raw db, not getTenantDb()
All `/api/super-admin/*` routes import `db` directly (not `getTenantDb()`) because they operate across tenants. The tenant context (AsyncLocalStorage) is NOT set for these routes. Using `getTenantDb()` here would throw "Tenant context not set".

#### Impersonation session fields
`session.originalOrganizationId` is optional — only set during impersonation. The impersonate endpoint only sets it on the FIRST call (guards with `if (!session.originalOrganizationId)`) to prevent nested impersonation from overwriting the real origin. Stop-impersonating clears it by setting `session.originalOrganizationId = undefined`.

#### Organization relations in Prisma schema are plural arrays
`checkpointConfigs` and `tvConfigs` (not singular) are the relation names on Organization — because an org can theoretically have multiple config rows (schema allows it). Always access `org.checkpointConfigs[0]` when you need the single config row. Use `take: 1` in include to avoid loading all rows.

#### Active ticket count definition
"Active" = status NOT IN ("DONE", "CANCELLED"). The TicketStatus enum has: OPEN, IN_PROGRESS, WAITING_FOR_INFO, DONE, CANCELLED. There is no "CLOSED" status.

#### Zod enum → Prisma enum type mismatch
`z.enum(ALL_ROLES as [string, ...string[]])` produces `string` output type (not Prisma `Role`). When passing this to Prisma `where.role`, TypeScript 2322 fires. Fix: chain `.transform((r) => r as Role)` and import `Role` from `@/generated/prisma/client`.

#### OrgSelfUpdateSchema for TECH_LEAD self-service
TECH_LEAD can update their org name but NOT slug or isActive directly. Use `OrgSelfUpdateSchema` (name only) in `/api/organizations/current PATCH`. Slug is auto-derived from name. isActive requires super-admin via `/api/super-admin/organizations/[id] PATCH`.

### Docker Seed Compilation Pattern

#### esbuild CJS format cannot handle import.meta.url from Prisma generated client
The generated Prisma client (`apps/web/generated/prisma/client.ts`) uses `import.meta.url` at the top level:
`globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))`
When esbuild bundles the seed script (`--packages=external --format=cjs`), this local file IS inlined (it's not an npm package), and `import.meta.url` becomes `undefined` in CJS output — causing `fileURLToPath(undefined)` → `ERR_INVALID_ARG_TYPE`.

Fix: use `--format=esm --outfile=seed.prod.mjs` instead of `--format=cjs`. Node 20 supports ESM natively, so `node seed.prod.mjs` works without any flags.

#### dotenv import is unnecessary in Docker production seed
`import "dotenv/config"` in the prod seed is pointless — docker-compose injects env vars directly. Remove it from seed.prod.ts. Note: `lib/db.ts` still has `import "dotenv/config"` but that's bundled by Next.js and handled at build time, so `dotenv` stays in `dependencies`.

### Runtime Bug Patterns (20260425)

#### TypeScript does not narrow prop types across function/closure boundaries
Even if a React component has an early `if (!prop) return ...` guard, TypeScript still sees `prop` as `T | undefined` inside a nested function defined after the guard. Fix: assign to a local const immediately after the guard (`const slug = orgSlug`) — TypeScript narrows the local correctly.

#### Next.js `manifest` metadata property vs `icons.other`
Declaring the web manifest via `icons.other: [{ rel: "manifest", url: "..." }]` routes it through Next.js's icon pipeline, which corrupts the content-type. Use the dedicated top-level `manifest: "/site.webmanifest"` property on the `Metadata` object instead.

#### Prisma interactive transaction tx does not inherit Client Extensions
`getTenantDb().$transaction(async (tx) => ...)` — the `tx` argument is a plain `PrismaClient` transaction, not the extended client. Extension query hooks (e.g., auto-inject `organizationId`) do NOT run on `tx`. Always inject `organizationId: session.organizationId` explicitly in `tx.model.create()` data inside interactive transactions.

### Docker Build + Prisma Generate Pattern

#### prisma.config.ts must not use Prisma's env() helper
Prisma's `env("VAR")` throws at config-load time when the variable is unset — even for `prisma generate` which never reads the DB URL. Use `process.env.VAR ?? "placeholder"` instead so codegen works in any environment. The placeholder should be a clearly invalid URL so accidental real use fails loudly.

#### DB_URL must NOT be a Docker build ARG
`prisma generate` does not need `DB_URL`. Never pass `DB_URL` as a Docker build ARG — it bakes credentials (or broken empty values) into the image layer. The real `DB_URL` should only enter the container at runtime via `env_file`.

#### Single source of truth for runtime DB env: apps/web/.env
`docker-compose.yml` should inject env into the running container exclusively via `env_file: apps/web/.env`. Do not duplicate vars in `environment:` blocks — compose-time interpolation (`${DB_USER}`) only reads from the shell env or the root `.env`, NOT from service-level `env_file`, so the two mechanisms get out of sync.

#### entrypoint.sh TCP probe: use DB_HOST/DB_PORT, not DB_URL regex
`lib/db.ts` uses `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` separately (via PrismaMariaDb adapter). The entrypoint wait-for-mysql probe should do the same — parse `DB_HOST`/`DB_PORT` directly instead of regex-extracting the host from `DB_URL`.

### MySQL Migration Baseline Pattern

#### Generating MySQL DDL with Prisma migrate diff
The correct flag in Prisma CLI >= 6.x is `--to-schema` (not `--to-schema-datamodel` which was removed):
`npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`
Run from `apps/web/` directory. Outputs ready-to-use MySQL DDL to stdout.

#### migration_lock.toml must declare provider = "mysql"
When switching from SQLite to MySQL, delete the old `migration_lock.toml` and create a new one with `provider = "mysql"`.
The old SQLite migrations are incompatible — create a single new baseline migration with the full MySQL DDL.

#### next.config.mjs serverExternalPackages for MySQL driver
`serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"]` must be present in `next.config.mjs` so Next.js standalone output bundles the MySQL driver instead of stale SQLite packages.

#### Pool timeout errors during `next build` are expected
During static page generation, Next.js tries to connect to the DB (for RSC pages that call Prisma). These fail with "pool timeout" if no DB is running at build time. This does NOT fail the build — it just means those pages fall back to dynamic rendering. Normal and expected in CI/CD environments.

### Docker Production Build — Patching Compiled Chunks

#### Source edits do NOT hot-reload into the production Docker container
The Next.js server runs as a standalone production build inside Docker. `NODE_ENV=production`, `PWD=/app`. There is no dev server. Editing source `.ts` files has no effect on the running server.

To apply a backend change without rebuilding the full image:
1. Edit the source `.ts` file (for correctness in git history)
2. Find the compiled chunk: `docker exec vectorops-web-1 grep -rl "unique string from the change" /app/apps/web/.next/server/chunks/`
3. `docker cp CONTAINER:/app/apps/web/.next/server/chunks/CHUNK_NAME.js /tmp/chunk.js`
4. `sed -i 's/old_pattern/new_pattern/' /tmp/chunk.js`
5. `docker cp /tmp/chunk.js CONTAINER:/app/apps/web/.next/server/chunks/CHUNK_NAME.js`
6. `docker restart CONTAINER_NAME` and wait ~8s for health check to pass

#### Finding the right chunk for an API route
The root chunk for most API routes is `/app/apps/web/.next/server/chunks/[root-of-the-server]__HASH.js`.
Multiple such root chunks may exist. Use `grep -rl "unique string"` to identify which one contains the code you need to patch.
The route handler is inlined in the root chunk; the `page: "/api/route/path/route"` string identifies which route each section belongs to.

### Gotchas
- The monorepo uses `"type": "module"` in `apps/web/package.json` — imports use ESM
- SQLite enums are stored as TEXT in the DB (SQLite has no native enum type)
- `$on("connect")` on PrismaClient emits events but may not be reliable across all Prisma versions — verify once installed
- iron-session v8: `SessionOptions` (not `IronSessionOptions`) is the correct type name
- Next.js 15+ App Router: `context.params` is a Promise — must `await context.params`
- `Array.split()[index]` returns `string | undefined` in strict TS — always guard with `parts[i] !== undefined`
- Prisma `readonly` arrays: `const x = ["OPEN", "IN_PROGRESS"] as const` creates a `readonly` tuple. Prisma's `{ in: TicketStatus[] }` requires a mutable array. Use `TicketStatus[]` typed variables with `= [TicketStatus.OPEN, ...]` to avoid the TS4104 error.
