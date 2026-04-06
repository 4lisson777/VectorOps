# Tech Leader -- Long-Term Memory

## Project Patterns
- Monorepo: Turbo + npm workspaces. Apps in apps/, packages in packages/
- Auth: requireAuth() from @/lib/auth returns { session, error }
- DB: db from @/lib/db using globalThis singleton for HMR safety
- Session in server components: getSession() from @/lib/session
- Date serialization: ISO strings when passing from server to client components
- Validation: Zod schemas in @/lib/schemas/
- UI: shadcn/ui from @workspace/ui/components/*, HugeIcons, cn() utility
- No rules directory exists yet at ai-driven-project/rules/

## Phase History
- Phase 1 (complete): Auth, pages, base layout
- Phase 2 (complete): Tickets, bugs, priority queue, detail page, timeline, CRUD API
- Phase 3 (complete): Real-time notifications, SSE, sound alerts, Ninja Board, developer status
- Phase 4 (complete): Help requests, checkpoints, reorder request flow
- Phase 5 (in progress): Admin dashboard, team mgmt, TV mode, theme polish, Docker. Done: 5.3 notification routing, 5.13 error pages. 13 tasks remaining.

## Stubs Inventory (Phase 5)
Admin component stubs exist returning null: command-dojo-overview, team-management, checkpoint-config, ticket-log, tv-board. Admin page stubs exist: /admin (has placeholder UI), /admin/team, /admin/checkpoints, /admin/log (return null). TV page at (public)/dev/tv has placeholder UI. Header has basic search but no dropdown/debounce/Ctrl+K.

## i18n Pattern
- For single-language apps, a simple `t()` utility function importing a typed const object is far simpler than React Context + hooks
- React Context approach fails for Server Components (no hooks in RSC)
- TypeScript const objects give autocompletion; JSON files do not
- Keep API responses in English even when UI is translated

## Patterns Learned
- Checkpoint config API already exists at /api/checkpoints/config (GET + PATCH with TECH_LEAD guard)
- Users API at /api/users already has role/isActive filters but lacks search and admin fields
- Tickets API at /api/tickets already supports search, pagination, and basic filters
- TV mode page lives under (public) route group for no-auth access
- Admin layout is transparent pass-through; role guard is in middleware

## Context System
- Master context at ai-driven-project/master-context.md
- Context files follow strict format with IDs (CTX-CATEGORY-NNN)
- After implementation, context files should be updated (especially CTX-FEAT-002, CTX-FEAT-004, CTX-INFRA-003, CTX-CORE-002)
