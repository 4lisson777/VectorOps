# ShinobiOps User Stories & QA Test Cases

> This document defines testable user stories derived from the PRD. Each story includes acceptance criteria suitable for Playwright automation.

---

## Authentication & Registration

### US-1: User self-registration with role selection

**As a** new team member  
**I want to** register myself with name, email, password, and role  
**So that** I can access the ShinobiOps application

**Acceptance Criteria:**
- [ ] Registration form displays all required fields: name, email, password, role (select), avatar (optional)
- [ ] Ninja alias is auto-generated but user can override it
- [ ] Email must be unique; submitting duplicate email shows error
- [ ] Password hashing is applied (no plaintext stored)
- [ ] On success, user is redirected to role-specific home view
- [ ] All 4 roles can be selected: Tech Lead, Developer, Support Member, Support Lead
- [ ] Avatar upload is optional; system generates initials fallback if none provided

**Test File:** `apps/web/e2e/auth-registration.spec.ts`

---

### US-2: User login with session persistence

**As a** registered user  
**I want to** log in with email and password  
**So that** I can access my team view

**Acceptance Criteria:**
- [ ] Login form accepts email and password
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to role-based home (e.g., dev → Ninja Board, support → action selector)
- [ ] Session is persisted in HTTP-only cookie
- [ ] Logging out clears the session
- [ ] Accessing protected routes without session redirects to login

**Test File:** `apps/web/e2e/auth-login.spec.ts`

---

### US-3: User profile management

**As a** any logged-in user  
**I want to** update my profile (name, avatar, password)  
**So that** my information is current

**Acceptance Criteria:**
- [ ] Profile page is accessible at `/profile`
- [ ] User can update name, avatar, and password
- [ ] Ninja alias can be edited and saved
- [ ] Sound alert mute toggle works and persists
- [ ] Changes are saved and reflected immediately on reload
- [ ] Password change requires old password confirmation

**Test File:** `apps/web/e2e/user-profile.spec.ts`

---

## Support Team Features

### US-4: Create a new ticket

**As a** support member  
**I want to** open a ticket for a dev team request  
**So that** the dev team is notified and can address it

**Acceptance Criteria:**
- [ ] Ticket form has fields: title (max 120), description, severity (select: Low/Medium/High/Critical), deadline (date picker)
- [ ] All fields are required
- [ ] On submit, ticket is created with status "Open"
- [ ] Public ID (TKT-XXXX) is generated and displayed
- [ ] Ticket enters priority queue (severity-based ordering)
- [ ] Dev team receives real-time notification + sound alert
- [ ] Opener is redirected to ticket detail page

**Test File:** `apps/web/e2e/support-create-ticket.spec.ts`

---

### US-5: Report a bug

**As a** support member  
**I want to** report a bug with structured details  
**So that** developers can quickly understand the issue

**Acceptance Criteria:**
- [ ] Bug form has fields: title, affected module, steps to reproduce, expected behavior, actual behavior, severity, deadline, environment (Production/Staging/Other), customer name/ID (optional)
- [ ] "Copy to ClickUp format" button generates pre-formatted markdown
- [ ] Markdown includes all fields and is copyable to clipboard
- [ ] On submit, bug is created with type "BUG" and status "Open"
- [ ] Public ID (BUG-XXXX) is generated
- [ ] Dev team receives distinct notification from tickets
- [ ] Distinct sound tone for bug vs. ticket

**Test File:** `apps/web/e2e/support-create-bug.spec.ts`

---

### US-6: View Mission Board (Support Queue)

**As a** support member  
**I want to** see all open tickets and bugs  
**So that** I can track the queue and status

**Acceptance Criteria:**
- [ ] Mission Board page displays all open items at `/support/queue`
- [ ] Items are ordered by: severity (Critical > High > Medium > Low), then by created_at (oldest first)
- [ ] Manual reorder overrides default sort
- [ ] Each ticket card shows: publicId (copyable), title, severity badge, status, opener, assignee (if any)
- [ ] Clickable card navigates to ticket detail
- [ ] "Request reorder" button visible on each item
- [ ] Reorder request flow works (request → approve/decline → notification)
- [ ] Support Lead actions show "Reordered by Lead" badge

**Test File:** `apps/web/e2e/support-mission-board.spec.ts`

---

### US-7: Request priority reorder

