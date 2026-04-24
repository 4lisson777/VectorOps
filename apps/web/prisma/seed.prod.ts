import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../generated/prisma/client"
import bcrypt from "bcryptjs"

const ADMIN_NAME = process.env.SEED_ADMIN_NAME
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Error: SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD must be set."
  )
  process.exit(1)
}

const adminName = ADMIN_NAME as string
const adminEmail = ADMIN_EMAIL as string
const adminPassword = ADMIN_PASSWORD as string

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const ROLE_NOTIFICATION_DEFAULTS: {
  role: "TECH_LEAD" | "DEVELOPER" | "QA" | "SUPPORT_LEAD" | "SUPPORT_MEMBER"
  notifyOnCreation: boolean
  notifyOnAssignment: boolean
}[] = [
  { role: "TECH_LEAD", notifyOnCreation: true, notifyOnAssignment: true },
  { role: "DEVELOPER", notifyOnCreation: true, notifyOnAssignment: true },
  { role: "QA", notifyOnCreation: true, notifyOnAssignment: false },
  { role: "SUPPORT_LEAD", notifyOnCreation: false, notifyOnAssignment: false },
  { role: "SUPPORT_MEMBER", notifyOnCreation: false, notifyOnAssignment: false },
]

async function applyPragmas(): Promise<void> {
  await prisma.$executeRawUnsafe("PRAGMA journal_mode = WAL;")
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON;")
  await prisma.$executeRawUnsafe("PRAGMA synchronous = NORMAL;")
  await prisma.$executeRawUnsafe("PRAGMA busy_timeout = 5000;")
}

async function main(): Promise<void> {
  console.log("Applying SQLite pragmas...")
  await applyPragmas()

  console.log('\nSeeding organization: "VectorOps"...')
  const org = await prisma.organization.upsert({
    where: { slug: "vectorops" },
    update: {},
    create: {
      name: "VectorOps",
      slug: "vectorops",
      isActive: true,
    },
  })
  console.log(`  Organization ID: ${org.id}`)

  console.log("  Creating super admin user...")
  const passwordHash = await bcrypt.hash(adminPassword, 12)
  const existingUser = await prisma.user.findFirst({
    where: { organizationId: org.id, email: adminEmail },
  })
  const admin = await prisma.user.upsert({
    where: { id: existingUser?.id ?? "" },
    update: { isSuperAdmin: true },
    create: {
      organizationId: org.id,
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "TECH_LEAD",
      ninjaAlias: "IronJonin",
      isSuperAdmin: true,
    },
  })
  console.log(`  Super admin: ${admin.name} (${admin.email}) [SUPER_ADMIN]`)

  console.log("  Seeding org configs...")

  const existingCheckpoint = await prisma.checkpointConfig.findFirst({
    where: { organizationId: org.id },
  })
  await prisma.checkpointConfig.upsert({
    where: { id: existingCheckpoint?.id ?? "" },
    update: {},
    create: {
      organizationId: org.id,
      intervalMinutes: 60,
      activeHoursStart: "09:00",
      activeHoursEnd: "18:00",
      isEnabled: true,
    },
  })

  const existingTv = await prisma.tvConfig.findFirst({
    where: { organizationId: org.id },
  })
  await prisma.tvConfig.upsert({
    where: { id: existingTv?.id ?? "" },
    update: {},
    create: {
      organizationId: org.id,
      isEnabled: true,
      refreshInterval: 30,
    },
  })

  for (const defaults of ROLE_NOTIFICATION_DEFAULTS) {
    await prisma.roleNotificationConfig.upsert({
      where: {
        organizationId_role: { organizationId: org.id, role: defaults.role },
      },
      update: {},
      create: {
        organizationId: org.id,
        role: defaults.role,
        notifyOnCreation: defaults.notifyOnCreation,
        notifyOnAssignment: defaults.notifyOnAssignment,
      },
    })
  }
  console.log("  Upserted RoleNotificationConfig for all roles")

  console.log("\nProduction seed complete.")
  console.log(`  Organization : VectorOps (slug: vectorops)`)
  console.log(`  Super admin  : ${ADMIN_EMAIL}`)
}

main()
  .catch((error: unknown) => {
    console.error("Production seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
