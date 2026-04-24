# Short-Term Memory -- Senior Backend Engineer

## Current Task
Fix: Docker production seed dotenv/config error — Complete

## Files Created / Modified

| File | Action |
|------|--------|
| `apps/web/prisma/seed.prod.ts` | Modified — removed `import "dotenv/config"` (line 1) |
| `Dockerfile` | Modified — changed esbuild format from `--format=cjs --outfile=seed.prod.cjs` to `--format=esm --outfile=seed.prod.mjs` |
| `entrypoint.sh` | Modified — updated seed runner from `seed.prod.cjs` to `seed.prod.mjs` |
