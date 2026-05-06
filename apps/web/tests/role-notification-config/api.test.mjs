/**
 * Role-Based Notification Configuration — API & Logic Integration Tests
 *
 * Covers:
 *  1.  Static: schema.prisma has RoleNotificationConfig model with correct fields
 *  2.  Static: notifications.ts getNotificationTargets reads RoleNotificationConfig on TICKET_CREATED
 *  3.  Static: notifications.ts getNotificationTargets reads RoleNotificationConfig on BUG_CREATED
 *  4.  Static: notifications.ts TICKET_ASSIGNED checks notifyOnAssignment (fail-closed)
 *  5.  Static: route.ts GET /api/admin/role-notification-config requires TECH_LEAD only
 *  6.  Static: route.ts PATCH /api/admin/role-notification-config uses Zod patchSchema
 *  7.  Static: route.ts ensureDefaultConfigsExist provisions missing rows
 *  8.  Auth guard: unauthenticated GET returns 307/401
 *  9.  Auth guard: unauthenticated PATCH returns 307/401
 * 10.  Auth guard: DEVELOPER role cannot call GET (403)
 * 11.  Auth guard: DEVELOPER role cannot call PATCH (403)
 * 12.  Auth guard: SUPPORT_MEMBER role cannot call GET (403)
 * 13.  Auth guard: QA role cannot call GET (403)
 * 14.  TECH_LEAD GET: returns 200 with configs array
 * 15.  TECH_LEAD GET: returns exactly 5 role configs
 * 16.  TECH_LEAD GET: all 5 roles present in response
 * 17.  TECH_LEAD GET: response is sorted alphabetically by role
 * 18.  TECH_LEAD GET: no id or updatedAt fields in response items
 * 19.  TECH_LEAD GET: default values match spec (TECH_LEAD, DEVELOPER, QA, SUPPORT_LEAD, SUPPORT_MEMBER)
 * 20.  TECH_LEAD PATCH: partial update of one role updates only that role
 * 21.  TECH_LEAD PATCH: update is reflected in subsequent GET
 * 22.  TECH_LEAD PATCH: PATCH returns full configs list (same shape as GET)
 * 23.  TECH_LEAD PATCH: partial PATCH with only notifyOnCreation leaves notifyOnAssignment unchanged
 * 24.  TECH_LEAD PATCH: partial PATCH with only notifyOnAssignment leaves notifyOnCreation unchanged
 * 25.  Zod validation: PATCH with empty configs array returns 400
 * 26.  Zod validation: PATCH with invalid role value returns 400
 * 27.  Zod validation: PATCH with non-boolean toggle value returns 400
 * 28.  Zod validation: PATCH with missing configs key returns 400
 * 29.  Zod validation: PATCH with invalid JSON body returns 400
 * 30.  PATCH restore: restore seed defaults after patch tests
 * 31.  Static: RoleNotificationConfig component renders 5 role rows with correct labels
 * 32.  Static: RoleNotificationConfig component uses aria-label on each Switch
 * 33.  Static: RoleNotificationConfig handleToggle sends partial PATCH (one entry only)
 * 34.  Static: RoleNotificationConfig handleToggle reverts optimistic update on PATCH failure
 * 35.  Static: AdminNotificationsContent derives eligibleRoles from notifyOnCreation=true
 * 36.  Static: NotificationRouting accepts eligibleRoles prop and re-fetches on change
 * 37.  Static: NotificationRouting renders empty-state message when eligibleRoles is empty array
 * 38.  Static: NotificationRouting fetches /api/users?role=<role>&isActive=true per eligible role
 * 39.  Notification logic: TICKET_CREATED skips users in roles with notifyOnCreation=false
 * 40.  Notification logic: BUG_CREATED skips users in roles with notifyOnCreation=false
 * 41.  Notification logic: TICKET_ASSIGNED skips assignee when their role has notifyOnAssignment=false
 * 42.  Notification logic: TICKET_ASSIGNED notifies assignee when their role has notifyOnAssignment=true
 * 43.  Regression: TICKET_DONE / TICKET_CANCELLED still notify ticket opener (unaffected by role config)
 * 44.  Regression: HELP_REQUEST_NEW still notifies active DEVs/TECH_LEADs (unaffected by role config)
 * 45.  Regression: existing seed users in DEVELOPER role have notifyTickets=true by default
 * 46.  PATCH + create ticket: creating a ticket with DEVELOPER notifyOnCreation=false → no notification created for developers
 * 47.  Restore: re-enable DEVELOPER notifyOnCreation after test 46
 *
 * Usage:
 *   node apps/web/tests/role-notification-config/api.test.mjs
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - Seed applied: npx prisma db seed (from apps/web/)
 */

const BASE_URL = "http://localhost:3000"

// ─── Harness ─────────────────────────────────────────────────────────────────

let passCount = 0
let failCount = 0
const failures = []

function pass(name) {
  console.log(`  PASS  ${name}`)
  passCount++
}

function fail(name, reason) {
  console.log(`  FAIL  ${name}`)
  console.log(`        ${reason}`)
  failCount++
  failures.push({ name, reason })
}

function assert(condition, name, reason) {
  if (condition) pass(name)
  else fail(name, reason)
}

async function getJson(url, cookie, { redirect = "follow" } = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    redirect,
    headers: cookie ? { Cookie: cookie } : {},
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

async function patchJson(url, data, cookie, { redirect = "follow" } = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    redirect,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

async function patchRaw(url, rawBody, cookie) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: rawBody,
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

async function postJson(url, data, cookie) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(data),
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

async function login(email, password) {
  const maxRetries = 12
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.status === 429 && attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 5_000))
      continue
    }
    const setCookie = res.headers.get("set-cookie")
    if (!setCookie) return null
    const match = setCookie.match(/^([^;]+)/)
    return match ? match[1] : null
  }
  return null
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function makeDeadline() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
}

// ─── Suite 1: Static — schema.prisma ─────────────────────────────────────────

