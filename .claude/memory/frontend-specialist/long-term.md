# Frontend Specialist — Long-Term Memory

## Project: ShinobiOps

### Component Locations
- Shared UI primitives: `packages/ui/src/components/*.tsx`
- App-specific components: `apps/web/components/[feature]/`
- Theme/styles: `packages/ui/src/styles/globals.css`
- ThemeProvider: `apps/web/components/theme-provider.tsx`
- Ticket-specific components: `apps/web/components/tickets/`

### Routing Structure
- `(auth)` group: unauthenticated pages (login, register) — navy background layout
- `(protected)` group: authenticated pages with AppShell (header + sidebar)
- `(public)` group: no-auth pages like /dev/tv

### Design System Patterns
- Primary navy: `oklch(0.18 0.05 265)` = deep navy `#1A1A2E`
- Crimson accent: `oklch(0.56 0.22 15)` = `#E94560`
- Use CSS oklch notation directly in Tailwind classes: `bg-[oklch(0.56_0.22_15)]`
- Sidebar uses CSS variables: `bg-sidebar`, `text-sidebar-foreground`, etc.
- All shared components use `"radix-ui"` package (not `@radix-ui/react-*` directly)
- Date inputs need `[color-scheme:light] dark:[color-scheme:dark]` class to respect theme
- TV mode extra-dark background: `oklch(0.12 0.03 265)`

### shadcn/ui Pattern
- Style: `radix-mira` (not default)
- Icon lib: `hugeicons` (NOT lucide-react — do not import lucide-react)
- All components go in `packages/ui/src/components/`
- Components import from `"radix-ui"` (the monorepo package with all primitives)

### Auth Flow
- Session stored in iron-session HTTP-only cookie: `shinobiops_session`
- Session shape: `{ userId, role, name }` (from `@/lib/session`)
- After login/register → redirect to role home
  - TECH_LEAD/DEVELOPER → `/dev`
  - SUPPORT_LEAD/SUPPORT_MEMBER → `/support`
- Middleware guards all protected routes; roles checked against prefix map

### Database Access Pattern
- Use `db` from `@/lib/db` directly in server components (not fetch to own API)
- Always serialize `Date` fields to `.toISOString()` before passing to client components
- `MissionBoard` and `TicketWithRelations` type lives in `apps/web/components/tickets/mission-board.tsx`

### Toast / Notification Pattern
- `toast.tsx` and `toaster.tsx` in packages/ui are stubs (not yet implemented via CLI)
- Use inline success/error state in forms instead (`React.useState<string | null>`)
- Show a brief status message (role="status") for success, role="alert" for errors

### Implemented Components (Phase 5)
- `UserAvatar` — `apps/web/components/user-avatar.tsx` (name, avatarUrl, size, className props)
  - Colors derived from name hash (8 predefined colors)
  - Sizes: sm=size-7, md=size-10, lg=size-14
  - Used across: header, developer-card, ticket-card, ticket-timeline, ticket-detail, team-management, checkpoint-config, tv-board, command-dojo-overview
- `CommandDojoOverview` — `apps/web/components/admin/command-dojo-overview.tsx`
  - Auto-fetch on mount when initialStats is null
  - Auto-refresh every 60s
  - TV mode settings section (PATCH /api/admin/tv-config)
- `TeamManagement` — `apps/web/components/admin/team-management.tsx`
  - Role change (PATCH /api/admin/users/[id])
  - Active toggle (same endpoint, handles 422 for own account)
  - Avatar upload (POST multipart/form-data to /api/admin/users/[id]/avatar)
- `CheckpointConfig` — `apps/web/components/admin/checkpoint-config.tsx`
  - Renamed "Status Scroll" in UI (ninja theme)
  - ISO datetime conversion for from/to history filter params
- `TicketLog` — `apps/web/components/admin/ticket-log.tsx`
  - sortBy values: createdAt | resolvedAt | severity | status | priorityOrder
  - Clickable rows navigate to /ticket/[publicId]
