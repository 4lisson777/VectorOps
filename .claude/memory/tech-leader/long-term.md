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

## Prisma Config / Docker Build Coupling
- PITFALL: `prisma.config.ts` using `env("DB_URL")` from `prisma/config` is EAGER -- it throws at config-load time even for `prisma generate`, which doesn't actually need a DB URL. This couples codegen to runtime credentials.
- Fix: use `process.env.DB_URL ?? "<placeholder>"` directly in `datasource.url`. Generate works with placeholder; migrations require the real value at runtime.
- `apps/web/lib/db.ts` does NOT consume `DB_URL`. It uses `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` directly via `PrismaMariaDb`. `DB_URL` is purely a Prisma CLI / migration concern.
- PITFALL: docker-compose `build.args` interpolate ONLY from compose-time env (shell or top-level `.env` at compose project root). Service-level `env_file:` is loaded into the running container, NOT into compose's variable interpolation context. Don't try to drive build args from `apps/web/.env`.
- Cleanest pattern: keep all DB env in `apps/web/.env` and inject via `env_file:`. Don't duplicate into `environment:` blocks.

## Docker / Build Pitfalls
- PITFALL: `--packages=external` in esbuild keeps all imports as runtime requires. If a dependency is pruned (npm prune --omit=dev), the bundled CJS file fails at runtime.
- PITFALL: esbuild ESM output doesn't define `require()`. CJS modules bundled into ESM that use `require("crypto")` fail silently. Fix: add banner `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);`
- PITFALL: Next.js standalone output includes its own minimal node_modules (~79MB). Copying the full workspace node_modules (~835MB) on top wastes 750MB. Use standalone node_modules for runtime, isolate additional tools (e.g., Prisma CLI) in separate directories.
- PITFALL: Prisma CLI has deep transitive deps (~82 packages). Cherry-picking is fragile. Better to npm install in an isolated /prisma-cli directory.
- Production seed scripts should NOT import `dotenv/config` -- Docker provides env vars via docker-compose. `dotenv` is a dev convenience only.
- The Dockerfile uses a 4-stage build: pruner (turbo prune) -> deps (npm ci) -> builder (build + esbuild + prisma-cli install) -> runner (standalone output + isolated prisma CLI).
- `turbo prune web --docker` produces /json (manifests only, for dep caching) and /full (source files). This ensures only web's transitive deps are installed.
- Alpine (node:22-alpine) is used; no native addon compilation needed for mariadb (pure JS driver).
- PITFALL: When migrating from SQLite to MySQL, Next.js standalone output caches old deps. Must add `serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"]` to next.config.mjs and do a clean rebuild.
- PITFALL: Next.js standalone output traces imports to determine node_modules to include. DB adapters/drivers that are loaded at runtime via Prisma may not be auto-detected. Always list them in `serverExternalPackages`.
- Old note (obsolete): Alpine worked with better-sqlite3; needed `apk add python3 make g++` in deps stage -- no longer applies after MySQL migration.
- No `openssl` package needed on Alpine -- Node.js Alpine images include built-in OpenSSL.
- Docs (fumadocs-mdx) app build currently broken in Docker -- `.source` generation fails. Build only `--filter=web` until fixed.
- TypeScript appears in pruned node_modules because Prisma and valibot declare it as a peer dependency. Not a devDep leak.
- HEALTHCHECK directive in Dockerfile provides default health checks; docker-compose healthcheck overrides it when using compose. Avoid duplicating in both files.
- NODE_PATH=/prisma-cli/node_modules is needed when running prisma migrate deploy so prisma.config.ts can resolve `import from "prisma/config"`.
- Prisma CLI version in /prisma-cli is dynamically extracted from the installed package to stay in sync with package.json.

## Prisma Extension Pitfalls
- PITFALL: Prisma Client Extensions ($extends) do NOT propagate query hooks into interactive transactions ($transaction(async (tx) => ...)). The `tx` object is a raw PrismaClient transaction, not the extended one. Any tenant-scoped creation inside interactive transactions must manually inject organizationId.
- This affects all API routes that use getTenantDb().$transaction(async (tx) => { tx.model.create(...) }) -- the create hook that auto-injects organizationId is skipped.
- Child models without organizationId (BugReport, TicketEvent, ReorderRequest) are fine since they link via parent FK.
- generatePublicId() operating cross-tenant inside tx is acceptable because publicIds are globally unique by design.

## Context System
- Master context at ai-driven-project/master-context.md
- Context files follow strict format with IDs (CTX-CATEGORY-NNN)
- After implementation, context files should be updated (especially CTX-FEAT-002, CTX-FEAT-004, CTX-INFRA-003, CTX-CORE-002)

