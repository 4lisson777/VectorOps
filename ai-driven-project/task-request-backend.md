# Prisma Setup Refactor Plan — ShinobiOps

**Date:** 2026-04-07
**Author:** Senior Backend Engineer (Claude)
**Scope:** Refactor Prisma setup to use `prisma.config.ts` as the single source of truth, per official Prisma v7 docs.

---

## 1. Current State Assessment

### 1.1 Versions in Use

| Package | Version |
|---------|---------|
| `prisma` (dev) | `^7.6.0` |
| `@prisma/client` | `^7.6.0` |
| `@prisma/adapter-better-sqlite3` | `^7.6.0` |
| `better-sqlite3` | `^12.8.0` |

**No version upgrade needed.** All packages are consistent.

### 1.2 Current `prisma.config.ts` (Minimal)

```ts
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"] ?? "file:./prisma/data/vectorops.db",
  },
})
```

**Issues with current config:**
- Does NOT use `env()` helper from `prisma/config` (recommended for type-safe env access)
- Does NOT configure `migrations.seed` (seed is configured in `package.json` `prisma.seed` instead — legacy pattern)
- Does NOT configure `migrations.path`
- Missing `migrations` block entirely

### 1.3 Seed Script (`prisma/seed.ts`) — Main Bug

The seed script creates a **bare `PrismaClient`** without the better-sqlite3 adapter:
```ts
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
```
Then applies pragmas via `$executeRawUnsafe` as a fragile workaround. This means seeded data may be written without WAL mode or foreign key enforcement.

### 1.4 Seed Config Location — Legacy Pattern

Seed is configured in `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Per official Prisma v7 docs, the recommended approach is to configure seed in `prisma.config.ts` via `migrations.seed`.

### 1.5 Import Path Inconsistency

- `lib/db.ts` imports from `"../generated/prisma/client"` (explicit path)
- 8 other files import from `"@prisma/client"` (bare specifier, works via tsconfig alias)
- Both resolve to the same generated code, but it's confusing

### 1.6 Enum Duplication

`lib/types.ts` re-declares `Role` and `DevStatus` as const objects that already exist as Prisma-generated enums.

---

## 2. Issues Summary

| # | Severity | Issue |
|---|----------|-------|
| 1 | **High** | `prisma.config.ts` is minimal — not using `env()`, no `migrations` block, no seed config |
| 2 | **Medium** | Seed script bypasses better-sqlite3 adapter (bare `PrismaClient`, fragile pragma workaround) |
| 3 | **Medium** | Seed configured in `package.json` instead of `prisma.config.ts` (legacy pattern) |
| 4 | Low | Import path inconsistency (`@prisma/client` vs `../generated/prisma/client`) |
| 5 | Low | Enum duplication in `lib/types.ts` |

---

## 3. Refactor Plan

### 3.1 Upgrade `prisma.config.ts` to Full Configuration (Priority: High)

Per [official Prisma v7 docs](https://www.prisma.io/docs/orm/reference/prisma-config-reference), the `prisma.config.ts` should be the single source of truth for all Prisma configuration.

**Target `prisma.config.ts`:**

```ts
import path from "node:path"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
})
```

**Key changes:**
- Use `env()` helper from `prisma/config` instead of `process.env` — throws clear error if `DATABASE_URL` is missing
- Add `migrations.path` to explicitly declare migration directory
- Move seed config from `package.json` `prisma.seed` → `prisma.config.ts` `migrations.seed`
- Use `path.join()` for cross-platform path resolution (per official docs example)

**Note on `env()` vs fallback:** The current config has a fallback (`?? "file:./prisma/data/vectorops.db"`). The `env()` helper will throw if `DATABASE_URL` is unset. This is the correct behavior for production. For development, `DATABASE_URL` should be set in `.env` file (which `lib/db.ts` already handles with its own fallback at runtime).

### 3.2 Remove Legacy Seed Config from `package.json` (Priority: High)

Remove the `prisma` block from `apps/web/package.json`:

```json
// REMOVE THIS:
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

