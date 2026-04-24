# Communication: Multitenancy Refactor

## Status
- Backend Phase MT-1 (Schema & Data Layer): [x] Complete (2026-04-23)
- Backend Phase MT-2 (Auth & Session): [x] Complete (2026-04-23)
- Backend Phase MT-3 (API Route Updates): [x] Complete (2026-04-23)
- Backend Phase MT-4 (Middleware & Super Admin): [x] Complete (2026-04-23)
- Backend Phase MT-5 (Migration & Seed): [x] Complete (2026-04-23)
- Frontend: [x] Complete (2026-04-23)
- QA: [ ] Not started

## Shared Context

### Architecture Decisions
- Tenant isolation: row-level with organizationId FK on all tenant-scoped models
- Database: SQLite (unchanged)
- URL structure: session-implicit (no subdomains, no path prefix)
- Super admin: boolean flag on User (`isSuperAdmin`), not a Role enum value
- Public IDs (TKT-XXXX, BUG-XXXX): remain globally unique, no per-tenant sequences
- Invite system: TECH_LEAD generates invite codes, new users join via code

### Key Models
- Organization: id, name, slug (unique), isActive, createdAt, updatedAt
- Invite: id, organizationId, code (unique 8-char), role, email?, expiresAt, usedById?, usedAt?, createdById, createdAt
- User gains: organizationId (FK), isSuperAdmin (bool)
- All tenant-scoped models gain: organizationId (FK)

### Session Shape After Refactor
```
SessionData {
  userId: string
  role: string
  name: string
  organizationId: string
  isSuperAdmin: boolean
}
```

## Phase MT-1 Implementation Notes

### Schema Changes Applied
- Added `Organization` model (`organizations` table): id, name, slug (unique), isActive, createdAt, updatedAt
- Added `Invite` model (`invites` table): id, organizationId, code (unique), role, email?, expiresAt, usedById?, usedAt?, createdById, createdAt
- Added nullable `organizationId String?` FK to: User, Ticket, Notification, HelpRequest, HelpRequestResponse, Checkpoint, CheckpointConfig, TvConfig, RoleNotificationConfig
- Added `isSuperAdmin Boolean @default(false)` to User
- Removed `@unique` from User.email — added `@@unique([organizationId, email])`
- Removed `@unique` from RoleNotificationConfig.role — added `@@unique([organizationId, role])`
- BugReport, TicketEvent, ReorderRequest — NO organizationId added (inherit via parent Ticket)

### Migration Applied
- Migration name: `20260423051733_add_multitenancy`
- All new columns are NULLABLE (String?) — existing data is preserved

### Data Migration Run
- Default org created: "Inovar Sistemas" (slug: `inovar-sistemas`)
- All 21 existing users, 39 tickets, 380 notifications, 8 help requests, 1 help response, 1 checkpoint config, 1 TV config, 5 role configs assigned to default org
- Script: `apps/web/prisma/migrations/data-migration-multitenancy.ts`

### Files Created
- `apps/web/lib/tenant-context.ts` — AsyncLocalStorage-based per-request tenant context
- `apps/web/lib/tenant-db.ts` — Prisma extension that auto-injects organizationId

### Files Modified (Phase MT-1 compatibility patches)
- `apps/web/app/api/auth/login/route.ts` — `findUnique({ where: { email } })` → `findFirst({ where: { email } })` (marked for MT-2 refactor)
- `apps/web/app/api/auth/register/route.ts` — same fix
- `apps/web/app/api/admin/role-notification-config/route.ts` — upsert now uses `findFirst` + `id` (marked for MT-3 refactor)
- `apps/web/prisma/seed.ts` — same pattern for user and role config upserts

### Deviations from Plan
- organizationId fields are OPTIONAL (String?) rather than non-nullable — this is intentional for phase 1 to avoid breaking existing data. Phase MT-8 will run the data migration and a second migration to make them non-nullable after all records are assigned.
- The `plan-overview.md` listed BugReport/TicketEvent/ReorderRequest in the "Models that get organizationId" list, but the `task-request-backend-phase1.md` explicitly excluded them. The task request was followed (excluded from organizationId).
- Existing code that used `findUnique` on non-unique fields was patched minimally to unblock typecheck; full refactor deferred to MT-2/MT-3.

