# Tech Leader -- Short-Term Memory

## Current Task
- **Name:** Fix Four Runtime Bugs
- **Plan folder:** `ai-driven-project/prompt-engineering/20260425_runtime-bugfixes/`
- **Scope:** Backend-only (logic fixes in existing files, no new UI components)
- **Status:** PLANNED -- awaiting backend engineer execution

## Bug Summary
1. TypeError on session.name.split() in app-shell.tsx -- guard undefined name
2. site.webmanifest syntax error -- move manifest from icons.other to top-level metadata.manifest
3. /api/tv/data 400 -- TvBoard needs to handle missing orgSlug instead of fetching without it
4. Ticket creation missing organization -- Prisma interactive transaction does not inherit tenant-db extension hooks; need explicit organizationId in data

## Key Insight (Bug 4)
Prisma Client Extensions do NOT propagate query hooks into interactive transactions ($transaction(async (tx) => ...)). The tx object is a raw PrismaClient, not the extended one. Any code using tenant-db extension inside interactive transactions must manually inject organizationId.

## Previous Task
- **Name:** Docker Architecture Audit and Optimization
- **Status:** COMPLETED

## Previous Task (paused)
- **Name:** Multitenancy Refactor
- **Plan folder:** `ai-driven-project/prompt-engineering/20260423_multitenancy-refactor/`
- **Scope:** Full-stack (multi-phase)
- **Status:** PLANNED -- awaiting backend Phase MT-1 execution first
