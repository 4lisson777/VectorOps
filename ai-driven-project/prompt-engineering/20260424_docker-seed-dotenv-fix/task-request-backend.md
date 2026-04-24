# Backend Task: Fix Docker Production Seed -- dotenv/config Module Not Found

## Description

The Docker container fails to start because the production seed script (`seed.prod.cjs`) requires `dotenv/config`, which is not available in the production Docker image. The bundled CJS file has an external require for `dotenv/config` that cannot be resolved at runtime.

The root cause: `seed.prod.ts` begins with `import "dotenv/config"` which is unnecessary in a Docker environment where env vars are injected by docker-compose. The esbuild step uses `--packages=external`, so `dotenv/config` remains as a runtime require in the compiled `seed.prod.cjs`. After `npm prune --omit=dev`, the module may not be available in the final runner stage.

## Acceptance Criteria

- [ ] Docker container starts successfully without the "Cannot find module 'dotenv/config'" error
- [ ] Production seed runs correctly when SEED_ADMIN_EMAIL is set in docker-compose
- [ ] The production seed script still works when run locally via `npm run db:seed:prod` (with env vars set)
- [ ] No unnecessary dependencies are added to the production image

## Fix Strategy

Remove the `import "dotenv/config"` line from `apps/web/prisma/seed.prod.ts`. In Docker, environment variables are provided by docker-compose (`environment` and `env_file` directives). The `dotenv` import is a development convenience that has no place in a production seed script.

Additionally, since `dotenv` was only a dependency for this import, evaluate whether `dotenv` can be moved from `dependencies` to `devDependencies` in `apps/web/package.json`. Check if any other production code imports `dotenv` before moving it. If other production files use it, leave it in dependencies.

## Files to Modify

1. `apps/web/prisma/seed.prod.ts` -- Remove the `import "dotenv/config"` line (line 1)
2. `apps/web/package.json` -- Move `dotenv` from `dependencies` to `devDependencies` if no other production code uses it (search first)

## Verification

After making the changes, run:
```bash
docker compose down -v && docker compose up --build
```
The container should start without errors. Check that the production seed runs (if SEED_ADMIN_EMAIL is configured in docker-compose).

## Rules to Follow
- Keep it simple: the smallest possible change that fixes the issue
- Do not add new dependencies
- Do not modify the Dockerfile or entrypoint.sh unless absolutely necessary (the fix is in the seed file)

## Communication File
N/A (backend-only task)
