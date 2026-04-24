# Backend Task: Phase 5 -- Admin APIs, TV Mode, Search, Avatar, Docker, Hardening

## Description

Implement all backend APIs and infrastructure for the remaining Phase 5 tasks. This includes admin dashboard stats, team management endpoints, checkpoint configuration/history endpoints, extended ticket filtering for the log page, TV mode data endpoint and config, global search improvements, avatar upload, Docker setup, and production hardening.

## Acceptance Criteria

- [ ] GET `/api/admin/stats` returns aggregated dashboard metrics (tickets by status/severity, assigned vs unassigned, avg resolution times, developer workload)
- [ ] GET `/api/admin/users` returns all users with filters (role, isActive, search by name/email)
- [ ] PATCH `/api/admin/users/[id]` allows Tech Lead to change role, toggle isActive, update avatarUrl (with self-deactivation guard)
- [ ] POST `/api/admin/users/[id]/avatar` handles image upload, stores in `public/avatars/`, returns URL
- [ ] GET `/api/admin/checkpoints/config` returns the CheckpointConfig record (already exists at `/api/checkpoints/config` -- verify or create admin-namespaced alias)
- [ ] PATCH `/api/admin/checkpoints/config` updates checkpoint settings (already exists -- verify it works)
- [ ] GET `/api/admin/checkpoints/history` returns checkpoint entries with user info, filterable by userId, date range, with pagination
- [ ] GET `/api/tickets` extended to support: date range filters (createdFrom, createdTo), resolvedAt range, sortBy column, sortOrder (asc/desc) -- for the admin log page
- [ ] Prisma schema updated: add `TvConfig` model (isEnabled boolean, refreshInterval int default 30)
- [ ] GET `/api/tv/data` (public, no auth) returns developer cards data + ticket/bug severity counts. Returns 503 when TV mode is disabled.
- [ ] GET `/api/admin/tv-config` returns TV mode settings (TECH_LEAD only)
- [ ] PATCH `/api/admin/tv-config` updates TV mode settings (TECH_LEAD only)
- [ ] GET `/api/tickets` search param works for both publicId prefix match and title partial match (already implemented -- verify)
- [ ] Dockerfile with multi-stage build (deps, builder, runner stages) using Node 20 slim
- [ ] docker-compose.yml with SQLite volume mount, .env file, health check, restart policy
- [ ] Entrypoint script: runs `prisma migrate deploy` then starts the server
- [ ] Environment validation: fail fast at startup if required env vars are missing (SESSION_SECRET, DATABASE_URL)
- [ ] Rate limiting on auth endpoints (POST `/api/auth/login`, POST `/api/auth/register`) -- 5 attempts per minute per IP
- [ ] Secure cookie flags when NODE_ENV=production (Secure, SameSite=Strict)
- [ ] CORS headers restricted to same-origin

## API Endpoints

### Admin Stats
- **GET `/api/admin/stats`** -- TECH_LEAD only. Returns: ticketsByStatus, ticketsBySeverity, assignedCount, unassignedCount, avgResolutionTime7d, avgResolutionTime30d (hours), developerWorkload (array of {userId, name, ninjaAlias, avatarUrl, openTicketCount})

### Team Management
- **GET `/api/admin/users`** -- TECH_LEAD only. Query: role?, isActive?, search? (name or email contains). Returns full user list with all relevant fields.
- **PATCH `/api/admin/users/[id]`** -- TECH_LEAD only. Body: { role?, isActive? }. Guard: cannot deactivate self. Returns updated user.
- **POST `/api/admin/users/[id]/avatar`** -- TECH_LEAD only. Multipart form data with image file. Resize to max 256x256, store as `public/avatars/{userId}.webp`. Returns { avatarUrl }.

### Checkpoint Admin
- **GET `/api/admin/checkpoints/history`** -- TECH_LEAD only. Query: userId?, from? (ISO date), to? (ISO date), page?, limit?. Returns checkpoint entries with user name/alias, paginated.

### Ticket Log (extend existing)
- **GET `/api/tickets`** -- Extend the existing ticketFilterSchema to add: createdFrom, createdTo, resolvedFrom, resolvedTo (all ISO date strings), sortBy (enum: createdAt, resolvedAt, severity, status, priorityOrder), sortOrder (asc/desc). Ensure the endpoint supports these for admin log usage.