async function testSchemaPrisma() {
  console.log("\n[Suite 1] Static: schema.prisma — RoleNotificationConfig model")

  const fs = await import("fs")
  const content = fs.readFileSync(
    "/home/alisson/web/personal/vectorops/apps/web/prisma/schema.prisma",
    "utf8"
  )

  assert(
    content.includes("model RoleNotificationConfig"),
    "schema.prisma defines model RoleNotificationConfig",
    "model RoleNotificationConfig not found in schema.prisma"
  )

  assert(
    content.includes("@@unique([organizationId, role])"),
    "RoleNotificationConfig has compound unique constraint on (organizationId, role)",
    "@@unique([organizationId, role]) not found in RoleNotificationConfig"
  )

  assert(
    content.includes("notifyOnCreation    Boolean"),
    "RoleNotificationConfig has notifyOnCreation Boolean field",
    "notifyOnCreation field not found"
  )

  assert(
    content.includes("notifyOnAssignment  Boolean"),
    "RoleNotificationConfig has notifyOnAssignment Boolean field",
    "notifyOnAssignment field not found"
  )

  assert(
    content.includes('@@map("role_notification_configs")'),
    'RoleNotificationConfig maps to table "role_notification_configs"',
    '@@map("role_notification_configs") not found'
  )
}

// ─── Suite 2-4: Static — notifications.ts logic ──────────────────────────────

async function testNotificationsStaticAnalysis() {
  console.log("\n[Suite 2-4] Static: notifications.ts — role config gate integration")

  const fs = await import("fs")
  const content = fs.readFileSync(
    "/home/alisson/web/personal/vectorops/apps/web/lib/notifications.ts",
    "utf8"
  )

  // Suite 2: TICKET_CREATED reads role config
  assert(
    content.includes("getRoleConfigMap") && content.includes("TICKET_CREATED"),
    "notifications.ts getNotificationTargets calls getRoleConfigMap for TICKET_CREATED",
    "getRoleConfigMap call not found near TICKET_CREATED case"
  )

  assert(
    content.includes("eligibleRoles") && content.includes("notifyOnCreation"),
    "notifications.ts builds eligibleRoles set from notifyOnCreation flag",
    "eligibleRoles or notifyOnCreation not found in notifications.ts"
  )

  assert(
    content.includes("if (eligibleRoles.length === 0)"),
    "notifications.ts returns empty arrays immediately when no roles are eligible",
    "early-return for empty eligibleRoles not found"
  )

  // Suite 3: BUG_CREATED also reads role config
  assert(
    content.includes("BUG_CREATED"),
    "notifications.ts handles BUG_CREATED case",
    "BUG_CREATED case not found in notifications.ts"
  )

  const bugCreatedBlock = content.slice(
    content.indexOf('case "BUG_CREATED"'),
    content.indexOf('case "BUG_CREATED"') + 600
  )
  assert(
    bugCreatedBlock.includes("getRoleConfigMap"),
    "BUG_CREATED also calls getRoleConfigMap (same gate as TICKET_CREATED)",
    "getRoleConfigMap not found in BUG_CREATED block"
  )

  assert(
    bugCreatedBlock.includes("notifyBugs"),
    "BUG_CREATED uses notifyBugs personal flag (distinct from notifyTickets)",
    "notifyBugs not found in BUG_CREATED block"
  )

  // Suite 4: TICKET_ASSIGNED checks notifyOnAssignment, fail-closed
  const assignedBlock = content.slice(
    content.indexOf('case "TICKET_ASSIGNED"'),
    content.indexOf('case "TICKET_ASSIGNED"') + 600
  )
  assert(
    assignedBlock.includes("notifyOnAssignment"),
    "TICKET_ASSIGNED checks notifyOnAssignment from role config",
    "notifyOnAssignment not found in TICKET_ASSIGNED block"
  )

  assert(
    assignedBlock.includes("?? false"),
    "TICKET_ASSIGNED fails closed when config is missing (defaults to false)",
    "fail-closed default (?? false) not found in TICKET_ASSIGNED block"
  )
}

// ─── Suite 5-7: Static — API route ───────────────────────────────────────────

async function testRouteStaticAnalysis() {
  console.log("\n[Suite 5-7] Static: role-notification-config route.ts — auth + Zod + provisioning")

  const fs = await import("fs")
  const content = fs.readFileSync(
    "/home/alisson/web/personal/vectorops/apps/web/app/api/admin/role-notification-config/route.ts",
    "utf8"
  )

  // Suite 5: Auth guard
  assert(
    content.includes('requireTenantRole("TECH_LEAD")'),
    "route.ts GET requires TECH_LEAD role",
    'requireTenantRole("TECH_LEAD") not found in GET handler'
  )

  const patchSection = content.slice(content.indexOf("export async function PATCH"))
  assert(
    patchSection.includes('requireTenantRole("TECH_LEAD")'),
    "route.ts PATCH also requires TECH_LEAD role",
    'requireTenantRole("TECH_LEAD") not found in PATCH handler'
  )

  // Suite 6: Zod schema
  assert(
    content.includes("patchSchema") && content.includes("z.object"),
    "route.ts defines patchSchema using Zod z.object",
    "patchSchema with z.object not found"
  )

  assert(
    content.includes('.min(1,'),
    "patchSchema enforces configs array min length of 1",
    ".min(1, ...) not found in patchSchema"
  )

  assert(
    content.includes('z.enum(["TECH_LEAD", "DEVELOPER", "QA", "SUPPORT_LEAD", "SUPPORT_MEMBER"])'),
    "patchSchema role field uses z.enum with all 5 roles",
    "z.enum with all 5 roles not found in patchSchema"
  )

  // Suite 7: Default provisioning
  assert(
    content.includes("ensureDefaultConfigsExist"),
    "route.ts defines ensureDefaultConfigsExist function",
    "ensureDefaultConfigsExist function not found"
  )

  assert(
    content.includes("createMany"),
    "ensureDefaultConfigsExist uses createMany to provision missing rows",
    "createMany not found in ensureDefaultConfigsExist"
  )

  // GET calls ensure
  const getSection = content.slice(content.indexOf("export async function GET"))
  assert(
    getSection.slice(0, 300).includes("ensureDefaultConfigsExist"),
    "GET handler calls ensureDefaultConfigsExist before querying",
    "GET handler does not call ensureDefaultConfigsExist"
  )
}

