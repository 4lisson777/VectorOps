# Frontend Task: Phase 5 -- Admin Pages, TV Mode, Global Search, Theme Polish, Loading States, Avatar

## Description

Implement all frontend UI for the remaining Phase 5 tasks. This covers the Command Dojo dashboard, team management page, checkpoint config page, ticket/bug log page, TV mode display, global search with Ctrl+K, ninja theme polish, avatar system (UserAvatar component), and loading skeletons.

## Acceptance Criteria

- [ ] `/admin` (Command Dojo) shows live stats: open tickets/bugs by severity, assigned vs unassigned, avg resolution times (7d/30d), per-developer workload list
- [ ] `/admin` has a manual "Refresh" button and auto-refreshes every 60 seconds
- [ ] `/admin/team` shows a searchable, filterable table of all users with columns: avatar, name, email, role, ninja alias, last active, status
- [ ] `/admin/team` allows role change via dropdown, deactivate/reactivate via toggle, avatar upload per user
- [ ] `/admin/checkpoints` shows config form (enable/disable toggle, interval input, active hours start/end pickers) with Save button
- [ ] `/admin/checkpoints` shows checkpoint response history below the config form, filterable by developer and date range
- [ ] `/admin/log` shows full ticket/bug history table with columns: publicId, title, type, severity, status, opener, assignee, created, resolved
- [ ] `/admin/log` supports search (publicId, title), filters (type, severity, status, opener, assignee, date range), column sorting, server-side pagination
- [ ] `/admin/log` rows are clickable, navigating to `/ticket/[publicId]`
- [ ] `/admin` page includes a TV Mode settings section (enable/disable toggle, refresh interval input)
- [ ] `/dev/tv` displays a full-screen, read-only Ninja Board with no header/sidebar
- [ ] `/dev/tv` top bar shows live open ticket/bug counts by severity (colored badges)
- [ ] `/dev/tv` shows developer cards grid (avatar, name, alias, current task, status, assigned ticket)
- [ ] `/dev/tv` auto-refreshes using the configured interval (polls `/api/tv/data`)
- [ ] `/dev/tv` is optimized for large screens: larger fonts, more spacing, high contrast dark theme
- [ ] Global search in header: debounced input, calls `/api/tickets?search=...&limit=8`, shows dropdown of results
- [ ] Global search: Ctrl+K (or Cmd+K on Mac) focuses the search bar
- [ ] Global search: typing a publicId (TKT-XXXX or BUG-XXXX) and pressing Enter navigates directly to that ticket
- [ ] Reusable `UserAvatar` component: shows uploaded avatar image or initials fallback (colored circle with 2 letters)
- [ ] `UserAvatar` used consistently across: header, Ninja Board developer cards, team management, ticket detail, TV mode
- [ ] Ninja theme polish: consistent severity badge colors (White=LOW, Green=MEDIUM, Red=HIGH, Black=CRITICAL)
- [ ] Ninja theme polish: themed icons for ticket types (shuriken for tickets, scroll for bugs, smoke bomb for help requests)
- [ ] Ninja theme polish: consistent terminology (Mission Board, Ninja Board, Smoke Signal, Status Scroll, Command Dojo)
- [ ] Loading skeletons for: Mission Board (ticket card placeholders), Ninja Board (developer card placeholders), ticket detail page, admin dashboard stats
- [ ] Loading skeletons use `loading.tsx` files with Suspense boundaries where appropriate

## Pages / Components

### Pages to Implement (replace current stubs)

1. **`/admin` (Command Dojo)** -- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/admin/page.tsx`
   - Render `CommandDojoOverview` component
   - Server component that fetches initial stats, passes to client component for refresh

2. **`/admin/team`** -- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/admin/team/page.tsx`
   - Render `TeamManagement` component

3. **`/admin/checkpoints`** -- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/admin/checkpoints/page.tsx`
   - Render `CheckpointConfig` component

4. **`/admin/log`** -- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/admin/log/page.tsx`
   - Render `TicketLog` component

