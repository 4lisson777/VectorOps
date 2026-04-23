# QA Task: Multitenancy Refactor Verification

## Description
Verify the complete multitenancy refactor for correctness, data isolation, security, and regression.

## Prerequisites
- All backend phases (MT-1 through MT-5) and frontend phase complete
- Check `.claude/communication/20260423_multitenancy-refactor.md` for implementation details

## Scope
Test the entire multitenancy implementation across all layers: schema, auth, API routes, SSE, UI.

## Test Categories

### 1. Data Isolation Tests (CRITICAL)

These are the highest-priority tests. Cross-tenant data leakage is a security vulnerability.

- [ ] **User isolation:** User in Org A cannot see users from Org B via `GET /api/users`
- [ ] **Ticket isolation:** User in Org A cannot see tickets from Org B via `GET /api/tickets`
- [ ] **Ticket detail isolation:** User in Org A cannot access Org B's ticket by ID via `GET /api/tickets/[id]`
- [ ] **Notification isolation:** User in Org A does not receive notifications for Org B's events
- [ ] **SSE isolation:** SSE stream for User in Org A does not include events from Org B
- [ ] **Help request isolation:** User in Org A cannot see Org B's help requests
- [ ] **Checkpoint isolation:** User in Org A cannot see Org B's checkpoints
- [ ] **Config isolation:** Org A's CheckpointConfig changes do not affect Org B
- [ ] **Config isolation:** Org A's TvConfig changes do not affect Org B
- [ ] **Config isolation:** Org A's RoleNotificationConfig changes do not affect Org B
- [ ] **Reorder isolation:** User in Org A cannot reorder Org B's tickets
- [ ] **Admin isolation:** TECH_LEAD in Org A cannot manage Org B's users
- [ ] **Invite isolation:** TECH_LEAD in Org A cannot see or revoke Org B's invites
- [ ] **TV data isolation:** `/api/tv/data?org=org-a-slug` only returns Org A's data

### 2. Registration & Org Creation Tests

- [ ] Register with "create org" mode creates an Organization + User with TECH_LEAD role
- [ ] Generated slug is URL-safe (lowercase, hyphens, no special chars)
- [ ] Duplicate org slug returns an appropriate error
- [ ] Default configs (CheckpointConfig, TvConfig, 5x RoleNotificationConfig) are created for new org
- [ ] Session after registration includes organizationId
- [ ] Register with "join via invite" mode creates User with invite's role in invite's org
- [ ] Used invite cannot be reused (returns error)
- [ ] Expired invite cannot be used (returns error)
- [ ] Email-restricted invite rejects a different email
- [ ] Invite code validation endpoint (`GET /api/invites/[code]`) returns org name and role

### 3. Login Tests

- [ ] Login with email unique to one org works as before (no slug needed)
- [ ] Login with email existing in multiple orgs returns 409 with org list
- [ ] Login with email + organizationSlug succeeds for the correct org
- [ ] Login sets organizationId in session
- [ ] Login for deactivated org returns 403
- [ ] Login for deactivated user returns 403

### 4. Invite System Tests

- [ ] TECH_LEAD can create invite with role, optional email, custom expiry
- [ ] Invite code is 8 characters, alphanumeric, unique
- [ ] TECH_LEAD can list active invites for their org only
- [ ] TECH_LEAD can revoke an invite (sets it as expired)
- [ ] Non-TECH_LEAD cannot create/list/revoke invites (403)
- [ ] Invite from Org A cannot be managed by TECH_LEAD of Org B

### 5. Super Admin Tests

- [ ] Super admin can list all organizations
- [ ] Super admin can create a new organization
- [ ] Super admin can update an organization's name, slug, isActive
- [ ] Super admin can list users across all organizations
- [ ] Super admin can impersonate an organization (session org changes)
- [ ] Super admin can stop impersonating (session org restores)
- [ ] Non-super-admin cannot access `/api/super-admin/*` (403)
- [ ] Non-super-admin cannot access `/super-admin/*` pages (redirect)
- [ ] Deactivating an org prevents its users from logging in

### 6. Existing Feature Regression Tests

- [ ] Ticket creation still works (creates in user's org)
- [ ] Ticket assignment still works (only users from same org appear)
- [ ] Ticket status changes still work
- [ ] Bug report creation and ClickUp export still work
- [ ] Notification creation and delivery still work (org-scoped)
- [ ] Persistent notification acknowledgment still works
- [ ] SSE events still deliver in real-time (within same org)
- [ ] Help request creation and response still work
- [ ] Checkpoint submission still works
- [ ] Checkpoint config management still works (per-org)
- [ ] TV config management still works (per-org)
- [ ] Role notification config management still works (per-org)
- [ ] Reorder request flow still works
- [ ] User profile editing still works
- [ ] Password change still works
- [ ] Admin user management still works (org-scoped)
- [ ] Admin stats still work (org-scoped)
- [ ] TV mode displays correct data with org slug parameter

### 7. Session & Auth Edge Cases

- [ ] Session cookie still has 7-day expiry
- [ ] Session is HTTP-only, Secure in production
- [ ] Expired session redirects to login
- [ ] Invalid session redirects to login
- [ ] Session contains: userId, role, name, organizationId, isSuperAdmin
- [ ] Role-based middleware guards still work correctly

### 8. Schema & Data Integrity Tests

- [ ] All tenant-scoped models have organizationId column
- [ ] organizationId is NOT NULL in the final schema
- [ ] FK constraints exist between organizationId and Organization.id
- [ ] Email uniqueness is per-org (same email can register in different orgs)
- [ ] RoleNotificationConfig has unique constraint on (organizationId, role)
- [ ] Deleting an org cascades or is prevented (check referential integrity)

## Test Data Setup
1. Create two test organizations: "Org Alpha" (slug: org-alpha) and "Org Beta" (slug: org-beta)
2. Create users in each org: at least 1 TECH_LEAD, 1 DEVELOPER, 1 SUPPORT_MEMBER per org
3. Create tickets in each org
4. Create one super-admin user
5. Run all isolation tests by authenticating as users from different orgs

## Testing Approach
- Use the existing API testing patterns (direct API calls via fetch/curl)
- For UI tests: manual verification of registration, login, header, invite management
- For isolation tests: authenticate as Org A user, attempt to access Org B resources
- For regression: re-run existing feature flows end-to-end

## Communication File
`.claude/communication/20260423_multitenancy-refactor.md`
