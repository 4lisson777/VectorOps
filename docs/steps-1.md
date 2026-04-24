# Phase 1 -- Authentication, Registration, User Roles, and Basic Navigation

## Goal

Establish the foundational layer: users can register, log in, see role-appropriate navigation, and be redirected to their home view. No feature logic yet -- just the skeleton that every subsequent phase builds on.

---

## Features / Tasks

### 1.1 Database and Prisma Setup

- Initialize Prisma in `apps/web/` with SQLite provider
- Create `prisma/schema.prisma` with the **User** model (all fields from PRD section 9)
- Configure SQLite pragmas (WAL, foreign_keys, synchronous, busy_timeout) via a Prisma client extension or seed script
- Create the initial migration (`prisma migrate dev`)
- Add a singleton Prisma client utility at `apps/web/lib/prisma.ts` (avoid multiple instances in dev mode)
- Add `prisma generate` and `prisma migrate deploy` to the build pipeline in `turbo.json`

**User model fields:**
- id (UUID, default cuid)
- name (string, required)
- email (string, unique, required)
- passwordHash (string, required)
- role (enum: TECH_LEAD, DEVELOPER, SUPPORT_LEAD, SUPPORT_MEMBER)
- avatarUrl (string, nullable)
- ninjaAlias (string, required -- auto-generated if not provided)
- isActive (boolean, default true)
- notifyTickets (boolean, default true)
- notifyBugs (boolean, default true)
- soundEnabled (boolean, default true)
- createdAt (datetime)
- updatedAt (datetime)

### 1.2 Authentication -- Session Management

- Install `iron-session` for encrypted cookie-based sessions
- Create session configuration at `apps/web/lib/session.ts`:
  - Session shape: `{ userId: string, role: Role }`
  - Cookie name, TTL, secure flag, HTTP-only flag
- Create a `SESSION_SECRET` environment variable (document in `.env.example`)
- Create helper functions: `getSession()`, `requireAuth()`, `requireRole()`

### 1.3 Registration Page (`/register`)

- Public page, no auth required
- Form fields: name, email, password, confirm password, role (select), ninja alias (optional, auto-generate if blank)
- Ninja alias auto-generation: create a utility that combines a random adjective + ninja name (e.g., "Shadow Ryu", "Silent Hattori")
- Client-side validation with Zod
- On submit: POST to `/api/auth/register`
- After success: redirect to `/login` with a success message

### 1.4 Registration API (`POST /api/auth/register`)

- Validate request body with Zod
- Check email uniqueness
- Hash password with bcrypt (cost factor 12)
- Auto-generate ninja alias if not provided
- Create user in database
- Return 201 with user info (exclude passwordHash)
- Return 409 if email already exists
- Return 400 for validation errors

### 1.5 Login Page (`/login`)

- Public page, no auth required
- Form fields: email, password
- Client-side validation with Zod
- On submit: POST to `/api/auth/login`
- After success: redirect based on role (see 1.7)
- Show error message on invalid credentials

### 1.6 Login API (`POST /api/auth/login`)

- Validate request body
- Look up user by email
- Compare password with bcrypt
- Check `isActive` flag
- Create session (iron-session) with userId and role
- Return 200 with user info
- Return 401 for invalid credentials
- Return 403 for deactivated accounts

### 1.7 Role-Based Redirect (`/`)

- Authenticated route
- Read session, redirect based on role:
  - TECH_LEAD -> `/dev`
  - DEVELOPER -> `/dev`
  - SUPPORT_LEAD -> `/support`
  - SUPPORT_MEMBER -> `/support`
- If not authenticated -> `/login`

### 1.8 Logout

- POST `/api/auth/logout` -- destroys session, returns 200
- Client-side: clear any local state, redirect to `/login`
- Add a logout button to the app header/sidebar

### 1.9 App Layout and Navigation Shell

- Create the root layout at `apps/web/app/layout.tsx` with theme provider, global styles, font setup
- Create an authenticated layout wrapper at `apps/web/app/(authenticated)/layout.tsx`:
  - Header with: app logo/name, global search bar (placeholder for now), notification bell (placeholder), user avatar dropdown (profile link, logout)
  - Sidebar navigation (role-aware -- show only links the user's role can access)
- Sidebar links per role:
  - **Support Member / Support Lead**: Support Home, New Ticket, New Bug, Mission Board, My Items
  - **Developer**: Ninja Board, Mission Board
  - **Tech Lead**: Ninja Board, Mission Board, Command Dojo, Team, Notifications, Checkpoints, Log
- All authenticated pages sit inside this layout

### 1.10 Profile Page (`/profile`)

- Authenticated, all roles
- Display current user info: name, email, role (read-only), ninja alias, avatar
- Editable fields: name, ninja alias, avatar (upload), password change (current + new + confirm)
- PATCH `/api/users/me` for profile updates
- PATCH `/api/users/me/password` for password change (requires current password)
- Toggle: sound alerts enabled/muted

### 1.11 Middleware -- Route Protection

- Create Next.js middleware at `apps/web/middleware.ts`
- Public routes: `/login`, `/register`, `/dev/tv`, `/api/auth/*`, `/api/health`
- All other routes require a valid session
- Role-based route protection:
  - `/admin/*` -- TECH_LEAD only
  - `/support/*` -- SUPPORT_MEMBER, SUPPORT_LEAD
  - `/dev/*` (except `/dev/tv`) -- DEVELOPER, TECH_LEAD
  - `/ticket/*`, `/profile` -- all authenticated roles

### 1.12 Health Check Endpoint

- GET `/api/health` -- returns `{ status: "ok", timestamp }` with 200
- Used by Docker healthcheck

### 1.13 Environment Configuration

- Create `.env.example` with all required variables:
  - `DATABASE_URL=file:./prisma/data/vectorops.db`
  - `SESSION_SECRET=<random-32-char-string>`
  - `NODE_ENV=development`
- Add `.env` to `.gitignore`

### 1.14 Seed Script

- Create `prisma/seed.ts` with sample users (one per role) for development
- Configure `prisma db seed` in `package.json`

---

## Acceptance Criteria

- [ ] Prisma schema compiles, migrations run, and the database file is created at the configured path
- [ ] A user can register with all required fields and is stored in the database with a hashed password
- [ ] A user can log in with correct credentials and receives a session cookie
- [ ] Invalid login attempts return appropriate error messages
- [ ] After login, the user is redirected to the correct home page based on their role
- [ ] The root `/` route redirects authenticated users to their role home and unauthenticated users to `/login`
- [ ] The navigation sidebar shows only links appropriate to the logged-in user's role
- [ ] Protected routes return 401/redirect for unauthenticated requests
- [ ] Protected routes return 403 for authenticated users with insufficient role
- [ ] The profile page loads current user data and allows updates to name, alias, and password
- [ ] The health check endpoint responds with 200
- [ ] The seed script creates test users for all four roles
- [ ] All pages use Server Components by default; `"use client"` is added only where interactive state is needed
- [ ] TypeScript compiles with zero errors (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