5. **`/dev/tv`** -- `/home/alisson/web/personal/vectorops/apps/web/app/(public)/dev/tv/page.tsx`
   - Render `TvBoard` component

### Components to Implement (replace current stubs)

1. **`CommandDojoOverview`** -- `/home/alisson/web/personal/vectorops/apps/web/components/admin/command-dojo-overview.tsx`
   - "use client" component
   - Stat cards grid: Open Tickets (by severity), Open Bugs (by severity), Avg Resolution 7d, Avg Resolution 30d, Assigned count, Unassigned count
   - Per-developer workload list with avatar, name, alias, open ticket count, progress bar
   - TV Mode settings section: enable/disable toggle, refresh interval input, Save button
   - Refresh button + auto-refresh interval (60s)

2. **`TeamManagement`** -- `/home/alisson/web/personal/vectorops/apps/web/components/admin/team-management.tsx`
   - "use client" component
   - Search input for name/email
   - Filter dropdowns for role and active status
   - Data table using shadcn Table component
   - Role change via Select dropdown (inline, saves on change)
   - Active/inactive toggle via Switch component
   - Avatar upload button per row (opens file picker, uploads to API)

3. **`CheckpointConfig`** -- `/home/alisson/web/personal/vectorops/apps/web/components/admin/checkpoint-config.tsx`
   - "use client" component
   - Top section: config form with fields (isEnabled Switch, intervalMinutes Input, activeHoursStart/End time inputs)
   - Save button that PATCHes `/api/admin/checkpoints/config`
   - Bottom section: checkpoint history table
   - Developer filter Select, date range inputs
   - Table: developer name, current task, blocked (badge), notes, timestamp
   - Pagination controls

4. **`TicketLog`** -- `/home/alisson/web/personal/vectorops/apps/web/components/admin/ticket-log.tsx`
   - "use client" component
   - Search input (debounced, searches publicId and title)
   - Filter bar: type Select, severity Select, status Select, date range inputs
   - Data table with sortable column headers (click to sort)
   - Clickable rows that navigate to `/ticket/[publicId]`
   - Pagination (page numbers, prev/next buttons)

5. **`TvBoard`** -- `/home/alisson/web/personal/vectorops/apps/web/components/tv/tv-board.tsx`
   - "use client" component
   - Full-screen dark layout (bg-[oklch(0.12_0.03_265)])
   - Top bar: ShinobiOps logo, severity count badges (4 for tickets, 4 for bugs), clock
   - Developer cards grid: large cards with avatar, name, alias, status badge, current task, assigned ticket info
   - Auto-refresh via polling (interval from TV config, default 30s)
   - "Last updated" timestamp indicator
   - No interactive elements (read-only)

6. **`UserAvatar`** -- Create new shared component at `/home/alisson/web/personal/vectorops/apps/web/components/user-avatar.tsx`
   - Props: name (string), avatarUrl (string | null), size ("sm" | "md" | "lg"), className
   - Uses shadcn Avatar/AvatarImage/AvatarFallback
   - Fallback: colored circle with initials (first letter of first and last name)
   - Color derived from name hash for consistency

7. **`GlobalSearch`** -- Enhance the search in `/home/alisson/web/personal/vectorops/apps/web/components/layout/header.tsx`
   - Add debounced API call to `/api/tickets?search=...&limit=8` as user types
   - Show dropdown/popover below search input with matching results
   - Each result shows: publicId, title, severity badge, status badge
   - Click result to navigate to `/ticket/[publicId]`
   - Press Enter on a publicId pattern (TKT-/BUG-XXXX) to navigate directly
   - Ctrl+K / Cmd+K keyboard shortcut to focus the search input
   - Close dropdown on blur or Escape

### Loading State Files to Create

- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/admin/loading.tsx` -- skeleton for Command Dojo
- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/dev/loading.tsx` -- skeleton for Ninja Board
- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/support/queue/loading.tsx` -- skeleton for Mission Board
- `/home/alisson/web/personal/vectorops/apps/web/app/(protected)/ticket/[publicId]/loading.tsx` -- skeleton for ticket detail

## Mock Data

No mock data phase. All components fetch from real API endpoints. Use loading skeletons during fetches and handle empty states gracefully.

## Design Reference

- Use shadcn/ui components from `@workspace/ui/components/*`
- Available components: Avatar, Badge, Button, Card, Dialog, DropdownMenu, Form, Input, Label, Popover, Select, Separator, Skeleton, Switch, Table, Tabs, Textarea, Toast, Tooltip
- SeverityBadge already exists at `@workspace/ui/components/severity-badge`
- Utility: `cn()` from `@workspace/ui/lib/utils`
- Color palette: Primary deep navy `#1A1A2E` / oklch(0.15 0.03 265), Accent crimson `#E94560` / oklch(0.56 0.22 15)
- Severity colors: LOW=white/neutral, MEDIUM=green, HIGH=red, CRITICAL=black
- Dark mode: already configured via next-themes, use `dark:` prefixes
- TV Mode: extra dark background oklch(0.12 0.03 265), white text, large fonts, high contrast

## Ninja Theme Consistency Checklist

Review and update all pages to ensure:
- "Mission Board" (not "Ticket Queue") on support/dev queue pages
- "Ninja Board" (not "Dev Board" or "Team Board") on dev page
- "Smoke Signal" (not "Help Request") in UI labels and buttons
- "Status Scroll" (not "Checkpoint") in UI labels
- "Command Dojo" (not "Admin Dashboard") on admin page
- Developer cards referred to as "Ninja" cards where appropriate
- Shuriken icon SVG for ticket type indicators
- Scroll icon SVG for bug type indicators  
- Smoke bomb icon SVG for help request indicators
- Consistent use of crimson accent (#E94560) for primary actions and important badges

## Rules to Follow
- Use `"use client"` only when state, effects, or event handlers are needed
- Import UI from `@workspace/ui/components/*`
- Use `cn()` for Tailwind class merging
- Accept `className` prop on reusable components
- All TypeScript, strict mode, no implicit any
- Responsive: works at 1280px desktop minimum, degrade gracefully for tablets
- Accessible: proper aria labels, keyboard navigation, focus management
- Use existing patterns from other pages in the codebase for data fetching, error handling, and state management

## Communication File
`/home/alisson/web/personal/vectorops/.claude/communication/phase5-admin-tv-polish-docker.md`

## Key Existing Files Reference
- Header (search lives here): `/home/alisson/web/personal/vectorops/apps/web/components/layout/header.tsx`
- Sidebar: `/home/alisson/web/personal/vectorops/apps/web/components/layout/sidebar.tsx`
- AppShell: `/home/alisson/web/personal/vectorops/apps/web/components/layout/app-shell.tsx`
- Developer card: `/home/alisson/web/personal/vectorops/apps/web/components/dev/developer-card.tsx`
- Ninja board: `/home/alisson/web/personal/vectorops/apps/web/components/dev/ninja-board.tsx`
- Ticket card: `/home/alisson/web/personal/vectorops/apps/web/components/tickets/ticket-card.tsx`
- Mission board: `/home/alisson/web/personal/vectorops/apps/web/components/mission-board/mission-board.tsx`
- Notification center: `/home/alisson/web/personal/vectorops/apps/web/components/layout/notification-center.tsx`
- Existing admin stubs: `/home/alisson/web/personal/vectorops/apps/web/components/admin/` (all 5 files are stubs returning null)
- TV board stub: `/home/alisson/web/personal/vectorops/apps/web/components/tv/tv-board.tsx`
- Skeleton component: `@workspace/ui/components/skeleton`
- SeverityBadge: `@workspace/ui/components/severity-badge`
