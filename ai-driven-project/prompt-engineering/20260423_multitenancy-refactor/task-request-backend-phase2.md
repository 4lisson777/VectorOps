# Backend Task: Phase MT-2 -- Auth, Session & Invite System

## Description
Update the authentication system to be tenant-aware. Session must carry organizationId. Login must resolve the user's org. Registration splits into "create org + first user" and "join via invite code". Add invite CRUD endpoints for TECH_LEADs.

## Prerequisites
- Phase MT-1 must be complete (Organization model, Invite model, tenant context infrastructure exist)

## Acceptance Criteria
- [ ] `SessionData` in `apps/web/lib/session.ts` includes `organizationId: string` and `isSuperAdmin: boolean`
- [ ] `getCurrentSession()` in `apps/web/lib/auth.ts` returns organizationId and isSuperAdmin
- [ ] New `requireSuperAdmin()` guard in `apps/web/lib/auth.ts` that checks isSuperAdmin flag
- [ ] Login route (`/api/auth/login`) includes organizationId in the session after login
- [ ] Login route handles users that belong to the same email across different orgs: if ambiguous, return an error asking the user to specify the org (via slug)
- [ ] Login schema optionally accepts `organizationSlug` to disambiguate
- [ ] Register route (`/api/auth/register`) supports two modes:
  - Mode 1 (create org): accepts `organizationName` and creates an Organization + first TECH_LEAD user
  - Mode 2 (join org): accepts `inviteCode` and creates a user in the invite's org with the invite's role
- [ ] New endpoint `POST /api/organizations/[id]/invites` creates an invite (TECH_LEAD only, same org)
- [ ] New endpoint `GET /api/organizations/[id]/invites` lists active invites (TECH_LEAD only)
- [ ] New endpoint `DELETE /api/organizations/[id]/invites/[inviteId]` revokes an invite (TECH_LEAD only)
- [ ] New endpoint `GET /api/invites/[code]` validates an invite code and returns org name + role (public, no auth required)
- [ ] Auth middleware sets tenant context via `runWithTenant()` for all authenticated requests
- [ ] `apps/web/lib/auth.ts` gains `requireTenantAuth()` that wraps `requireAuth()` + verifies organizationId is in session + sets tenant context

## API Endpoints

### Modified Endpoints

**POST /api/auth/login**
- Input gains optional `organizationSlug: string`
- Lookup: find user by email. If email exists in multiple orgs and no slug provided, return 409 with `{ error: "Multiple organizations found", organizations: [{ name, slug }] }` so the frontend can ask the user to pick.
- If slug provided: find user by email + org slug combo.
- Session now saves: `{ userId, role, name, organizationId, isSuperAdmin }`

**POST /api/auth/register**
- Mode detection: if body contains `organizationName`, it is "create org" mode. If body contains `inviteCode`, it is "join org" mode. Exactly one must be present.
- Create Org mode:
  - Validate org name, generate slug from name (lowercase, replace spaces with hyphens, strip special chars)
  - Check slug uniqueness
  - Create Organization, then create User with role TECH_LEAD and that org's ID
  - Create default CheckpointConfig, TvConfig, and RoleNotificationConfig records for the new org
  - Start session
- Join Org mode:
  - Validate invite code exists, is not expired, is not used
  - If invite has email restriction, validate it matches
  - Create User with the invite's role and org
  - Mark invite as used (set usedById, usedAt)
  - Start session

**GET /api/auth/me**
- Include organizationId, isSuperAdmin, and organization name in the response

### New Endpoints

**POST /api/organizations/[id]/invites**
- Auth: TECH_LEAD of the same organization
- Input: `{ role: Role, email?: string, expiresInHours?: number }` (default 72 hours)
- Generate a unique 8-character alphanumeric invite code
- Return the invite object including a shareable URL

**GET /api/organizations/[id]/invites**
- Auth: TECH_LEAD of the same organization
- Return all non-expired, non-used invites for the org

**DELETE /api/organizations/[id]/invites/[inviteId]**
- Auth: TECH_LEAD of the same organization
- Soft-delete by setting expiresAt to now (expired)

**GET /api/invites/[code]**
- Public endpoint (no auth required)
- Validate the code: exists, not expired, not used
- Return: `{ organizationName, role, email (if restricted) }`
- Do NOT return sensitive data (org ID, user details)

## Business Logic
- Slug generation: lowercase, replace whitespace with hyphens, remove non-alphanumeric-hyphen chars, trim hyphens from edges
- Invite code generation: 8 characters, uppercase alphanumeric, excluding ambiguous characters (0/O, 1/I/L)
- Default invite expiration: 72 hours
- An invite can only be used once
- When creating a new org, the system must seed default configs:
  - 1 CheckpointConfig with the existing defaults
  - 1 TvConfig with the existing defaults
  - 5 RoleNotificationConfig records (one per Role) with the existing defaults from the seed file

## Validation Schemas
Create or update `apps/web/lib/schemas/auth-schemas.ts` (or create `organization-schemas.ts`) with:
- LoginSchema: add optional organizationSlug
- RegisterCreateOrgSchema: name, email, password, organizationName, ninjaAlias (optional)
- RegisterJoinOrgSchema: name, email, password, inviteCode, ninjaAlias (optional) -- role comes from invite
- InviteCreateSchema: role, email (optional), expiresInHours (optional, default 72)

## Rules to Follow
- All new endpoints follow existing patterns: `requireAuth()` / `requireRole()` guards, Zod validation, JSON responses
- Invite codes must be cryptographically random (use `crypto.randomBytes` or `crypto.getRandomValues`)
- The register endpoint must remain rate-limited (already has rate limiting)
- PT-BR error messages in user-facing responses (matching existing convention)
- Keep session cookie name unchanged (`shinobiops_session`)

## Communication File
`.claude/communication/20260423_multitenancy-refactor.md`
