# Frontend Task: Phase 3 -- Real-Time Notifications UI, Sound Alerts, Ninja Board, and Admin Notification Routing

## Description
Implement the client-side real-time layer: SSE context provider, notification center with sound alerts, the Ninja Board with live developer status cards, and the admin notification routing page. All components consume a shared SSE connection and react to server-pushed events in real time.

## Acceptance Criteria
- [ ] SSE context provider (`SSEProvider`) shares a single EventSource connection across all components in the AppShell
- [ ] `useSSE` hook connects to `/api/sse` with exponential backoff reconnection (max 30s, 10 retries)
- [ ] `useNotifications` hook fetches notifications on mount, subscribes to SSE for live updates, and exposes `markRead`/`markAllRead`
- [ ] `useSoundAlerts` hook plays Web Audio API tones (no audio files) mapped to notification types, respects `localStorage` mute setting
- [ ] NotificationCenter component shows bell icon with unread badge count, opens a Popover with notification list, plays sounds on new notifications
- [ ] Header component uses NotificationCenter instead of the static bell button (replace lines 166-173)
- [ ] AppShell wraps its content with SSEProvider
- [ ] DeveloperCard shows avatar, name, ninja alias, status badge (color-coded), current task, and assigned ticket
- [ ] DeveloperCard allows the current user to change their own status via dropdown and edit their own current task inline
- [ ] NinjaBoard displays a responsive grid of DeveloperCards, updates live via SSE events
- [ ] Dev page (`/dev`) is a server component that fetches developers and passes data to NinjaBoard
- [ ] NotificationRouting admin component shows a table of developers with toggleable notification preferences
- [ ] Admin notifications page (`/admin/notifications`) renders the NotificationRouting component

## Pages / Components

### New Files
- **`apps/web/lib/sse-context.tsx`** -- SSEProvider component + useSSEContext hook. Single EventSource per AppShell mount, fan-out to subscribers via `Set<Subscriber>` ref.
- **`apps/web/hooks/use-sse.ts`** -- Low-level EventSource hook with exponential backoff. Uses `handlerRef` pattern so callback identity changes do not re-create the connection.
- **`apps/web/hooks/use-notifications.ts`** -- Fetches `GET /api/notifications` on mount, subscribes to `notification:new` via SSEContext, exposes `{ notifications, unreadCount, isLoading, markRead(id), markAllRead, refetch }`.
- **`apps/web/hooks/use-sound-alerts.ts`** -- Web Audio API oscillator tones. Lazy AudioContext creation. 5 tones: A=880Hz sine 300ms (TICKET_CREATED), B=440Hz sawtooth 500ms (BUG_CREATED), C=660Hz triangle 400ms (help request), D=528Hz sine 250ms (checkpoint), E=1046Hz sine 200ms (TICKET_DONE/CANCELLED). Checks `localStorage.getItem("vectorops:soundEnabled") !== "false"` before playing.

### Modified Files
- **`apps/web/components/layout/app-shell.tsx`** -- Wrap children + Header with `<SSEProvider>`.
- **`apps/web/components/layout/header.tsx`** -- Replace the static bell button (lines 166-173) with `<NotificationCenter />`.
- **`apps/web/components/layout/notification-center.tsx`** -- Implement: bell icon + red unread badge, Popover with scrollable notification list, each item shows title/body/relative time/unread dot, click navigates to `/ticket/{publicId}` and marks read, footer has "Mark all as read" button. Uses `useNotifications()` + `useSoundAlerts()` + `useSSEContext()`. Plays tone on `notification:new` events (mapping: TICKET_CREATED->A, BUG_CREATED->B, TICKET_DONE/CANCELLED->E).
- **`apps/web/components/dev/developer-card.tsx`** -- Full interactive card. Props: `{ dev: { id, name, ninjaAlias, avatarUrl, devStatus, currentTask, assignedTicket? }, isCurrentUser, onStatusChange, onTaskChange }`. Status badge colors: ACTIVE=green, IN_CHECKPOINT=amber, BLOCKED=red, HELPING=blue. If isCurrentUser: status badge opens DropdownMenu with 4 options calling `PATCH /api/users/me/status`; currentTask is inline-editable (click to edit, blur/Enter to save).
- **`apps/web/components/dev/ninja-board.tsx`** -- Props: `{ initialDevs: DevCardData[], currentUserId: string }`. State initialized from initialDevs. Subscribes via useSSEContext: `developer:status_changed` updates matching card in state, `ticket:assigned` triggers refetchDevs. Stats header (active/blocked counts). Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`. Includes `refetchDevs()` via `GET /api/users?role=DEVELOPER&isActive=true`.
- **`apps/web/app/(protected)/dev/page.tsx`** -- Server component: fetch devs from DB with `devStatus`, `currentTask`, and first active assigned ticket. Serialize dates to ISO strings. Pass to `<NinjaBoard initialDevs={...} currentUserId={session.userId} />`.
- **`apps/web/components/admin/notification-routing.tsx`** -- Client component: fetch devs with notification prefs, render table with per-row toggles for `notifyTickets`/`notifyBugs`, call `PATCH /api/users/[id]/notifications` on toggle.
- **`apps/web/app/(protected)/admin/notifications/page.tsx`** -- Render `<NotificationRouting />`.

## Mock Data
No mock data phase needed. The backend will be implemented first (or concurrently). The frontend should call real API endpoints. If backend is not ready yet, the hooks should handle loading/error states gracefully and show empty states.

## Design Reference
- Use shadcn/ui components: `Popover`, `Button`, `Badge`, `DropdownMenu`, `Switch`, `Table`, `Card`, `Avatar`, `Input`
- Import from `@workspace/ui/components/*`
- Colors: follow existing theme tokens in `globals.css`
- Status badge colors: green (`text-green-500`/`bg-green-500/10`), amber, red, blue
- Icons: use HugeIcons (already the project icon library)
- Dark mode: all components must support dark mode via `dark:` Tailwind prefixes
- Refer to `ai-driven-project/utilities/ui-system.md` for design tokens and component conventions

## Rules to Follow
- Use `"use client"` directive only on components that need state, effects, or event handlers
- Server components by default (page.tsx files should be server components where possible)
- Import shared UI from `@workspace/ui/components/*`
- Use `cn()` from `@workspace/ui/lib/utils` for merging Tailwind classes
- Follow date serialization pattern from `dev/queue/page.tsx` when passing server data to client components
- Session access in server components: use `getSession()` from `@/lib/session`
- Follow existing component patterns in the codebase for consistency

## Communication File
`.claude/communication/phase3-realtime-notifications.md`

## Detailed Plan Reference
Full implementation spec: `/home/alisson/.claude/plans/starry-zooming-acorn.md` (steps 6-11)
