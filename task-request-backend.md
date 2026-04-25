# Backend Task — Phase 1 Production Readiness

## Branch
`claude/design-system-updates-7qFGz`

## Overview
Implement four backend tasks to make VectorOps production-ready. All work goes in `apps/web/`.

---

## P1.1 — Bug API Endpoints

The bug form at `/support/bug/new` currently submits to void. `POST /api/tickets` already creates bugs (when `affectedModule` is present it creates a BugReport record). The `/api/bugs` stubs need to be real endpoints that mirror the ticket API but scoped to `type = "BUG"` and with ClickUp export.

### Files to implement

**`apps/web/app/api/bugs/route.ts`**

```
GET  /api/bugs   — list bug reports (same filter params as GET /api/tickets but type forced to BUG)
POST /api/bugs   — create a bug report (delegates to the same transaction as POST /api/tickets does for bugs)
```

For GET: copy the filter logic from `apps/web/app/api/tickets/route.ts` GET handler, force `where.type = "BUG"`, include `bugReport: true` always.

For POST: use `requireTenantRole("SUPPORT_MEMBER", "SUPPORT_LEAD", "QA")`. Validate with `bugCreateSchema` from `apps/web/lib/schemas/ticket-schemas.ts`. Call the same creation logic as `POST /api/tickets` (generate publicId with type "BUG", calculate priorityOrder, create Ticket + BugReport in a transaction, create CREATED TicketEvent, emit `ticket:created` SSE event with `type: "BUG"`, fire notifications).

**`apps/web/app/api/bugs/[id]/route.ts`**

```
GET    /api/bugs/[id]  — fetch bug by id or publicId (BUG-XXXX)
PATCH  /api/bugs/[id]  — update status/severity/deadline (same rules as PATCH /api/tickets/[id])
DELETE /api/bugs/[id]  — cancel a bug (sets status to CANCELLED, only if OPEN or IN_PROGRESS)
```

GET: copy from `apps/web/app/api/tickets/[id]/route.ts` GET, always include `bugReport: true`. Return 404 if ticket not found or `ticket.type !== "BUG"`.

PATCH: copy from `apps/web/app/api/tickets/[id]/route.ts` PATCH. Same status transition rules (`ALLOWED_TRANSITIONS`), same role checks (status changes: DEVELOPER/TECH_LEAD/QA; severity/deadline: TECH_LEAD/QA only).

DELETE: `requireTenantRole("SUPPORT_MEMBER", "SUPPORT_LEAD", "TECH_LEAD", "QA")`. Only allowed when `status === "OPEN"`. Set `status = "CANCELLED"`, create CANCELLED TicketEvent, emit `ticket:cancelled` SSE event.

**`apps/web/app/api/bugs/[id]/clickup-export/route.ts`**

```
GET /api/bugs/[id]/clickup-export  — returns markdown string for ClickUp
```

`requireTenantAuth`. Fetch the ticket + bugReport. Return a JSON object with a `markdown` string field formatted as:

```markdown
## [BUG-XXXX] {title}

**Severidade:** {severity}  
**Ambiente:** {environment}  
**Módulo Afetado:** {affectedModule}  
**Cliente:** {customerId or "N/A"}  
**Prazo:** {deadline formatted as dd/MM/yyyy}  
**Reportado por:** {openedBy.name}

### Passos para Reproduzir
{stepsToReproduce}

### Comportamento Esperado
{expectedBehavior}

### Comportamento Atual
{actualBehavior}
```

---

## P1.3 — Session Secret Hardening

**`apps/web/lib/session.ts`** — line 22:
```typescript
// BEFORE:
password: process.env.SESSION_SECRET ?? "fallback-dev-secret-min-32-chars!!",

// AFTER:
password: (() => {
  const secret = process.env.SESSION_SECRET
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production")
  }
  return secret ?? "fallback-dev-secret-min-32-chars!!"
})(),
```

