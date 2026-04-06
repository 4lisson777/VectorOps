# ShinobiOps -- Master Task Tracker

> Status indicators: `[ ]` pending | `[~]` in progress | `[x]` done

---

## Phase 1 -- Authentication, Registration, User Roles, Basic Navigation

> Step file: `docs/steps-1.md`

- [x] 1.1 Database and Prisma setup (schema, User model, migration, singleton client, SQLite pragmas)
- [x] 1.2 Authentication -- iron-session setup (session config, helpers: getSession, requireAuth, requireRole)
- [x] 1.3 Registration page (`/register`) -- form with all fields, Zod validation, ninja alias auto-gen
- [x] 1.4 Registration API (`POST /api/auth/register`) -- validation, bcrypt hash, email uniqueness, alias gen
- [x] 1.5 Login page (`/login`) -- form, Zod validation, error handling
- [x] 1.6 Login API (`POST /api/auth/login`) -- credential check, session creation, active check
- [x] 1.7 Role-based redirect (`/`) -- redirect based on session role
- [x] 1.8 Logout (API + UI button)
- [x] 1.9 App layout and navigation shell (root layout, authenticated layout, header, sidebar, role-aware nav)
- [x] 1.10 Profile page (`/profile`) -- view/edit name, alias, avatar, password, sound toggle
- [x] 1.11 Middleware -- route protection (public routes, role-based guards)
- [x] 1.12 Health check endpoint (`GET /api/health`)
- [x] 1.13 Environment configuration (`.env.example`, `.gitignore`)
- [x] 1.14 Seed script (sample users for all 4 roles)

---

## Phase 2 -- Ticket and Bug Forms, Priority Queue, Status Management

> Step file: `docs/steps-2.md`

- [x] 2.1 Prisma schema -- Ticket, BugReport, TicketEvent, ReorderRequest models + migration
- [x] 2.2 Public ID generation utility (TKT-XXXX, BUG-XXXX, sequential, transaction-safe)
- [x] 2.3 Priority order calculation utility (severity weight + age, initial positioning)
- [x] 2.4 Create Ticket form page (`/support/ticket/new`)
- [x] 2.5 Create Bug Report form page (`/support/bug/new`) with ClickUp export button
- [x] 2.6 Ticket CRUD API (POST, GET list, GET detail, PATCH status/severity/deadline/assign)
- [x] 2.7 Mission Board -- Support view (`/support/queue`) with filters, search, reorder button stub
- [x] 2.8 Mission Board -- Dev view (`/dev/queue`) with assign-to-me, assign-to-other, filters
- [x] 2.9 Ticket detail page (`/ticket/[publicId]`) with header, body, bug fields, timeline, action buttons
- [x] 2.10 My Items page (`/support/my-items`) grouped by status
- [x] 2.11 ClickUp export utility (Markdown formatter + clipboard copy)
- [x] 2.12 Zod validation schemas (shared in `packages/ui/src/lib/schemas/`)

---

## Phase 3 -- Real-Time Notifications, Sound Alerts, Ninja Board

> Step file: `docs/steps-3.md`

- [x] 3.1 SSE infrastructure (endpoint, connection registry, broadcast utils, keep-alive)
- [x] 3.2 Client-side SSE hook (`useSSE`) with auto-reconnect and typed event dispatch
- [x] 3.3 Notification model (Prisma) and API (GET list, PATCH read, POST read-all)
- [x] 3.4 Notification creation service (server-side functions for each event type)
- [x] 3.5 Integrate notifications into ticket lifecycle (create, assign, status change, done, cancelled)
- [x] 3.6 Notification center UI (bell icon, unread badge, dropdown panel, mark as read)
- [x] 3.7 Sound alert system (5 tones, Web Audio API, mute support, autoplay handling)
- [x] 3.8 Sound integration with SSE events (map event types to tones)
- [x] 3.9 Ninja Board page (`/dev`) -- developer cards grid (avatar, name, alias, task, ticket, status)
- [x] 3.10 Developer status model (currentTask, currentStatus fields + API endpoints)
- [x] 3.11 Ninja Board live updates via SSE (DEVELOPER_STATUS_UPDATED events)
- [x] 3.12 Developer self-update interaction (click own card, edit task/status modal)
- [x] 3.13 Notification banner on Ninja Board (new ticket/bug arrival banner)

