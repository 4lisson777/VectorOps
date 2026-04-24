import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../generated/prisma/client"
import bcrypt from "bcryptjs"

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Apply SQLite pragmas before any seeding operations
async function applyPragmas(): Promise<void> {
  await prisma.$executeRawUnsafe("PRAGMA journal_mode = WAL;")
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON;")
  await prisma.$executeRawUnsafe("PRAGMA synchronous = NORMAL;")
  await prisma.$executeRawUnsafe("PRAGMA busy_timeout = 5000;")
}

interface SeedUser {
  name: string
  email: string
  password: string
  role: "TECH_LEAD" | "DEVELOPER" | "SUPPORT_LEAD" | "SUPPORT_MEMBER" | "QA"
  ninjaAlias: string
  isSuperAdmin?: boolean
}

// Primary organization users (VectorOps)
const VECTOROPS_USERS: SeedUser[] = [
  // Super Admin + Tech Lead (1)
  {
    name: "Alisson Lima",
    email: "alisson@vector.ops",
    password: "Password123!",
    role: "TECH_LEAD",
    ninjaAlias: "IronJonin",
    isSuperAdmin: true,
  },
  // Developers (4)
  {
    name: "Matheus",
    email: "matheus@vectorops.dev",
    password: "Password123!",
    role: "DEVELOPER",
    ninjaAlias: "SilentBlade",
  },
  {
    name: "Marcos",
    email: "marcos@vectorops.dev",
    password: "Password123!",
    role: "DEVELOPER",
    ninjaAlias: "StormKunai",
  },
  {
    name: "Ivson",
    email: "ivson@vectorops.dev",
    password: "Password123!",
    role: "DEVELOPER",
    ninjaAlias: "VoidSerpent",
  },
  {
    name: "Guilherme",
    email: "guilherme@vectorops.dev",
    password: "Password123!",
    role: "DEVELOPER",
    ninjaAlias: "EmberShuriken",
  },
  // Support Lead (1)
  {
    name: "Alisson Rosa",
    email: "alisson.rosa@vectorops.dev",
    password: "Password123!",
    role: "SUPPORT_LEAD",
    ninjaAlias: "SwiftCrane",
  },
  // Support Members (2)
  {
    name: "Bruno Carvalho",
    email: "bruno@vectorops.dev",
    password: "Password123!",
    role: "SUPPORT_MEMBER",
    ninjaAlias: "CrimsonFang",
  },
  {
    name: "Leticia Duarte",
    email: "leticia@vectorops.dev",
    password: "Password123!",
    role: "SUPPORT_MEMBER",
    ninjaAlias: "MistSparrow",
  },
  // QA (1)
  {
    name: "Nicoli",
    email: "nicoli@vectorops.dev",
    password: "Password123!",
    role: "QA",
    ninjaAlias: "ShadowSeal",
  },
]

// Test organization users (Test Company — for dev multitenancy testing)
const TEST_COMPANY_USERS: SeedUser[] = [
  {
    name: "Test Lead",
    email: "lead@testcompany.dev",
    password: "Password123!",
    role: "TECH_LEAD",
    ninjaAlias: "PhantomSensei",
  },
  {
    name: "Test Developer",
    email: "dev@testcompany.dev",
    password: "Password123!",
    role: "DEVELOPER",
    ninjaAlias: "DustKunai",
  },
  {
    name: "Test Support",
    email: "support@testcompany.dev",
    password: "Password123!",
    role: "SUPPORT_MEMBER",
    ninjaAlias: "IronSparrow",
  },
]

interface RoleNotificationDefault {
  role: "TECH_LEAD" | "DEVELOPER" | "QA" | "SUPPORT_LEAD" | "SUPPORT_MEMBER"
  notifyOnCreation: boolean
  notifyOnAssignment: boolean
}

const ROLE_NOTIFICATION_DEFAULTS: RoleNotificationDefault[] = [
  { role: "TECH_LEAD", notifyOnCreation: true, notifyOnAssignment: true },
  { role: "DEVELOPER", notifyOnCreation: true, notifyOnAssignment: true },
  { role: "QA", notifyOnCreation: true, notifyOnAssignment: false },
  { role: "SUPPORT_LEAD", notifyOnCreation: false, notifyOnAssignment: false },
  { role: "SUPPORT_MEMBER", notifyOnCreation: false, notifyOnAssignment: false },
]

