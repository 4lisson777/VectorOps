# Tech Leader -- Short-Term Memory

## Current Task
- **Name:** Multitenancy Refactor
- **Plan folder:** `ai-driven-project/prompt-engineering/20260423_multitenancy-refactor/`
- **Scope:** Full-stack (multi-phase)
- **Status:** PLANNED -- awaiting backend Phase MT-1 execution first

## Key Decisions
- Row-level tenant isolation with organizationId FK on all tenant-scoped models
- Keep SQLite (no DB engine change in this phase)
- Super admin is a boolean flag on User (`isSuperAdmin`), not a Role enum value
- Session-implicit tenancy (no subdomains, no URL path prefixes)
- Invite-based org joining (TECH_LEAD generates codes, users join via code)
- Prisma Client Extension + AsyncLocalStorage for auto-scoping queries
- Public IDs remain globally unique (no per-tenant sequences)
- Email uniqueness changes from global to per-organization
- Two-step migration: nullable columns -> data backfill -> non-nullable columns
- TV route gains `?org=slug` parameter for public access

## Architecture Notes
- New models: Organization (tenant entity), Invite (join codes)
- User gains: organizationId (FK), isSuperAdmin (boolean)
- Session gains: organizationId, isSuperAdmin
- All ~40 API routes need to switch from raw `db` to `getTenantDb()`
- SSE events must include organizationId for cross-tenant filtering
- Notification targeting must be org-scoped
- BugReport, TicketEvent, ReorderRequest inherit org scope through parent Ticket (no direct organizationId)
- CheckpointConfig, TvConfig become per-org (no longer singleton)
- RoleNotificationConfig unique constraint changes from (role) to (organizationId, role)

## Phase Execution Order
1. MT-1: Schema & Data Layer (backend) -- MUST go first
2. MT-5: Migration & Seed (backend) -- immediately after MT-1
3. MT-2: Auth & Session (backend) -- depends on MT-1
4. MT-3: API Route Updates (backend) -- depends on MT-1, MT-2
5. MT-4: Middleware & Super Admin (backend) -- depends on MT-2, MT-3
6. Frontend: all UI changes -- depends on all backend phases
7. QA: full testing -- depends on everything
