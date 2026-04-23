/**
 * Data Migration: Multitenancy Backfill
 *
 * This script runs AFTER the Prisma schema migration adds nullable organizationId
 * columns to all tenant-scoped models, and BEFORE any future migration that
 * makes them non-nullable.
 *
 * It creates the default "Inovar Sistemas" organization and assigns all existing
 * records to it, preserving all historical data during the multitenancy transition.
 *
 * Run with: npx tsx apps/web/prisma/migrations/data-migration-multitenancy.ts
 * Or via:   npm run db:migrate:mt -w web
 *
 * NOTE: The WHERE clause uses raw SQL (organizationId IS NULL) because Prisma's
 * type system does not allow null filters on non-nullable columns. This script was
 * designed to run when organizationId was still nullable (String?), before the
 * `make_org_id_required` migration. Raw SQL is used here to keep the script safe
 * to re-run at any point in time.
 */

import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../../generated/prisma/client"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
})

const db = new PrismaClient({ adapter })

async function main() {
  console.log("Starting multitenancy data migration...")

  // Step 1: Create the default organization
  const defaultOrg = await db.organization.upsert({
    where: { slug: "inovar-sistemas" },
    update: {},
    create: {
      name: "Inovar Sistemas",
      slug: "inovar-sistemas",
      isActive: true,
    },
  })

  console.log(`Default organization: ${defaultOrg.name} (${defaultOrg.id})`)

  const orgId = defaultOrg.id

  // Steps 2-10: Assign all existing records to the default org where not already set.
  // Raw SQL is required because the Prisma-generated type for `where` no longer accepts
  // null after the `make_org_id_required` migration promoted organizationId to non-nullable.
  const tables = [
    "users",
    "tickets",
    "notifications",
    "help_requests",
    "help_request_responses",
    "checkpoints",
    "checkpoint_config",
    "tv_config",
    "role_notification_configs",
  ]

  for (const table of tables) {
    await db.$executeRawUnsafe(
      `UPDATE "${table}" SET "organizationId" = ? WHERE "organizationId" IS NULL`,
      orgId
    )
    console.log(`Updated ${table}`)
  }

  console.log("\nData migration complete.")
  console.log(
    "All existing records have been assigned to the default organization."
  )
  console.log(
    "You can now run a second Prisma migration to make organizationId non-nullable."
  )
}

main()
  .catch((err) => {
    console.error("Migration failed:", err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
