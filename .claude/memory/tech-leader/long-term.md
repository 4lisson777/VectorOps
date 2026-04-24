# Tech Leader -- Long-Term Memory

## Project Patterns
- Monorepo: Turbo + npm workspaces. Apps in apps/, packages in packages/
- Auth: requireAuth() from @/lib/auth returns { session, error }
- DB: db from @/lib/db using globalThis singleton for HMR safety
- Session in server components: getSession() from @/lib/session
- Date serialization: ISO strings when passing from server to client components
- Validation: Zod schemas in @/lib/schemas/
- UI: shadcn/ui from @workspace/ui/components/*, HugeIcons, cn() utility
- No rules directory exists yet at ai-driven-project/rules/

## Phase History
- Phase 1 (complete): Auth, pages, base layout
- Phase 2 (complete): Tickets, bugs, priority queue, detail page, timeline, CRUD API
- Phase 3 (complete): Real-time notifications, SSE, sound alerts, Ninja Board, developer status
- Phase 4 (complete): Help requests, checkpoints, reorder request flow
- Phase 5 (in progress): Admin dashboard, team mgmt, TV mode, theme polish, Docker. Done: 5.3 notification routing, 5.13 error pages. 13 tasks remaining.

## Stubs Inventory (Phase 5)
Admin component stubs exist returning null: command-dojo-overview, team-management, checkpoint-config, ticket-log, tv-board. Admin page stubs exist: /admin (has placeholder UI), /admin/team, /admin/checkpoints, /admin/log (return null). TV page at (public)/dev/tv has placeholder UI. Header has basic search but no dropdown/debounce/Ctrl+K.

## i18n Pattern
- For single-language apps, a simple `t()` utility function importing a typed const object is far simpler than React Context + hooks
- React Context approach fails for Server Components (no hooks in RSC)
- TypeScript const objects give autocompletion; JSON files do not
- Keep API responses in English even when UI is translated

## Patterns Learned
- Checkpoint config API already exists at /api/checkpoints/config (GET + PATCH with TECH_LEAD guard)
- Users API at /api/users already has role/isActive filters but lacks search and admin fields
- Tickets API at /api/tickets already supports search, pagination, and basic filters
- TV mode page lives under (public) route group for no-auth access
- Admin layout is transparent pass-through; role guard is in middleware
- Notification system: `lib/notifications.ts` has `getNotificationTargets()` (role-based targeting) + `createAndEmitNotifications()` (individual create + SSE emit with real DB IDs)
- PITFALL: Prisma `createMany()` with SQLite does NOT return inserted IDs. Always use individual `create()` when IDs are needed downstream.
- SSE route filters events by userId for `notification:new` — any new per-user event types need the same filter
- Sound alerts use Web Audio API oscillator tones (no audio files); mute stored in localStorage
- SSE context uses pub/sub pattern via React context; components subscribe via `useSSEContext().subscribe()`
- Notification center already plays sounds on `notification:new` events based on type-to-tone mapping
- Ticket creation and assignment APIs already call notification functions fire-and-forget style
- Backend assign endpoint allows QA role, but frontend TicketActions component historically excluded QA from assignment UI
- When adding new role capabilities to UI, check BOTH the component role guards AND the server component data fetching (e.g., developer list)

## Notification Config Architecture
- Notification preferences have two layers: role-level gate (RoleNotificationConfig) and user-level toggle (User.notifyTickets / notifyBugs)
- Role config controls: notifyOnCreation (gate for TICKET_CREATED/BUG_CREATED targeting) and notifyOnAssignment (gate for TICKET_ASSIGNED targeting)
- Both layers must be enabled for creation notifications; assignment only checks role layer
- Admin UI at /admin/notifications has two sections: role config table + per-user routing table
- Per-user routing table should dynamically show users from roles where notifyOnCreation is enabled

## Multitenancy Refactor Insights
- Row-level isolation (organizationId FK) is the correct pattern for SQLite; schema-per-tenant is not supported
- AsyncLocalStorage + Prisma Client Extension is the standard pattern for per-request tenant scoping in Next.js
- Not all models need direct organizationId: child models (BugReport, TicketEvent, ReorderRequest) inherit scope through parent relations
- Singleton configs (CheckpointConfig, TvConfig) must become per-org records
- Email uniqueness must change from global to per-org to allow same person in multiple orgs
- Public ticket IDs should remain globally unique to avoid confusion across support channels
- Two-step migration (nullable -> backfill -> non-nullable) is safer for existing data
- Super admin should be a boolean flag, not a role, to avoid polluting the tenant-scoped Role enum
- TV mode (public route, no auth) needs org slug as a URL parameter for tenant scoping

## Docker / Build Pitfalls
- PITFALL: `--packages=external` in esbuild keeps all imports as runtime requires. If a dependency is pruned (npm prune --omit=dev), the bundled CJS file fails at runtime.
- Production seed scripts should NOT import `dotenv/config` -- Docker provides env vars via docker-compose. `dotenv` is a dev convenience only.
- The Dockerfile uses a 3-stage build: deps (npm ci) -> builder (build + esbuild + prune) -> runner (standalone output). Only production deps survive into the runner.

## Context System
- Master context at ai-driven-project/master-context.md
- Context files follow strict format with IDs (CTX-CATEGORY-NNN)
- After implementation, context files should be updated (especially CTX-FEAT-002, CTX-FEAT-004, CTX-INFRA-003, CTX-CORE-002)