The seed command is now configured in `prisma.config.ts` via `migrations.seed`. Running `npx prisma db seed` will read from the config file.

### 3.3 Fix Seed Script — Use Shared Factory (Priority: Medium)

**Step 1:** Extract `createPrismaClient()` from `lib/db.ts` into `lib/prisma-factory.ts`:

```ts
// lib/prisma-factory.ts
import path from "path"
import { fileURLToPath } from "url"
import Database from "better-sqlite3"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../generated/prisma/client"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./prisma/data/vectorops.db"
  const filePath = url.replace(/^file:/, "")
  const dbPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(__dirname, "..", filePath)

  const database = new Database(dbPath)
  database.pragma("journal_mode = WAL")
  database.pragma("foreign_keys = ON")
  database.pragma("synchronous = NORMAL")
  database.pragma("busy_timeout = 5000")

  const adapter = new PrismaBetterSqlite3(database)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}
```

**Step 2:** Simplify `lib/db.ts` to use the factory:

```ts
// lib/db.ts
import type { PrismaClient } from "../generated/prisma/client"
import { createPrismaClient } from "./prisma-factory"

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const db: PrismaClient = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db
}
```

**Step 3:** Rewrite `prisma/seed.ts` to use the factory:

```ts
// prisma/seed.ts
import { createPrismaClient } from "../lib/prisma-factory"
import bcrypt from "bcryptjs"

const prisma = createPrismaClient()

// ... rest of seed logic stays the same, but REMOVE applyPragmas() entirely
```

**Important:** Use relative import `"../lib/prisma-factory"` (not `@/lib/prisma-factory`) because `tsx` doesn't resolve tsconfig path aliases by default.

### 3.4 Standardize Import Paths (Priority: Low)

**Recommended: Keep `@prisma/client` bare specifier.** The tsconfig alias makes it work. Document the alias in `tsconfig.json` with a comment:

```json
"paths": {
  // Redirects @prisma/client to local generated output (Prisma 7 pattern)
  "@prisma/client": ["./generated/prisma/client"],
  "@/*": ["./*"]
}
```

No source file changes needed.

### 3.5 Remove Enum Duplication in `lib/types.ts` (Priority: Low)

After grepping all callers, remove `Role` and `DevStatus` const objects from `lib/types.ts`. All callers should import from `@prisma/client` (which resolves to the generated client via tsconfig alias).

---

## 4. Implementation Order

| Step | Files Changed | Risk |
|------|--------------|------|
| 1. Upgrade `prisma.config.ts` | `apps/web/prisma.config.ts` | Low |
| 2. Remove legacy seed from `package.json` | `apps/web/package.json` | Low |
| 3. Create `lib/prisma-factory.ts` | New file | Low |
| 4. Refactor `lib/db.ts` to use factory | `apps/web/lib/db.ts` | Low |
| 5. Rewrite `prisma/seed.ts` to use factory | `apps/web/prisma/seed.ts` | Low — test with `npm run db:seed` |
| 6. Document tsconfig alias | `apps/web/tsconfig.json` | Zero |
| 7. Remove enum duplication | `apps/web/lib/types.ts` + callers | Medium — grep audit required |

---

## 5. Verification Checklist

After implementation, verify:

- [ ] `npx prisma generate` works from `apps/web/`
- [ ] `npx prisma migrate deploy` works
- [ ] `npx prisma db seed` works (reads seed from `prisma.config.ts`)
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` succeeds
- [ ] Database has WAL mode enabled after seeding (`PRAGMA journal_mode;` returns `wal`)
- [ ] Foreign keys are enforced after seeding

---

## 6. Reference

- [Prisma Config Reference (official)](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
- [Prisma Schema Location](https://www.prisma.io/docs/orm/prisma-schema/overview/location)
- Prisma v7: `adapter` property removed from config — driver adapters work automatically
- Prisma v7: `migrations.seed` in config replaces `package.json` `prisma.seed`
