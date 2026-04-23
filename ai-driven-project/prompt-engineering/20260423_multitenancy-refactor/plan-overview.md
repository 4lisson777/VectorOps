# Multitenancy Refactor -- Master Plan

## Overview

Refactor ShinobiOps from a single-tenant internal tool into a multitenant system where each client organization operates independently with its own users, tickets, configs, and data.

## Architecture Decisions

### 1. Tenant Isolation Strategy: Row-Level with tenantId FK

**Decision:** Row-level isolation using a `tenantId` foreign key on every tenant-scoped table.

**Rationale:**
- SQLite does not support schema-per-tenant.
- Database-per-tenant adds massive operational complexity for the marginal benefit it provides.
- Row-level is the simplest, most maintainable approach (KISS).
- A Prisma middleware/extension can enforce tenant scoping automatically.
- If scale demands PostgreSQL later, row-level isolation migrates cleanly.

### 2. Database: Keep SQLite (for now)

**Decision:** Keep SQLite with row-level isolation. Do NOT migrate to PostgreSQL in this phase.

**Rationale:**
- SQLite handles concurrent reads well with WAL mode (already enabled).
- The current deployment model is single-server Docker; SQLite fits perfectly.
- Multitenancy with row-level isolation works identically on SQLite and PostgreSQL.
- A future phase can swap the Prisma adapter to PostgreSQL if concurrent write pressure requires it.
- Changing the DB engine AND adding multitenancy simultaneously violates KISS.

### 3. Tenant Model

A new `Organization` entity represents a tenant:
- `id` (cuid), `name`, `slug` (unique, URL-safe), `isActive`, `createdAt`, `updatedAt`
- The `slug` is used in URLs and as a human-readable identifier.
- Organizations are created either through a super-admin panel or during a self-service signup flow.

### 4. Admin Hierarchy

**New role: SUPER_ADMIN** (platform-level, not per-tenant).

- `SUPER_ADMIN`: Can create/manage organizations, view cross-tenant data, impersonate. Lives OUTSIDE the per-tenant role system. Stored as a flag on User (`isSuperAdmin: Boolean`), not in the `Role` enum.
- `TECH_LEAD`: Becomes the "Tenant Admin" -- manages their org's users, configs, and data. The existing role system stays intact within each tenant.
- All other roles (`DEVELOPER`, `SUPPORT_LEAD`, `SUPPORT_MEMBER`, `QA`): Unchanged behavior, scoped to their tenant.

Why a boolean flag instead of a Role enum value:
- A super admin still has a regular role within their own organization.
- Super admin is a platform capability, not a team role.
- Avoids polluting the existing Role enum with a non-tenant concept.

### 5. Session Changes

The `SessionData` interface gains `organizationId`:
```
SessionData {
  userId: string
  role: string
  name: string
  organizationId: string   // NEW
  isSuperAdmin: boolean    // NEW
}
```

### 6. Data Isolation Strategy

**Prisma Client Extension** that automatically injects `where: { organizationId }` on all queries for tenant-scoped models. This is safer than manual filtering because it cannot be forgotten.

The extension reads `organizationId` from an async local storage context (Node.js `AsyncLocalStorage`) that is set per-request by middleware.

Models that get `organizationId`:
- User, Ticket, BugReport, TicketEvent, ReorderRequest, Notification, HelpRequest, HelpRequestResponse, Checkpoint, CheckpointConfig, TvConfig, RoleNotificationConfig

Models that do NOT get `organizationId`:
- Organization (it IS the tenant)

### 7. Config Scoping

Currently singleton records (CheckpointConfig, TvConfig) become per-tenant:
- Add `organizationId` FK to CheckpointConfig, TvConfig, RoleNotificationConfig
- Add unique constraint on `(organizationId, role)` for RoleNotificationConfig
- Each org gets its own default config on creation

### 8. Public ID Sequences

**Decision:** Keep public IDs globally unique by using a global counter.

**Rationale:**
- Per-tenant counters add complexity without user-facing benefit.
- Global uniqueness prevents confusion when tickets are referenced across support channels.
- The existing `generatePublicId()` logic already works globally; no change needed.

### 9. Registration Flow

Two flows:
1. **Create Organization + First User:** A new signup page at `/register` creates an org and the first TECH_LEAD user.
2. **Join Existing Organization:** An invite system where TECH_LEADs generate invite links/codes. The `/register?invite=CODE` route joins the user to the existing org.

### 10. URL Structure

**Decision:** Session-implicit tenancy (no subdomain, no path prefix).

**Rationale:**
- Subdomains require wildcard DNS and SSL certificates -- too complex for an internal tool.
- Path prefixes (`/org/[slug]/...`) require rewriting every route and every link.
- Session-implicit is simplest: user logs in, their org is in the session, all queries scope to it.
- The org name/slug appears in the UI header for clarity.