**As a** support member  
**I want to** request a higher priority position for a ticket  
**So that** critical issues are addressed sooner

**Acceptance Criteria:**
- [ ] "Request reorder" button opens a dialog with position selector and reason field
- [ ] Request is sent and ticket owner receives notification
- [ ] Owner can approve or decline from notification
- [ ] On approval, ticket moves to requested position; all members see updated order
- [ ] On decline, requester receives decline notification
- [ ] Support Lead can approve/decline any reorder regardless of ownership
- [ ] Support Lead reorder action shows distinctive badge in queue

**Test File:** `apps/web/e2e/support-reorder-request.spec.ts`

---

### US-8: View personal ticket history

**As a** support member  
**I want to** see all tickets and bugs I have opened  
**So that** I can track my submissions

**Acceptance Criteria:**
- [ ] "My Items" page at `/support/my-items` shows all tickets/bugs opened by user
- [ ] Items are grouped by status: Open, In Progress, Waiting for Info, Done, Cancelled
- [ ] Each item shows: publicId, title, severity, current status, assignee, created date, resolved date (if done)
- [ ] Clicking item navigates to detail page
- [ ] Done/cancelled items show completion timestamp

**Test File:** `apps/web/e2e/support-my-items.spec.ts`

---

## Development Team Features

### US-9: View Ninja Board (team overview)

**As a** developer  
**I want to** see all team members and their current tasks  
**So that** I understand team workload and can offer help

**Acceptance Criteria:**
- [ ] Ninja Board page displays at `/dev`
- [ ] Each developer card shows: avatar (or initials), name, ninja alias, current task (editable), status badge, assigned ticket (with severity)
- [ ] Cards are real-time updated via SSE
- [ ] Status indicators: Active, In Checkpoint, Blocked, Helping
- [ ] Clicking own card opens modal to edit task + status
- [ ] All changes persist and are visible to other team members
- [ ] No response within 10 minutes shows "No response" indicator

**Test File:** `apps/web/e2e/dev-ninja-board.spec.ts`

---

### US-10: View Mission Board (Dev Queue)

**As a** developer  
**I want to** see the priority queue of tickets and bugs  
**So that** I can claim work items

**Acceptance Criteria:**
- [ ] Mission Board page at `/dev/queue` shows all open items, sorted by priority
- [ ] "Assign to me" button allows dev to claim unassigned tickets
- [ ] Assigned ticket appears on dev's Ninja Board card immediately
- [ ] Filter by type (Ticket/Bug/All), severity, assignee, status
- [ ] Tech Lead can "Assign to another dev"
- [ ] Tech Lead can reassign already-assigned tickets
- [ ] Clickable card navigates to detail page

**Test File:** `apps/web/e2e/dev-mission-board.spec.ts`

---

### US-11: Transition ticket status

**As a** developer  
**I want to** update ticket status (Open → In Progress → Done/Waiting for Info → Cancelled)  
**So that** team and support are informed of progress

**Acceptance Criteria:**
- [ ] Ticket detail page shows status dropdown
- [ ] Valid transitions: Open → In Progress, In Progress → Waiting for Info, In Progress → Done, any → Cancelled
- [ ] Status change creates TicketEvent entry
- [ ] Support opener receives notification when ticket is Done or Cancelled
- [ ] Ticket is removed from open queue when Done/Cancelled
- [ ] All transitions are logged with timestamp and actor

**Test File:** `apps/web/e2e/dev-ticket-status.spec.ts`

---

### US-12: Send Smoke Signal (help request)

**As a** developer  
**I want to** send a help request to my teammates  
**So that** someone can unblock me quickly

**Acceptance Criteria:**
- [ ] "Send Smoke Signal" button on Ninja Board or ticket detail
- [ ] Dialog prompts for context message (required, max 280 chars)
- [ ] Help request includes requester name and message
- [ ] All other developers receive sound alert + notification
- [ ] Other devs can click "I can help" to respond
- [ ] Responder's status changes to "Helping"
- [ ] Requester is notified of responder(s)
- [ ] Distinct sound tone (Tone C) for help requests

**Test File:** `apps/web/e2e/dev-smoke-signal.spec.ts`

---

### US-13: Respond to checkpoint (Status Scroll)

**As a** developer  
**I want to** respond to periodic checkpoint prompts  
**So that** Tech Lead has visibility into my work

