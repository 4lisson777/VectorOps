# Backend Task: Phase MT-3 -- API Route Updates & SSE Scoping

## Description
Update all existing API routes to use the tenant-scoped Prisma client (`getTenantDb()`) instead of the raw `db` import. Update SSE event filtering to include tenant scoping. Update the notification targeting system to be org-scoped.

## Prerequisites
- Phase MT-1 complete (tenant-db infrastructure exists)
- Phase MT-2 complete (auth sets tenant context per request)

## Acceptance Criteria
- [ ] All tenant-scoped API routes use `getTenantDb()` instead of raw `db`
- [ ] SSE route filters events by organizationId in addition to userId
- [ ] SSE emitter events include organizationId in payload
- [ ] Notification targeting (`getNotificationTargets`) queries are org-scoped
- [ ] Ticket creation, assignment, status change APIs are org-scoped
- [ ] User listing APIs are org-scoped
- [ ] Admin config APIs (checkpoint config, TV config, role notification config) are org-scoped
- [ ] Help request APIs are org-scoped
- [ ] Checkpoint APIs are org-scoped
- [ ] Reorder request APIs are org-scoped
- [ ] Bug report APIs are org-scoped
- [ ] No cross-tenant data leakage in any API route

## Routes to Update

### Critical Path -- Auth-adjacent (use raw `db`, NOT tenant-scoped)
These routes need special handling because they run before or outside tenant context:
- `apps/web/app/api/auth/login/route.ts` -- uses raw db (handled in Phase MT-2)
- `apps/web/app/api/auth/register/route.ts` -- uses raw db (handled in Phase MT-2)
- `apps/web/app/api/auth/logout/route.ts` -- no db queries, no change needed
- `apps/web/app/api/auth/me/route.ts` -- uses raw db to fetch user, should include org info
- `apps/web/app/api/health/route.ts` -- no tenant scope needed
- `apps/web/app/api/invites/[code]/route.ts` -- public, uses raw db (created in Phase MT-2)

### Tenant-Scoped Routes -- Switch to getTenantDb()

**Ticket routes:**
- `apps/web/app/api/tickets/route.ts` (GET list, POST create) -- replace `db` with `getTenantDb()`
- `apps/web/app/api/tickets/[id]/route.ts` (GET detail, PATCH update) -- replace `db`
- `apps/web/app/api/tickets/[id]/assign/route.ts` -- replace `db`
- `apps/web/app/api/tickets/[id]/events/route.ts` -- replace `db`
- `apps/web/app/api/tickets/[id]/reorder/route.ts` -- replace `db`

**Bug routes:**
- `apps/web/app/api/bugs/route.ts` -- replace `db`
- `apps/web/app/api/bugs/[id]/route.ts` -- replace `db`
- `apps/web/app/api/bugs/[id]/clickup-export/route.ts` -- replace `db`

**User routes:**
- `apps/web/app/api/users/route.ts` -- replace `db` (list users in same org)
- `apps/web/app/api/users/[id]/route.ts` -- replace `db`
- `apps/web/app/api/users/[id]/notifications/route.ts` -- replace `db`
- `apps/web/app/api/users/me/route.ts` -- replace `db`
- `apps/web/app/api/users/me/password/route.ts` -- replace `db`
- `apps/web/app/api/users/me/status/route.ts` -- replace `db`

**Notification routes:**
- `apps/web/app/api/notifications/route.ts` -- replace `db`
- `apps/web/app/api/notifications/[id]/read/route.ts` -- replace `db`
- `apps/web/app/api/notifications/[id]/acknowledge/route.ts` -- replace `db`
- `apps/web/app/api/notifications/pending/route.ts` -- replace `db`
- `apps/web/app/api/notifications/read-all/route.ts` -- replace `db`

**Admin routes:**
- `apps/web/app/api/admin/users/route.ts` -- replace `db`
- `apps/web/app/api/admin/users/[id]/route.ts` -- replace `db`
- `apps/web/app/api/admin/users/[id]/avatar/route.ts` -- replace `db`
- `apps/web/app/api/admin/checkpoints/config/route.ts` -- replace `db`
- `apps/web/app/api/admin/checkpoints/history/route.ts` -- replace `db`
- `apps/web/app/api/admin/stats/route.ts` -- replace `db`
- `apps/web/app/api/admin/tv-config/route.ts` -- replace `db`
- `apps/web/app/api/admin/role-notification-config/route.ts` -- replace `db`

**Other routes:**
- `apps/web/app/api/checkpoints/route.ts` -- replace `db`
- `apps/web/app/api/checkpoints/config/route.ts` -- replace `db`
- `apps/web/app/api/help-requests/route.ts` -- replace `db`
- `apps/web/app/api/help-requests/[id]/respond/route.ts` -- replace `db`
- `apps/web/app/api/reorder-requests/route.ts` -- replace `db`
- `apps/web/app/api/reorder-requests/[id]/route.ts` -- replace `db`
- `apps/web/app/api/tv/data/route.ts` -- this is a public route for TV display; needs special handling (see below)

### Special Case: TV Data Route
The TV data route (`/api/tv/data`) is currently public (no auth). For multitenancy, it needs to know which org's data to show. Options:
- Accept an `org` query parameter with the org slug
- The TV page URL would become `/dev/tv?org=inovar-sistemas`
- The route fetches the org by slug and manually scopes queries (does not use tenant context since no session)

### SSE Route Update
`apps/web/app/api/sse/route.ts`:
- Read organizationId from session (already available after Phase MT-2)
- Add organizationId to the event filtering logic: only forward events where `event.payload.organizationId === sessionOrgId`
- This prevents users in Org A from receiving SSE events from Org B

### SSE Emitter Update
`apps/web/lib/sse-emitter.ts`:
- The `ShinobiEvent` payload type should document that `organizationId` is expected on all emitted events
- Each route that calls `emitShinobiEvent()` must include `organizationId` in the payload
- The organizationId comes from the tenant context (`getTenantId()`)

### Notification System Update
`apps/web/lib/notifications.ts`:
- `getNotificationTargets()`: all user queries must be scoped by organizationId
- The function should accept organizationId as a parameter (since it runs in the same request context, it can also use getTenantId(), but explicit is better)
- `createAndEmitNotifications()`: the SSE events emitted must include organizationId in payload

## Business Logic
- The pattern for updating each route is mechanical: replace `import { db }` with `import { getTenantDb }` and replace `db.` calls with `const tenantDb = getTenantDb(); tenantDb.` calls
- Because the Prisma extension auto-injects organizationId, most route logic remains unchanged
- For routes that use `db.$transaction()`, the transaction client from the extended db also inherits the extension
- Routes that fetch related models through parent relations (e.g., `ticket.include.bugReport`) do NOT need separate scoping -- the parent query is already scoped

## Rules to Follow
- Do NOT change business logic in the routes -- only change the db client used
- Routes that use `requireRole()` already set tenant context (from Phase MT-2); just use `getTenantDb()`
- Keep error messages unchanged
- The `db` import in `apps/web/lib/db.ts` remains available for cross-tenant operations (auth, super-admin)
- Add `organizationId` to SSE payloads in a backward-compatible way (it is an additional field, does not break existing event consumers)

## Communication File
`.claude/communication/20260423_multitenancy-refactor.md`