### TV Mode
- **GET `/api/tv/data`** -- Public (no auth). Check TvConfig.isEnabled first; if disabled return 503. Returns: developers (array with name, ninjaAlias, avatarUrl, devStatus, currentTask, assignedTicket), ticketCounts (object with severity counts for open tickets), bugCounts (same for bugs).
- **GET `/api/admin/tv-config`** -- TECH_LEAD only. Returns TvConfig record.
- **PATCH `/api/admin/tv-config`** -- TECH_LEAD only. Body: { isEnabled?, refreshInterval? (10-300 seconds) }. Creates record if none exists.

## Data Models

### New: TvConfig
- id: String (cuid, PK)
- isEnabled: Boolean (default true)
- refreshInterval: Int (default 30, in seconds)
- Table name: "tv_config"

### Existing models used
- User (team management, avatar upload)
- Ticket (stats, log, TV counts)
- Checkpoint + CheckpointConfig (admin checkpoint page)

## Business Logic

### Admin Stats
- ticketsByStatus: GROUP BY status WHERE status NOT IN (DONE, CANCELLED) for "open" view, but return all statuses
- ticketsBySeverity: GROUP BY severity for non-closed tickets
- avgResolutionTime: compute from resolvedAt - createdAt for tickets resolved in the last 7/30 days, in hours
- developerWorkload: count of assigned tickets with status in (OPEN, IN_PROGRESS, WAITING_FOR_INFO) per developer

### Avatar Upload
- Accept PNG, JPG, WEBP only (validate MIME type)
- Use sharp (add as dependency) to resize to max 256x256 and convert to WebP
- Store in `public/avatars/{userId}.webp`
- Update user.avatarUrl to `/avatars/{userId}.webp`

### TV Mode Data
- Return 503 with `{ error: "TV mode is disabled" }` when TvConfig.isEnabled is false
- Include all users with role DEVELOPER or TECH_LEAD and isActive=true
- For each developer, include their top assigned ticket (highest priority, open status)

### Rate Limiting
- Simple in-memory Map<string, { count: number, resetAt: number }>
- Key: IP address from request headers (x-forwarded-for or request IP)
- 5 requests per 60 seconds per IP on auth endpoints
- Return 429 with `{ error: "Too many requests" }` when exceeded

### Environment Validation
- Create `lib/env.ts` that validates required env vars at import time
- Required: SESSION_SECRET, DATABASE_URL
- Optional with defaults: NODE_ENV (default "development"), PORT (default "3000")
- Import this in the root layout or middleware so it runs early

### Docker
- Dockerfile stages: deps (install), builder (build app + generate prisma client), runner (copy standalone output, prisma client, migrations)
- entrypoint.sh: `npx prisma migrate deploy && node server.js`
- docker-compose.yml: mount `./data:/app/prisma/data`, read `.env`, health check on `/api/health`, port 3000

## Rules to Follow
- Use existing patterns: requireAuth/requireRole from `@/lib/auth`, db from `@/lib/db`
- Zod validation for all request bodies and query parameters
- Consistent error format: `{ error: string, details?: object }`
- Fire-and-forget for non-critical async operations (notifications)
- Use Prisma transactions where multiple writes are needed
- Import from `@prisma/client` for types/enums (the generated client path is `../generated/prisma/client`)

## Communication File
`/home/alisson/web/personal/vectorops/.claude/communication/phase5-admin-tv-polish-docker.md`

## Key Existing Files Reference
- Auth helpers: `/home/alisson/web/personal/vectorops/apps/web/lib/auth.ts`
- DB singleton: `/home/alisson/web/personal/vectorops/apps/web/lib/db.ts`
- Session: `/home/alisson/web/personal/vectorops/apps/web/lib/session.ts`
- Ticket schemas: `/home/alisson/web/personal/vectorops/apps/web/lib/schemas/ticket-schemas.ts`
- Notifications: `/home/alisson/web/personal/vectorops/apps/web/lib/notifications.ts`
- SSE emitter: `/home/alisson/web/personal/vectorops/apps/web/lib/sse-emitter.ts`
- Prisma schema: `/home/alisson/web/personal/vectorops/apps/web/prisma/schema.prisma`
- Existing checkpoint config API: `/home/alisson/web/personal/vectorops/apps/web/app/api/checkpoints/config/route.ts`
- Existing users API: `/home/alisson/web/personal/vectorops/apps/web/app/api/users/route.ts`
- Existing tickets API: `/home/alisson/web/personal/vectorops/apps/web/app/api/tickets/route.ts`
- Health endpoint: `/home/alisson/web/personal/vectorops/apps/web/app/api/health/route.ts`