**Acceptance Criteria:**
- [ ] Checkpoint prompt appears at configured interval (e.g., every hour during active hours)
- [ ] Modal asks for: current task, blocked (yes/no), optional notes
- [ ] Response is submitted and recorded in Checkpoint table
- [ ] Tech Lead can view checkpoint history per developer
- [ ] If dev doesn't respond within 10 minutes, card shows "No response" badge
- [ ] Checkpoint responses are filterable by date range and developer
- [ ] Each checkpoint event is immutable (not editable after submission)

**Test File:** `apps/web/e2e/dev-checkpoint.spec.ts`

---

### US-14: Update task status (Status Scroll shortcut)

**As a** developer  
**I want to** update my current task and status at any time  
**So that** my team sees my real-time work updates

**Acceptance Criteria:**
- [ ] Clicking own Ninja Board card opens a modal with task text and status dropdown
- [ ] Task text is free-form textarea (no limit in v1.0)
- [ ] Status options: Active, In Checkpoint, Blocked, Helping, Away
- [ ] Changes are saved immediately and visible to other team members
- [ ] Changes are reflected in real-time via SSE
- [ ] No checkpoint modal is required — this is a shortcut

**Test File:** `apps/web/e2e/dev-update-task-status.spec.ts`

---

## Admin & Tech Lead Dashboard

### US-15: View Command Dojo overview

**As a** Tech Lead  
**I want to** see live dashboard stats  
**So that** I have a real-time view of team and queue health

**Acceptance Criteria:**
- [ ] Admin page at `/admin` shows stats grid:
  - [ ] Open tickets by severity (Low, Medium, High, Critical counts)
  - [ ] Open bugs by severity
  - [ ] Assigned vs. unassigned count
  - [ ] Average resolution time (7-day and 30-day rolling)
  - [ ] Per-developer workload list (avatar, name, open count, progress bar)
- [ ] "Refresh" button manually refreshes stats
- [ ] Auto-refresh every 60 seconds
- [ ] All stats update in real-time via API polling
- [ ] Stats match aggregated data from tickets table

**Test File:** `apps/web/e2e/admin-command-dojo.spec.ts`

---

### US-16: Manage team members

**As a** Tech Lead  
**I want to** view, filter, and manage all users  
**So that** I control team roster and permissions

**Acceptance Criteria:**
- [ ] Team page at `/admin/team` displays table of all users
- [ ] Columns: avatar, name, email, role, ninja alias, last active, status
- [ ] Search by name or email
- [ ] Filter by role (Tech Lead, Developer, Support Member, Support Lead)
- [ ] Filter by active status (active/inactive toggle)
- [ ] Inline role dropdown — click to change role
- [ ] Active/inactive toggle via switch (soft deactivation)
- [ ] Avatar upload button per user opens file picker
- [ ] Avatar upload triggers resize to 256x256 and converts to WebP
- [ ] Updated avatar appears immediately on user's cards/profile
- [ ] Tech Lead cannot deactivate self (guard)
- [ ] Changes persist and are reflected app-wide

**Test File:** `apps/web/e2e/admin-team-management.spec.ts`

---

### US-17: Configure notification routing

**As a** Tech Lead  
**I want to** control which developers receive which notifications  
**So that** I can customize alert delivery

**Acceptance Criteria:**
- [ ] Notifications page at `/admin/notifications` shows table of all developers
- [ ] Each developer has toggles: "Notify Tickets", "Notify Bugs"
- [ ] Help request notifications are always sent to all devs (not configurable in v1.0)
- [ ] Toggling a setting updates immediately (save on change)
- [ ] Changes persist to database
- [ ] Developers respect these settings when new items arrive

**Test File:** `apps/web/e2e/admin-notification-routing.spec.ts`

---

### US-18: Configure checkpoints

**As a** Tech Lead  
**I want to** enable/disable checkpoints and set frequency  
**So that** I can control team check-in cadence

**Acceptance Criteria:**
- [ ] Checkpoint page at `/admin/checkpoints` has config form:
  - [ ] Enable/disable toggle
  - [ ] Interval input (30 minutes to 8 hours)
  - [ ] Active hours start/end pickers (e.g., 08:00–18:00)