// ─── Suite 8-9: Auth guard — unauthenticated requests ────────────────────────

async function testUnauthenticated() {
  console.log("\n[Suite 8-9] Auth guards — unauthenticated requests")

  const getRes = await fetch(`${BASE_URL}/api/admin/role-notification-config`, {
    redirect: "manual",
  })
  assert(
    getRes.status === 401 || getRes.status === 302 || getRes.status === 307,
    "Unauthenticated GET /api/admin/role-notification-config → auth redirect (307/401)",
    `Expected 307/401 but got ${getRes.status}`
  )

  const patchRes = await fetch(`${BASE_URL}/api/admin/role-notification-config`, {
    method: "PATCH",
    redirect: "manual",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ configs: [{ role: "DEVELOPER", notifyOnCreation: false }] }),
  })
  assert(
    patchRes.status === 401 || patchRes.status === 302 || patchRes.status === 307,
    "Unauthenticated PATCH /api/admin/role-notification-config → auth redirect (307/401)",
    `Expected 307/401 but got ${patchRes.status}`
  )
}

// ─── Suites 10-13: Role guard — wrong roles cannot access endpoint ────────────

async function testRoleGuards(cookies) {
  console.log("\n[Suite 10-13] Role guards — non-TECH_LEAD roles are rejected")

  const { status: devGetStatus } = await getJson("/api/admin/role-notification-config", cookies.dev)
  assert(
    devGetStatus === 403,
    "DEVELOPER cannot GET /api/admin/role-notification-config (403)",
    `Expected 403 but got ${devGetStatus}`
  )

  const { status: devPatchStatus } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "DEVELOPER", notifyOnCreation: false }] },
    cookies.dev
  )
  assert(
    devPatchStatus === 403,
    "DEVELOPER cannot PATCH /api/admin/role-notification-config (403)",
    `Expected 403 but got ${devPatchStatus}`
  )

  await sleep(300)
  const { status: supportGetStatus } = await getJson(
    "/api/admin/role-notification-config",
    cookies.support
  )
  assert(
    supportGetStatus === 403,
    "SUPPORT_MEMBER cannot GET /api/admin/role-notification-config (403)",
    `Expected 403 but got ${supportGetStatus}`
  )

  await sleep(300)
  const { status: qaGetStatus } = await getJson(
    "/api/admin/role-notification-config",
    cookies.qa
  )
  assert(
    qaGetStatus === 403,
    "QA cannot GET /api/admin/role-notification-config (403)",
    `Expected 403 but got ${qaGetStatus}`
  )
}

// ─── Suites 14-19: TECH_LEAD GET — shape and content ─────────────────────────

async function testTechLeadGet(cookies) {
  console.log("\n[Suite 14-19] TECH_LEAD GET — shape, count, roles, ordering, defaults")

  const { status, body } = await getJson("/api/admin/role-notification-config", cookies.techLead)

  assert(status === 200, "TECH_LEAD GET returns 200", `Expected 200 but got ${status}`)

  assert(
    body !== null && Array.isArray(body.configs),
    "GET response body has configs array",
    `body.configs is not an array: ${JSON.stringify(body)}`
  )

  assert(
    body.configs.length === 5,
    "GET returns exactly 5 role configs",
    `Expected 5 configs but got ${body.configs.length}`
  )

  const roles = body.configs.map((c) => c.role)
  const expectedRoles = ["DEVELOPER", "QA", "SUPPORT_LEAD", "SUPPORT_MEMBER", "TECH_LEAD"]
  assert(
    expectedRoles.every((r) => roles.includes(r)),
    "All 5 roles are present in GET response (DEVELOPER, QA, SUPPORT_LEAD, SUPPORT_MEMBER, TECH_LEAD)",
    `Missing roles. Got: ${JSON.stringify(roles)}`
  )

  // Alphabetical ordering
  const sortedRoles = [...roles].sort()
  assert(
    JSON.stringify(roles) === JSON.stringify(sortedRoles),
    "GET response is sorted alphabetically by role",
    `Expected ${JSON.stringify(sortedRoles)} but got ${JSON.stringify(roles)}`
  )

  // No id or updatedAt in response items
  const firstItem = body.configs[0]
  assert(
    !Object.prototype.hasOwnProperty.call(firstItem, "id") &&
      !Object.prototype.hasOwnProperty.call(firstItem, "updatedAt"),
    "Response items omit id and updatedAt fields",
    `Unexpected fields in response item: ${JSON.stringify(Object.keys(firstItem))}`
  )

  // Default values per spec
  const configMap = Object.fromEntries(body.configs.map((c) => [c.role, c]))

  assert(
    configMap.TECH_LEAD?.notifyOnCreation === true && configMap.TECH_LEAD?.notifyOnAssignment === true,
    "Default: TECH_LEAD has notifyOnCreation=true, notifyOnAssignment=true",
    `TECH_LEAD config: ${JSON.stringify(configMap.TECH_LEAD)}`
  )

  assert(
    configMap.DEVELOPER?.notifyOnCreation === true && configMap.DEVELOPER?.notifyOnAssignment === true,
    "Default: DEVELOPER has notifyOnCreation=true, notifyOnAssignment=true",
    `DEVELOPER config: ${JSON.stringify(configMap.DEVELOPER)}`
  )

  assert(
    configMap.QA?.notifyOnCreation === true && configMap.QA?.notifyOnAssignment === false,
    "Default: QA has notifyOnCreation=true, notifyOnAssignment=false",
    `QA config: ${JSON.stringify(configMap.QA)}`
  )

  assert(
    configMap.SUPPORT_LEAD?.notifyOnCreation === false &&
      configMap.SUPPORT_LEAD?.notifyOnAssignment === false,
    "Default: SUPPORT_LEAD has notifyOnCreation=false, notifyOnAssignment=false",
    `SUPPORT_LEAD config: ${JSON.stringify(configMap.SUPPORT_LEAD)}`
  )

  assert(
    configMap.SUPPORT_MEMBER?.notifyOnCreation === false &&
      configMap.SUPPORT_MEMBER?.notifyOnAssignment === false,
    "Default: SUPPORT_MEMBER has notifyOnCreation=false, notifyOnAssignment=false",
    `SUPPORT_MEMBER config: ${JSON.stringify(configMap.SUPPORT_MEMBER)}`
  )

  return body.configs
}

