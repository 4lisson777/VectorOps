# Phase 5 -- Admin Dashboard, Notification Routing, ClickUp Export, TV Mode, Theme Polish, Docker

## Goal

Complete all remaining features for a production-ready internal release: the Command Dojo admin dashboard, notification routing configuration, TV mode, ninja theme polish, and Docker deployment.

---

## Features / Tasks

### 5.1 Admin Dashboard -- Command Dojo (`/admin`)

- Access: TECH_LEAD only
- Overview panel with key metrics:
  - Total open tickets and bugs, broken down by severity (card per severity with count)
  - Assigned vs. unassigned ticket count
  - Average resolution time (rolling 7-day and 30-day)
  - Per-developer workload: list of developers with their count of open assigned items
- Use Server Components for initial data load; add client-side refresh with a "Refresh" button or auto-refresh interval

**API Endpoint:**

**GET `/api/admin/stats`**
- Access: TECH_LEAD
- Returns aggregated statistics:
  - ticketsByStatus (counts per status)
  - ticketsBySeverity (counts per severity)
  - assignedCount, unassignedCount
  - avgResolutionTime7d, avgResolutionTime30d (in hours)
  - developerWorkload (array of { userId, name, openTicketCount })

### 5.2 Team Management Page (`/admin/team`)

- Access: TECH_LEAD
- Table of all registered users with columns: name, email, role, ninja alias, last active (updatedAt), status (active/deactivated)
- Actions per user:
  - Change role (dropdown)
  - Deactivate account (soft delete -- sets isActive=false, preserves data)
  - Reactivate account
  - Upload/change avatar
- Search by name or email
- Filter by role, active status

**API Endpoints:**

**GET `/api/admin/users`**
- Access: TECH_LEAD
- Returns all users with role, status, last active
- Query params: role, isActive, search

**PATCH `/api/admin/users/[id]`**
- Access: TECH_LEAD
- Update role, isActive, avatarUrl
- Prevent Tech Lead from deactivating themselves

**POST `/api/admin/users/[id]/avatar`**
- Access: TECH_LEAD
- Upload avatar image for any user
- Store in `public/avatars/` or a dedicated uploads directory

### 5.3 Notification Routing Page (`/admin/notifications`)

- Access: TECH_LEAD
- Table of all developers with toggle switches:
  - Receive Ticket notifications (maps to `notifyTickets` field)
  - Receive Bug notifications (maps to `notifyBugs` field)
- Help request notifications are always on (display as non-editable "Always on" label)
- Bulk actions: "Enable all Ticket notifications", "Enable all Bug notifications"
- Changes save immediately (optimistic UI with PATCH calls)

**API Endpoint:**

**PATCH `/api/admin/users/[id]/notifications`**
- Access: TECH_LEAD
- Body: `{ notifyTickets?: boolean, notifyBugs?: boolean }`
- Updates the user's notification preferences

### 5.4 Checkpoint Configuration Page (`/admin/checkpoints`)

- Access: TECH_LEAD
- Form fields:
  - Enable/disable globally (toggle)
  - Interval in minutes (number input, min 30, max 480)
  - Active hours start (time picker)
  - Active hours end (time picker)
- Save button updates the single CheckpointConfig record
- Below the config form: Checkpoint response history
  - Filter by developer (select) and date range
  - Table: developer name, current task, blocked (yes/no), notes, timestamp
  - Sortable by date

**API Endpoints:**

**GET `/api/admin/checkpoints/config`**
- Access: TECH_LEAD
- Returns the CheckpointConfig record

**PATCH `/api/admin/checkpoints/config`**
- Access: TECH_LEAD
- Update intervalMinutes, activeHoursStart, activeHoursEnd, isEnabled
- Validate constraints (min/max interval, valid time format)
- After updating, restart the checkpoint scheduler with new settings

**GET `/api/admin/checkpoints/history`**
- Access: TECH_LEAD
- Query params: userId, from, to, limit, offset
- Returns checkpoint entries with user info