- [ ] Save button persists changes to CheckpointConfig
- [ ] Below config form: checkpoint history table (filterable by developer, date range)
- [ ] History table shows: developer avatar, name, task, blocked badge, notes, timestamp
- [ ] Pagination controls for history (page numbers, prev/next)
- [ ] Changes apply to all developers immediately

**Test File:** `apps/web/e2e/admin-checkpoint-config.spec.ts`

---

### US-19: View ticket and bug log

**As a** Tech Lead  
**I want to** search, filter, and sort all tickets and bugs  
**So that** I can audit history and analyze trends

**Acceptance Criteria:**
- [ ] Log page at `/admin/log` displays full history table
- [ ] Columns: publicId (clickable), title, type (Ticket/Bug badge), severity badge, status, opener, assignee, created date, resolved date
- [ ] Search by publicId or title (debounced, server-side)
- [ ] Filters: type (Ticket/Bug), severity, status, date range (created/resolved)
- [ ] Sortable column headers (click to sort asc/desc)
- [ ] Server-side pagination (page numbers, prev/next)
- [ ] Clickable rows navigate to `/ticket/[publicId]`
- [ ] Default sort: created date desc (newest first)
- [ ] All filters work together (AND logic)

**Test File:** `apps/web/e2e/admin-ticket-log.spec.ts`

---

### US-20: Configure TV Mode

**As a** Tech Lead  
**I want to** enable/disable and configure TV mode  
**So that** I can control office dashboard visibility

**Acceptance Criteria:**
- [ ] TV mode settings on Command Dojo page (`/admin`)
- [ ] Enable/disable toggle for `/dev/tv` public access
- [ ] Refresh interval input (default 30s, range 10–300s)
- [ ] Save button persists settings
- [ ] When disabled, `/api/tv/data` returns 503
- [ ] When disabled, `/dev/tv` shows "TV mode is disabled" message
- [ ] When enabled, TV board auto-refreshes at configured interval
- [ ] Changes apply immediately

**Test File:** `apps/web/e2e/admin-tv-config.spec.ts`

---

## Real-Time & Notifications

### US-21: Receive in-app notifications

**As a** any user  
**I want to** see notifications in the notification center  
**So that** I'm informed of relevant events

**Acceptance Criteria:**
- [ ] Notification bell icon in header shows unread count badge
- [ ] Clicking bell opens notification panel/dropdown
- [ ] Each notification shows: icon (type), message, timestamp
- [ ] Clicking notification navigates to relevant item (ticket, help request, etc.)
- [ ] "Mark as read" / "Mark all as read" buttons work
- [ ] Notification center shows oldest unread notifications first
- [ ] Max 50 notifications per user (pagination)
- [ ] Read vs. unread visual distinction

**Test File:** `apps/web/e2e/notifications-center.spec.ts`

---

### US-22: Receive sound alerts

**As a** developer  
**I want to** hear distinct sound alerts for different events  
**So that** I'm immediately notified even when not looking at screen

**Acceptance Criteria:**
- [ ] New Ticket → Tone A (subtle chime)
- [ ] New Bug → Tone B (urgent, distinct from A)
- [ ] Help Request → Tone C (sharp alert)
- [ ] Checkpoint → Tone D (soft pulse)
- [ ] Ticket Done/Cancelled → Tone E (resolution sound)
- [ ] Sounds respect "mute" setting from profile
- [ ] Sounds only play if user has granted autoplay permission (browser API)
- [ ] Mute toggle in profile persists
- [ ] Each sound plays once per event

**Test File:** `apps/web/e2e/sound-alerts.spec.ts`

---

### US-23: Real-time updates via SSE

**As a** any user  
**I want to** see live updates without refreshing  
**So that** my view is always current

**Acceptance Criteria:**
- [ ] SSE connection established on app load
- [ ] New tickets/bugs appear on Ninja Board immediately
- [ ] Developer status updates on Ninja Board in real-time
- [ ] Notification banner appears on Ninja Board when new items arrive
- [ ] Ticket status changes are visible across all open detail pages
- [ ] Checkpoint reminders trigger for all devs at scheduled time
- [ ] Reorder request notifications appear in real-time
- [ ] SSE connection auto-reconnects on disconnect (with exponential backoff)

**Test File:** `apps/web/e2e/sse-real-time.spec.ts`

---

## TV Mode & Public Access

### US-24: View TV mode Ninja Board

**As an** office display (public, internal network)  
**I want to** show a read-only full-screen team dashboard  
**So that** everyone can see team status at a glance