// ─── Suites 20-24: TECH_LEAD PATCH — partial updates ─────────────────────────

async function testTechLeadPatch(cookies) {
  console.log("\n[Suite 20-24] TECH_LEAD PATCH — partial updates")

  // 20: Patch one field on one role; verify only that role changes
  await sleep(300)
  const { status: patchStatus, body: patchBody } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "SUPPORT_LEAD", notifyOnCreation: true }] },
    cookies.techLead
  )
  assert(
    patchStatus === 200,
    "PATCH with valid single-role update returns 200",
    `Expected 200 but got ${patchStatus}: ${JSON.stringify(patchBody)}`
  )

  // 21: Verify subsequent GET reflects the change
  await sleep(200)
  const { body: getBody } = await getJson("/api/admin/role-notification-config", cookies.techLead)
  const configMap = Object.fromEntries(getBody.configs.map((c) => [c.role, c]))
  assert(
    configMap.SUPPORT_LEAD?.notifyOnCreation === true,
    "Subsequent GET reflects SUPPORT_LEAD notifyOnCreation=true after PATCH",
    `SUPPORT_LEAD config after PATCH: ${JSON.stringify(configMap.SUPPORT_LEAD)}`
  )

  // 22: PATCH returns full configs list (same shape as GET)
  assert(
    Array.isArray(patchBody?.configs) && patchBody.configs.length === 5,
    "PATCH response returns full configs list (5 items, same shape as GET)",
    `Expected 5 configs in PATCH response but got: ${JSON.stringify(patchBody)}`
  )

  // 23: Patch only notifyOnCreation — notifyOnAssignment must remain unchanged
  await sleep(300)
  // SUPPORT_LEAD originally has notifyOnAssignment=false; we only patch notifyOnCreation
  const { body: partialBody } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "SUPPORT_LEAD", notifyOnCreation: false }] },
    cookies.techLead
  )
  const slPatch = partialBody.configs.find((c) => c.role === "SUPPORT_LEAD")
  assert(
    slPatch?.notifyOnCreation === false && slPatch?.notifyOnAssignment === false,
    "Partial PATCH with only notifyOnCreation leaves notifyOnAssignment unchanged",
    `SUPPORT_LEAD after partial PATCH: ${JSON.stringify(slPatch)}`
  )

  // 24: Patch only notifyOnAssignment — notifyOnCreation must remain unchanged
  await sleep(300)
  // QA has notifyOnCreation=true; only patch notifyOnAssignment
  const { body: qaBody } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "QA", notifyOnAssignment: true }] },
    cookies.techLead
  )
  const qaPatch = qaBody.configs.find((c) => c.role === "QA")
  assert(
    qaPatch?.notifyOnCreation === true && qaPatch?.notifyOnAssignment === true,
    "Partial PATCH with only notifyOnAssignment leaves notifyOnCreation unchanged",
    `QA after partial notifyOnAssignment PATCH: ${JSON.stringify(qaPatch)}`
  )

  // Restore QA to original defaults (notifyOnAssignment=false)
  await sleep(300)
  await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "QA", notifyOnAssignment: false }] },
    cookies.techLead
  )
}

// ─── Suites 25-29: Zod validation ────────────────────────────────────────────

async function testZodValidation(cookies) {
  console.log("\n[Suite 25-29] Zod validation — PATCH rejects invalid inputs")

  // 25: Empty configs array
  await sleep(300)
  const { status: emptyStatus, body: emptyBody } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [] },
    cookies.techLead
  )
  assert(
    emptyStatus === 400,
    "PATCH with empty configs array returns 400",
    `Expected 400 but got ${emptyStatus}: ${JSON.stringify(emptyBody)}`
  )
  assert(
    emptyBody?.error === "Validation failed",
    "400 response body has error: 'Validation failed'",
    `Body: ${JSON.stringify(emptyBody)}`
  )

  // 26: Invalid role value
  await sleep(300)
  const { status: badRoleStatus, body: badRoleBody } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "INVALID_ROLE", notifyOnCreation: true }] },
    cookies.techLead
  )
  assert(
    badRoleStatus === 400,
    "PATCH with invalid role value returns 400",
    `Expected 400 but got ${badRoleStatus}: ${JSON.stringify(badRoleBody)}`
  )

  // 27: Non-boolean toggle value
  await sleep(300)
  const { status: badBoolStatus } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "DEVELOPER", notifyOnCreation: "yes" }] },
    cookies.techLead
  )
  assert(
    badBoolStatus === 400,
    "PATCH with non-boolean notifyOnCreation returns 400",
    `Expected 400 but got ${badBoolStatus}`
  )

  // 28: Missing configs key
  await sleep(300)
  const { status: missingKeyStatus } = await patchJson(
    "/api/admin/role-notification-config",
    { role: "DEVELOPER", notifyOnCreation: false },
    cookies.techLead
  )
  assert(
    missingKeyStatus === 400,
    "PATCH with missing configs key returns 400",
    `Expected 400 but got ${missingKeyStatus}`
  )

  // 29: Invalid JSON body
  await sleep(300)
  const { status: invalidJsonStatus } = await patchRaw(
    "/api/admin/role-notification-config",
    "not-valid-json",
    cookies.techLead
  )
  assert(
    invalidJsonStatus === 400,
    "PATCH with invalid JSON body returns 400",
    `Expected 400 but got ${invalidJsonStatus}`
  )
}