**`apps/web/middleware.ts`** — line 67 (inside `readSessionFromRequest`):
```typescript
// BEFORE:
const password = process.env.SESSION_SECRET ?? "fallback-dev-secret-min-32-chars!!"

// AFTER:
const password = process.env.SESSION_SECRET ?? "fallback-dev-secret-min-32-chars!!"
// (keep unchanged — middleware runs at edge, cannot throw; the session.ts IIFE covers production)
```

**`apps/web/lib/env.ts`** — add length validation to SESSION_SECRET check:
```typescript
// After the existing null check for SESSION_SECRET, add:
const secret = process.env.SESSION_SECRET
if (secret && secret.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters long.")
}
```

---

## P1.4 — CSRF Protection

Add Origin/Host validation to the middleware for all state-changing API requests.

**`apps/web/middleware.ts`** — add CSRF check before the public path guard:

```typescript
// At the top of the middleware function, before isPublicPath check:
// CSRF: for mutation methods on API routes, validate Origin matches the Host
const method = request.method
if (
  ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
  pathname.startsWith("/api/") &&
  !isPublicPath(pathname)
) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  if (origin && host) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }
  // If Origin header is absent (same-origin server-side calls), allow through
}
```

The CSRF check should be placed after the public path check (public mutation endpoints like register/login are exempt).

Actually: insert the CSRF check AFTER `if (isPublicPath(pathname)) return NextResponse.next()`.

---

## P1.5 — `users/[id]` API

**`apps/web/app/api/users/[id]/route.ts`**

```
GET   /api/users/[id]   — fetch any user's profile (TECH_LEAD or self)
PATCH /api/users/[id]   — update user fields (TECH_LEAD for role/isActive/password-reset; self for name/avatar/ninjaAlias)
```

**GET handler** — `requireTenantAuth`:
- Fetch user by id from tenantDb.user.findUnique
- Select: id, name, email, role, avatarUrl, ninjaAlias, isActive, devStatus, currentTask, notifyTickets, notifyBugs, soundEnabled, createdAt, updatedAt
- If calling user is not TECH_LEAD and `session.userId !== id`, return 403
- If user not found, return 404

**PATCH handler** — `requireTenantAuth`:

Validation schema:
```typescript
const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  ninjaAlias: z.string().min(1).max(50).optional(),
  role: z.enum(["TECH_LEAD","DEVELOPER","SUPPORT_LEAD","SUPPORT_MEMBER","QA"]).optional(),
  isActive: z.boolean().optional(),
  newPassword: z.string().min(8).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
})
```

Rules:
- `role` and `isActive` changes: TECH_LEAD only
- `newPassword` when called by TECH_LEAD (admin reset): set directly (hash with bcrypt, cost 12)
- `name`, `ninjaAlias`, `avatarUrl`: TECH_LEAD or self
- If caller is not TECH_LEAD and `session.userId !== id`: 403

Import bcrypt from wherever it's used in the codebase (check `apps/web/app/api/auth/register/route.ts` for the import pattern).

After updating, if `role` was changed, emit a `developer:status_changed` SSE event so the Ninja Board updates in real-time (or simply — emit it if the user is a developer and any field changed).

---

## Implementation Notes

- Always use `requireTenantRole` or `requireTenantAuth` from `apps/web/lib/auth.ts` — never access session directly
- Always use `getTenantDb()` from `apps/web/lib/tenant-db.ts` — never import `db` directly
- Use `emitShinobiEvent` from `apps/web/lib/sse-emitter.ts` for real-time events
- The `organizationId` is injected automatically by the tenant-db Prisma extension — do NOT pass it manually in `data` objects (use `as any` cast as existing routes do)
- Type imports come from `@/generated/prisma/client`
- Error responses follow pattern: `NextResponse.json({ error: "..." }, { status: NNN })`

## After Implementation

Run: `git add -A && git commit -m "feat(phase-1-backend): Bug API, users/[id], CSRF, session hardening" && git push -u origin claude/design-system-updates-7qFGz`