async function seedOrganizationUsers(
  orgId: string,
  users: SeedUser[]
): Promise<void> {
  for (const seedUser of users) {
    const passwordHash = await bcrypt.hash(seedUser.password, 12)

    // Upsert by (organizationId, email) compound unique — use findFirst + id for the where clause.
    // On update: only overwrite isSuperAdmin if the seed definition sets it to true,
    // to avoid inadvertently demoting an existing super-admin on re-seed.
    const existingUser = await prisma.user.findFirst({
      where: { organizationId: orgId, email: seedUser.email },
    })
    const user = await prisma.user.upsert({
      where: { id: existingUser?.id ?? "" },
      update: seedUser.isSuperAdmin ? { isSuperAdmin: true } : {},
      create: {
        organizationId: orgId,
        name: seedUser.name,
        email: seedUser.email,
        passwordHash,
        role: seedUser.role,
        ninjaAlias: seedUser.ninjaAlias,
        isSuperAdmin: seedUser.isSuperAdmin ?? false,
      },
    })

    const superTag = user.isSuperAdmin ? " [SUPER_ADMIN]" : ""
    console.log(
      `    Created/found user: ${user.name} (${user.role})${superTag} — ${user.email}`
    )
  }
}

async function seedOrgConfigs(orgId: string): Promise<void> {
  // CheckpointConfig — one per org
  const existingCheckpointConfig = await prisma.checkpointConfig.findFirst({
    where: { organizationId: orgId },
  })
  await prisma.checkpointConfig.upsert({
    where: { id: existingCheckpointConfig?.id ?? "" },
    update: {},
    create: {
      organizationId: orgId,
      intervalMinutes: 60,
      activeHoursStart: "09:00",
      activeHoursEnd: "18:00",
      isEnabled: true,
    },
  })
  console.log("    Upserted CheckpointConfig")

  // TvConfig — one per org
  const existingTvConfig = await prisma.tvConfig.findFirst({
    where: { organizationId: orgId },
  })
  await prisma.tvConfig.upsert({
    where: { id: existingTvConfig?.id ?? "" },
    update: {},
    create: {
      organizationId: orgId,
      isEnabled: true,
      refreshInterval: 30,
    },
  })
  console.log("    Upserted TvConfig")

  // RoleNotificationConfig — one row per (org, role)
  for (const defaults of ROLE_NOTIFICATION_DEFAULTS) {
    await prisma.roleNotificationConfig.upsert({
      where: { organizationId_role: { organizationId: orgId, role: defaults.role } },
      update: {},
      create: {
        organizationId: orgId,
        role: defaults.role,
        notifyOnCreation: defaults.notifyOnCreation,
        notifyOnAssignment: defaults.notifyOnAssignment,
      },
    })
    console.log(
      `    Upserted RoleNotificationConfig: ${defaults.role} (creation=${defaults.notifyOnCreation}, assignment=${defaults.notifyOnAssignment})`
    )
  }
}

async function main(): Promise<void> {
  console.log("Applying SQLite pragmas...")
  await applyPragmas()

  // ── Organization 1: VectorOps (default / dev org) ────────────────────────
  console.log('\nSeeding organization: "VectorOps"...')
  const vectoropsOrg = await prisma.organization.upsert({
    where: { slug: "vectorops" },
    update: {},
    create: {
      name: "VectorOps",
      slug: "vectorops",
      isActive: true,
    },
  })
  console.log(`  Organization ID: ${vectoropsOrg.id}`)

  console.log("  Seeding users...")
  await seedOrganizationUsers(vectoropsOrg.id, VECTOROPS_USERS)

  console.log("  Seeding org configs...")
  await seedOrgConfigs(vectoropsOrg.id)

  // ── Organization 2: Test Company (dev multitenancy testing) ──────────────
  console.log('\nSeeding organization: "Test Company"...')
  const testOrg = await prisma.organization.upsert({
    where: { slug: "test-company" },
    update: {},
    create: {
      name: "Test Company",
      slug: "test-company",
      isActive: true,
    },
  })
  console.log(`  Organization ID: ${testOrg.id}`)

  console.log("  Seeding users...")
  await seedOrganizationUsers(testOrg.id, TEST_COMPANY_USERS)

  console.log("  Seeding org configs...")
  await seedOrgConfigs(testOrg.id)

  console.log("\nDev seed complete.")
  console.log("")
  console.log("Seed credentials (all passwords: Password123!):")
  console.log("  VectorOps:")
  console.log("    TECH_LEAD + SUPER_ADMIN : alisson@vector.ops")
  console.log("    DEVELOPER               : matheus@vectorops.dev")
  console.log("    SUPPORT_LEAD            : alisson.rosa@vectorops.dev")
  console.log("    SUPPORT_MEMBER          : bruno@vectorops.dev")
  console.log("    QA                      : nicoli@vectorops.dev")
  console.log("  Test Company:")
  console.log("    TECH_LEAD               : lead@testcompany.dev")
  console.log("    DEVELOPER               : dev@testcompany.dev")
  console.log("    SUPPORT_MEMBER          : support@testcompany.dev")
}

main()
  .catch((error: unknown) => {
    console.error("Seed script failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
