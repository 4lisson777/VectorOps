# Backend Task: Fix 5 Failing API Integration Test Suites

## Description

5 out of 13 API integration test suites fail when running `npm run test:api -w web`. The 8 "new" suites pass. The 5 "legacy" suites (status-change, multitenancy, persistent-notifications, role-notification-config, ticket-notification-flow) all fail. Root cause analysis reveals TWO distinct categories of problems:

1. **Rate Limiting (affects all 5 suites):** The login rate limiter allows 5 requests per 60-second window per IP. All test requests originate from the same IP (localhost/127.0.0.1), so they share a single bucket. Legacy test suites do NOT use the shared test harness's `login()` with retry logic; they each have their own inline `login()` without retries. The status-change suite makes 11 login calls (rate limit hit after 5th). The multitenancy suite also makes 11+ login calls. When suites run sequentially (via `run-all.mjs`), the preceding suite's login calls may exhaust the rate limit for the next suite.

2. **Wrong Seed Credentials in Tests (affects 4 suites):** The test files reference emails and org slugs that do NOT exist in the current seed (`prisma/seed.ts`). Specifically:
   - `persistent-notifications` uses: `support@vectorops.dev`, `qa@vectorops.dev`, `techlead@vectorops.dev`, `developer@vectorops.dev` -- NONE of these exist in the seed
   - `role-notification-config` uses: `alisson.lima@vectorops.dev` (TECH_LEAD) -- does NOT exist; actual seed TECH_LEAD is `alisson@vector.ops`
   - `ticket-notification-flow` uses: `alisson.lima@vectorops.dev` (TECH_LEAD) -- same problem
   - `multitenancy` uses: `alisson.lima@vectorops.dev` (TECH_LEAD) AND expects org slug `inovar-sistemas` -- actual slug is `vectorops`

## Acceptance Criteria

- [ ] All 13 test suites pass when running `npm run test:api -w web` sequentially
- [ ] The rate limiter still works for production (not disabled entirely)
- [ ] No changes to the seed data (tests should be fixed to match the seed)
- [ ] Legacy test suites are updated to use correct seed credentials
- [ ] Rate limiting does not break sequential test execution

## Root Cause Details

### Current Seed Users (from `prisma/seed.ts`)

**VectorOps org (slug: "vectorops"):**
- TECH_LEAD + SUPER_ADMIN: `alisson@vector.ops`
- DEVELOPER: `matheus@vectorops.dev`
- DEVELOPER: `marcos@vectorops.dev`
- DEVELOPER: `ivson@vectorops.dev`
- DEVELOPER: `guilherme@vectorops.dev`
- SUPPORT_LEAD: `alisson.rosa@vectorops.dev`
- SUPPORT_MEMBER: `bruno@vectorops.dev`
- SUPPORT_MEMBER: `leticia@vectorops.dev`
- QA: `nicoli@vectorops.dev`

**Test Company org (slug: "test-company"):**
- TECH_LEAD: `lead@testcompany.dev`
- DEVELOPER: `dev@testcompany.dev`
- SUPPORT_MEMBER: `support@testcompany.dev`

### Shared Test Harness Credentials (already correct)

In `tests/_shared/test-harness.mjs`, the `SEED_EMAILS` map uses the correct emails. The 8 passing suites all import from this harness.

### What Each Failing Suite Needs

#### 1. `status-change/api.test.mjs`
- **Credential issue:** Uses CORRECT emails but has its own `login()` function WITHOUT retry/rate-limit handling
- **Fix needed:** Either (a) refactor to use the shared harness `login()` with retries, or (b) reduce redundant login calls by caching cookies at suite level, or (c) increase the rate limit window/count for the login endpoint
- **Login call count:** 11 calls across 5 sub-suites (Suite 1 logs in 4 users, Suite 2 logs in 1, Suite 3 logs in 3, Suite 4 logs in 1, Suite 5 logs in 2)

#### 2. `multitenancy/api.test.mjs`
- **Credential issue:** Uses `alisson.lima@vectorops.dev` (does NOT exist; should be `alisson@vector.ops`). Expects org slug `inovar-sistemas` (actual: `vectorops`). Uses `bruno@vectorops.dev` for SUPPORT (correct email but stored as INOVAR_SUPPORT).
- **Fix needed:** Update all credential constants to match actual seed. Update org slug references from `inovar-sistemas` to `vectorops`. Update all "Inovar Sistemas" string assertions to "VectorOps". The local `login()` also lacks retry logic. The test makes 11+ login calls.

#### 3. `persistent-notifications/api.test.mjs`
- **Credential issue:** Uses completely wrong emails: `support@vectorops.dev`, `qa@vectorops.dev`, `techlead@vectorops.dev`, `developer@vectorops.dev`
- **Fix needed:** Replace with correct seed emails: `bruno@vectorops.dev` (SUPPORT_MEMBER), `nicoli@vectorops.dev` (QA), `alisson@vector.ops` (TECH_LEAD), `matheus@vectorops.dev` (DEVELOPER). Also needs retry logic in `login()`.

#### 4. `role-notification-config/api.test.mjs`
- **Credential issue:** Uses `alisson.lima@vectorops.dev` as TECH_LEAD (does NOT exist; should be `alisson@vector.ops`). Other emails (`matheus@vectorops.dev`, `bruno@vectorops.dev`, `nicoli@vectorops.dev`) are correct.
- **Fix needed:** Fix TECH_LEAD email to `alisson@vector.ops`. Add retry logic to `login()`.

#### 5. `ticket-notification-flow/api.test.mjs`
- **Credential issue:** Uses `alisson.lima@vectorops.dev` as TECH_LEAD (does NOT exist; should be `alisson@vector.ops`). Other emails (`matheus@vectorops.dev`, `bruno@vectorops.dev`, `nicoli@vectorops.dev`) are correct.
- **Fix needed:** Fix TECH_LEAD email to `alisson@vector.ops`. Add retry logic to `login()`.

