# Backend Task: Phase MT-5 -- Data Migration & Seed Update

## Description
Create the migration scripts and update the seed file to support multitenancy. Handle the transition of existing single-tenant data to the multitenant schema.

## Prerequisites
- Phase MT-1 schema changes complete

## Acceptance Criteria
- [ ] A two-step migration strategy exists:
  1. First migration: add organizationId as NULLABLE to all models, create Organization and Invite tables
  2. Data migration script: create default org, backfill all records
  3. Second migration: make organizationId NON-NULLABLE, add FK constraints and indexes
- [ ] Seed script (`apps/web/prisma/seed.ts`) creates a default organization before seeding users
- [ ] Seed script assigns all seed users to the default organization
- [ ] Seed script creates org-scoped CheckpointConfig, TvConfig, and RoleNotificationConfig records
- [ ] Seed script optionally creates a second test organization with a few users for testing multitenancy
- [ ] Data migration script is idempotent (safe to run multiple times)

## Migration Strategy

### Step 1: Schema Migration (Prisma handles this)
The Prisma schema from Phase MT-1 is applied. Since we cannot do two-step nullable migrations easily with Prisma's declarative schema, the approach is:

1. Temporarily modify schema to make organizationId optional (`String?`) on all models
2. Run `npx prisma migrate dev --name add-multitenancy-nullable`
3. Run the data migration script
4. Modify schema to make organizationId required (`String`) with proper FKs
5. Run `npx prisma migrate dev --name make-org-id-required`

### Step 2: Data Migration Script
File: `apps/web/prisma/data-migration-multitenancy.ts`

```
Logic:
1. Check if a default org already exists (idempotency)
2. Create Organization { name: "Inovar Sistemas", slug: "inovar-sistemas" }
3. UPDATE users SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
4. UPDATE tickets SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
5. UPDATE notifications SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
6. UPDATE help_requests SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
7. UPDATE help_request_responses SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
8. UPDATE checkpoints SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
9. UPDATE checkpoint_config SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
10. UPDATE tv_config SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
11. UPDATE role_notification_configs SET organizationId = <defaultOrgId> WHERE organizationId IS NULL
```

Use raw SQL (`$executeRawUnsafe`) for efficiency on bulk updates.

### Step 3: Seed Script Update
File: `apps/web/prisma/seed.ts`

Changes:
- Create (or upsert) default organization "Inovar Sistemas" with slug "inovar-sistemas"
- All user upserts include `organizationId: defaultOrgId`
- RoleNotificationConfig upserts use `@@unique([organizationId, role])` for the where clause
- CheckpointConfig and TvConfig upserts include organizationId
- Optionally create a second org "Test Company" with slug "test-company" and 2-3 test users for development testing
- Create one super-admin user (not tied to org flow, but isSuperAdmin: true) for dev testing

## Business Logic
- The data migration script uses the raw Prisma client (not tenant-scoped)
- All raw SQL should use parameterized queries where possible, except for SQLite limitations
- The migration must handle the case where the database is fresh (no existing data) gracefully
- The seed script should be the single source of truth for development data

## Rules to Follow
- Follow the existing seed script structure and logging patterns
- Use `upsert` for idempotency wherever possible
- Keep the data migration script separate from the Prisma schema migration (different concern)
- Add a `package.json` script entry: `"db:migrate:mt"` for running the data migration
- Document the migration steps in a comment at the top of the data migration script

## Communication File
`.claude/communication/20260423_multitenancy-refactor.md`
