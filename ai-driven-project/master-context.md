# Master Context — ShinobiOps

**System Version:** 3.2.0  
**Last Updated:** 2026-04-07 (Persistent Notifications: useBrowserNotifications, usePersistentNotifications, PersistentNotificationBanner, PersistentNotificationManager — fully integrated)  
**Maintainer:** Alisson (Tech Lead)  
**Project Type:** Internal Fullstack Web Application (Next.js Monorepo)  
**Language:** PT-BR (product UI) / EN-US (source code & internal docs)

---

## Quick Summary

ShinobiOps is an internal platform for Inovar Sistemas that unites customer support and development teams around production issue escalation and real-time team coordination. Built as a Turbo monorepo with Next.js 16, shadcn/ui, Prisma + SQLite, and SSE for real-time updates. Ninja-themed UX identity.

---

## Context Registry

| ID | Name | File Path | Category | Last Modified | Description | Dependencies |
|----|------|-----------|----------|---------------|-------------|--------------|
| CTX-CORE-001 | Architecture | `core/architecture.md` | Core | 2026-04-05 | Monorepo structure, routing, component system, path aliases | — |
| CTX-CORE-002 | Data Model | `core/data-model.md` | Core | 2026-04-06 (Phase 3) | Prisma schema, entities, relationships, enums — now includes Notification, DevStatus | CTX-INFRA-002 |
| CTX-CORE-003 | Authentication | `core/authentication.md` | Core | 2026-04-05 | Auth flow, sessions, RBAC, middleware | CTX-CORE-002 |
| CTX-FEAT-001 | Mission Board | `features/mission-board.md` | Feature | 2026-04-06 | Priority queue, ticket cards, reorder flow | CTX-CORE-002, CTX-FEAT-003 |
| CTX-FEAT-002 | Ninja Board | `features/ninja-board.md` | Feature | 2026-04-06 | Dev team overview, status cards, TV mode — Ninja Board + DeveloperCard implemented; TV mode page exists but TvBoard is a stub | CTX-CORE-002, CTX-INFRA-003 |
| CTX-FEAT-003 | Ticket Lifecycle | `features/ticket-lifecycle.md` | Feature | 2026-04-06 | Ticket/Bug CRUD, statuses, timeline events | CTX-CORE-002 |
| CTX-FEAT-004 | Notifications | `features/notifications.md` | Feature | 2026-04-07 | SSE push, sound alerts, notification center — fully implemented; persistent notifications with 30s repeat + browser Notifications API added | CTX-INFRA-003, CTX-CORE-002 |
| CTX-FEAT-005 | Checkpoints | `features/checkpoints.md` | Feature | 2026-04-06 | Status Scroll system, configurable intervals — Full UI + API implementation; schema migrated | CTX-CORE-002, CTX-FEAT-004 |
| CTX-FEAT-006 | Smoke Signals | `features/smoke-signals.md` | Feature | 2026-04-06 | Help request system between developers — Full UI + API implementation (including sound triggers) | CTX-CORE-002, CTX-FEAT-004 |
| CTX-INFRA-001 | Deployment | `infrastructure/deployment.md` | Infrastructure | 2026-04-05 | Docker, docker-compose, production config | CTX-INFRA-002 |
| CTX-INFRA-002 | Database | `infrastructure/database.md` | Infrastructure | 2026-04-06 | SQLite config, WAL mode, Prisma 7, Seeding (`prisma/seed.ts`) fully implemented | — |
| CTX-INFRA-003 | Real-Time | `infrastructure/realtime.md` | Infrastructure | 2026-04-06 | SSE fully implemented — `lib/sse-emitter.ts`, `app/api/sse/route.ts`, `lib/sse-context.tsx`, `hooks/use-sse.ts` | CTX-CORE-003 |
| CTX-UTIL-001 | UI System | `utilities/ui-system.md` | Utility | 2026-04-06 | shadcn/ui, Tailwind, design tokens — 100% PT-BR translated | CTX-CORE-001 |
| CTX-UTIL-002 | API Patterns | `utilities/api-patterns.md` | Utility | 2026-04-06 | API route conventions, logging (`TicketEvent`), validation | CTX-CORE-003 |
| CTX-UTIL-003 | Dev Tooling | `utilities/dev-tooling.md` | Utility | 2026-04-05 | Turbo, ESLint, Prettier, TypeScript config | CTX-CORE-001 |
| CTX-UTIL-004 | Documentation | `utilities/docs.md` | Utility | 2026-04-06 | Comprehensive docs in `/docs` (Audit Logs, Roles, Seeding, Smoke Signals) | — |