// ─── Suite 30: Restore seed defaults ─────────────────────────────────────────

async function restoreSeedDefaults(cookies) {
  console.log("\n[Suite 30] Restore: reset all role configs to seed defaults")

  await sleep(300)
  const { status, body } = await patchJson(
    "/api/admin/role-notification-config",
    {
      configs: [
        { role: "TECH_LEAD", notifyOnCreation: true, notifyOnAssignment: true },
        { role: "DEVELOPER", notifyOnCreation: true, notifyOnAssignment: true },
        { role: "QA", notifyOnCreation: true, notifyOnAssignment: false },
        { role: "SUPPORT_LEAD", notifyOnCreation: false, notifyOnAssignment: false },
        { role: "SUPPORT_MEMBER", notifyOnCreation: false, notifyOnAssignment: false },
      ],
    },
    cookies.techLead
  )
  assert(
    status === 200,
    "Restore: reset all role configs to seed defaults — PATCH returns 200",
    `Expected 200 but got ${status}: ${JSON.stringify(body)}`
  )
}

// ─── Suites 31-38: Static — frontend components ──────────────────────────────

async function testFrontendComponents() {
  console.log("\n[Suite 31-38] Static: frontend components — RoleNotificationConfig, AdminNotificationsContent, NotificationRouting")

  const fs = await import("fs")

  // Suite 31-34: role-notification-config.tsx
  const roleConfigContent = fs.readFileSync(
    "/home/alisson/web/personal/vectorops/apps/web/components/admin/role-notification-config.tsx",
    "utf8"
  )

  // 31: 5 roles in display order
  const roleDisplayOrder = [
    '"TECH_LEAD"',
    '"DEVELOPER"',
    '"QA"',
    '"SUPPORT_LEAD"',
    '"SUPPORT_MEMBER"',
  ]
  assert(
    roleDisplayOrder.every((r) => roleConfigContent.includes(r)),
    "RoleNotificationConfig has all 5 roles in ROLE_DISPLAY_ORDER",
    "One or more roles missing from ROLE_DISPLAY_ORDER in role-notification-config.tsx"
  )

  // Check role labels exist
  const expectedLabels = [
    "Lider Tecnico",
    "Desenvolvedor",
    "QA",
    "Lider de Suporte",
    "Membro de Suporte",
  ]
  assert(
    expectedLabels.every((label) => roleConfigContent.includes(label)),
    "RoleNotificationConfig has PT-BR labels for all 5 roles",
    "One or more PT-BR role labels missing from role-notification-config.tsx"
  )

  // 32: aria-label on Switch components
  assert(
    roleConfigContent.includes("aria-label={`Ativar notificacao de criacao para"),
    "RoleNotificationConfig Switch for notifyOnCreation has descriptive aria-label",
    "aria-label for notifyOnCreation Switch not found"
  )
  assert(
    roleConfigContent.includes("aria-label={`Ativar notificacao de atribuicao para"),
    "RoleNotificationConfig Switch for notifyOnAssignment has descriptive aria-label",
    "aria-label for notifyOnAssignment Switch not found"
  )

  // 33: Partial PATCH — handleToggle sends only the changed entry
  const handleToggleBlock = roleConfigContent.slice(
    roleConfigContent.indexOf("async function handleToggle"),
    roleConfigContent.indexOf("async function handleToggle") + 800
  )
  assert(
    handleToggleBlock.includes("configs: [{ role, [field]: value }]"),
    "handleToggle sends partial PATCH with only the changed config entry",
    "Partial PATCH pattern not found in handleToggle"
  )

  // 34: Optimistic revert on failure
  assert(
    roleConfigContent.includes("Revert optimistic update") ||
      (roleConfigContent.includes("if (!res.ok)") && roleConfigContent.includes("reverted")),
    "RoleNotificationConfig reverts optimistic update on PATCH failure",
    "Optimistic revert logic not found in role-notification-config.tsx"
  )

  // Suite 35: admin-notifications-content.tsx
  const adminContent = fs.readFileSync(
    "/home/alisson/web/personal/vectorops/apps/web/components/admin/admin-notifications-content.tsx",
    "utf8"
  )

  assert(
    adminContent.includes("eligibleRoles") && adminContent.includes("notifyOnCreation"),
    "AdminNotificationsContent derives eligibleRoles from notifyOnCreation=true configs",
    "eligibleRoles derivation from notifyOnCreation not found in admin-notifications-content.tsx"
  )

  assert(
    adminContent.includes(".filter((c) => c.notifyOnCreation)"),
    "AdminNotificationsContent filters configs where notifyOnCreation is true",
    ".filter((c) => c.notifyOnCreation) not found"
  )

  assert(
    adminContent.includes("<NotificationRouting eligibleRoles={eligibleRoles}"),
    "AdminNotificationsContent passes eligibleRoles prop to NotificationRouting",
    "<NotificationRouting eligibleRoles={eligibleRoles} not found"
  )

  // Suite 36-38: notification-routing.tsx
  const routingContent = fs.readFileSync(
    "/home/alisson/web/personal/vectorops/apps/web/components/admin/notification-routing.tsx",
    "utf8"
  )

  // 36: Accepts eligibleRoles prop and re-fetches on change
  assert(
    routingContent.includes("eligibleRoles: RoleKey[] | null"),
    "NotificationRouting accepts eligibleRoles prop typed as RoleKey[] | null",
    "eligibleRoles: RoleKey[] | null prop type not found in notification-routing.tsx"
  )

  assert(
    routingContent.includes("JSON.stringify(eligibleRoles)"),
    "NotificationRouting re-fetches when eligibleRoles changes (useEffect dependency)",
    "JSON.stringify(eligibleRoles) dep not found in useEffect"
  )

  // 37: Empty-state message when eligibleRoles is empty
  assert(
    routingContent.includes("Nenhum papel esta habilitado para receber notificacoes de criacao"),
    "NotificationRouting shows informational empty-state message when eligibleRoles is empty",
    "Empty-state message not found in notification-routing.tsx"
  )

  // 38: Fetches users per eligible role from /api/users?role=<role>&isActive=true
  assert(
    routingContent.includes("/api/users?role=") && routingContent.includes("isActive=true"),
    "NotificationRouting fetches /api/users?role=<role>&isActive=true per eligible role",
    "/api/users?role= or isActive=true not found in notification-routing.tsx"
  )
}