## Prisma + Proxy Singleton Pitfall (CRITICAL)
- PITFALL: `lib/db.ts` originally used `globalThis.__prisma` cache only in dev; production fell through to `return createPrismaClient()` on every call. Combined with a `Proxy` whose `get` handler calls `getDb()` on every property read, every `db.user.findMany(...)` call leaked a fresh `PrismaClient` AND a fresh `mariadb.createPool({connectionLimit: 8})`.
- Symptom: MySQL `max_connections` (default 151) exhausts within ~18 unique queries. Adapter then reports `pool timeout: failed to retrieve a connection from pool after 10000ms (pool connections: active=0 idle=0 limit=8)`. The pool reports `active=0 idle=0` because the *new* pool can't establish connections (server is full), not because the pool was sized wrong.
- Direct connection test surfaces the actual server-side error: `(no: 1040, SQLState: 08004) Too many connections`.
- Fix: cache the client in a module-level `let prismaInstance` for prod, keep `globalThis.__prisma` for dev-HMR only. The Proxy is fine to keep -- it defers client creation past `next build`'s import-time, but the cache must be a true singleton.
- Diagnostic queries to remember:
  - `mysql -e "SHOW STATUS LIKE 'Threads_connected'"`
  - `mysql -e "SHOW VARIABLES LIKE 'max_connections'"`
  - `mysql -e "SELECT user,count(*) FROM information_schema.PROCESSLIST GROUP BY user"`

## SSR Crash Diagnosis Pattern
- A minified server error like `TypeError: ... at <unknown> (.next/server/chunks/ssr/[root-of-the-server]__HASH._.js:1:OFFSET)` can be located by `head -c (OFFSET+10) | tail -c 60` on the chunk file inside the running container -- the offset points at the exact JS expression. Useful for finding which component crashed when sourcemaps are unavailable in prod.
- Defensive components: any component that does `prop.length` / `prop.split` / `prop.trim` should accept `string | null | undefined` and short-circuit on falsy. UserAvatar, in particular, is rendered server-side from session data which can be partial after migrations.

## API Integration Tests Pattern
- Test runner at `apps/web/tests/run-all.mjs` runs suites sequentially via `execSync`
- 8 "new" suites import from shared harness (`tests/_shared/test-harness.mjs`) which has `loginAs()` with retry-on-429 logic (12 retries, 5s delay)
- 5 "legacy" suites define their own inline `login()`, `getJson()`, etc. WITHOUT retry logic
- All tests share a single rate-limit bucket (IP: "unknown" or "127.0.0.1") -- be careful with login rate limits
- PITFALL: Legacy tests reference hard-coded emails that may not match the seed. Always cross-reference `prisma/seed.ts` SEED_EMAILS before writing tests.
- Seed orgs: VectorOps (slug: "vectorops"), Test Company (slug: "test-company"). NEVER "inovar-sistemas".
- Seed TECH_LEAD+SUPER_ADMIN: `alisson@vector.ops` (NOT `alisson.lima@vectorops.dev`)
- Rate limit for login: 5/min is too low for sequential test suites. Increase to 30/min or add retry logic to test clients.
- PITFALL: VectorOps org accumulates 1000+ tickets from repeated test runs. Tests that create tickets and look for them in a paginated list MUST sort by `createdAt desc` (or filter by ID) to avoid missing newly-created tickets that land beyond page 1 when sorted by default `priorityOrder asc`.
- Super-admin organization list endpoint has a separate Zod schema with `limit.max(100)`. Tests that need to list all orgs must either stay within this limit or the max should be raised. Super-admin endpoints deal with small datasets (orgs) so higher limits (500) are safe.
- PITFALL: Notifications accumulate unboundedly across test runs. GET /api/notifications has max(50) limit. Tests that compare `.notifications.length` before/after creating a notification FAIL when users have 50+ notifications because `min(N, 50) == min(N+1, 50) == 50`. Fix: add auto-cleanup to GET endpoint (threshold=50, retain latest 30). This ensures tests see actual count changes.
- PITFALL (refinement): The cleanup threshold (MAX_NOTIFICATIONS) MUST be <= the API response limit (currently 50). Setting MAX_NOTIFICATIONS=100 means cleanup only fires at >100, but users with 50-100 notifications still saturate the limit=50 response. Correct values: MAX_NOTIFICATIONS=50, KEEP_NOTIFICATIONS=30.
- The notification creation logic (lib/notifications.ts), fire-and-forget patterns in ticket routes, and role-notification-config PATCH/GET are all correct. Only the GET /api/notifications route needed the cleanup addition.

## Documentation
- Deployment guide created at `docs/DEPLOYMENT.md` -- comprehensive DevOps reference covering Docker Compose, env vars, migrations, backups, health checks, reverse proxy (SSE-aware nginx config), troubleshooting
- Two .env files pattern: root `.env` for Docker Compose build-time interpolation, `apps/web/.env` for container runtime env (injected via `env_file:`)
- Critical reverse proxy note: nginx must have `proxy_buffering off` and `proxy_cache off` for SSE to work
