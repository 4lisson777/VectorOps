# Backend Task: Fix Four Runtime Bugs

## Description
Fix four runtime bugs affecting the ShinobiOps application. These are all backend/fullstack issues that do not require new UI components -- they are logic fixes in existing files.

## Acceptance Criteria
- [ ] Bug 1: No more TypeError when `session.name` is undefined in app-shell.tsx
- [ ] Bug 2: Browser no longer shows "Manifest: Line: 1, column: 1, Syntax error" in the console
- [ ] Bug 3: GET /api/tv/data no longer returns 400 when accessed without `?org=` parameter from the TV page
- [ ] Bug 4: POST /api/tickets successfully creates a ticket with the correct organizationId

## Bug Details and Root Causes

### Bug 1: TypeError on `session.name.split()` in app-shell.tsx

**File:** `apps/web/components/layout/app-shell.tsx` (line 32)

**Root Cause:** `session.name` can be `undefined` when the iron-session cookie exists but the `name` field was never populated (e.g., stale session from before the multitenancy refactor, or a session created by an auth flow that did not set the name). The code calls `session.name.split(" ")` without a guard.

**Fix:** Add a defensive fallback so that if `session.name` is falsy, use an empty string or a fallback like "?" for the initials. The `userInitials` computation on lines 32-38 should guard against undefined name:
```
(session.name ?? "")
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map((w) => w[0])
  .join("")
  .toUpperCase() || "?"
```

Also pass `session.name ?? ""` instead of raw `session.name` to the Sidebar's `userName` prop.

### Bug 2: site.webmanifest syntax error in browser

**File:** `apps/web/app/layout.tsx` (line 65-67)

**Root Cause:** The manifest file itself (`apps/web/public/site.webmanifest`) is valid JSON. The problem is that Next.js metadata API does not support declaring the web manifest via `icons.other` with `rel: "manifest"`. When placed under the `icons` property, Next.js processes the URL through its icon pipeline, which may alter content type or wrap the response. The correct approach is to use the dedicated `manifest` property on the metadata object.

**Fix:** Remove the manifest from `icons.other` and add it as a top-level `manifest` property on the metadata export:
- Remove lines 65-67 (`other: [{ rel: "manifest", url: "/site.webmanifest" }]`)
- Add `manifest: "/site.webmanifest"` as a top-level property of the metadata object (same level as `title`, `description`, etc.)

### Bug 3: /api/tv/data returns 400 (Bad Request)

**File:** `apps/web/app/api/tv/data/route.ts` (lines 17-24) and `apps/web/components/tv/tv-board.tsx` (lines 242-244)

**Root Cause:** The API endpoint requires `?org=SLUG` and returns 400 when it is missing. The TvBoard component only passes the slug when `orgSlug` is provided via props. The TV page (`apps/web/app/(public)/dev/tv/page.tsx`) passes `orgSlug` from the URL query parameter `?org=...`. When a user navigates to `/dev/tv` without specifying `?org=...`, the component fetches `/api/tv/data` without the parameter, triggering the 400.

**Fix options (choose one):**

Option A (recommended): In `tv-board.tsx`, when no `orgSlug` is provided, show a user-friendly message asking the user to provide an org parameter, instead of making a doomed fetch call. This is the cleanest fix because the TV mode by design is public and needs to know which organization to display.

Option B: In the API endpoint, if no `org` parameter is provided, fall back to a default organization or return the first active one. This is less explicit but works for single-org deployments.

Recommendation: Go with Option A. In the TvBoard component, add an early return before the fetch effect when `orgSlug` is not provided, showing a message like "Informe o parametro ?org=SLUG na URL para visualizar o painel."

### Bug 4: Ticket creation missing organization relation (Prisma error)

**File:** `apps/web/app/api/tickets/route.ts` (lines 137-158)

**Root Cause:** The ticket creation uses `tenantDb.$transaction(async (tx) => ...)` -- an interactive Prisma transaction. The `tx` object inside an interactive transaction is a raw `PrismaClient` transaction, NOT the extended client. Prisma Client Extensions (like the one created by `getTenantDb()`) do NOT propagate their query hooks into interactive transactions. Therefore, the `tx.ticket.create()` call never receives the `organizationId` injection that the tenant-db extension would normally provide.

**Fix:** Inside the transaction callback, manually inject `organizationId` from the session into the `data` object for the `ticket.create()` call. The session is already available (passed by `requireTenantRole`). Remove the `as any` cast and the misleading comment about auto-injection.

Specifically, change the `tx.ticket.create({ data: { ... } })` call to include:
```
organizationId: session.organizationId
```

as an explicit field in the data object. Since the session is available from the `requireTenantRole` closure, this is straightforward.

Also audit the rest of the POST handler for other `tx.*` calls that may be affected:
- `tx.bugReport.create()` -- BugReport does NOT have organizationId in the schema (it inherits scope through ticketId), so this is fine.
- `tx.ticketEvent.create()` -- TicketEvent also does NOT have organizationId (inherits through ticketId), so this is fine.
- The `generatePublicId(ticketType, tx)` call uses `tx.ticket.findFirst()` which also does not get the extension hook. This means `generatePublicId` searches across ALL organizations' tickets, not just the current one. This is actually ACCEPTABLE because `publicId` is globally unique by design (see long-term memory: "Public ticket IDs should remain globally unique to avoid confusion across support channels"). No fix needed here.
- `calculatePriorityOrder(data.severity, tx)` similarly operates cross-tenant but priority ordering should also be global or at least the ID generation logic is safe. Check whether the priority order computation scopes by org -- if it does not, that may be a separate issue to track but is not the reported bug.

## Files to Modify

1. `apps/web/components/layout/app-shell.tsx` -- guard against undefined session.name
2. `apps/web/app/layout.tsx` -- move manifest from icons.other to top-level manifest property
3. `apps/web/components/tv/tv-board.tsx` -- handle missing orgSlug gracefully
4. `apps/web/app/api/tickets/route.ts` -- add explicit organizationId to ticket creation data

## Rules to Follow
- Keep fixes minimal and targeted -- do not refactor unrelated code
- Maintain TypeScript strict mode compliance
- Use defensive programming (guard against null/undefined)
- Keep UI text in PT-BR
- Do not change the Prisma schema
- Do not add new dependencies

## Communication File
N/A (single-agent task)