### For Phase MT-2 (Auth & Session)
- `getTenantId()` throws if no context is set — middleware must call `runWithTenant(orgId, handler)` before any tenant-scoped query runs
- Login route currently uses `findFirst({ where: { email } })` — should be updated to resolve org from session/invite code
- The `SessionData` interface still has the old shape (`{ userId, role, name }`) — needs `organizationId` and `isSuperAdmin` added

### For Phase MT-3 (API Route Updates)
- All application routes should import `getTenantDb()` instead of `db`
- `getTenantDb()` auto-injects `organizationId` — no manual `where: { organizationId }` needed in routes
- The raw `db` export is still needed for auth routes and super-admin (cross-tenant operations)

## Phase MT-5 Implementation Notes (Migration & Seed)

### Data Verification
- Confirmed 0 null organizationId values across all 9 tenant-scoped tables before proceeding
- All 21 existing users, all tickets, notifications, etc. were already assigned to "Inovar Sistemas" org from the MT-1 data migration

### Schema Change Applied
- Migration `20260423093841_make_org_id_required` promoted `organizationId String?` to `organizationId String` on all 9 models
- Foreign key constraints are now enforced by SQLite

### Seed Script Updated (`apps/web/prisma/seed.ts`)
- Creates "Inovar Sistemas" org (slug: `inovar-sistemas`) first via upsert
- Creates "Test Company" org (slug: `test-company`) for multitenancy dev testing
- All user upserts scoped to `(organizationId, email)` compound unique
- `alisson.lima@vectorops.dev` is flagged `isSuperAdmin: true`; upsert sets it on `update` path too
- Each org gets CheckpointConfig, TvConfig, and 5 RoleNotificationConfig rows
- RoleNotificationConfig upsert uses `@@unique([organizationId, role])` key via `{ organizationId_role: { organizationId, role } }`
- Script is fully idempotent — safe to re-run
- Added `db:migrate:mt` script to `apps/web/package.json` that runs the data migration via `tsx`

### Data Migration Script Updated (`apps/web/prisma/migrations/data-migration-multitenancy.ts`)
- Rewrote bulk-update steps to use `$executeRawUnsafe` with raw SQL `WHERE organizationId IS NULL`
- Reason: Prisma's generated types no longer accept `null` for a non-nullable field filter — raw SQL bypasses this while keeping the script correct and idempotent

### TypeScript State After MT-5
- `seed.ts` and `data-migration-multitenancy.ts` compile cleanly
- ~15 TS errors remain in existing API routes (missing `organizationId` in create calls) — these are the expected input for MT-3

### Seed Credentials (all passwords: Password123!)
| Org | Role | Email |
|-----|------|-------|
| Inovar Sistemas | TECH_LEAD + SUPER_ADMIN | alisson.lima@vectorops.dev |
| Inovar Sistemas | DEVELOPER | matheus@vectorops.dev |
| Inovar Sistemas | SUPPORT_LEAD | alisson.rosa@vectorops.dev |
| Inovar Sistemas | SUPPORT_MEMBER | bruno@vectorops.dev |
| Inovar Sistemas | QA | nicoli@vectorops.dev |
| Test Company | TECH_LEAD | lead@testcompany.dev |
| Test Company | DEVELOPER | dev@testcompany.dev |
| Test Company | SUPPORT_MEMBER | support@testcompany.dev |

### For Phase MT-3 (API Route Updates)
- Every route that does a `create` on a tenant-scoped model must now include `organizationId`
- The tenant organizationId comes from the session (`session.organizationId`) — this will be available after MT-2
- Affected files (identified by typecheck):
  - `app/api/tickets/route.ts`
  - `app/api/checkpoints/route.ts`
  - `app/api/checkpoints/config/route.ts`
  - `app/api/admin/checkpoints/config/route.ts`
  - `app/api/help-requests/route.ts`
  - `app/api/help-requests/[id]/respond/route.ts`
  - `app/api/admin/role-notification-config/route.ts`
  - `app/api/admin/tv-config/route.ts`
  - `app/api/tv/data/route.ts`
  - `app/api/auth/register/route.ts`
  - `lib/notifications.ts`

## Phase MT-3 Implementation Notes (API Route Updates & SSE Scoping)