---

## Usage Rules

### Context File Format

Every context file **MUST** follow this structure:

```markdown
# Context: [CONTEXT_NAME]
**ID**: [CTX-CATEGORY-NNN]
**Category**: [Core | Feature | Infrastructure | Utility]
**Last Updated**: [YYYY-MM-DD]
**Dependencies**: [Comma-separated context IDs, or "None"]

## Summary
[1-3 sentences: what this context covers]

## Key Information
[Main content organized in clear subsections]

## Code References
[Relevant file paths — use relative paths from project root]

## Related Contexts
[Links to dependent/related context files with brief reason]

## Change Log
| Date | Change | Author |
|------|--------|--------|
| YYYY-MM-DD | Description | Name |
```

### Naming Conventions

- **Context IDs**: `CTX-{CATEGORY}-{NNN}` where CATEGORY is `CORE`, `FEAT`, `INFRA`, or `UTIL`
- **File names**: lowercase, hyphenated (e.g., `ticket-lifecycle.md`)
- **Folders**: match category names (`core/`, `features/`, `infrastructure/`, `utilities/`)

### Content Rules

1. **Be specific** — Reference actual file paths and component names from the codebase
2. **Stay current** — Update contexts when the underlying code changes
3. **No duplication** — Each fact lives in exactly one context file; others link to it
4. **Human + AI readable** — Use clear markdown with structured sections
5. **Max 300 lines per context** — Split into sub-contexts if larger

---

## Update Protocols

### When to Update

An AI agent or developer **MUST** update the relevant context file(s) when:

1. A new file, route, component, or API endpoint is created
2. An existing feature's behavior changes significantly
3. A dependency is added or removed
4. Database schema changes (migration)
5. Infrastructure configuration changes

### How to Update

1. **Identify affected contexts** — Check the Context Registry above for relevant IDs
2. **Edit the context file** — Update the relevant sections, especially Code References
3. **Update the Change Log** — Add a dated entry describing the change
4. **Update Last Modified** — In both the context file header and this registry table
5. **Check dependencies** — If your change affects dependent contexts, update those too
6. **Verify no orphans** — Every new context file must be registered in this table

### Creating a New Context

1. Determine the category: Core (system-wide), Feature (user-facing), Infrastructure (deployment/infra), Utility (tooling/helpers)
2. Assign the next available ID in that category (e.g., `CTX-FEAT-007`)
3. Create the file following the format in Usage Rules
4. Add an entry to the Context Registry table above
5. Link related contexts bidirectionally

### Deleting a Context

1. Remove all references from other context files' Dependencies and Related Contexts sections
2. Remove the entry from the Context Registry table
3. Delete the file
4. Commit with message: `docs(context): remove CTX-XXX-NNN — [reason]`

---

## AI Integration Guide

### For AI Agents — How to Use This System

**When you start working on a task:**

1. **Read this file first** (`master-context.md`) to understand the project structure
2. **Identify relevant contexts** by scanning the Context Registry table
3. **Read only the contexts you need** — don't load everything
4. **Follow dependency chains** — if a context lists dependencies, read those too if needed

**When you finish a task:**

1. **Check if any context needs updating** — Did you add files? Change routes? Modify the schema?
2. **Update affected context files** following the Update Protocols above
3. **Update the Change Log** in each modified context
4. **Update the Last Modified date** in the Context Registry

