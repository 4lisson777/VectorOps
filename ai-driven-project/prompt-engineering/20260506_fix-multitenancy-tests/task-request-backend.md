# Backend Task: Fix 3 Failing Multitenancy Tests

## Description

The multitenancy test suite (`apps/web/tests/multitenancy/api.test.mjs`) has 111 passing and 3 failing tests. The test file itself is well-written and already uses correct credentials/retry logic. The failures are caused by two backend issues and one test-side issue.

## Acceptance Criteria

- [ ] All 114 multitenancy tests pass when running `node apps/web/tests/multitenancy/api.test.mjs`
- [ ] No regressions in other test suites
- [ ] No changes to seed data
- [ ] Production behavior is not degraded

## Failures and Root Causes

### Failure 1: Test 6b — "Inovar tech lead sees Inovar's ticket in ticket list"

**What happens:** The test creates a new LOW-severity ticket via `POST /api/tickets`, then does `GET /api/tickets?limit=100` and looks for the new ticket's ID in the response. The ticket is not found.

**Root cause:** The VectorOps org currently has 1038 tickets. The `GET /api/tickets` endpoint sorts by `priorityOrder: "asc"` by default. A LOW-severity ticket gets the highest `priorityOrder` value (placed at the very end of the queue). With a limit of 100, the endpoint returns only the first 100 tickets (highest priority first), and the newly created LOW-severity ticket is around position 1038+ -- way beyond the first 100 results.

**Fix (test-side):** The test should use query parameters that guarantee the new ticket appears in results. Two options:
- Option A (recommended): Sort by `createdAt desc` with `sortBy=createdAt&sortOrder=desc` so the newest ticket appears first. Change the query to `/api/tickets?limit=100&sortBy=createdAt&sortOrder=desc`.
- Option B: Search by the ticket's title using `search=Isolation+Test+Ticket`.

### Failure 2 & 3: Tests 12b — "VectorOps appears in org list" and "Test Company appears in org list"

**What happens:** The test calls `GET /api/super-admin/organizations?limit=200` and expects to find both orgs. The response has `organizations: []` (empty slugs array).

**Root cause (backend-side):** The `listQuerySchema` in `apps/web/app/api/super-admin/organizations/route.ts` defines `limit` with `.max(100)`. When the test passes `limit=200`, Zod validation fails and the endpoint returns a 400 error. The test does not check the status code on this specific call (12b checks `body?.organizations ?? []` directly), so it silently gets an empty array from the error response.

**Fix:** Two changes needed:
1. **Backend fix:** Increase the max limit in the super-admin organizations list endpoint from 100 to 200 (or higher, e.g., 500). Super admins need to see all orgs. Unlike tenant-scoped endpoints, the number of organizations will be small (tens, not thousands), so a higher limit is safe.
2. **Alternative (test-side only):** Change the test to use `limit=100` instead of `limit=200`. However, the backend fix is more correct since super-admin endpoints should support listing all orgs.

## Files to Modify

### Backend Changes

1. **`apps/web/app/api/super-admin/organizations/route.ts`** (line 23):
   - In `listQuerySchema`, change `limit: z.coerce.number().int().min(1).max(100).default(20)` to `limit: z.coerce.number().int().min(1).max(500).default(20)`
   - Rationale: Super-admin endpoints manage a small number of organizations (tens, not thousands). A 500-limit cap is safe and prevents the test from failing while still having a reasonable upper bound.

### Test Changes

2. **`apps/web/tests/multitenancy/api.test.mjs`** (line 754):
   - Change `GET /api/tickets?limit=100` to `GET /api/tickets?limit=100&sortBy=createdAt&sortOrder=desc` so the newly created ticket appears at the top of the results regardless of how many tickets exist in the org.

## Business Logic

No business logic changes. The super-admin limit increase is a convenience/correctness fix for an admin-only endpoint. The test change uses existing API query parameters correctly.

## Rules to Follow

- KISS: Minimal changes -- one line in the backend, one line in the test
- Do not change seed data
- Do not change the test harness structure
- Verify all 114 tests pass after the fix

## Communication File

N/A -- this is a backend-only task with a minor test adjustment.
