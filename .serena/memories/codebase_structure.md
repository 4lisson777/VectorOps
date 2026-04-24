# ShinobiOps — Codebase Structure

```
vectorops/                         # monorepo root
├── apps/
│   └── web/                        # Next.js 16 app (main application)
│       ├── app/                    # App Router
│       │   ├── (auth)/             # login, register (no AppShell)
│       │   ├── (protected)/        # all authenticated pages (uses AppShell)
│       │   │   ├── support/        # support team pages
│       │   │   │   ├── page.tsx    # action selection (ticket vs bug)
│       │   │   │   ├── ticket/new/ # create ticket form
│       │   │   │   ├── bug/new/    # report bug form
│       │   │   │   ├── queue/      # Mission Board (support view)
│       │   │   │   └── my-items/   # personal ticket history
│       │   │   ├── dev/            # development team pages
│       │   │   │   ├── page.tsx    # Ninja Board
│       │   │   │   └── queue/      # Mission Board (dev view)
│       │   │   ├── admin/          # Command Dojo (Tech Lead only)
│       │   │   │   ├── page.tsx    # overview dashboard
│       │   │   │   ├── team/       # team member management
│       │   │   │   ├── notifications/ # notification routing config
│       │   │   │   ├── checkpoints/   # checkpoint config
│       │   │   │   └── log/        # full ticket/bug history
│       │   │   ├── ticket/[publicId]/ # ticket detail + timeline
│       │   │   └── profile/        # user profile settings
│       │   ├── (public)/           # unauthenticated public pages
│       │   │   └── dev/tv/         # TV mode (read-only Ninja Board)
│       │   ├── api/                # API routes
│       │   │   ├── auth/           # login, register, logout, me
│       │   │   ├── tickets/        # ticket CRUD + assign/reorder/events
│       │   │   ├── bugs/           # bug CRUD + clickup-export
│       │   │   ├── users/          # user management
│       │   │   ├── notifications/  # notification read/list
│       │   │   ├── reorder-requests/ # priority reorder flow
│       │   │   ├── help-requests/  # Smoke Signal feature
│       │   │   ├── checkpoints/    # Status Scroll + config
│       │   │   ├── sse/            # Server-Sent Events endpoint
│       │   │   └── health/         # health check
│       │   ├── layout.tsx          # root layout
│       │   ├── page.tsx            # role-based redirect
│       │   ├── not-found.tsx       # 404 "Mission Not Found"
│       │   └── error.tsx           # error boundary
│       ├── components/             # app-specific components
│       │   ├── auth/               # login-form, register-form
│       │   ├── layout/             # app-shell, header, sidebar
│       │   └── profile/            # profile-form
│       ├── hooks/                  # custom React hooks
│       ├── lib/                    # utilities
│       │   ├── db.ts               # Prisma singleton + SQLite pragmas
│       │   ├── session.ts          # iron-session config + getSession()
│       │   ├── auth.ts             # requireAuth(), requireRole() guards
│       │   ├── types.ts            # Role enum, SafeUser type
│       │   └── ninja-alias.ts      # generateNinjaAlias()
│       ├── prisma/
│       │   ├── schema.prisma       # Prisma schema (User model — Phase 1)
│       │   ├── migrations/         # migration history
│       │   └── seed.ts             # dev seed (one user per role)
│       └── middleware.ts           # route protection middleware
│
├── packages/
│   ├── ui/                         # @workspace/ui — shared component library
│   │   └── src/
│   │       ├── components/         # shadcn/ui + custom components
│   │       ├── hooks/              # shared hooks
│   │       ├── lib/utils.ts        # cn() utility
│   │       └── styles/globals.css  # Tailwind + CSS variables (navy/crimson theme)
│   ├── typescript-config/          # base.json, nextjs.json
│   └── eslint-config/              # base.js, next.js, react-internal.js
│
├── docs/
│   ├── PRD.md                      # product requirements (source of truth)
│   ├── TECH-STACK.md               # architecture decisions
│   ├── TASKS.md                    # master task tracker (66 tasks, 5 phases)
│   └── steps-1.md ... steps-5.md  # per-phase implementation plans
│
├── turbo.json                      # Turbo task pipeline
├── package.json                    # root workspace config
└── CLAUDE.md                       # Claude Code guidance
```