**Commit message convention for context changes:**

```
docs(context): [action] CTX-XXX-NNN — [brief description]
```

Examples:
- `docs(context): update CTX-FEAT-001 — add reorder request API endpoints`
- `docs(context): create CTX-FEAT-007 — clickup export feature`
- `docs(context): remove CTX-UTIL-004 — merged into CTX-UTIL-001`

### Structured Metadata (JSON)

Each context file includes a parseable JSON metadata block in comments for automated tooling:

```json
<!-- @context-meta
{
  "id": "CTX-CORE-001",
  "category": "core",
  "dependencies": [],
  "tags": ["architecture", "routing", "monorepo"],
  "status": "current",
  "language": "en-us"
}
-->
```

### Quick Lookup

- **Need to add a page?** → Read `CTX-CORE-001` (Architecture)
- **Need to modify the database?** → Read `CTX-CORE-002` (Data Model) + `CTX-INFRA-002` (Database)
- **Need to add an API route?** → Read `CTX-UTIL-002` (API Patterns)
- **Need to add a component?** → Read `CTX-UTIL-001` (UI System)
- **Need to work on tickets/bugs?** → Read `CTX-FEAT-003` (Ticket Lifecycle)
- **Need to change notifications?** → Read `CTX-FEAT-004` (Notifications) + `CTX-INFRA-003` (Real-Time)
- **Need to deploy?** → Read `CTX-INFRA-001` (Deployment)
- **Need to understand auth/roles?** → Read `CTX-CORE-003` (Authentication)

---

## Integrity Checks

Run these checks periodically to ensure context health:

### Validation Checklist

- [ ] Every file in `ai-driven-project/` (except `master-context.md`) is listed in the Context Registry
- [ ] Every context ID is unique across the system
- [ ] All dependency references (`CTX-XXX-NNN`) resolve to existing context files
- [ ] All Code References point to files that exist in the codebase
- [ ] No context file exceeds 300 lines
- [ ] Every context file follows the required format structure
- [ ] Change Logs have entries for the most recent code changes

### Orphan Detection

A context file is **orphaned** if:
- It exists in the directory but has no entry in the Context Registry
- It is not referenced by any other context's Dependencies or Related Contexts

### Duplicate Prevention

Before creating a new context, search for:
1. Existing context with the same ID
2. Existing context covering the same topic (check names and descriptions)
3. Existing context with overlapping Code References

---

## Directory Map

```
ai-driven-project/
├── master-context.md              # This file — central control and index
├── core/                          # Core system contexts
│   ├── architecture.md            # CTX-CORE-001: Monorepo, routing, components
│   ├── data-model.md              # CTX-CORE-002: Prisma schema, entities
│   └── authentication.md          # CTX-CORE-003: Auth, sessions, RBAC
├── features/                      # Feature-specific contexts
│   ├── mission-board.md           # CTX-FEAT-001: Priority queue, reorder
│   ├── ninja-board.md             # CTX-FEAT-002: Dev team overview, TV mode
│   ├── ticket-lifecycle.md        # CTX-FEAT-003: Ticket/Bug CRUD, timeline
│   ├── notifications.md           # CTX-FEAT-004: Push, sounds, center
│   ├── checkpoints.md             # CTX-FEAT-005: Status Scroll system
│   └── smoke-signals.md           # CTX-FEAT-006: Help requests
├── infrastructure/                # Infrastructure contexts
│   ├── deployment.md              # CTX-INFRA-001: Docker, production
│   ├── database.md                # CTX-INFRA-002: SQLite, Prisma config
│   └── realtime.md                # CTX-INFRA-003: SSE implementation
└── utilities/                     # Utility contexts
    ├── ui-system.md               # CTX-UTIL-001: shadcn/ui, Tailwind, theme
    ├── api-patterns.md            # CTX-UTIL-002: API conventions, validation
    └── dev-tooling.md             # CTX-UTIL-003: Turbo, linting, formatting
```

---

*ShinobiOps Context System — v1.0.0*