// ─── Suites 39-42: Notification logic — role gate in practice ────────────────

async function testNotificationLogicViaPatch(cookies) {
  console.log(
    "\n[Suite 39-42] Notification logic — role gate: creation + assignment notifications"
  )

  // Get the DEVELOPER user who corresponds to cookies.dev (Matheus)
  // by looking up their profile via /api/users/me with the dev cookie
  await sleep(300)
  const { body: devProfileBody } = await getJson("/api/users/me", cookies.dev)
  const developer = devProfileBody?.user ?? devProfileBody
  if (!developer?.id) {
    fail("Setup: get DEVELOPER user profile via /api/users/me", "No user profile returned for developer session")
    return
  }

  // Create a ticket so we can test TICKET_ASSIGNED
  // Note: POST /api/tickets is restricted to SUPPORT_MEMBER, SUPPORT_LEAD, QA roles
  await sleep(300)
  const { status: createStatus, body: ticketBody } = await postJson(
    "/api/tickets",
    {
      type: "TICKET",
      title: "QA Role Notification Test Ticket",
      description: "Automated test ticket for role notification config QA",
      severity: "LOW",
      deadline: makeDeadline(),
    },
    cookies.support
  )

  if (createStatus !== 201) {
    fail(
      "Setup: create test ticket for assignment notification test",
      `Expected 201 but got ${createStatus}: ${JSON.stringify(ticketBody)}`
    )
    return
  }

  // assign route uses ticket DB id (not publicId)
  const ticketDbId = ticketBody?.ticket?.id

  assert(
    createStatus === 201 && ticketDbId,
    "Setup: test ticket created successfully",
    `Ticket creation failed: ${JSON.stringify(ticketBody)}`
  )

  // ─── Suite 39: TICKET_CREATED skips roles with notifyOnCreation=false
  // Turn off DEVELOPER notifyOnCreation
  await sleep(300)
  await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "DEVELOPER", notifyOnCreation: false }] },
    cookies.techLead
  )

  // Count existing notifications for the developer user (call as developer — endpoint uses session)
  await sleep(200)
  const { body: beforeBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const notificationsBeforeCount = beforeBody?.notifications?.length ?? 0

  // Create another ticket with DEVELOPER notifyOnCreation=false (SUPPORT_MEMBER creates it)
  await sleep(300)
  await postJson(
    "/api/tickets",
    {
      type: "TICKET",
      title: "QA Test — Dev Should NOT Get Notification",
      description: "Ticket created while DEVELOPER notifyOnCreation=false",
      severity: "LOW",
      deadline: makeDeadline(),
    },
    cookies.support
  )

  await sleep(500)

  // Fetch notifications for developer again (same session)
  const { body: afterBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const notificationsAfterCount = afterBody?.notifications?.length ?? 0

  assert(
    notificationsAfterCount === notificationsBeforeCount,
    "TICKET_CREATED: DEVELOPER receives no creation notification when notifyOnCreation=false for DEVELOPER role",
    `Before: ${notificationsBeforeCount}, After: ${notificationsAfterCount} — notification was created when it should not have been`
  )

  // ─── Suite 40: BUG_CREATED skips DEVELOPER when notifyOnCreation=false
  // Note: POST /api/tickets (BUG type) is restricted to SUPPORT_MEMBER, SUPPORT_LEAD, QA
  await sleep(300)
  const { body: bugBeforeBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const bugNotifBeforeCount = bugBeforeBody?.notifications?.length ?? 0

  await postJson(
    "/api/tickets",
    {
      type: "BUG",
      title: "QA Test — Dev Should NOT Get Bug Notification",
      description: "Bug created while DEVELOPER notifyOnCreation=false",
      severity: "LOW",
      deadline: makeDeadline(),
      affectedModule: "QA test module",
      stepsToReproduce: "1. Create bug 2. Check notifications",
      expectedBehavior: "No notification for developer",
      actualBehavior: "No notification for developer",
      environment: "STAGING",
    },
    cookies.support
  )

  await sleep(500)

  const { body: bugAfterBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const bugNotifAfterCount = bugAfterBody?.notifications?.length ?? 0

  assert(
    bugNotifAfterCount === bugNotifBeforeCount,
    "BUG_CREATED: DEVELOPER receives no creation notification when notifyOnCreation=false for DEVELOPER role",
    `Before: ${bugNotifBeforeCount}, After: ${bugNotifAfterCount} — notification was created when it should not have been`
  )

  // ─── Suite 41: TICKET_ASSIGNED skips assignee when notifyOnAssignment=false for DEVELOPER
  // DEVELOPER has notifyOnAssignment=true by default — turn it off
  await sleep(300)
  await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "DEVELOPER", notifyOnAssignment: false }] },
    cookies.techLead
  )

  await sleep(200)
  const { body: assignBeforeBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const assignBeforeCount = assignBeforeBody?.notifications?.length ?? 0

  // Assign the ticket to the developer (route uses DB id)
  await sleep(300)
  await postJson(
    `/api/tickets/${ticketDbId}/assign`,
    { assignedToId: developer.id },
    cookies.techLead
  )

  await sleep(500)
  const { body: assignAfterBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const assignAfterCount = assignAfterBody?.notifications?.length ?? 0

  assert(
    assignAfterCount === assignBeforeCount,
    "TICKET_ASSIGNED: DEVELOPER receives no assignment notification when notifyOnAssignment=false for DEVELOPER role",
    `Before: ${assignBeforeCount}, After: ${assignAfterCount} — assignment notification created when it should not have been`
  )

  // ─── Suite 42: TICKET_ASSIGNED notifies assignee when notifyOnAssignment=true
  // Re-enable notifyOnAssignment for DEVELOPER
  await sleep(300)
  await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "DEVELOPER", notifyOnAssignment: true }] },
    cookies.techLead
  )

  // Create a fresh unassigned ticket for this test (SUPPORT_MEMBER can create tickets)
  await sleep(300)
  const { body: assignTicketBody } = await postJson(
    "/api/tickets",
    {
      type: "TICKET",
      title: "QA Test — Dev Should Get Assignment Notification",
      description: "Ticket created to test notifyOnAssignment=true",
      severity: "LOW",
      deadline: makeDeadline(),
    },
    cookies.support
  )
  // assign route uses DB id
  const assignTestTicketDbId = assignTicketBody?.ticket?.id

  await sleep(200)
  const { body: assign42BeforeBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const assign42BeforeCount = assign42BeforeBody?.notifications?.length ?? 0

  // Assign to developer (notifyOnAssignment=true now)
  await sleep(300)
  await postJson(
    `/api/tickets/${assignTestTicketDbId}/assign`,
    { assignedToId: developer.id },
    cookies.techLead
  )

  await sleep(2000)
  const { body: assign42AfterBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const assign42AfterCount = assign42AfterBody?.notifications?.length ?? 0

  assert(
    assign42AfterCount > assign42BeforeCount,
    "TICKET_ASSIGNED: DEVELOPER receives assignment notification when notifyOnAssignment=true for DEVELOPER role",
    `Before: ${assign42BeforeCount}, After: ${assign42AfterCount} — expected notification count to increase`
  )

  return { ticketDbId, developer }
}

// ─── Suites 43-44: Regression — other notification types are unaffected ──────

async function testNotificationRegressions(cookies) {
  console.log("\n[Suite 43-44] Regression: other notification types unaffected by role config")

  // Suite 43: TICKET_DONE / TICKET_CANCELLED still notify the ticket opener
  // The opener is techLead; get their user info
  await sleep(300)
  const { body: tlUser } = await getJson("/api/users/me", cookies.techLead)
  const techLeadId = tlUser?.user?.id ?? tlUser?.id

  if (!techLeadId) {
    fail(
      "Setup for regression test: get TECH_LEAD user id",
      `Could not get tech lead user from /api/users/me: ${JSON.stringify(tlUser)}`
    )
    return
  }

  // Create a fresh ticket to close (SUPPORT_MEMBER creates it; TECH_LEAD will close it)
  await sleep(300)
  const { body: closeTicketBody } = await postJson(
    "/api/tickets",
    {
      type: "TICKET",
      title: "QA Test — TICKET_DONE regression",
      description: "Ticket created to verify DONE notification reaches opener",
      severity: "LOW",
      deadline: makeDeadline(),
    },
    cookies.support
  )
  // ticket PATCH route uses DB id
  const closeId = closeTicketBody?.ticket?.id

  if (!closeId) {
    fail("Setup: create ticket for regression DONE test", `Ticket not created: ${JSON.stringify(closeTicketBody)}`)
    return
  }

  // Count notifications for the support user (ticket opener) before closing
  await sleep(300)
  const { body: regBeforeBody } = await getJson("/api/notifications?limit=50", cookies.support)
  const regBeforeCount = regBeforeBody?.notifications?.length ?? 0

  // State machine: OPEN → IN_PROGRESS → DONE (two steps required)
  await sleep(300)
  const { status: inProgressStatus } = await patchJson(
    `/api/tickets/${closeId}`,
    { status: "IN_PROGRESS" },
    cookies.techLead
  )

  await sleep(300)
  const { status: doneStatus } = await patchJson(
    `/api/tickets/${closeId}`,
    { status: "DONE" },
    cookies.techLead
  )

  await sleep(2000)
  // Ticket opener (support user) should receive a TICKET_DONE notification
  const { body: regAfterBody } = await getJson("/api/notifications?limit=50", cookies.support)
  const regAfterCount = regAfterBody?.notifications?.length ?? 0

  // TICKET_DONE sends to ticketOpenedById (opener) regardless of role config gates
  assert(
    inProgressStatus === 200 && doneStatus === 200,
    "Regression: PATCH /api/tickets/:id status transitions (IN_PROGRESS then DONE) both return 200",
    `IN_PROGRESS: ${inProgressStatus}, DONE: ${doneStatus}`
  )

  assert(
    regAfterCount > regBeforeCount,
    "Regression: TICKET_DONE creates notification for ticket opener (unaffected by role config gate)",
    `Opener notification count before: ${regBeforeCount}, after: ${regAfterCount} — TICKET_DONE notification not sent`
  )

  // Suite 44: HELP_REQUEST_NEW — verify static logic is unchanged
  const fs = await import("fs")
  const content = fs.readFileSync(
    "/home/alisson/web/personal/vectorops/apps/web/lib/notifications.ts",
    "utf8"
  )
  const helpBlock = content.slice(
    content.indexOf('case "HELP_REQUEST_NEW"'),
    content.indexOf('case "HELP_REQUEST_NEW"') + 400
  )

  assert(
    helpBlock.includes('"DEVELOPER"') && helpBlock.includes('"TECH_LEAD"'),
    "Regression: HELP_REQUEST_NEW still targets DEVELOPER and TECH_LEAD roles (no role config gate)",
    "DEVELOPER or TECH_LEAD not found in HELP_REQUEST_NEW block"
  )

  assert(
    !helpBlock.includes("getRoleConfigMap"),
    "Regression: HELP_REQUEST_NEW does NOT call getRoleConfigMap (unaffected by role config)",
    "getRoleConfigMap found in HELP_REQUEST_NEW block — unexpected regression"
  )
}

// ─── Suite 45: Regression — seed users notifyTickets default ─────────────────

async function testSeedUserDefaults(cookies) {
  console.log("\n[Suite 45] Regression: seed users have notifyTickets=true by default")

  const { body } = await getJson("/api/users?role=DEVELOPER&isActive=true", cookies.techLead)
  const developers = body?.users ?? []

  assert(
    developers.length > 0,
    "At least one active DEVELOPER user exists in the system",
    "No DEVELOPER users found via /api/users"
  )

  // Verify the first developer's notification prefs via /api/users/[id]/notifications (TECH_LEAD can call this)
  const dev = developers[0]
  await sleep(200)
  const { status: prefsStatus, body: prefsBody } = await getJson(
    `/api/users/${dev.id}/notifications`,
    cookies.techLead
  )

  assert(
    prefsStatus === 200 && prefsBody?.notifyTickets === true,
    "Seed DEVELOPER user has notifyTickets=true by default (via /api/users/[id]/notifications)",
    `HTTP ${prefsStatus}, notifyTickets=${prefsBody?.notifyTickets} for user ${dev.id}`
  )
}

// ─── Suites 46-47: Integration — disable DEVELOPER creation + create ticket ──

async function testDisableDevCreationIntegration(cookies) {
  console.log(
    "\n[Suite 46-47] Integration: creating ticket with DEVELOPER notifyOnCreation=false → no dev notifications"
  )

  // Get the DEVELOPER user profile for cookies.dev (Matheus) — ensures cookie and user match
  await sleep(300)
  const { body: devProfileBody2 } = await getJson("/api/users/me", cookies.dev)
  const developer = devProfileBody2?.user ?? devProfileBody2
  if (!developer?.id) {
    fail("Setup: find DEVELOPER user for integration test", "No user profile returned for developer session")
    return
  }

  // Disable DEVELOPER notifyOnCreation
  await sleep(300)
  await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "DEVELOPER", notifyOnCreation: false }] },
    cookies.techLead
  )

  await sleep(200)
  const { body: beforeBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const beforeCount = beforeBody?.notifications?.length ?? 0

  // Create a ticket (SUPPORT_MEMBER role creates tickets — TECH_LEAD cannot)
  await sleep(300)
  await postJson(
    "/api/tickets",
    {
      type: "TICKET",
      title: "Integration Test — DEVELOPER should NOT get notified",
      description: "Role gate disabled — DEVELOPER notifyOnCreation=false",
      severity: "LOW",
      deadline: makeDeadline(),
    },
    cookies.support
  )

  await sleep(600)
  const { body: afterBody } = await getJson("/api/notifications?limit=50", cookies.dev)
  const afterCount = afterBody?.notifications?.length ?? 0

  assert(
    afterCount === beforeCount,
    "Suite 46: DEVELOPER receives no TICKET_CREATED notification when their role gate is off",
    `Notification count changed from ${beforeCount} to ${afterCount} — gate did not suppress notification`
  )

  // Suite 47: Restore DEVELOPER notifyOnCreation
  await sleep(300)
  const { status: restoreStatus } = await patchJson(
    "/api/admin/role-notification-config",
    { configs: [{ role: "DEVELOPER", notifyOnCreation: true }] },
    cookies.techLead
  )
  assert(
    restoreStatus === 200,
    "Suite 47: Restore DEVELOPER notifyOnCreation=true — PATCH returns 200",
    `Expected 200 but got ${restoreStatus}`
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(70))
  console.log("  Role-Based Notification Configuration — Integration Tests")
  console.log("=".repeat(70))

  // Login all required roles (300ms gaps to avoid contention from bcrypt)
  console.log("\nLogging in test users...")
  const techLeadCookie = await login("alisson@vector.ops", "Password123!")
  await sleep(300)
  const devCookie = await login("matheus@vectorops.dev", "Password123!")
  await sleep(300)
  const supportCookie = await login("bruno@vectorops.dev", "Password123!")
  await sleep(300)
  const qaCookie = await login("nicoli@vectorops.dev", "Password123!")

  if (!techLeadCookie) {
    console.error("\nFATAL: Could not log in as TECH_LEAD. Is the dev server running?")
    process.exit(1)
  }

  const cookies = {
    techLead: techLeadCookie,
    dev: devCookie,
    support: supportCookie,
    qa: qaCookie,
  }

  console.log("  TECH_LEAD cookie:", techLeadCookie ? "obtained" : "MISSING")
  console.log("  DEVELOPER cookie:", devCookie ? "obtained" : "MISSING")
  console.log("  SUPPORT_MEMBER cookie:", supportCookie ? "obtained" : "MISSING")
  console.log("  QA cookie:", qaCookie ? "obtained" : "MISSING")

  // Run all suites
  await testSchemaPrisma()
  await testNotificationsStaticAnalysis()
  await testRouteStaticAnalysis()
  await testUnauthenticated()
  await testRoleGuards(cookies)
  await testTechLeadGet(cookies)
  await testTechLeadPatch(cookies)
  await testZodValidation(cookies)
  await restoreSeedDefaults(cookies)
  await testFrontendComponents()
  await testNotificationLogicViaPatch(cookies)
  await testNotificationRegressions(cookies)
  await testSeedUserDefaults(cookies)
  await testDisableDevCreationIntegration(cookies)

  // Final restore to ensure DB is clean
  await sleep(300)
  await patchJson(
    "/api/admin/role-notification-config",
    {
      configs: [
        { role: "TECH_LEAD", notifyOnCreation: true, notifyOnAssignment: true },
        { role: "DEVELOPER", notifyOnCreation: true, notifyOnAssignment: true },
        { role: "QA", notifyOnCreation: true, notifyOnAssignment: false },
        { role: "SUPPORT_LEAD", notifyOnCreation: false, notifyOnAssignment: false },
        { role: "SUPPORT_MEMBER", notifyOnCreation: false, notifyOnAssignment: false },
      ],
    },
    cookies.techLead
  )

  // Results
  console.log("\n" + "=".repeat(70))
  console.log(`  Results: ${passCount} passed, ${failCount} failed`)
  console.log("=".repeat(70))

  if (failures.length > 0) {
    console.log("\nFailed tests:")
    for (const f of failures) {
      console.log(`  - ${f.name}`)
      console.log(`    ${f.reason}`)
    }
  }

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Unexpected error:", err)
  process.exit(1)
})