**Acceptance Criteria:**
- [ ] TV Board page at `/dev/tv` (no login required)
- [ ] Full-screen dark layout (`oklch(0.12 0.03 265)`) with white text
- [ ] Top bar shows:
  - [ ] ShinobiOps logo
  - [ ] Ticket counts by severity (4 badges: Low, Medium, High, Critical)
  - [ ] Bug counts by severity (4 badges)
  - [ ] Live clock (HH:MM:SS)
- [ ] Developer cards grid (large, optimized for 4K displays):
  - [ ] Avatar (256px)
  - [ ] Name and ninja alias
  - [ ] Status badge (colored)
  - [ ] Current task text
  - [ ] Assigned ticket (title + severity badge)
- [ ] Auto-refreshes at configured interval (polls `/api/tv/data`)
- [ ] "Last updated" timestamp indicator
- [ ] No interactive elements (read-only)
- [ ] No header, sidebar, or navigation
- [ ] Handles 503 (disabled state) gracefully

**Test File:** `apps/web/e2e/tv-board.spec.ts`

---

## Global Search

### US-25: Global search with dropdown results

**As a** any user  
**I want to** search for tickets by ID or title  
**So that** I can quickly navigate to relevant items

**Acceptance Criteria:**
- [ ] Search input in header (always visible when authenticated)
- [ ] Typing triggers debounced API call (300ms) to `/api/tickets?search=...&limit=8`
- [ ] Dropdown shows matching results below input
- [ ] Each result shows: publicId, title, severity badge, status badge, type badge
- [ ] Clicking result navigates to `/ticket/[publicId]`
- [ ] Typing exact publicId pattern (TKT-XXXX or BUG-XXXX) and pressing Enter navigates directly
- [ ] Escape key closes dropdown
- [ ] Blur hides dropdown
- [ ] Max 8 results shown per query

**Test File:** `apps/web/e2e/global-search.spec.ts`

---

### US-26: Keyboard shortcut for search (Ctrl+K / Cmd+K)

**As a** any user  
**I want to** press Ctrl+K (or Cmd+K on Mac) to focus search  
**So that** I can quickly search without reaching for mouse

**Acceptance Criteria:**
- [ ] Pressing Ctrl+K on Windows/Linux focuses search input
- [ ] Pressing Cmd+K on macOS focuses search input
- [ ] If search already has focus, shortcut clears it and re-focuses
- [ ] Search input shows visual focus indicator
- [ ] Shortcut works on any page (not just when on /dev, /support, etc.)
- [ ] Typing immediately after shortcut populates the search field

**Test File:** `apps/web/e2e/global-search-keyboard.spec.ts`

---

## Ticket Detail & Timeline

### US-27: View ticket detail with full timeline

**As a** any user  
**I want to** view a ticket and see its complete history  
**So that** I understand all events and context

**Acceptance Criteria:**
- [ ] Ticket detail page at `/ticket/[publicId]` (e.g., `/ticket/TKT-0042`)
- [ ] Page shows:
  - [ ] Header: publicId (copyable), title, type badge, severity badge, status, opener avatar+name, assignee avatar+name, created date, deadline
  - [ ] Original fields: description, severity, deadline, (for bugs: affected module, steps, expected/actual, environment, customer ID)
  - [ ] ClickUp export button (bugs only)
  - [ ] Status dropdown (if user can edit)
  - [ ] Timeline feed (chronological):
    - [ ] Each event shows icon, label, actor avatar+name, exact timestamp
    - [ ] Event types: CREATED, STATUS_CHANGED, ASSIGNED, REASSIGNED, SEVERITY_CHANGED, DEADLINE_CHANGED, PRIORITY_REORDERED, REORDER_REQUESTED, REORDER_APPROVED, REORDER_DECLINED, DONE, CANCELLED
  - [ ] Action buttons: Assign to me (if unassigned), Update status, Request reorder (if support opener)
- [ ] Any authenticated user can view (authorization by internal network)
- [ ] Shareable URL works for any logged-in user

**Test File:** `apps/web/e2e/ticket-detail.spec.ts`

---

## Loading States & UX Polish

### US-28: Loading skeletons for async pages

**As a** user  
**I want to** see placeholder content while pages load  
**So that** the app feels responsive and not broken

