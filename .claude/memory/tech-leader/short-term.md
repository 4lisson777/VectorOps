# Tech Leader -- Short-Term Memory

## Current Task
- **Name:** Create Deployment Guide for DevOps Engineers
- **Output file:** `docs/DEPLOYMENT.md`
- **Scope:** Documentation-only (no code changes)
- **Status:** COMPLETED
- **Key Decisions:**
  - Created comprehensive guide covering Docker Compose build/run, env vars, migrations, backups, health checks, reverse proxy (SSE-aware), troubleshooting
  - Documented the two-file .env pattern (root for Compose interpolation, apps/web for container runtime)
  - Included critical SSE proxy_buffering warning for nginx reverse proxy
  - Documented the entrypoint.sh startup flow (migrate + optional seed + server start)
  - Added cron backup schedule example and volume backup alternative

## Previous Task
- **Name:** Lower Notification Cleanup Threshold (Fix role-notification-config test 42)
- **Plan folder:** `ai-driven-project/prompt-engineering/20260506_fix-notification-cleanup-threshold/`
- **Scope:** Backend-only (1 constant change in notifications GET route)
- **Status:** PLANNED -- awaiting backend engineer execution

## Previous Task
- **Name:** Fix Role-Notification-Config Test Suite (2 Failing Tests)
- **Plan folder:** `ai-driven-project/prompt-engineering/20260506_fix-role-notification-config-tests/`
- **Scope:** Backend-only
- **Status:** PARTIALLY FIXED -- tests 42/43 originally fixed but regressed due to threshold being too high

## Previous Task
- **Name:** Fix 3 Failing Multitenancy Tests
- **Plan folder:** `ai-driven-project/prompt-engineering/20260506_fix-multitenancy-tests/`
- **Scope:** Backend-only (1 backend fix + 1 test fix)
- **Status:** PLANNED -- awaiting backend engineer execution

## Previous Task
- **Name:** Fix 5 Failing API Integration Test Suites
- **Plan folder:** `ai-driven-project/prompt-engineering/20260429_fix-failing-test-suites/`
- **Scope:** Backend-only (test fixes + rate limit adjustment)
- **Status:** PARTIALLY APPLIED -- credential fixes done, rate limit + retry may still be pending
