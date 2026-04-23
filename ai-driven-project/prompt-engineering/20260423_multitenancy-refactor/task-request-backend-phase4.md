# Backend Task: Phase MT-4 -- Middleware, Super Admin, & Org Management

## Description
Update Next.js middleware for tenant context setting. Create super-admin API routes for organization management. Add organization settings endpoints for TECH_LEADs.

## Prerequisites
- Phase MT-1, MT-2, MT-3 complete

## Acceptance Criteria
- [ ] Next.js middleware reads organizationId from session and sets it in request headers for downstream use
- [ ] Super-admin routes at `/api/super-admin/*` are guarded by `requireSuperAdmin()`
- [ ] Super-admin can list, create, update, deactivate organizations
- [ ] Super-admin can list users across all organizations
- [ ] Super-admin can impersonate an organization (switch session org context for debugging)
- [ ] TECH_LEAD can update their own organization's name
- [ ] TECH_LEAD can view organization details
- [ ] Middleware adds super-admin route guards (redirects non-super-admins away from `/super-admin/*`)

## API Endpoints

### Super Admin Endpoints

**GET /api/super-admin/organizations**
- Auth: requireSuperAdmin()
- Returns: paginated list of all organizations with user count, ticket count, isActive status
- Query params: search, isActive filter, page, limit

**POST /api/super-admin/organizations**
- Auth: requireSuperAdmin()
- Creates a new organization with default configs (same as register create-org flow)
- Input: `{ name, slug? }` -- slug auto-generated from name if not provided
- Does NOT create a user -- org starts empty, users join via invite

**GET /api/super-admin/organizations/[id]**
- Auth: requireSuperAdmin()
- Returns: full organization details including user list, active ticket count, config summary

**PATCH /api/super-admin/organizations/[id]**
- Auth: requireSuperAdmin()
- Update: name, slug, isActive
- Deactivating an org prevents all its users from logging in

**GET /api/super-admin/users**
- Auth: requireSuperAdmin()
- Returns: paginated list of all users across all organizations
- Query params: organizationId filter, role filter, search, page, limit
- Each user includes their organization name

**POST /api/super-admin/impersonate**
- Auth: requireSuperAdmin()
- Input: `{ organizationId }`
- Updates the current session's organizationId to the target org (for debugging)
- Stores the original orgId in session as `originalOrganizationId` so it can be restored

**POST /api/super-admin/stop-impersonating**
- Auth: requireSuperAdmin()
- Restores the session's organizationId from `originalOrganizationId`

### Org Settings Endpoints (for TECH_LEAD)

**GET /api/organizations/current**
- Auth: requireAuth() (any authenticated user)
- Returns: current org's name, slug, user count
- Uses organizationId from session

**PATCH /api/organizations/current**
- Auth: requireRole("TECH_LEAD")
- Update: organization name (slug is derived, not directly editable by TECH_LEAD)
- Validates name is not empty, generates new slug from name

## Middleware Updates

### File: `apps/web/middleware.ts`

Add to ROLE_GUARDS:
```
{ prefix: "/super-admin", roles: [] }  // Special: check isSuperAdmin flag, not role
```

Add logic:
- For `/super-admin/*` paths: check `session.isSuperAdmin === true`; redirect to role home if false
- For all authenticated requests: pass `x-organization-id` header to downstream (for SSE and server components that cannot use AsyncLocalStorage directly)

### Public API Prefixes Update
Add to PUBLIC_API_PREFIXES:
- `/api/invites/` (public invite validation endpoint from Phase MT-2)

## Business Logic
- Organization deactivation is a soft deactivation: `isActive = false`. The login route should check `organization.isActive` before allowing login.
- Impersonation is logged (add a `console.warn` with the super-admin's userId and the target orgId for audit purposes). A full audit log can be added later.
- Slug changes should check for uniqueness and return 409 if conflicting.
- Super-admin users see a special UI indicator when impersonating (handled by frontend, but the session needs `isImpersonating: boolean` to support this).

## Validation Schemas
Create `apps/web/lib/schemas/organization-schemas.ts`:
- OrgCreateSchema: name (required), slug (optional)
- OrgUpdateSchema: name (optional), slug (optional), isActive (optional)
- ImpersonateSchema: organizationId (required)

## Rules to Follow
- Super-admin endpoints use the raw `db` client (not tenant-scoped) since they operate across tenants
- TECH_LEAD org endpoints use tenant-scoped db
- Follow existing API patterns (requireAuth/requireRole guard, Zod validation, JSON response)
- All new routes go under `apps/web/app/api/`
- PT-BR error messages for user-facing errors

## Communication File
`.claude/communication/20260423_multitenancy-refactor.md`
