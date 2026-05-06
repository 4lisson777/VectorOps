# Post-Mortem: Missing `organizationId` in Prisma Create Operations

**Date:** 2026-04-27
**Severity:** High — affected all bug creation, help requests, checkpoints, notifications, and config defaults
**Detection:** E2E API integration test suite (first full run)
**Resolution:** Explicit `organizationId` injection in all affected routes

---

## Summary

9 files across the codebase contained a bug where `organizationId` was not provided when creating records in multi-tenant-scoped models. This caused **500 Internal Server Error** on every affected endpoint. The root cause was a false assumption that the tenant-db Prisma extension would auto-inject `organizationId` in all contexts — it does not inside `$transaction` callbacks, and Prisma 7.x enforces relation fields more strictly than earlier versions.

---

## Root Cause

### How multi-tenancy works in ShinobiOps

`getTenantDb()` returns a Prisma client extended with query hooks that intercept operations like `create`, `findMany`, etc., and inject `organizationId` from the AsyncLocalStorage tenant context. This works for direct calls:

```ts
// This works — the extension intercepts the create call
const tenantDb = getTenantDb()
await tenantDb.notification.create({ data: { userId, type, title } })
```

### Where it breaks

**1. Inside `$transaction` interactive callbacks**

When using `tenantDb.$transaction(async (tx) => { ... })`, the `tx` parameter is a raw `PrismaClient` that does NOT carry the extension's query hooks. Any `tx.model.create()` call bypasses the tenant injection entirely:

```ts
// BUG: tx is a raw client — no organizationId injection
await tenantDb.$transaction(async (tx) => {
  await tx.ticket.create({ data: { title, openedById } }) // 500: organization is missing
})
```

**2. Prisma 7.x relation enforcement**

Even for direct `tenantDb.model.create()` calls (outside transactions), Prisma 7.x enforces that relation fields are set through the relation API (`organization: { connect: { id } }`) rather than the scalar foreign key (`organizationId`). The extension sets `args.data.organizationId` as a flat scalar, which Prisma 7.x rejects with "Argument `organization` is missing."

### The `as any` mask

Every affected file used `as any` casts on the `data` object to suppress TypeScript errors about the missing `organizationId` field, with comments like:

```ts
// organizationId is injected by the tenant-db Prisma extension
// eslint-disable-next-line @typescript-eslint/no-explicit-any
data: { userId, contextMessage } as any,
```

This hid both the TypeScript error AND the runtime failure. The `as any` cast was load-bearing — removing it would have surfaced the missing field at compile time.

---

## Impact

| Endpoint | HTTP | Effect |
|----------|------|--------|
| POST /api/bugs | POST | Bug creation returned 500 |
| POST /api/help-requests | POST | Help request creation returned 500 |
| POST /api/help-requests/[id]/respond | POST | Help request response returned 500 |
| POST /api/checkpoints | POST | Checkpoint creation returned 500 |
| GET /api/checkpoints/config | GET | Default config auto-creation returned 500 (first access per org) |
| GET /api/admin/checkpoints/config | GET | Same |
| GET /api/admin/tv-config | GET | Default TV config auto-creation returned 500 (first access per org) |
| GET /api/admin/role-notification-config | GET | Missing role configs auto-creation returned 500 |
| PATCH /api/admin/role-notification-config | PATCH | Upsert create path returned 500 |
| Notification creation (lib/notifications.ts) | Internal | All fire-and-forget notifications silently failed |

The `/api/tickets` route was NOT affected because it already had `organizationId: session.organizationId` set explicitly.

---

## Fix

Every affected location was fixed the same way — add `organizationId` explicitly to the `data` object:

```ts
// Before (broken)
await tx.checkpoint.create({
  data: { userId, currentTask, isBlocked } as any,
})

// After (fixed)
await tx.checkpoint.create({
  data: { userId, currentTask, isBlocked, organizationId: session.organizationId },
})
```

For standalone functions without access to `session` (like `getOrCreateConfig()`), `getTenantId()` from the tenant context was used instead:

```ts
import { getTenantId } from "@/lib/tenant-context"
await tenantDb.checkpointConfig.create({ data: { organizationId: getTenantId() } })
```

### Files changed

| File | Change |
|------|--------|
| `app/api/bugs/route.ts` | Added `organizationId: session.organizationId` in `$transaction` |
| `app/api/help-requests/route.ts` | Added `organizationId: session.organizationId` to create |
| `app/api/help-requests/[id]/respond/route.ts` | Added `organizationId: session.organizationId` in `$transaction` |
| `app/api/checkpoints/route.ts` | Added `organizationId: session.organizationId` in `$transaction` |
| `app/api/checkpoints/config/route.ts` | Added `organizationId: getTenantId()` to default creation |
| `app/api/admin/checkpoints/config/route.ts` | Same |
| `app/api/admin/tv-config/route.ts` | Added `organizationId: getTenantId()` to default creation |
| `app/api/admin/role-notification-config/route.ts` | Added `organizationId` to createMany and upsert |
| `lib/notifications.ts` | Added `organizationId` to notification create |

---

## Lessons Learned

### 1. `as any` on data objects is a code smell for missing fields

Every instance of this bug was preceded by `as any` and a comment claiming the extension handles it. The cast silenced both TypeScript and the IDE, making the bug invisible until runtime.

**Rule:** Never use `as any` on Prisma `data` objects. If TypeScript complains about a missing field, the field is actually missing.

### 2. Prisma extensions do not propagate into `$transaction` callbacks

The `tx` parameter inside `$transaction(async (tx) => { ... })` is a raw PrismaClient. Query hooks from `$extends()` do not apply. Any field that the extension normally injects must be set explicitly inside transactions.

**Rule:** Always pass `organizationId` explicitly in `$transaction` blocks. Never rely on the tenant-db extension inside transactions.

### 3. Fire-and-forget errors are invisible

`lib/notifications.ts` failures were caught by `.catch(console.error)` and logged to the server console, but never surfaced to the caller. The notification creation was silently failing for all ticket/bug creation events.

**Rule:** Monitor server logs for fire-and-forget errors. Consider adding error counters or alerts for silent failures.

### 4. The first working route became the wrong template

`POST /api/tickets` correctly used `organizationId: session.organizationId` (likely because it was written first and hit this issue during development). All subsequent routes were written with the incorrect assumption that the extension handles it, creating a divergent pattern.

**Rule:** When a pattern exists in one place but not others, verify which one is correct before propagating.

### 5. E2E tests catch integration bugs that type checking cannot

TypeScript, ESLint, and the build all passed. The bug only manifested at runtime when hitting the actual database. The E2E test suite caught all 9 instances on its first run.

**Rule:** API endpoints that write to the database need integration tests, not just type checking.

---

## Prevention

1. **Grep audit:** Run `grep -rn "as any" app/api/ lib/` periodically and eliminate unnecessary casts
2. **Transaction linting:** Any new `$transaction` callback should be reviewed for missing `organizationId`
3. **CI gate:** The E2E test suite (`npm run test:api -w web`) should run in CI before merges
4. **Pattern documentation:** The CLAUDE.md file should document that `organizationId` must always be explicit in `create` operations, especially inside `$transaction`