---

## Phase 4 -- Help Requests, Checkpoints, Reorder Request Flow

> Step file: `docs/steps-4.md`

- [x] 4.1 Prisma schema -- HelpRequest and HelpResponse models + migration
- [x] 4.2 Smoke Signal UI (button, modal with context message, optional ticket link)
- [x] 4.3 Help Request API (POST create, GET list, POST respond)
- [x] 4.4 Help Request notification on Ninja Board (pop-up with "I can help" button)
- [x] 4.5 Checkpoint schema and config (CheckpointConfig, Checkpoint models, seed defaults)
- [x] 4.6 Checkpoint scheduler (interval-based, active hours, per-developer tracking)
- [x] 4.7 Checkpoint prompt UI (modal with task, blocked toggle, notes, submit)
- [x] 4.8 Checkpoint API (POST submit, GET history for admin)
- [x] 4.9 "No Response" indicator (10-minute timeout, warning badge on Ninja Board card)
- [x] 4.10 Reorder request flow -- full implementation (request, approve, decline, notifications)
- [x] 4.11 Support Lead direct reorder (bypass request, "Reordered by Lead" badge)
- [x] 4.12 Reorder indicators in queue (badges, animations, pending request icons)

---

## Phase 5 -- Admin Dashboard, Notification Routing, TV Mode, Theme Polish, Docker

> Step file: `docs/steps-5.md`

- [ ] 5.1 Admin dashboard -- Command Dojo (`/admin`) with stats overview
- [ ] 5.2 Team management page (`/admin/team`) -- user table, role change, deactivate, avatar
- [x] 5.3 Notification routing page (`/admin/notifications`) -- per-dev ticket/bug toggles
- [ ] 5.4 Checkpoint configuration page (`/admin/checkpoints`) -- config form + response history
- [ ] 5.5 Ticket and bug log page (`/admin/log`) -- full history with search, filter, sort, pagination
- [ ] 5.6 TV Mode -- Ninja Board display (`/dev/tv`) -- read-only, full-screen, auto-refresh
- [ ] 5.7 TV Mode admin settings (enable/disable toggle, refresh interval)
- [ ] 5.8 Global search (header search bar, publicId direct nav, title search dropdown, Ctrl+K)
- [ ] 5.9 Ninja theme polish (terminology, icons, colors, badges, consistency review)
- [ ] 5.10 Avatar system (upload, resize, initials fallback, reusable UserAvatar component)
- [ ] 5.11 Docker setup (multi-stage Dockerfile, docker-compose.yml, entrypoint with migrate)
- [ ] 5.12 Environment and production hardening (env validation, secure cookies, rate limiting, CORS)
- [x] 5.13 Error pages (custom 404, error boundary, consistent API error format)
- [ ] 5.14 Loading states (skeletons for boards, detail pages, dashboard)
- [ ] 5.15 Final integration testing (end-to-end manual test across all roles and flows)
- [ ] 5.16 Translate to portuguese -> /home/alisson/.claude/plans/kind-napping-melody.md

---

## Summary

| Phase | Tasks | Done | Status |
|-------|-------|------|--------|
| Phase 1 -- Auth and Navigation | 14 | 14 | Complete |
| Phase 2 -- Tickets and Queue | 12 | 12 | Complete |
| Phase 3 -- Real-Time and Ninja Board | 13 | 13 | Complete |
| Phase 4 -- Collaboration Features | 12 | 12 | Complete |
| Phase 5 -- Admin, TV, Polish, Docker | 15 | 2 | In Progress (13 remaining) |
| **Total** | **66** | **65** | |
