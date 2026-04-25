# Backend Task — Phase 2 Production Hardening

## Branch
`claude/phase-2-hardening`

## Overview
Five hardening tasks. All work in `apps/web/`. No new npm packages needed — structured logging uses Node.js built-ins only (npm registry is blocked in this environment).

---

## P2.1 — Database Indexes

**File:** `apps/web/prisma/schema.prisma`

The following models need compound indexes for the queries that run most often. Add the `@@index` directives, then run `npx prisma migrate dev --name add_performance_indexes` from `apps/web/`.

### Ticket model — after the last `@@map`:
```prisma
@@index([organizationId, status])
@@index([organizationId, priorityOrder])
@@index([organizationId, severity])
@@index([organizationId, createdAt])
```

### User model — after the existing `@@unique([organizationId, email])`:
```prisma
@@index([organizationId, isActive])
@@index([organizationId, role])
```

### TicketEvent model — after `@@map("ticket_events")`:
```prisma
@@index([ticketId, createdAt])
```

### ReorderRequest model — after `@@map("reorder_requests")`:
```prisma
@@index([ticketId, status])
```

To run the migration:
```bash
cd apps/web && npx prisma migrate dev --name add_performance_indexes
```

---

## P2.2 — Input Validation Hardening

**File:** `apps/web/lib/schemas/ticket-schemas.ts`

Current fields have no upper bounds. Add:

```typescript
export const ticketCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),          // was max(120), keep reasonable
  description: z.string().min(1, "Description is required").max(5000),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  deadline: z.string().datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be ISO date or datetime")),
})

export const bugCreateSchema = ticketCreateSchema.extend({
  affectedModule: z.string().min(1).max(200),
  stepsToReproduce: z.string().min(1).max(5000),
  expectedBehavior: z.string().min(1).max(2000),
  actualBehavior: z.string().min(1).max(2000),
  environment: z.enum(["PRODUCTION", "STAGING", "OTHER"]),
  customerId: z.string().max(100).optional(),
})

export const ticketUpdateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "WAITING_FOR_INFO", "DONE", "CANCELLED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  deadline: z.string().optional(),
}).refine(...)  // keep existing refine
```

Also update `apps/web/app/api/reorder-requests/route.ts` createSchema:
```typescript
reason: z.string().max(500).optional(),  // already has this — verify
```

Also update `apps/web/app/api/checkpoints/route.ts` createSchema:
```typescript
currentTask: z.string().min(1).max(500),   // already has this — verify
notes: z.string().max(1000).optional(),    // already has this — verify
```

And the war room API at `apps/web/app/api/war-room/route.ts`:
```typescript
title: z.string().min(1).max(100).default("War Room"),   // already has this
message: z.string().max(300).nullish(),                   // already has this
```

Verify the schemas are consistent, add `.max()` wherever missing.

---

## P2.3 — Structured Logging (Zero-dependency)

npm registry is blocked — do NOT attempt to install pino or any external logger. Instead, implement a zero-dependency structured JSON logger.

### Create `apps/web/lib/logger.ts`:

```typescript
type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  time: string
  msg: string
  [key: string]: unknown
}

function write(level: LogLevel, msg: string, extra?: Record<string, unknown>): void {
  const entry: LogEntry = { level, time: new Date().toISOString(), msg, ...extra }
  // errors and warnings go to stderr; info/debug to stdout
  if (level === "error" || level === "warn") {
    process.stderr.write(JSON.stringify(entry) + "\n")
  } else {
    process.stdout.write(JSON.stringify(entry) + "\n")
  }
}

export const logger = {
  info:  (msg: string, extra?: Record<string, unknown>) => write("info",  msg, extra),
  warn:  (msg: string, extra?: Record<string, unknown>) => write("warn",  msg, extra),
  error: (msg: string, extra?: Record<string, unknown>) => write("error", msg, extra),
  debug: (msg: string, extra?: Record<string, unknown>) => write("debug", msg, extra),
}
```

This produces NDJSON (newline-delimited JSON) — compatible with Loki, Datadog, Splunk, CloudWatch, and any stdout-scraping log aggregator.

### Replace `console.error` / `console.warn` in API routes:

Go through these files and replace `console.error` / `console.warn` with `logger.error` / `logger.warn`:

- `apps/web/app/api/bugs/route.ts` — `.catch(console.error)` → `.catch((err: unknown) => logger.error("Bug notification failed", { error: String(err) }))`
- `apps/web/app/api/bugs/[id]/route.ts` — same pattern
- `apps/web/app/api/tickets/route.ts` — same
- `apps/web/app/api/tickets/[id]/route.ts` — same
- `apps/web/app/api/tickets/[id]/assign/route.ts` — same
- `apps/web/app/api/help-requests/route.ts` — same
- `apps/web/app/api/help-requests/[id]/respond/route.ts` — same
- `apps/web/app/api/reorder-requests/[id]/route.ts` — same
- `apps/web/app/api/super-admin/impersonate/route.ts` — `console.warn(...)` → `logger.warn(...)`
- `apps/web/app/api/super-admin/stop-impersonating/route.ts` — same
- `apps/web/app/error.tsx` — `console.error("[VectorOps] Unhandled error:", error)` → `logger.error("Unhandled client error", { error: String(error) })`

### Add request logging to middleware:

In `apps/web/middleware.ts`, at the start of the `middleware` function, add a minimal request log **only in development** (avoid log noise in production for every static asset request — the matcher already filters those):

```typescript
// Log all matched requests in development for debugging
if (process.env.NODE_ENV !== "production") {
  // lightweight inline log — do NOT import logger here (middleware runs at edge runtime)
  // Edge runtime cannot use process.stdout.write; use console.log which works in both
  console.log(JSON.stringify({ level: "info", time: new Date().toISOString(), msg: "request", method: request.method, path: pathname }))
}
```

**Important:** Middleware runs in the Edge runtime. `process.stdout.write` is NOT available there. Use `console.log` with JSON string in middleware only. Use `logger` (which uses `process.stdout.write`) in API route handlers (Node.js runtime).

---

## P2.4 — QA Role Clarification

QA is well-integrated across the codebase (29 API files, middleware, schema). The decision: **keep QA** as a first-class role.

### Define QA permissions clearly in `apps/web/middleware.ts`:

Add a comment block above ROLE_GUARDS defining the role permissions matrix:

```typescript
// Role → permitted top-level sections:
//   TECH_LEAD    — /admin (full), /dev, /support
//   QA           — /admin (read-only stats), /dev (board + queue), /support (read-only)
//   DEVELOPER    — /dev
//   SUPPORT_LEAD — /support (full)
//   SUPPORT_MEMBER — /support (create tickets/bugs, my items)
```

### Update `apps/web/components/admin/team-management.tsx`:

In the ROLE_LABELS map, QA is already present. Verify it's `QA: "QA"` and the select dropdown in the invite form includes QA as an option.

Check `apps/web/components/admin/invite-management.tsx` — the role select for new invites. Make sure `QA` appears as an option alongside the other roles.

### Add QA to `apps/web/lib/schemas/` if any schema mistakenly excludes it:

Search for role enums in schemas and ensure QA is included wherever DEVELOPER or SUPPORT_LEAD appear.

---

## P2.5 — Deadline Timezone

**Assessment:** Already correct. `new Date(ticket.deadline).toLocaleDateString("pt-BR", ...)` in `components/tickets/ticket-card.tsx` uses the browser's local timezone by default. SQLite/Prisma stores UTC. No changes required for correctness.

**Enhancement:** Centralize the deadline formatting into a shared utility to prevent future drift.

### Create `apps/web/lib/format-date.ts`:

```typescript
/**
 * Formats a deadline Date or ISO string for display.
 * Uses the browser/process locale timezone (UTC on server, local on client).
 */
export function formatDeadline(date: Date | string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Returns true when the given deadline is in the past.
 */
export function isPastDeadline(date: Date | string): boolean {
  return new Date(date) < new Date()
}
```

### Replace inline date formatting in components:

**`apps/web/components/tickets/ticket-card.tsx`** (line ~135):
```tsx
// Before:
{new Date(ticket.deadline).toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" })}

// After:
{formatDeadline(ticket.deadline)}
```

And the `isPastDue` boolean (line ~63):
```tsx
// Before:
new Date(ticket.deadline) < new Date()

// After:
isPastDeadline(ticket.deadline)
```

Check for any other deadline display locations in `apps/web/components/` and apply the same utility.

---

## Implementation Notes

- All work is in `apps/web/`
- For Prisma migration: `cd apps/web && npx prisma migrate dev --name add_performance_indexes`
- The `logger` module uses `process.stdout/stderr.write` — only valid in Node.js runtime (API routes, server components). In middleware (Edge runtime), use `console.log` with JSON string directly.
- Do NOT import `logger` in `middleware.ts` — it runs at Edge runtime.
- Do NOT attempt to `npm install` anything — the registry is blocked.

## After Implementation

```bash
git add -A
git commit -m "feat(phase-2): DB indexes, input validation, structured logging, QA role, deadline utils"
git push -u origin claude/phase-2-hardening
```