- `TvBoard` — `apps/web/components/tv/tv-board.tsx`
  - Polls /api/tv/data, uses server's refreshInterval for scheduling
  - Handles 503 (TV mode disabled) gracefully
  - LiveClock component with 1s interval
- GlobalSearch (in header) — debounced, Ctrl+K, dropdown, direct publicId navigation

### Loading Skeletons (Phase 5)
- `/admin/loading.tsx` — Command Dojo skeleton
- `/dev/loading.tsx` — Ninja Board skeleton  
- `/support/queue/loading.tsx` — Mission Board skeleton
- `/ticket/[publicId]/loading.tsx` — Ticket detail skeleton

### Multitenancy UI Patterns (2026-04-23)
- Impersonation detection: `session.isSuperAdmin && session.originalOrganizationId && originalOrganizationId !== organizationId`
- Super-admin GET /api/super-admin/organizations returns `pagination` object (not flat fields)
- Super-admin GET /api/super-admin/organizations/[id] returns `totalTicketCount` and `activeTicketCount` as top-level numbers
- POST /api/super-admin/organizations doesn't return counts — default to 0
- TV route requires `?org=SLUG` — returns 400 without it
- `/api/auth/me` returns `organizationName` and `organizationSlug` as flat fields on user object
- Invite code validation: GET /api/invites/[code]; errors: 404=not found, 409=used, 410=expired, 403=inactive org
- Register modes: presence of `organizationName` = create-org mode; `inviteCode` = join mode
- Login 409 response: `{ error: "...", organizations: [{ name, slug }] }`
- ImpersonationBanner: amber colors, calls POST /api/super-admin/stop-impersonating
- Org settings: GET/PATCH /api/organizations/current (no /[id] needed for current user's org)
- Invite management: uses /api/organizations/[id]/invites (id from session.organizationId)

### Implemented Components (Multitenancy Phase)
- `OrganizationSettings` — `apps/web/components/admin/organization-settings.tsx`
- `InviteManagement` + `NewInviteDialog` + `InviteRow` — `apps/web/components/admin/invite-management.tsx`
- `OrgList` + `CreateOrgDialog` — `apps/web/components/super-admin/org-list.tsx`
- `OrgDetail` — `apps/web/components/super-admin/org-detail.tsx`
- Super-admin pages: `/super-admin/`, `/super-admin/organizations`, `/super-admin/organizations/[id]`
- Org settings page: `/admin/organization`

### Implemented Components (Phase 1)
- `Input`, `Label`, `Card*`, `Badge`, `Avatar*`, `Separator`, `DropdownMenu*`, `Select*`, `Tabs*` — all in `packages/ui/src/components/`
- `SeverityBadge` — implemented in `packages/ui/src/components/severity-badge.tsx`
- `LoginForm`, `RegisterForm` — in `apps/web/components/auth/`
- `Header`, `Sidebar`, `AppShell` — in `apps/web/components/layout/`
- `ProfileForm` — in `apps/web/components/profile/`

### Implemented Components (Phase 3)
- `SSEProvider` + `useSSEContext` — `apps/web/lib/sse-context.tsx` (lib, not hooks folder)
- `useSSE` — `apps/web/hooks/use-sse.ts` (low-level EventSource, handlerRef pattern)
- `useSoundAlerts` — `apps/web/hooks/use-sound-alerts.ts` (lazy AudioContext, 5 tones A-E)
- `useNotifications` — `apps/web/hooks/use-notifications.ts` (fetch + SSE + markRead/markAllRead)
- `NotificationCenter` — `apps/web/components/layout/notification-center.tsx` (Popover + bell badge)

### Implemented Components (Persistent Notifications)
- `useBrowserNotifications` — `apps/web/hooks/use-browser-notifications.ts` (requestPermission, showNotification, closeNotification; deduplicates by tag)
- `usePersistentNotifications` — `apps/web/hooks/use-persistent-notifications.ts` (pendingRef pattern for stable interval callback; 30s repeat; SSE subscription; acknowledges via API)
- `PersistentNotificationBanner` — `apps/web/components/notifications/persistent-notification-banner.tsx` (fixed top-right overlay; individual + "Reconhecer Todas" bulk ack)
- `PersistentNotificationManager` — `apps/web/components/notifications/persistent-notification-manager.tsx` (thin orchestrator; mounted inside SSEProvider in AppShell)
- `AppShell` updated to mount PersistentNotificationManager inside SSEProvider
- `DeveloperCard` + `DevCardData` type — `apps/web/components/dev/developer-card.tsx`
- `NinjaBoard` — `apps/web/components/dev/ninja-board.tsx`
- `NotificationRouting` — `apps/web/components/admin/notification-routing.tsx` (updated: accepts `eligibleRoles: RoleKey[] | null` prop; fetches multi-role users in parallel; shows role Badge per member)
- `RoleNotificationConfig` — `apps/web/components/admin/role-notification-config.tsx` (role-level notification gates: notifyOnCreation + notifyOnAssignment toggles; onConfigChange callback)
- `AdminNotificationsContent` — `apps/web/components/admin/admin-notifications-content.tsx` (orchestrator: manages eligibleRoles state shared between RoleNotificationConfig and NotificationRouting)
- `Popover/PopoverContent/PopoverTrigger` — `packages/ui/src/components/popover.tsx`
- `Table/TableHeader/TableBody/TableRow/TableHead/TableCell` — `packages/ui/src/components/table.tsx`
- `Skeleton` — `packages/ui/src/components/skeleton.tsx`
- `Switch` — `packages/ui/src/components/switch.tsx`

### SSE Architecture Pattern
- One `EventSource` per page (shared via SSEProvider wrapping AppShell's main content area)
- `useSSEContext()` → `{ subscribe: (fn) => unsubscribeFn }` — components call subscribe in useEffect
- `handlerRef` pattern in useSSE keeps effect stable (empty deps array, handler updated via ref)
- SSE payload is `Record<string, unknown>` — cast via `event.payload as unknown as YourType`

### Implemented Components (Phase 2)
- `TicketForm` — `apps/web/components/tickets/ticket-form.tsx`
- `BugForm` — `apps/web/components/tickets/bug-form.tsx`
- `TicketCard` — `apps/web/components/tickets/ticket-card.tsx`
- `MissionBoard` + `TicketWithRelations` type — `apps/web/components/tickets/mission-board.tsx`
- `TicketTimeline` + `TicketEventWithActor` type — `apps/web/components/tickets/ticket-timeline.tsx`
- `TicketActions` + `TicketForActions` type — `apps/web/components/tickets/ticket-actions.tsx`
- `CopyIdButton` — `apps/web/components/tickets/copy-id-button.tsx`
- `ClickUpCopyButton` — `apps/web/components/tickets/clickup-copy-button.tsx`

### API Endpoints (Role Notification Config) — Called by frontend
- GET /api/admin/role-notification-config — returns { configs: [{ role, notifyOnCreation, notifyOnAssignment }] } ordered by role alphabetically; auto-provisions missing rows
- PATCH /api/admin/role-notification-config — body: { configs: [{ role, notifyOnCreation?, notifyOnAssignment? }] }; partial update; returns full updated list

### API Endpoints (Phase 5) — Called by frontend
- GET /api/admin/stats — Command Dojo stats (ticketsByStatus/ticketsBySeverity as arrays)
- GET /api/admin/users — user list (role?, isActive?, search? query params)
- PATCH /api/admin/users/[id] — role and/or isActive change (422 if deactivating own account)
- POST /api/admin/users/[id]/avatar — multipart/form-data with field name "avatar"
- GET /api/admin/checkpoints/config — checkpoint config
- PATCH /api/admin/checkpoints/config — update checkpoint config
- GET /api/admin/checkpoints/history — checkpoint history (userId?, from?, to? as ISO datetimes)
- GET /api/tickets — extended with sortBy, sortOrder, createdFrom, createdTo, resolvedFrom, resolvedTo
- GET /api/tv/data — public, returns developers + ticketCounts + bugCounts + refreshInterval
- GET /api/admin/tv-config — TV config
- PATCH /api/admin/tv-config — update TV config (isEnabled, refreshInterval 10-300)

### API Endpoints (Phase 3) — Called by frontend
- GET /api/sse — EventSource stream (used by useSSE hook)
- GET /api/notifications?limit=N — fetch notifications list + unreadCount
- PATCH /api/notifications/[id]/read — mark single notification read
- PATCH /api/notifications/read-all — mark all notifications read
- PATCH /api/users/me/status — update devStatus and/or currentTask
- GET /api/users/[id]/notifications — get notifyTickets/notifyBugs (TECH_LEAD only)
- PATCH /api/users/[id]/notifications — set notifyTickets/notifyBugs (TECH_LEAD only)

### API Endpoints (Persistent Notifications) — Called by frontend
- GET /api/notifications/pending — returns all requiresAck=true && acknowledgedAt=null notifications for current user
- PATCH /api/notifications/[id]/acknowledge — acknowledges a notification (sets acknowledgedAt); emits SSE `notification:acknowledged` for cross-tab sync

### API Endpoints (Phase 1)
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET /api/auth/me
- GET /api/health
- GET /api/users/me (added by frontend agent)
- PATCH /api/users/me (name, ninjaAlias)
- PATCH /api/users/me/password (currentPassword, newPassword)

### API Endpoints (Phase 2) — Called by frontend
- POST /api/tickets — create ticket or bug (body: { type: "TICKET"|"BUG", ...fields })
- GET /api/tickets — list tickets (used in server components directly via Prisma instead)
- PATCH /api/tickets/[id] — update status, severity, deadline
- POST /api/tickets/[id]/assign — assign ticket to a user ({ assignedToId: string })

### Persistent Notification Patterns
- `pendingRef` pattern: keep a `useRef` in sync with state via `useEffect` so the `setInterval` callback always sees fresh state without being recreated on every state change
- `notification:acknowledged` SSE event payload: `{ notificationId: string; userId: string }` — remove matching id from pending queue
- `notification:new` SSE payload now includes `requiresAck: boolean` and `id` fields
- Browser Notifications: use `tag` param to replace (not stack) OS-level notification on repeated ticks
- Close existing notification before re-creating with same tag to force re-alert on macOS
- Sound tone mapping for persistent: TICKET_CREATED=A, BUG_CREATED=B, TICKET_ASSIGNED=A
- `PersistentNotificationManager` mounts inside SSEProvider (not outside) so it can call `useSSEContext()`

### Key Gotchas
- `radix-ui` package re-exports all primitives — use `import { Avatar } from "radix-ui"` pattern
- Sidebar CSS vars: defined in globals.css, light mode = navy sidebar, dark mode = deep navy
- Sound mute preference stored in localStorage key: `shinobiops:soundEnabled`
- Protected layout fetches avatarUrl from DB on each navigation — will be optimized in later phases
- Prisma query results have `Date` objects — must serialize to string before passing to client components
- `TicketWithRelations` used by MissionBoard stores deadline/createdAt as `string | Date` to be flexible
- `details/summary` HTML elements work well for collapsible sections without extra JS (used in My Items page)
- Severity badge belt-rank system: LOW=white, MEDIUM=green, HIGH=red, CRITICAL=black
- TV mode: polls use intervalRef pattern — update interval dynamically based on server response
- Checkpoint history `from`/`to` params must be full ISO datetime strings (not date-only strings)
- Avatar upload: multipart/form-data with field name exactly `avatar`
- Admin stats: ticketsBySeverity is `Array<{severity, count}>` NOT a key-value map
