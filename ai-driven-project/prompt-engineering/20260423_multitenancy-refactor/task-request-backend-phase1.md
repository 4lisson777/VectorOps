# Backend Task: Phase MT-1 -- Schema & Data Layer

## Description
Add the Organization model to the Prisma schema, add `organizationId` foreign keys to all tenant-scoped models, create the tenant-scoping infrastructure (AsyncLocalStorage context + Prisma extension), and write the database migration.

## Acceptance Criteria
- [ ] New `Organization` model exists in `apps/web/prisma/schema.prisma` with fields: id, name, slug (unique), isActive, createdAt, updatedAt
- [ ] New `Invite` model exists with fields: id, organizationId, code (unique), role, email (optional), expiresAt, usedById (optional), usedAt, createdById, createdAt
- [ ] Every tenant-scoped model has a non-nullable `organizationId` foreign key pointing to Organization
- [ ] A unique constraint on `(organizationId, role)` replaces the current `@unique` on `role` in RoleNotificationConfig
- [ ] A unique constraint on `(organizationId, email)` is added to User (email unique within org, not globally)
- [ ] `User` model gains `isSuperAdmin Boolean @default(false)` field
- [ ] File `apps/web/lib/tenant-context.ts` provides AsyncLocalStorage-based per-request tenant context with `setTenantContext(orgId)` and `getTenantContext()` functions
- [ ] File `apps/web/lib/tenant-db.ts` exports a `getTenantDb()` function that returns a Prisma client extended to auto-inject `organizationId` in `where` clauses for all tenant-scoped models
- [ ] Migration runs successfully with `npx prisma migrate dev`
- [ ] Existing data migration script handles the transition (creates a default org, assigns all existing records to it)

## Data Models

### New: Organization
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| name | String | Display name of the organization |
| slug | String | Unique, URL-safe identifier (lowercase, hyphens) |
| isActive | Boolean | Default true, can be deactivated by super-admin |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Relations: has many Users, Tickets, CheckpointConfigs, TvConfigs, RoleNotificationConfigs, Invites

### New: Invite
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| organizationId | String | FK to Organization |
| code | String | Unique invite code (e.g., 8-char alphanumeric) |
| role | Role | The role the invited user will receive |
| email | String? | Optional: if set, only this email can use the invite |
| expiresAt | DateTime | When the invite expires |
| usedById | String? | FK to User who used the invite |
| usedAt | DateTime? | When the invite was used |
| createdById | String | FK to User who created the invite |
| createdAt | DateTime | Auto |

### Modified Models -- add organizationId

All of these models get a new field:
```
organizationId String
organization   Organization @relation(fields: [organizationId], references: [id])
```

Models to modify:
- User
- Ticket
- Notification (already has userId, but direct org FK is faster for scoping than joining through User)
- HelpRequest
- HelpRequestResponse
- Checkpoint
- CheckpointConfig (remove singleton pattern; add organizationId, make it one-per-org)
- TvConfig (same as CheckpointConfig)
- RoleNotificationConfig (change unique from `role` to `[organizationId, role]`)

Models that inherit org scope through parent relations (do NOT add organizationId):
- BugReport (scoped via Ticket)
- TicketEvent (scoped via Ticket)
- ReorderRequest (scoped via Ticket)

### User Model Changes
- Add `organizationId String` with FK to Organization
- Add `isSuperAdmin Boolean @default(false)`
- Change email uniqueness: remove `@unique` on email, add `@@unique([organizationId, email])` (email unique within org)
- Keep all existing fields unchanged

## Tenant Context Infrastructure

### File: `apps/web/lib/tenant-context.ts`
Create an AsyncLocalStorage-based context that stores the current tenant's organizationId for the duration of a request. Provide:
- `runWithTenant(organizationId: string, fn: () => T): T` -- wraps a function execution with tenant context
- `getTenantId(): string` -- reads the current tenant ID; throws if not set
- `getTenantIdOptional(): string | null` -- reads without throwing (for super-admin routes)

### File: `apps/web/lib/tenant-db.ts`
Create a Prisma Client Extension using `$extends` that:
- Before every `findMany`, `findFirst`, `findUnique`, `count`, `create`, `update`, `delete`, `updateMany`, `deleteMany` on tenant-scoped models: auto-injects `where.organizationId = getTenantId()`
- For `create` operations: auto-injects `data.organizationId = getTenantId()`
- Exports `getTenantDb()` that returns the extended client
- The list of tenant-scoped model names should be defined as a const array for maintainability

IMPORTANT: The extension must NOT modify queries on Organization or Invite models (those are cross-tenant). BugReport, TicketEvent, and ReorderRequest do NOT need org injection because they are always accessed through their parent Ticket relation.

## Business Logic
- The existing `db` export in `apps/web/lib/db.ts` remains unchanged (it is the raw, unscoped client). Super-admin routes and the auth system use the raw client.
- Application routes use `getTenantDb()` which reads the tenant from AsyncLocalStorage.
- The migration must be backward-compatible: create a default "Inovar Sistemas" organization and assign all existing records to it.

## Migration Script

Create a data migration script at `apps/web/prisma/migrations/data-migration-multitenancy.ts` that:
1. Creates a default Organization with name "Inovar Sistemas" and slug "inovar-sistemas"
2. Updates all existing User records to set organizationId to the default org
3. Updates all existing Ticket records to set organizationId to the default org
4. Updates all existing Notification, HelpRequest, HelpRequestResponse, Checkpoint records
5. Updates CheckpointConfig and TvConfig records with the default org ID
6. Updates RoleNotificationConfig records with the default org ID

This script runs AFTER the Prisma schema migration adds the nullable columns and BEFORE the second migration that makes them non-nullable.

## Rules to Follow
- Use cuid() for all new IDs (existing pattern)
- Follow the existing Prisma schema conventions (@@map for table names, lowercase snake_case table names)
- Table name for Organization: `organizations`
- Table name for Invite: `invites`
- Keep the Prisma extension simple and focused. Do NOT add business logic to it.
- The tenant context must be request-scoped, not global. AsyncLocalStorage is the correct approach for this.

## Communication File
`.claude/communication/20260423_multitenancy-refactor.md`