### 5.5 Ticket and Bug Log Page (`/admin/log`)

- Access: TECH_LEAD
- Full searchable, filterable history of all tickets and bugs ever created
- Table columns: publicId, title, type, severity, status, opener, assignee, created date, resolved date
- Filters: type, severity, status, opener, assignee, date range
- Search: by publicId, title
- Sortable by any column
- Click any row to navigate to ticket detail page
- Pagination (server-side)

**API Endpoint:**
- Reuse GET `/api/tickets` with extended filters -- ensure it supports date range, resolved status, and pagination parameters

### 5.6 TV Mode -- Ninja Board Display (`/dev/tv`)

- Public route (no auth required) -- accessible via direct URL on internal network
- Full-screen, read-only version of the Ninja Board
- No header, no sidebar, no interactive controls
- Content:
  - Top bar: live count of open tickets by severity (4 colored badges), live count of open bugs by severity
  - Developer cards grid: same info as regular Ninja Board (avatar, name, alias, current task, status, assigned ticket)
  - No edit buttons, no modals
- Auto-refresh: connect to SSE for live updates (use a special SSE connection for TV mode that doesn't require auth)
  - Alternative: poll GET `/api/developers` and GET `/api/admin/stats` every 30 seconds
- Optimized for large screens (TV-sized): larger fonts, more spacing, high contrast
- Minimal animation to prevent burn-in concerns

**API Endpoint:**

**GET `/api/tv/data`**
- Public (no auth -- protected only by being on internal network)
- Returns: developer cards data + ticket/bug severity counts
- The Tech Lead can enable/disable this endpoint (see 5.7)

### 5.7 TV Mode Admin Settings

- Add to `/admin` or as a section in an existing admin page:
  - Toggle: Enable/Disable TV mode (controls whether `/dev/tv` and `/api/tv/data` are accessible)
  - Auto-refresh interval (number input, default 30 seconds)
- Store settings in a `TvConfig` model or as part of a general `AppConfig` table

**API Endpoints:**

**GET `/api/admin/tv-config`**
- Access: TECH_LEAD

**PATCH `/api/admin/tv-config`**
- Access: TECH_LEAD
- Body: `{ isEnabled: boolean, refreshInterval: number }`

### 5.8 Global Search

- Search bar in the header (already placed as placeholder in Phase 1)
- Accepts ticket public IDs (TKT-XXXX, BUG-XXXX) -- navigates directly to the ticket detail page
- Also accepts partial title matches -- shows a dropdown of matching tickets
- Implementation: debounced input that calls GET `/api/tickets?search=...` with a limit of 5-10 results
- Keyboard shortcut: Ctrl+K or Cmd+K to focus the search bar

### 5.9 Ninja Theme Polish

- Review and refine all pages for consistent ninja theme:
  - Severity badges use belt-rank colors (White, Green, Red, Black) consistently
  - Shuriken icon for ticket type, scroll icon for bug type (or similar themed icons)
  - Smoke bomb icon for help requests
  - Scroll icon for checkpoints
  - Subtle clan-crest watermark behind developer cards on the Ninja Board
- Ensure the color palette is consistent: deep navy primary (#1A1A2E), crimson accent (#E94560), off-white surfaces
- Ninja terminology in UI labels where appropriate (per PRD section 8.1):
  - "Mission Board" instead of "Ticket Queue"
  - "Ninja Board" for the dev overview
  - "Smoke Signal" for help requests
  - "Status Scroll" for checkpoints
  - "Command Dojo" for admin dashboard
  - Developer cards labeled as "Ninja" cards
- Responsive: ensure all pages work at 1280px desktop and tablet sizes

### 5.10 Avatar System

- Implement avatar upload:
  - Accept image files (PNG, JPG, WEBP)
  - Resize/compress on the server (or use Next.js Image for serving)
  - Store in `public/avatars/[userId].[ext]`
  - Fallback: initials avatar generated from user name (colored circle with two letters)
- Create a reusable `UserAvatar` component that handles both cases

### 5.11 Docker Setup

**Dockerfile:**
- Multi-stage build:
  - Stage 1 (`deps`): Install all dependencies
  - Stage 2 (`builder`): Build Next.js app, generate Prisma client
  - Stage 3 (`runner`): Copy only production artifacts, install only production dependencies
- Use Node.js 20 slim or Alpine base
- Set `DATABASE_URL` to `file:./prisma/data/vectorops.db`
- Run `prisma migrate deploy` on container startup (via an entrypoint script)
- Expose port 3000

**docker-compose.yml:**
- Single service: `vectorops`
- Mount a named volume for `./prisma/data` to persist the SQLite database
- Environment variables from `.env` file
- Health check: `curl -f http://localhost:3000/api/health`
- Restart policy: `unless-stopped`

**Entrypoint script:**
- Run `npx prisma migrate deploy` to apply any pending migrations
- Then start the Next.js production server with `node server.js` or `npm start`

### 5.12 Environment and Production Hardening

- Ensure all environment variables are documented in `.env.example`
- Validate required environment variables at startup (fail fast if missing)
- Set secure cookie flags for production (Secure, SameSite)
- Ensure `NODE_ENV=production` disables Prisma Studio and dev-only features
- Add rate limiting to auth endpoints (basic -- e.g., 5 attempts per minute per IP)
- Add CORS headers (restrict to same-origin for internal deployment)

### 5.13 Error Pages

- Custom 404 page (`apps/web/app/not-found.tsx`) -- themed, with navigation back to home
- Custom error boundary (`apps/web/app/error.tsx`) -- themed, with retry button
- API error responses: consistent JSON format `{ error: string, details?: object }`

### 5.14 Loading States

- Add loading skeletons for:
  - Mission Board (ticket card placeholders)
  - Ninja Board (developer card placeholders)
  - Ticket detail page
  - Admin dashboard stats
- Use Suspense boundaries with `loading.tsx` files where appropriate

### 5.15 Final Integration Testing

- Manually test the complete flow:
  1. Register users for all 4 roles
  2. Log in as support, create ticket and bug
  3. Log in as dev, see notification, assign ticket, update status
  4. Verify support member sees status change notification
  5. Test help request flow (send and respond)
  6. Test checkpoint flow (configure, trigger, respond)
  7. Test reorder request flow (request, approve, decline)
  8. Test TV mode display
  9. Test admin dashboard stats accuracy
  10. Build Docker image, run with compose, verify persistence across restart

---

## Acceptance Criteria

- [ ] The Command Dojo dashboard shows accurate live statistics (open tickets by severity, assigned vs unassigned, resolution times, developer workload)
- [ ] The Tech Lead can view all users, change roles, deactivate/reactivate accounts
- [ ] The Tech Lead can configure per-developer notification routing (ticket/bug toggles)
- [ ] The Tech Lead can configure checkpoint interval, active hours, and enable/disable
- [ ] The checkpoint history page shows all responses filterable by developer and date range
- [ ] The ticket/bug log page shows full history with search, filter, sort, and pagination
- [ ] TV mode displays a read-only Ninja Board at `/dev/tv` without requiring login
- [ ] TV mode shows live ticket/bug severity counts and developer status cards
- [ ] TV mode can be enabled/disabled by the Tech Lead
- [ ] Global search navigates to tickets by publicId and shows title search results
- [ ] Ninja theme terminology and visual identity are consistent across all pages
- [ ] Avatar upload works; initials fallback displays correctly
- [ ] Docker image builds successfully with multi-stage build
- [ ] Docker Compose starts the app with persistent SQLite volume
- [ ] Migrations run automatically on container startup
- [ ] Health check endpoint works for Docker orchestration
- [ ] Custom 404 and error pages are themed and functional
- [ ] Loading skeletons appear during data fetches
- [ ] The complete user flow works end-to-end across all roles
- [ ] TypeScript compiles with zero errors; lint passes; build succeeds