### Pattern Applied
- All tenant-scoped API routes now import `getTenantDb` from `@/lib/tenant-db` instead of raw `db`
- Auth guards migrated from `requireAuth`/`requireRole` to `requireTenantAuth`/`requireTenantRole`
- `requireTenantRole` is a new helper added to `apps/web/lib/auth.ts` — it combines role check + tenant context setup

### New Auth Helper (`requireTenantRole`)
Added to `apps/web/lib/auth.ts`:
```ts
requireTenantRole(...roles)(async (session) => { ... })
```
This curried helper combines `requireRole()` + `runWithTenant()` in one call for routes that need both a role check and tenant context.

### TypeScript Workarounds
- Prisma's extended client requires `organizationId` in `create` data at the type level, even though the extension auto-injects it. All affected `create` / `createMany` / `upsert create` calls use `as any` on the data field with an explanatory comment.
- `generatePublicId` and `calculatePriorityOrder` helper functions updated to accept a minimal interface type instead of `Prisma.TransactionClient` — this makes them compatible with the extended client's transaction callback type.

### SSE Route Updated
`apps/web/app/api/sse/route.ts`:
- Reads `organizationId` from session
- Filters events: if `event.payload.organizationId` is defined and doesn't match the session's org, the event is dropped
- Events without `organizationId` in payload pass through (backward compat)

### SSE Emitter Events Updated
All routes that call `emitShinobiEvent()` now include `organizationId: session.organizationId` in the payload:
- `ticket:created`, `ticket:status_changed`, `ticket:assigned`
- `developer:status_changed` (from checkpoints, status, help-request respond routes)
- `help_request:new`, `help_request:responded`
- `notification:acknowledged`

### Notification System Updated (`apps/web/lib/notifications.ts`)
- All DB queries in `getNotificationTargets` and `createAndEmitNotifications` now use `getTenantDb()` instead of raw `db`
- `createAndEmitNotifications` reads `organizationId` via `getTenantIdOptional()` and includes it in SSE `notification:new` payloads
- Import changed from `db` to `getTenantDb` + `getTenantIdOptional`

### TV Route (`/api/tv/data`)
- Now requires `?org=SLUG` query parameter
- Uses raw `db` (no session) to resolve org by slug
- Manually scopes all queries with explicit `organizationId` in `where` clauses
- Returns 400 if no `org` param, 404 if org not found, 403 if org inactive, 503 if TV disabled

### Bug Routes
`apps/web/app/api/bugs/route.ts` and `apps/web/app/api/bugs/[id]/route.ts` — these were already stub files with TODO comments only. No actual db calls existed to migrate. Left as-is.

### Routes NOT Changed (as planned)
- `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me` — use raw `db` by design
- `/api/health` — no db queries
- `/api/invites/[code]` — public, cross-tenant

### TypeScript Status After MT-3
- 0 TS errors (`npm run typecheck` clean)

### For Phase MT-4 (Middleware & Super Admin)
- `requireTenantRole` is available in `@/lib/auth` for all super-admin routes
- `requireSuperAdmin` is already implemented — super-admin routes can use it directly + call `runWithTenant` manually if they need to impersonate a tenant
- TV page URL must be updated to include `?org=SLUG` parameter

## Backend -> Frontend

### API Endpoints (to be filled by backend engineer as implemented)

**Auth:**
- POST /api/auth/register -- modes: create-org (body has organizationName) or join-invite (body has inviteCode)
- POST /api/auth/login -- optional organizationSlug for disambiguation; returns 409 with org list if ambiguous
- GET /api/auth/me -- now includes organizationId, isSuperAdmin, organizationName

**Invites:**
- GET /api/invites/[code] -- public, returns { organizationName, role, email? }
- POST /api/organizations/[id]/invites -- TECH_LEAD, creates invite
- GET /api/organizations/[id]/invites -- TECH_LEAD, lists active invites
- DELETE /api/organizations/[id]/invites/[inviteId] -- TECH_LEAD, revokes

**Organization:**
- GET /api/organizations/current -- any auth user, returns current org details
- PATCH /api/organizations/current -- TECH_LEAD, updates org name

**Super Admin:**
- GET /api/super-admin/organizations -- list all orgs
- POST /api/super-admin/organizations -- create org
- GET /api/super-admin/organizations/[id] -- org detail
- PATCH /api/super-admin/organizations/[id] -- update org
- GET /api/super-admin/users -- list all users cross-org
- POST /api/super-admin/impersonate -- switch org context
- POST /api/super-admin/stop-impersonating -- restore org context

