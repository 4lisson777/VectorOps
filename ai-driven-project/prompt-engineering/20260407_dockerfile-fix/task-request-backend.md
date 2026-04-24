# Backend Task: Fix Dockerfile and Entrypoint for Production Deployment

## Description

The Docker build and runtime setup has multiple issues preventing the ShinobiOps application from running in a container. The Dockerfile needs fixes for native dependency compilation, missing build tools, environment variable handling, Prisma migration tooling at runtime, and Next.js standalone output configuration for monorepo packages.

## Acceptance Criteria

- [ ] Docker image builds successfully with `docker compose build`
- [ ] Container starts and serves the app on port 3000
- [ ] Prisma migrations run automatically on container start
- [ ] SQLite database is created/persisted in the mounted volume
- [ ] Health check at /api/health responds successfully
- [ ] The app can be accessed from the host at port 3005

## Issues Identified and Required Fixes

### Issue 1: Missing build tools for native modules (CRITICAL)

`better-sqlite3` is a native Node.js addon that requires C++ compilation. The `node:20-slim` image does NOT include `python3`, `make`, or `g++`. The `deps` stage runs `npm ci --ignore-scripts` which skips native compilation entirely, and even without `--ignore-scripts`, compilation would fail due to missing build tools.

**Fix:** In the `deps` stage, install `python3`, `make`, and `g++` before running `npm ci`. Remove `--ignore-scripts` so native addons compile. Alternatively, keep `--ignore-scripts` in deps and run `npm rebuild better-sqlite3` in the builder stage after copying node_modules.

### Issue 2: SKIP_ENV_VALIDATION not set during build (CRITICAL)

The web app's build script is `SKIP_ENV_VALIDATION=true next build` but when `npx turbo run build --filter=web...` is invoked, turbo runs the package's build script. However, the environment variable `SKIP_ENV_VALIDATION` is set inside the npm script string itself. Verify this works correctly with turbo -- if turbo overrides the script environment, the build may fail because `DATABASE_URL` and `SESSION_SECRET` are not available at build time.

**Fix:** Add `ENV SKIP_ENV_VALIDATION=true` in the builder stage as a safety net to ensure env validation is skipped during build regardless of how the build script is invoked.

### Issue 3: next.config.mjs missing serverExternalPackages (CRITICAL)

Next.js standalone output needs to know which packages should NOT be bundled. Native modules like `better-sqlite3` cannot be bundled by webpack/turbopack. Without `serverExternalPackages`, the standalone build will either fail or produce a broken bundle.

**Fix:** Add `serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"]` to `next.config.mjs`.

### Issue 4: Prisma CLI not available at runtime (CRITICAL)

The entrypoint runs `npx prisma migrate deploy` but the runner stage only copies the standalone output and Prisma generated client. The `prisma` CLI package is NOT in the standalone output -- it is a devDependency. `npx` would try to download it on every container start, which is unreliable and slow.

**Fix:** Either:
- (A) Copy the `prisma` binary and its dependencies from the builder stage into the runner, OR
- (B) Install `prisma` as a production dependency in the runner stage, OR
- (C) Copy `node_modules/prisma` and `node_modules/@prisma/engines` from the builder stage

The simplest approach: copy the necessary prisma node_modules from builder and use `node_modules/.bin/prisma` or `npx` (which will find it locally).

### Issue 5: Entrypoint working directory mismatch

The entrypoint runs `node apps/web/server.js` from `/app`. With Next.js standalone output, the server.js is at `/app/apps/web/server.js` (copied from `.next/standalone`). This path appears correct, but verify the standalone output preserves the monorepo directory structure.

**Fix:** Confirm the path is correct. The standalone output for a monorepo does preserve the workspace structure, so `apps/web/server.js` should exist at `/app/apps/web/server.js`. This is likely fine.

### Issue 6: DATABASE_URL path for migrations vs runtime

The docker-compose sets `DATABASE_URL=file:/app/apps/web/prisma/data/vectorops.db` (absolute path). The volume mount is `./data:/app/apps/web/prisma/data`. Prisma migrate deploy needs to create the database file at this location. Ensure the `node` user has write permissions to the mounted volume.

**Fix:** The volume mount directory must be writable by the `node` user (uid 1000). Add a note or ensure the data directory is created with proper permissions. Consider creating the data directory in the Dockerfile before switching to the `node` user.

### Issue 7: node_modules hoisting in monorepo

With npm workspaces, `npm ci` hoists dependencies to the root `node_modules`. The `turbo prune --docker` output splits into `json/` (package manifests) and `full/` (source code). In the deps stage, `npm ci` installs into root `/app/node_modules`. In the builder stage, node_modules is copied from deps and source from pruner. This should work, but the `better-sqlite3` native binary must match the builder image's architecture.

**Fix:** Ensure all stages use the same base image (`node:20-slim`) so the native binary is compatible.

## Files to Modify

1. `/home/alisson/web/personal/vectorops/Dockerfile` -- Fix all build stages
2. `/home/alisson/web/personal/vectorops/entrypoint.sh` -- Fix Prisma CLI invocation
3. `/home/alisson/web/personal/vectorops/apps/web/next.config.mjs` -- Add serverExternalPackages

## Business Logic

No business logic changes. This is a DevOps/infrastructure fix.

## Rules to Follow

- Keep the multi-stage build pattern (pruner -> deps -> builder -> runner)
- Minimize final image size (do NOT install build tools in the runner stage)
- Use `node` user in the runner stage for security
- Ensure the entrypoint handles the case where the database file does not yet exist (first run)
- The SQLite database path must match between DATABASE_URL env var and the volume mount

## Communication File

N/A -- Backend-only task, no frontend changes.
