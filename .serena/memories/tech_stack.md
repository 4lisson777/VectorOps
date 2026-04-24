# ShinobiOps — Tech Stack

## Monorepo
- **Turbo** monorepo with npm workspaces (`npm@11.6.2`, Node ≥ 20)
- `apps/web/` — Next.js app (main application)
- `packages/ui/` — shared component library (`@workspace/ui`)
- `packages/typescript-config/` — shared TS configs
- `packages/eslint-config/` — shared ESLint configs

## Frontend
- **Next.js 16** (App Router, Turbopack for dev)
- **React 19**, TypeScript 5.9 (strict mode, no `any`)
- **Tailwind CSS 4.1** + PostCSS
- **shadcn/ui** (Radix UI primitives + Tailwind) — Mira style, radix-light theme
- **HugeIcons** (`@hugeicons/react`) for icons
- **next-themes** for dark/light mode

## Backend / API
- Next.js **App Router API routes** (`/app/api/*`)
- **Prisma 7** ORM with **SQLite 3** (WAL mode)
- **iron-session v8** for HTTP-only session cookies
- **bcryptjs** (cost factor 12) for password hashing
- **Zod** for schema validation
- **Server-Sent Events (SSE)** for real-time notifications

## Database Schema (current — Phase 1)
- `User` model: id (cuid), name, email (unique), passwordHash, role (enum), avatarUrl?, ninjaAlias, isActive, notifyTickets, notifyBugs, soundEnabled, createdAt, updatedAt
- Roles: `TECH_LEAD | DEVELOPER | SUPPORT_LEAD | SUPPORT_MEMBER`
- DB file: `apps/web/prisma/data/vectorops.db` (env: `DATABASE_URL`)

## Color Palette
- Primary: deep navy `#1A1A2E`
- Accent: crimson `#E94560`
- Severity: White (Low), Green (Medium), Red (High), Black (Critical)

## Path Aliases
- `@/*` → `apps/web/*`
- `@workspace/ui/*` → `packages/ui/src/*`