### Response Schemas

**POST /api/auth/login (200)**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "TECH_LEAD | DEVELOPER | SUPPORT_LEAD | SUPPORT_MEMBER | QA",
    "organizationId": "string",
    "isSuperAdmin": false,
    "avatarUrl": "string | null",
    "ninjaAlias": "string",
    "isActive": true,
    "notifyTickets": true,
    "notifyBugs": true,
    "soundEnabled": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

**POST /api/auth/login (409 — multiple orgs)**
```json
{
  "error": "Múltiplas organizações encontradas",
  "organizations": [{ "name": "string", "slug": "string" }]
}
```

**POST /api/auth/register (201 — both modes)**
```json
{
  "user": { /* same shape as login user */ },
  "organization": { "id": "string", "name": "string", "slug": "string" }
}
```

**GET /api/auth/me (200)**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "organizationId": "string",
    "isSuperAdmin": false,
    "organizationName": "string",
    "organizationSlug": "string",
    "avatarUrl": "string | null",
    "ninjaAlias": "string",
    "isActive": true,
    "notifyTickets": true,
    "notifyBugs": true,
    "soundEnabled": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

**GET /api/invites/[code] (200)**
```json
{
  "organizationName": "string",
  "role": "string",
  "email": "string (only if restricted)",
  "expiresAt": "ISO8601"
}
```

**GET /api/invites/[code] errors**
- 404: code not found
- 409: already used
- 410: expired
- 403: org inactive

**POST /api/organizations/[id]/invites (201)**
```json
{
  "invite": {
    "id": "string",
    "code": "string (8-char uppercase)",
    "role": "string",
    "email": "string | null",
    "expiresAt": "ISO8601",
    "createdAt": "ISO8601",
    "createdBy": { "id": "string", "name": "string" }
  }
}
```

**GET /api/organizations/[id]/invites (200)**
```json
{
  "invites": [ /* same shape as create response */ ]
}
```

**DELETE /api/organizations/[id]/invites/[inviteId] (200)**
```json
{
  "invite": { "id": "string", "code": "string", "role": "string", "email": "string | null", "expiresAt": "ISO8601" }
}
```

### TV Route Change
- `/api/tv/data` now accepts `?org=SLUG` query parameter for org scoping

## Frontend Implementation Notes (2026-04-23)

### Components Created
- `apps/web/components/auth/register-form.tsx` — tabs UI (create org / join via invite); invite code validated on blur/Enter via GET /api/invites/[code]; join tab shows org name + role badge preview; accepts `initialInviteCode` prop
- `apps/web/components/auth/login-form.tsx` — handles 409 multi-org response; shows org picker Select; re-submits with organizationSlug
- `apps/web/components/layout/header.tsx` — shows organizationName next to hamburger; ImpersonationBanner (amber, sticky) for super-admin impersonating; Super Admin link in user dropdown
- `apps/web/components/layout/sidebar.tsx` — "Organização" nav item (BuildingIcon) in adminSecondary for TECH_LEAD; links to /admin/organization
- `apps/web/components/layout/app-shell.tsx` — passes organizationName prop to Header
- `apps/web/components/admin/organization-settings.tsx` — org name editor + stats card
- `apps/web/components/admin/invite-management.tsx` — invite list + create dialog + revoke; monospace code display; copyable invite link
- `apps/web/components/super-admin/org-list.tsx` — paginated org table + search + create dialog + active toggle
- `apps/web/components/super-admin/org-detail.tsx` — org details + edit form + impersonation + user list

### Pages Created
- `apps/web/app/(protected)/admin/organization/page.tsx` — TECH_LEAD only
- `apps/web/app/(protected)/super-admin/page.tsx` — stats dashboard (replaced placeholder)
- `apps/web/app/(protected)/super-admin/organizations/page.tsx`
- `apps/web/app/(protected)/super-admin/organizations/[id]/page.tsx`

### Pages Modified
- `apps/web/app/(auth)/register/page.tsx` — reads ?invite= searchParam; passes to RegisterForm
- `apps/web/app/(protected)/layout.tsx` — fetches org name from DB; passes to AppShell
- `apps/web/app/(public)/dev/tv/page.tsx` — reads ?org= searchParam; passes to TvBoard