**Acceptance Criteria:**
- [ ] Admin dashboard (`/admin`) shows skeleton stats and workload cards while fetching
- [ ] Ninja Board (`/dev`) shows skeleton developer cards while loading
- [ ] Mission Board (`/support/queue`, `/dev/queue`) shows skeleton ticket cards while loading
- [ ] Ticket detail (`/ticket/[publicId]`) shows skeleton header, description, timeline while loading
- [ ] Skeletons disappear smoothly when real content arrives
- [ ] Skeleton animations use subtle pulse effect
- [ ] No jank or layout shift on load completion (CLS = 0)

**Test File:** `apps/web/e2e/loading-states.spec.ts`

---

### US-29: Ninja theme consistency

**As a** user  
**I want to** see consistent ninja-themed terminology and icons  
**So that** the application feels cohesive

**Acceptance Criteria:**
- [ ] All pages use correct terminology:
  - [ ] "Mission Board" (not "Ticket Queue")
  - [ ] "Ninja Board" (not "Dev Board")
  - [ ] "Smoke Signal" (not "Help Request")
  - [ ] "Status Scroll" (not "Checkpoint")
  - [ ] "Command Dojo" (not "Admin Dashboard")
  - [ ] "Threat Report" (not "Bug Report" — on Mission Board titles)
- [ ] Severity badges use belt-rank colors:
  - [ ] White → Low
  - [ ] Green → Medium
  - [ ] Red → High
  - [ ] Black → Critical
- [ ] Icons are consistently applied:
  - [ ] Shuriken icon for Ticket type
  - [ ] Scroll icon for Bug type
  - [ ] Smoke bomb icon for Help Request
