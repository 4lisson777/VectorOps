# Backend Task: Lower Notification Cleanup Threshold

## Description
The GET /api/notifications endpoint has an auto-cleanup mechanism that prunes old notifications when the total exceeds a threshold. The current threshold (MAX_NOTIFICATIONS=100) is too high, causing test failures in the role-notification-config suite. During test runs, a developer user accumulates 50-100 notifications. The GET endpoint caps results at limit=50, so when the actual count is between 50 and 100, the response always returns exactly 50 items. Tests that compare notification count before/after creating a new notification see no change (50 == 50) and fail.

## Acceptance Criteria
- [ ] MAX_NOTIFICATIONS is lowered to 50 (from 100)
- [ ] KEEP_NOTIFICATIONS remains at 30
- [ ] No other changes to the file
- [ ] Docker container is rebuilt and restarted
- [ ] All 76 tests in role-notification-config/api.test.mjs pass

## File to Modify
`/home/alisson/web/personal/vectorops/apps/web/app/api/notifications/route.ts`

## Exact Change
Lines 6-7, change:
```
const MAX_NOTIFICATIONS = 100
const KEEP_NOTIFICATIONS = 30
```
To:
```
const MAX_NOTIFICATIONS = 50
const KEEP_NOTIFICATIONS = 30
```

## Post-Change Steps (MUST follow in order)
1. Rebuild the Docker container: `docker compose build web && docker compose up -d web`
2. Wait ~15 seconds for the container to become healthy
3. Run the tests: `node apps/web/tests/role-notification-config/api.test.mjs`
4. Verify all 76 tests pass (0 failures)

## Rules to Follow
- Only modify the source code, NOT the tests
- Do not change any logic, only the constant value
- Rebuild Docker after changing source

## Communication File
N/A (single-agent task)