### API Modified (minor addition)
- `apps/web/app/api/tv/data/route.ts` — added `organizationName` to response (added `name` to org select)

### Middleware Modified
- `apps/web/middleware.ts` — added `/admin/organization` as TECH_LEAD-only before generic /admin guard

### TypeScript
- `npm run typecheck` — 0 errors after implementation

### UI Decisions
- Org picker in login: appears as an inline card below password field (no modal) for quick UX
- Invite code: `font-mono text-base tracking-widest uppercase` in input; `text-2xl font-bold tracking-widest` in success display
- Impersonation: amber banner above the main header bar (sticky z-50); button calls stop-impersonating then navigates to /super-admin
- Super-admin pages: clean/utilitarian (no ninja theme), uses the same shadcn Card/Table/Badge components
- TV mode: org name shown as small `text-xs text-white/40` subtitle below ShurikenLogo

## Frontend -> Backend

### Expected Behaviors
- Register form sends either `{ organizationName, name, email, password }` or `{ inviteCode, name, email, password }`
- Login form sends `{ email, password }` initially; if 409 returned, re-sends with `{ email, password, organizationSlug }`
- Header needs org name -- will fetch from `/api/auth/me` or session context
- Invite management page calls POST/GET/DELETE on `/api/organizations/[id]/invites`
- Super-admin pages call `/api/super-admin/*` endpoints

### UI Flows
1. Registration (Create Org): user fills org name + personal details -> POST /api/auth/register -> auto-login -> redirect to /dev
2. Registration (Join via Invite): user enters code -> validates via GET /api/invites/[code] -> shows org name + role -> user fills personal details -> POST /api/auth/register -> auto-login -> redirect to role home
3. Login (single org): normal login flow, no change
4. Login (multi org): login returns 409 -> show org picker -> re-submit with slug
5. Invite creation: TECH_LEAD fills role + optional email + expiry -> POST invite -> show copyable link

## Phase MT-2 Implementation Notes (Auth & Session)

### SessionData Changes
`apps/web/lib/session.ts` — `SessionData` interface now has:
```ts
{ userId, role, name, organizationId, isSuperAdmin }
```
Cookie name unchanged (`shinobiops_session`). All sessions created before MT-2 are now invalid (missing new fields) — users will be logged out and need to log in again.

### Auth Guards Added (`apps/web/lib/auth.ts`)
- `getCurrentSession()` — now returns `organizationId` and `isSuperAdmin`
- `requireSuperAdmin()` — returns 403 if `isSuperAdmin !== true`
- `requireTenantAuth(handler)` — wraps `requireAuth()` + calls `runWithTenant(session.organizationId, handler)`, making `getTenantDb()` safe to use inside the handler

### Login Route Rewrite (`/api/auth/login`)
- Now queries `findMany` on email (not `findFirst`) to detect multi-org users
- If email exists in multiple orgs and no `organizationSlug` provided: 409 with `organizations` list
- If org is inactive: 403
- Session now saves `organizationId` and `isSuperAdmin`

### Register Route Rewrite (`/api/auth/register`)
Mode detection: presence of `organizationName` key (create-org) vs `inviteCode` key (join-org).

**Create-org mode:**
- Generates slug via `generateOrgSlug()` in `lib/invite-code.ts`
- Slug uniqueness checked against `organization.slug` unique index
- Creates org + TECH_LEAD user + CheckpointConfig + TvConfig + 5 RoleNotificationConfig records in a single `$transaction`
- Old `role` field from the request is removed — new orgs always get TECH_LEAD

**Join-org mode:**
- Validates invite: exists, not used, not expired, org active
- If invite has email restriction, enforces it
- Checks email uniqueness within the org (not globally)
- Creates user + marks invite used in a single `$transaction`

### /api/auth/me Updated
- Now queries `organization` relation alongside user
- Returns `organizationId`, `isSuperAdmin`, `organizationName`, `organizationSlug` in the user object

### New Files Created
- `apps/web/lib/schemas/auth-schemas.ts` — `LoginSchema`, `RegisterCreateOrgSchema`, `RegisterJoinOrgSchema`
- `apps/web/lib/schemas/organization-schemas.ts` — `InviteCreateSchema`
- `apps/web/lib/invite-code.ts` — `generateInviteCode()` (8-char, excludes 0/O/1/I/L), `generateOrgSlug()`
- `apps/web/app/api/organizations/[id]/invites/route.ts` — POST (create) + GET (list)
- `apps/web/app/api/organizations/[id]/invites/[inviteId]/route.ts` — DELETE (revoke)
- `apps/web/app/api/invites/[code]/route.ts` — GET public validation