## Fix Strategy

### Strategy A: Fix the Tests (RECOMMENDED)

**Step 1 - Fix Credentials:** Update all wrong email addresses in the 4 legacy test files to match the actual seed. Update org slug references in the multitenancy test.

**Step 2 - Fix Rate Limiting for Tests:** The best approach is a combination:
1. **Increase login rate limit** from 5/minute to 30/minute (or higher). The rate limiter at 5/min is too aggressive for an internal-only app where all requests come from localhost during testing AND in production (single-node deployment).
2. **Alternatively/additionally:** Refactor legacy tests to cache login cookies at the top of the test file rather than re-logging-in for each sub-suite. The status-change test logs in as DEVELOPER 5 separate times -- it should log in once and reuse the cookie.

**Step 3 - Add Retry Logic:** Add retry-on-429 logic to each legacy test's inline `login()` function (matching the shared harness pattern).

### Strategy B: Refactor Legacy Tests to Use Shared Harness

Convert all legacy tests to import from `tests/_shared/test-harness.mjs` instead of defining their own inline helpers. This is the cleanest long-term fix but is a larger change.

### Recommended Approach: Hybrid

1. Fix all wrong credentials (mandatory)
2. Increase login rate limit from 5 to 30 per minute (reasonable for an internal app)
3. Add basic retry logic to legacy test `login()` functions
4. Cache cookies at suite level in status-change test to reduce redundant logins

## Files to Modify

### Test Files (credential + retry fixes)
- `apps/web/tests/status-change/api.test.mjs` -- fix: cache cookies, add retry logic
- `apps/web/tests/multitenancy/api.test.mjs` -- fix: wrong emails, wrong org slug, wrong org name assertions, add retry logic
- `apps/web/tests/persistent-notifications/api.test.mjs` -- fix: all 4 emails are wrong, add retry logic
- `apps/web/tests/role-notification-config/api.test.mjs` -- fix: TECH_LEAD email, add retry logic
- `apps/web/tests/ticket-notification-flow/api.test.mjs` -- fix: TECH_LEAD email, add retry logic

### Backend (rate limit adjustment)
- `apps/web/app/api/auth/login/route.ts` -- increase rate limit from `{ limit: 5, windowMs: 60_000 }` to `{ limit: 30, windowMs: 60_000 }`

## Specific Credential Mapping (Search and Replace)

| Test File | Wrong Email | Correct Email |
|-----------|-------------|---------------|
| persistent-notifications | `support@vectorops.dev` | `bruno@vectorops.dev` |
| persistent-notifications | `qa@vectorops.dev` | `nicoli@vectorops.dev` |
| persistent-notifications | `techlead@vectorops.dev` | `alisson@vector.ops` |
| persistent-notifications | `developer@vectorops.dev` | `matheus@vectorops.dev` |
| role-notification-config | `alisson.lima@vectorops.dev` | `alisson@vector.ops` |
| ticket-notification-flow | `alisson.lima@vectorops.dev` | `alisson@vector.ops` |
| multitenancy | `alisson.lima@vectorops.dev` | `alisson@vector.ops` |

## Multitenancy Test Org Slug Fixes

| Wrong Reference | Correct Reference |
|-----------------|-------------------|
| `"inovar-sistemas"` (slug) | `"vectorops"` |
| `"Inovar Sistemas"` (name) | `"VectorOps"` |
| `INOVAR_TECH_LEAD` label references | Keep the variable names but fix email values |

## Multitenancy Test Credential Constants Fix

Current (wrong):
```
const INOVAR_TECH_LEAD = { email: "alisson.lima@vectorops.dev", password: "Password123!" }
const INOVAR_DEVELOPER = { email: "matheus@vectorops.dev", password: "Password123!" }
const INOVAR_SUPPORT   = { email: "bruno@vectorops.dev", password: "Password123!" }
```

Should be:
```
const INOVAR_TECH_LEAD = { email: "alisson@vector.ops", password: "Password123!" }
const INOVAR_DEVELOPER = { email: "matheus@vectorops.dev", password: "Password123!" }
const INOVAR_SUPPORT   = { email: "bruno@vectorops.dev", password: "Password123!" }
```

## Status-Change Test Cookie Caching Fix

The status-change test should log in each user ONCE at the top and reuse cookies across all 5 sub-suites:

Current: Each sub-suite calls `login()` independently (11 total calls)
Should: Login all 4 users once at the top, store in variables, pass to each sub-suite function

## Important Notes

- The multitenancy test references org-level features (invites, organizations API, impersonation) that ARE properly implemented in the backend API routes. The super-admin endpoints exist and use `requireSuperAdmin()`. The TV data endpoint works with `?org=<slug>`. The issues are purely credential/slug mismatches.
- The `Alisson Rosa` user in the seed has role `SUPPORT_LEAD`, NOT `SUPPORT_MEMBER`. The multitenancy test uses `INOVAR_SUPPORT` which maps to `bruno@vectorops.dev` (SUPPORT_MEMBER) -- this is correct.
- Do NOT change the seed data. The seed is correct. The tests need to match the seed.
- After making changes, run `npm run test:api -w web` to verify all 13 suites pass.

## Business Logic

No business logic changes needed. This is a test-data alignment + rate limit tuning task.

## Rules to Follow

- KISS: Make minimal changes to fix the tests
- Do not refactor working code unnecessarily
- Preserve the existing test structure (legacy tests keep their inline helpers, but add retry logic)
- The rate limit increase from 5 to 30 is reasonable for an internal-only single-node app

## Communication File

N/A -- this is a backend-only (test + rate limit) task.
