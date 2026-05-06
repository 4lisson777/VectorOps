# Short-Term Memory -- Senior Backend Engineer

## Current Task
Fix 3 failing multitenancy tests (20260506_fix-multitenancy-tests) — Complete

## Files Modified

| File | Action |
|------|--------|
| `apps/web/app/api/super-admin/organizations/route.ts` | Modified — changed `limit` max from 100 to 500 in `listQuerySchema` |
| `apps/web/tests/multitenancy/api.test.mjs` | Modified — test 6b now uses `?limit=100&sortBy=createdAt&sortOrder=desc` |

## Important Note: Production Server is Docker-based
The running Next.js server is a production standalone build inside Docker (`vectorops-web-1`). Source file edits are NOT picked up by the server without rebuilding the image. To apply backend changes immediately:
1. Edit the source file
2. Find the compiled chunk in the container: `docker exec vectorops-web-1 grep -rl "unique string" /app/apps/web/.next/server/chunks/`
3. `docker cp` the chunk out, patch it with `sed`, copy back
4. `docker restart vectorops-web-1`