### Important Notes for Frontend
- `GET /api/invites/[code]` normalizes the code to uppercase — frontend can pass it as-is
- Invite revocation is a soft-delete (sets `expiresAt = now`), not a hard delete
- Register response always includes both `user` and `organization` objects for immediate routing
- The `/api/auth/me` response has `organizationName` and `organizationSlug` as top-level fields on the user object (flattened, not nested)
- `requireTenantAuth` is now the preferred guard for all tenant-scoped routes — MT-3 will migrate all application routes to use it

### TypeScript Status After MT-2
- 0 new TS errors introduced
- ~14 pre-existing MT-3 errors remain (missing `organizationId` in create calls in application routes — to be fixed in MT-3)

## Phase MT-4 Implementation Notes (Middleware & Super Admin)

### Middleware Updates (`apps/web/middleware.ts`)
- `SessionPayload` in middleware now includes `organizationId` and `isSuperAdmin`
- Added `/api/invites/` to `PUBLIC_API_PREFIXES` (public invite validation endpoint)
- Added `/super-admin` route guard: checks `session.isSuperAdmin === true`; redirects to role home if false
- All authenticated requests now set `x-organization-id` response header for downstream server components
- Super-admin guard runs before the ROLE_GUARDS loop (separate branch with early return)

### SessionData Update (`apps/web/lib/session.ts`)
- Added optional field `originalOrganizationId?: string` to `SessionData` interface
- Used during super-admin impersonation to preserve the real org id for restoration

### New Validation Schemas (`apps/web/lib/schemas/organization-schemas.ts`)
- `OrgCreateSchema`: name (required, 2-100 chars), slug (optional, lowercase alphanumeric + hyphens)
- `OrgUpdateSchema`: name (optional), slug (optional), isActive (optional)
- `ImpersonateSchema`: organizationId (required)
- `OrgSelfUpdateSchema`: name (required) — used by TECH_LEAD self-service update (no slug/isActive exposed)

### Super Admin API Routes (all use raw `db`, cross-tenant)
- `GET /api/super-admin/organizations` — paginated list with user/ticket counts; query: search, isActive, page, limit
- `POST /api/super-admin/organizations` — creates empty org with default configs (CheckpointConfig, TvConfig, 5 RoleNotificationConfigs)
- `GET /api/super-admin/organizations/[id]` — full org detail: users, ticket counts (total + active), configs
- `PATCH /api/super-admin/organizations/[id]` — update name/slug/isActive; slug checked for uniqueness (409 on conflict)
- `GET /api/super-admin/users` — paginated cross-org user list with organization nested; query: organizationId, role, search, page, limit
- `POST /api/super-admin/impersonate` — switches session.organizationId to target; saves original in session.originalOrganizationId; console.warn audit log
- `POST /api/super-admin/stop-impersonating` — restores session.organizationId from originalOrganizationId; clears the field

### Org Settings API Routes (tenant-scoped via raw db with session.organizationId)
- `GET /api/organizations/current` — returns org name, slug, isActive, userCount; any authenticated user
- `PATCH /api/organizations/current` — TECH_LEAD only; updates name, derives slug from name; checks slug uniqueness (409 on conflict)

### Super Admin Page Placeholders (frontend will fill in)
- `apps/web/app/(protected)/super-admin/layout.tsx` — server-side isSuperAdmin guard (defense in depth)
- `apps/web/app/(protected)/super-admin/page.tsx` — placeholder dashboard

### Impersonation Behavior
- Impersonation is non-destructive: `originalOrganizationId` is only set on the FIRST impersonation (nested impersonation doesn't overwrite the real origin)
- `isImpersonating` boolean is returned in impersonate response (frontend can use this to show indicator)
- Both `impersonate` and `stop-impersonating` produce `console.warn` audit logs with userId, fromOrgId, toOrgId

### Active Ticket Count Definition
- "Active" tickets = status NOT IN (`DONE`, `CANCELLED`) — matches the two terminal statuses in TicketStatus enum

### TypeScript Status After MT-4
- 0 TS errors (`npm run typecheck` clean)