- [ ] Primary action buttons use crimson accent (#E94560)
- [ ] Developer cards on Ninja Board are visually distinctive
- [ ] All pages respect dark/light mode (if configured)

**Test File:** `apps/web/e2e/ninja-theme.spec.ts`

---

### US-30: Responsive design

**As a** user on a tablet or smaller desktop  
**I want to** use the app effectively  
**So that** I can work from any device on the LAN

**Acceptance Criteria:**
- [ ] All pages render correctly at 1280px width (minimum desktop)
- [ ] Layout degrades gracefully for smaller screens
- [ ] Tables collapse to card view on mobile (if needed)
- [ ] Modals and dropdowns are touch-friendly (sufficient tap targets)
- [ ] Text is legible without zooming
- [ ] Sidebar collapses or minimizes on smaller screens
- [ ] TV mode scales to fill screen at any resolution
- [ ] No horizontal scrolling on main content areas
- [ ] Images and avatars scale appropriately

**Test File:** `apps/web/e2e/responsive-design.spec.ts`

---

## Error Handling & Edge Cases

### US-31: Graceful error handling

**As a** user  
**I want to** see clear error messages when something fails  
**So that** I know what went wrong

**Acceptance Criteria:**
- [ ] Network errors show user-friendly message ("Please check your connection")
- [ ] Auth errors show appropriate message ("Invalid credentials", "Session expired")
- [ ] Validation errors highlight the specific field with error text
- [ ] 404 errors on tickets show "Ticket not found" instead of blank page
- [ ] Rate-limited auth attempts show "Too many attempts. Try again in a minute."
- [ ] Concurrent updates handled gracefully (last-write-wins or conflict message)
- [ ] API errors return consistent `{ error: string, details?: object }` format
- [ ] Error pages use consistent design (not default browser 500 page)

**Test File:** `apps/web/e2e/error-handling.spec.ts`

---

### US-32: Session timeout & re-authentication

**As a** user with an expired session  
**I want to** be prompted to re-login  
**So that** security is maintained

**Acceptance Criteria:**
- [ ] Session cookie has appropriate TTL (e.g., 7 days)
- [ ] Accessing protected route with expired session redirects to `/login`
- [ ] API calls with expired session return 401 and trigger re-login prompt
- [ ] Re-login preserves intended destination and redirects after auth
- [ ] Clear error message: "Your session expired. Please log in again."

**Test File:** `apps/web/e2e/session-timeout.spec.ts`

---

### US-33: Docker deployment

**As a** DevOps / deployment team  
**I want to** run ShinobiOps in Docker  
**So that** the app is portable and scalable

**Acceptance Criteria:**
- [ ] `Dockerfile` builds successfully with multi-stage build (deps → builder → runner)
- [ ] `docker-compose.yml` orchestrates app + SQLite volume
- [ ] `.env` file is read and variables are applied
- [ ] `entrypoint.sh` runs `prisma migrate deploy` on startup
- [ ] Health check endpoint `/api/health` returns 200 when healthy
- [ ] SQLite volume persists data across container restarts
- [ ] No environment variables are logged or exposed
- [ ] Container starts on port 3000
- [ ] Build succeeds without errors or warnings

**Test File:** Manual / `docs/DEPLOYMENT.md` (not Playwright)

---

### US-34: Environment validation

**As a** a system administrator  
**I want to** the app to fail fast if required env vars are missing  
**So that** deployment issues are caught early

**Acceptance Criteria:**
- [ ] App startup requires: `SESSION_SECRET`, `DATABASE_URL`
- [ ] App startup fails with clear error if any required var is missing
- [ ] Error message lists which variables are missing
- [ ] `lib/env.ts` validates at import time (before app logic runs)
- [ ] Non-required vars (NODE_ENV, PORT) have sensible defaults
- [ ] No startup errors if all required vars are present

**Test File:** `apps/web/e2e/env-validation.spec.ts` (or integration test)

---

## Test Organization

```
apps/web/e2e/
├── auth/
│   ├── registration.spec.ts (US-1)
│   ├── login.spec.ts (US-2)
│   └── profile.spec.ts (US-3)
├── support/
│   ├── create-ticket.spec.ts (US-4)
│   ├── create-bug.spec.ts (US-5)
│   ├── mission-board.spec.ts (US-6)
│   ├── reorder-request.spec.ts (US-7)
│   └── my-items.spec.ts (US-8)
├── dev/
│   ├── ninja-board.spec.ts (US-9)
│   ├── mission-board.spec.ts (US-10)
│   ├── ticket-status.spec.ts (US-11)
│   ├── smoke-signal.spec.ts (US-12)
│   ├── checkpoint.spec.ts (US-13)
│   └── update-task-status.spec.ts (US-14)
├── admin/
│   ├── command-dojo.spec.ts (US-15)
│   ├── team-management.spec.ts (US-16)
│   ├── notification-routing.spec.ts (US-17)
│   ├── checkpoint-config.spec.ts (US-18)
│   ├── ticket-log.spec.ts (US-19)
│   └── tv-config.spec.ts (US-20)
├── realtime/
│   ├── notifications-center.spec.ts (US-21)
│   ├── sound-alerts.spec.ts (US-22)
│   └── sse-real-time.spec.ts (US-23)
├── tv/
│   └── tv-board.spec.ts (US-24)
├── search/
│   ├── global-search.spec.ts (US-25)
│   └── global-search-keyboard.spec.ts (US-26)
├── shared/
│   ├── ticket-detail.spec.ts (US-27)
│   ├── loading-states.spec.ts (US-28)
│   ├── ninja-theme.spec.ts (US-29)
│   ├── responsive-design.spec.ts (US-30)
│   ├── error-handling.spec.ts (US-31)
│   ├── session-timeout.spec.ts (US-32)
│   └── env-validation.spec.ts (US-34)
```

---

## Notes for QA Engineer

### Playwright MCP Integration

Each test file above should be created using Playwright's page testing API:

```typescript
import { test, expect } from '@playwright/test'

test('US-1: User self-registration with role selection', async ({ page }) => {
  // Test steps here
})
```

### Common Test Patterns

1. **Auth tests**: Use seeded test users or register fresh users for each test
2. **Real-time tests**: Wait for SSE events or polling responses with appropriate timeouts
3. **Role-based tests**: Test each role independently and verify access control
4. **Data validation**: Test form validation errors and field constraints
5. **UI state**: Verify visual indicators (badges, status, counts) match data

### Environment Setup

- Test against a fresh SQLite database per test run (seed with baseline users)
- Use `TEST_ENV=test` to skip certain middleware or enable test mode if needed
- Clear notifications and data between test runs
- Use `page.goto()` with full URLs (e.g., `http://localhost:3000/login`)

### Timeouts & Waits

- SSE events: wait up to 5 seconds
- API responses: wait up to 3 seconds
- Sound playback: verify via API call or mock (not the actual audio)
- Real-time updates: poll `/api/tickets` or check DOM for changes

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-06  
**Status:** Ready for QA implementation