---

## Phased Execution Plan

### Phase MT-1: Schema & Data Layer (Backend)
Add Organization model, tenantId columns, Prisma extension for auto-scoping, migration script.

### Phase MT-2: Auth & Session (Backend)
Update session to include organizationId, update login/register flows, add invite system, add super-admin flag.

### Phase MT-3: API Route Updates (Backend)
Update all ~40 API routes to work with the tenant-scoped Prisma extension. Update notification targeting to be org-scoped.

### Phase MT-4: Middleware & Guards (Backend)
Update Next.js middleware for tenant context, add super-admin routes, add org management API.

### Phase MT-5: Frontend - Auth & Org UI (Frontend)
Update registration flow (create org / join org), login shows org name, org selector for super-admins, org settings page.

### Phase MT-6: Frontend - Tenant Context (Frontend)
Update all pages/components to work with tenant-scoped data. Add org name in header. Ensure all client-side fetches work correctly.

### Phase MT-7: Super Admin Panel (Frontend + Backend)
Create `/super-admin` pages for org management, user management across orgs, platform metrics.

### Phase MT-8: Migration & Seed (Backend)
Create migration script for existing single-tenant data. Update seed script for multi-tenant dev data.

### Phase MT-9: QA & Testing
End-to-end testing of tenant isolation, cross-tenant leak prevention, role hierarchy, invite flow.

---

## File Impact Analysis

### Files to MODIFY (Backend)

| File | Change |
|------|--------|
| `apps/web/prisma/schema.prisma` | Add Organization model, add organizationId to all tenant-scoped models |
| `apps/web/lib/session.ts` | Add organizationId, isSuperAdmin to SessionData |
| `apps/web/lib/auth.ts` | Pass organizationId from session, add requireSuperAdmin() |
| `apps/web/lib/db.ts` | Add Prisma extension for tenant auto-scoping |
| `apps/web/lib/notifications.ts` | Scope notification targeting queries by organizationId |
| `apps/web/lib/sse-emitter.ts` | Add organizationId to event payload for org-scoped filtering |
| `apps/web/lib/types.ts` | Add organizationId to SafeUser, add Organization type |
| `apps/web/lib/ticket-id.ts` | No change (global IDs) |
| `apps/web/middleware.ts` | Set tenant context from session, add super-admin route guards |
| `apps/web/prisma/seed.ts` | Create default org, scope all seed data to it |
| `apps/web/app/api/auth/register/route.ts` | Create org flow, invite join flow |
| `apps/web/app/api/auth/login/route.ts` | Include organizationId in session |
| `apps/web/app/api/sse/route.ts` | Filter SSE events by organizationId |
| ALL route files under `apps/web/app/api/` | Use tenant-scoped db client |

### Files to MODIFY (Frontend)

| File | Change |
|------|--------|
| `apps/web/components/auth/register-form.tsx` | Add org creation / invite code flow |
| `apps/web/components/auth/login-form.tsx` | Show org name after login |
| `apps/web/components/layout/header.tsx` | Display current org name |
| `apps/web/components/layout/sidebar.tsx` | Add org settings link for TECH_LEAD |
| `apps/web/components/admin/team-management.tsx` | Org-scoped user management |
| `apps/web/components/admin/checkpoint-config.tsx` | Org-scoped config |

### Files to CREATE (Backend)

| File | Purpose |
|------|---------|
| `apps/web/lib/tenant-context.ts` | AsyncLocalStorage for per-request tenant context |
| `apps/web/lib/tenant-db.ts` | Prisma extension that auto-injects organizationId |
| `apps/web/app/api/organizations/route.ts` | CRUD for organizations (super-admin) |
| `apps/web/app/api/organizations/[id]/route.ts` | Single org management |
| `apps/web/app/api/organizations/[id]/invite/route.ts` | Generate invite codes |
| `apps/web/app/api/auth/register/invite/route.ts` | Join org via invite code |
| `apps/web/lib/schemas/organization-schemas.ts` | Zod schemas for org validation |

### Files to CREATE (Frontend)

| File | Purpose |
|------|---------|
| `apps/web/app/(protected)/admin/organization/page.tsx` | Org settings page |
| `apps/web/components/admin/organization-settings.tsx` | Org name, slug, invite management |
| `apps/web/app/(protected)/super-admin/page.tsx` | Super admin dashboard |
| `apps/web/app/(protected)/super-admin/organizations/page.tsx` | Org list/management |
| `apps/web/app/(protected)/super-admin/layout.tsx` | Super admin layout |
| `apps/web/components/super-admin/org-list.tsx` | Organization list component |
| `apps/web/components/super-admin/org-create-form.tsx` | Create org form |
