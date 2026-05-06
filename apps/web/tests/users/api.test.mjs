/**
 * Users — API Integration Tests
 *
 * Covers all user-related endpoints:
 *
 * Suite 1: GET /api/users                      (8 tests)
 * Suite 2: GET /api/users/me                   (2 tests)
 * Suite 3: PATCH /api/users/me                 (8 tests)
 * Suite 4: PATCH /api/users/me/password        (7 tests)
 * Suite 5: GET /api/users/[id]                 (4 tests)
 * Suite 6: PATCH /api/users/[id]               (7 tests)
 * Suite 7: GET/PATCH /api/users/[id]/notifications (8 tests)
 *
 * Usage:
 *   node apps/web/tests/users/api.test.mjs
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - Seed applied: npx prisma db seed (from apps/web/)
 */

import {
  createTestRunner,
  loginAs,
  login,
  getJson,
  postJson,
  patchJson,
  deleteJson,
  BASE_URL,
  PASSWORD,
  SEED_EMAILS,
  sleep,
} from "../_shared/test-harness.mjs"

// ─── Globals ─────────────────────────────────────────────────────────────────

const { assert, summary } = createTestRunner()

// Cookies stored after login — populated in main()
let techLeadCookie = null
let developerCookie = null
let supportMemberCookie = null

// User IDs retrieved via GET /api/users/me — populated in main()
let techLeadId = null
let developerId = null
let supportMemberId = null

// ─── Suite 1: GET /api/users ─────────────────────────────────────────────────

async function suite1GetUsers() {
  console.log("\n[Suite 1] GET /api/users — list and filter")

  // 1 — Authenticated request returns 200 with users array
  const { status: s1, body: b1 } = await getJson("/api/users", techLeadCookie)
  assert(
    s1 === 200,
    "Authenticated GET /api/users returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    Array.isArray(b1?.users),
    "Response body contains a users array",
    `Got ${JSON.stringify(b1)}`
  )

  // 2 — ?role=DEVELOPER returns only devs with devStatus/currentTask/assignedTickets
  const { status: s2, body: b2 } = await getJson("/api/users?role=DEVELOPER", techLeadCookie)
  assert(
    s2 === 200,
    "?role=DEVELOPER returns 200",
    `Expected 200, got ${s2}`
  )
  const devUsers = b2?.users ?? []
  const allAreDev = devUsers.every((u) => u.role === "DEVELOPER")
  assert(
    allAreDev && devUsers.length > 0,
    "?role=DEVELOPER returns only DEVELOPER users",
    `Got roles: ${devUsers.map((u) => u.role).join(", ")} (count: ${devUsers.length})`
  )
  const firstDev = devUsers[0]
  assert(
    "devStatus" in (firstDev ?? {}) &&
      "currentTask" in (firstDev ?? {}) &&
      "assignedTickets" in (firstDev ?? {}),
    "DEVELOPER entries include devStatus, currentTask and assignedTickets fields",
    `firstDev keys: ${Object.keys(firstDev ?? {}).join(", ")}`
  )

  // 3 — ?role=SUPPORT_MEMBER returns users without devStatus fields
  const { status: s3, body: b3 } = await getJson(
    "/api/users?role=SUPPORT_MEMBER",
    techLeadCookie
  )
  assert(s3 === 200, "?role=SUPPORT_MEMBER returns 200", `Expected 200, got ${s3}`)
  const supportUsers = b3?.users ?? []
  const noDevFields = supportUsers.every(
    (u) => !("devStatus" in u) && !("currentTask" in u) && !("assignedTickets" in u)
  )
  assert(
    noDevFields,
    "SUPPORT_MEMBER entries do not include devStatus/currentTask/assignedTickets",
    `Unexpected dev fields found in: ${JSON.stringify(supportUsers[0])}`
  )

  // 4 — ?isActive=true returns only active users
  const { status: s4, body: b4 } = await getJson("/api/users?isActive=true", techLeadCookie)
  assert(s4 === 200, "?isActive=true returns 200", `Expected 200, got ${s4}`)
  // Users returned via this endpoint don't expose isActive in the select, but a non-error 200 is the contract
  assert(
    Array.isArray(b4?.users),
    "?isActive=true returns users array",
    `Got ${JSON.stringify(b4)}`
  )

  // 5 — ?isActive=false returns results (may be empty but still 200)
  const { status: s5, body: b5 } = await getJson("/api/users?isActive=false", techLeadCookie)
  assert(
    s5 === 200,
    "?isActive=false returns 200 (may be empty array)",
    `Expected 200, got ${s5}`
  )
  assert(
    Array.isArray(b5?.users),
    "?isActive=false response contains a users array",
    `Got ${JSON.stringify(b5)}`
  )

  // 6 — ?role=INVALID_ROLE returns 400
  const { status: s6, body: b6 } = await getJson(
    "/api/users?role=INVALID_ROLE",
    techLeadCookie
  )
  assert(
    s6 === 400,
    "?role=INVALID_ROLE returns 400",
    `Expected 400, got ${s6}: ${JSON.stringify(b6)}`
  )

  // 7 — Unauthenticated request is rejected (401 or 307 redirect)
  const { status: s7 } = await getJson("/api/users", null, { redirect: "manual" })
  assert(
    s7 === 401 || s7 === 307,
    "Unauthenticated GET /api/users is rejected (401 or 307)",
    `Expected 401 or 307, got ${s7}`
  )
}

// ─── Suite 2: GET /api/users/me ──────────────────────────────────────────────

async function suite2GetMe() {
  console.log("\n[Suite 2] GET /api/users/me")

  // 1 — Authenticated returns 200 with expected fields
  const { status: s1, body: b1 } = await getJson("/api/users/me", techLeadCookie)
  assert(s1 === 200, "Authenticated GET /api/users/me returns 200", `Expected 200, got ${s1}`)
  const user = b1?.user
  const expectedFields = ["id", "name", "email", "role", "isActive", "notifyTickets", "notifyBugs", "soundEnabled"]
  const hasAllFields = expectedFields.every((f) => f in (user ?? {}))
  assert(
    hasAllFields,
    "GET /api/users/me response includes all expected fields",
    `Missing fields. Got keys: ${Object.keys(user ?? {}).join(", ")}`
  )

  // 2 — Unauthenticated returns 401 or 307
  const { status: s2 } = await getJson("/api/users/me", null, { redirect: "manual" })
  assert(
    s2 === 401 || s2 === 307,
    "Unauthenticated GET /api/users/me is rejected (401 or 307)",
    `Expected 401 or 307, got ${s2}`
  )
}

// ─── Suite 3: PATCH /api/users/me ────────────────────────────────────────────

async function suite3PatchMe() {
  console.log("\n[Suite 3] PATCH /api/users/me — profile update")

  // Capture original values so we can restore them at the end
  const { body: original } = await getJson("/api/users/me", developerCookie)
  const originalName = original?.user?.name
  const originalAlias = original?.user?.ninjaAlias

  // 1 — Update name only
  const { status: s1, body: b1 } = await patchJson(
    "/api/users/me",
    { name: "TestName" },
    developerCookie
  )
  assert(s1 === 200, "PATCH /api/users/me with name only returns 200", `Expected 200, got ${s1}`)
  assert(
    b1?.user?.name === "TestName",
    "Response reflects updated name",
    `Expected 'TestName', got '${b1?.user?.name}'`
  )

  // 2 — Update ninjaAlias only
  const { status: s2, body: b2 } = await patchJson(
    "/api/users/me",
    { ninjaAlias: "TestAlias" },
    developerCookie
  )
  assert(
    s2 === 200,
    "PATCH /api/users/me with ninjaAlias only returns 200",
    `Expected 200, got ${s2}`
  )
  assert(
    b2?.user?.ninjaAlias === "TestAlias",
    "Response reflects updated ninjaAlias",
    `Expected 'TestAlias', got '${b2?.user?.ninjaAlias}'`
  )

  // 3 — Update both name and ninjaAlias together
  const { status: s3, body: b3 } = await patchJson(
    "/api/users/me",
    { name: "BothUpdated", ninjaAlias: "BothAlias" },
    developerCookie
  )
  assert(
    s3 === 200,
    "PATCH /api/users/me with both name and ninjaAlias returns 200",
    `Expected 200, got ${s3}`
  )
  assert(
    b3?.user?.name === "BothUpdated" && b3?.user?.ninjaAlias === "BothAlias",
    "Response reflects both updated fields",
    `Got name='${b3?.user?.name}', ninjaAlias='${b3?.user?.ninjaAlias}'`
  )

  // 4 — Empty body {} returns 400 "No valid fields"
  const { status: s4, body: b4 } = await patchJson("/api/users/me", {}, developerCookie)
  assert(
    s4 === 400,
    "PATCH /api/users/me with empty body {} returns 400",
    `Expected 400, got ${s4}: ${JSON.stringify(b4)}`
  )
  assert(
    typeof b4?.error === "string" && b4.error.toLowerCase().includes("no valid fields"),
    "Error message mentions 'No valid fields'",
    `Got error: '${b4?.error}'`
  )

  // 5 — name="" (empty string) returns 400 (min 1 char constraint)
  const { status: s5, body: b5 } = await patchJson(
    "/api/users/me",
    { name: "" },
    developerCookie
  )
  assert(
    s5 === 400,
    "PATCH /api/users/me with name='' returns 400 (min 1 char)",
    `Expected 400, got ${s5}: ${JSON.stringify(b5)}`
  )

  // 6 — name exceeding 100 chars returns 400
  const longName = "A".repeat(101)
  const { status: s6, body: b6 } = await patchJson(
    "/api/users/me",
    { name: longName },
    developerCookie
  )
  assert(
    s6 === 400,
    "PATCH /api/users/me with name >100 chars returns 400",
    `Expected 400, got ${s6}: ${JSON.stringify(b6)}`
  )

  // 7 — Unauthenticated returns 401 or 307
  const { status: s7 } = await patchJson("/api/users/me", { name: "Ghost" }, null, {
    redirect: "manual",
  })
  assert(
    s7 === 401 || s7 === 307,
    "Unauthenticated PATCH /api/users/me is rejected (401 or 307)",
    `Expected 401 or 307, got ${s7}`
  )

  // 8 — Restore original name and alias
  await patchJson(
    "/api/users/me",
    { name: originalName, ninjaAlias: originalAlias },
    developerCookie
  )
  const { body: restored } = await getJson("/api/users/me", developerCookie)
  assert(
    restored?.user?.name === originalName,
    "Original name restored after suite",
    `Expected '${originalName}', got '${restored?.user?.name}'`
  )
}

// ─── Suite 4: PATCH /api/users/me/password ───────────────────────────────────

async function suite4PatchPassword() {
  console.log("\n[Suite 4] PATCH /api/users/me/password — password change")

  const SUPPORT_EMAIL = SEED_EMAILS.SUPPORT_MEMBER
  const TEMP_PASSWORD = "TempPass99!"

  // Log in fresh for this suite so we have an isolated cookie
  const { cookie: supportCookie } = await login(SUPPORT_EMAIL, PASSWORD)

  // 1 — Correct currentPassword + valid newPassword returns 200
  const { status: s1, body: b1 } = await patchJson(
    "/api/users/me/password",
    { currentPassword: PASSWORD, newPassword: TEMP_PASSWORD },
    supportCookie
  )
  assert(
    s1 === 200,
    "Correct currentPassword + valid newPassword returns 200",
    `Expected 200, got ${s1}: ${JSON.stringify(b1)}`
  )
  assert(
    b1?.message === "Password updated successfully",
    "Response contains success message",
    `Got: '${b1?.message}'`
  )

  // 2 — New password works — verify by logging in with it
  const { cookie: newCookie } = await login(SUPPORT_EMAIL, TEMP_PASSWORD)
  assert(
    newCookie !== null,
    "Login succeeds with new password after change",
    "Login returned no cookie with new password"
  )

  // 3 — Wrong currentPassword returns 400 with specific error
  const { status: s3, body: b3 } = await patchJson(
    "/api/users/me/password",
    { currentPassword: "WrongPassword1!", newPassword: "AnotherPass99!" },
    newCookie ?? supportCookie
  )
  assert(
    s3 === 400,
    "Wrong currentPassword returns 400",
    `Expected 400, got ${s3}: ${JSON.stringify(b3)}`
  )
  const currentPwdErrors = b3?.details?.currentPassword ?? []
  assert(
    currentPwdErrors.some((msg) => msg.toLowerCase().includes("incorrect current password")),
    "Error details mention 'Incorrect current password'",
    `Got details.currentPassword: ${JSON.stringify(currentPwdErrors)}`
  )

  // 4 — newPassword < 8 chars returns 400
  const { status: s4, body: b4 } = await patchJson(
    "/api/users/me/password",
    { currentPassword: TEMP_PASSWORD, newPassword: "short" },
    newCookie ?? supportCookie
  )
  assert(
    s4 === 400,
    "newPassword shorter than 8 chars returns 400",
    `Expected 400, got ${s4}: ${JSON.stringify(b4)}`
  )

  // 5 — Missing currentPassword returns 400
  const { status: s5, body: b5 } = await patchJson(
    "/api/users/me/password",
    { newPassword: "ValidPass99!" },
    newCookie ?? supportCookie
  )
  assert(
    s5 === 400,
    "Missing currentPassword returns 400",
    `Expected 400, got ${s5}: ${JSON.stringify(b5)}`
  )

  // 6 — Unauthenticated returns 401 or 307
  const { status: s6 } = await patchJson(
    "/api/users/me/password",
    { currentPassword: PASSWORD, newPassword: "ValidPass99!" },
    null,
    { redirect: "manual" }
  )
  assert(
    s6 === 401 || s6 === 307,
    "Unauthenticated PATCH /api/users/me/password is rejected (401 or 307)",
    `Expected 401 or 307, got ${s6}`
  )

  // 7 — Restore original password
  const activeCookie = newCookie ?? supportCookie
  const { status: restoreStatus } = await patchJson(
    "/api/users/me/password",
    { currentPassword: TEMP_PASSWORD, newPassword: PASSWORD },
    activeCookie
  )
  assert(
    restoreStatus === 200,
    "Original password restored after suite",
    `Expected 200, got ${restoreStatus}`
  )
}

// ─── Suite 5: GET /api/users/[id] ────────────────────────────────────────────

async function suite5GetUserById() {
  console.log("\n[Suite 5] GET /api/users/[id] — fetch by ID")

  // 1 — DEVELOPER self-fetch returns 200
  const { status: s1, body: b1 } = await getJson(`/api/users/${developerId}`, developerCookie)
  assert(
    s1 === 200,
    "DEVELOPER self-fetch GET /api/users/[id] returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    b1?.user?.id === developerId,
    "Self-fetch returns correct user id",
    `Expected '${developerId}', got '${b1?.user?.id}'`
  )

  // 2 — TECH_LEAD can fetch any user
  const { status: s2, body: b2 } = await getJson(`/api/users/${developerId}`, techLeadCookie)
  assert(
    s2 === 200,
    "TECH_LEAD can GET /api/users/[developerId]",
    `Expected 200, got ${s2}`
  )
  assert(
    b2?.user?.id === developerId,
    "TECH_LEAD fetch returns correct user id",
    `Expected '${developerId}', got '${b2?.user?.id}'`
  )

  // 3 — DEVELOPER fetching another user returns 403
  const { status: s3, body: b3 } = await getJson(
    `/api/users/${supportMemberId}`,
    developerCookie
  )
  assert(
    s3 === 403,
    "DEVELOPER fetching another user returns 403",
    `Expected 403, got ${s3}: ${JSON.stringify(b3)}`
  )

  // 4 — Nonexistent ID returns 404
  const { status: s4, body: b4 } = await getJson(
    "/api/users/nonexistent-id-000",
    techLeadCookie
  )
  assert(
    s4 === 404,
    "GET /api/users/[nonexistent-id] returns 404",
    `Expected 404, got ${s4}: ${JSON.stringify(b4)}`
  )
}

// ─── Suite 6: PATCH /api/users/[id] ──────────────────────────────────────────

async function suite6PatchUserById() {
  console.log("\n[Suite 6] PATCH /api/users/[id] — profile update by ID")

  // Capture original developer name to restore later
  const { body: devOriginal } = await getJson(`/api/users/${developerId}`, techLeadCookie)
  const originalDevName = devOriginal?.user?.name
  const originalDevAlias = devOriginal?.user?.ninjaAlias

  // 1 — DEVELOPER self-update name returns 200
  const { status: s1, body: b1 } = await patchJson(
    `/api/users/${developerId}`,
    { name: "SelfUpdateName" },
    developerCookie
  )
  assert(
    s1 === 200,
    "DEVELOPER self-update PATCH /api/users/[id] returns 200",
    `Expected 200, got ${s1}: ${JSON.stringify(b1)}`
  )
  assert(
    b1?.user?.name === "SelfUpdateName",
    "Self-update response reflects new name",
    `Expected 'SelfUpdateName', got '${b1?.user?.name}'`
  )

  // 2 — TECH_LEAD updates another user returns 200
  const { status: s2, body: b2 } = await patchJson(
    `/api/users/${developerId}`,
    { name: "TechLeadUpdated" },
    techLeadCookie
  )
  assert(
    s2 === 200,
    "TECH_LEAD PATCH /api/users/[developerId] returns 200",
    `Expected 200, got ${s2}: ${JSON.stringify(b2)}`
  )
  assert(
    b2?.user?.name === "TechLeadUpdated",
    "TECH_LEAD update response reflects new name",
    `Expected 'TechLeadUpdated', got '${b2?.user?.name}'`
  )

  // 3 — DEVELOPER updating another user returns 403
  const { status: s3, body: b3 } = await patchJson(
    `/api/users/${supportMemberId}`,
    { name: "Unauthorized" },
    developerCookie
  )
  assert(
    s3 === 403,
    "DEVELOPER updating another user returns 403",
    `Expected 403, got ${s3}: ${JSON.stringify(b3)}`
  )

  // 4 — TECH_LEAD sets newPassword on another user returns 200
  const { status: s4, body: b4 } = await patchJson(
    `/api/users/${developerId}`,
    { newPassword: "AdminReset99!" },
    techLeadCookie
  )
  assert(
    s4 === 200,
    "TECH_LEAD sets newPassword on another user — returns 200",
    `Expected 200, got ${s4}: ${JSON.stringify(b4)}`
  )

  // Verify new password works and restore the original password
  const { cookie: devNewCookie } = await login(SEED_EMAILS.DEVELOPER, "AdminReset99!")
  assert(
    devNewCookie !== null,
    "DEVELOPER can log in with the admin-reset password",
    "Login returned no cookie with admin-reset password"
  )

  // Restore developer original password via the new cookie
  if (devNewCookie) {
    await patchJson(
      "/api/users/me/password",
      { currentPassword: "AdminReset99!", newPassword: PASSWORD },
      devNewCookie
    )
  }

  // 5 — Empty body returns 400 "No fields to update"
  const { status: s5, body: b5 } = await patchJson(
    `/api/users/${developerId}`,
    {},
    techLeadCookie
  )
  assert(
    s5 === 400,
    "PATCH /api/users/[id] with empty body returns 400",
    `Expected 400, got ${s5}: ${JSON.stringify(b5)}`
  )
  assert(
    typeof b5?.error === "string" && b5.error.toLowerCase().includes("no fields to update"),
    "Error message mentions 'No fields to update'",
    `Got error: '${b5?.error}'`
  )

  // 6 — Nonexistent ID returns 404
  const { status: s6, body: b6 } = await patchJson(
    "/api/users/nonexistent-id-000",
    { name: "Ghost" },
    techLeadCookie
  )
  assert(
    s6 === 404,
    "PATCH /api/users/[nonexistent-id] returns 404",
    `Expected 404, got ${s6}: ${JSON.stringify(b6)}`
  )

  // 7 — Restore original name and alias for developer
  const { status: restoreStatus } = await patchJson(
    `/api/users/${developerId}`,
    { name: originalDevName, ninjaAlias: originalDevAlias },
    techLeadCookie
  )
  assert(
    restoreStatus === 200,
    "Developer original name/alias restored after suite",
    `Expected 200, got ${restoreStatus}`
  )
}

// ─── Suite 7: GET/PATCH /api/users/[id]/notifications ────────────────────────

async function suite7Notifications() {
  console.log("\n[Suite 7] GET/PATCH /api/users/[id]/notifications")

  // Capture original notification prefs for the developer to restore later
  const { body: original } = await getJson(
    `/api/users/${developerId}/notifications`,
    techLeadCookie
  )
  const originalNotifyTickets = original?.notifyTickets
  const originalNotifyBugs = original?.notifyBugs

  // 1 — GET as TECH_LEAD returns 200 with notifyTickets and notifyBugs
  const { status: s1, body: b1 } = await getJson(
    `/api/users/${developerId}/notifications`,
    techLeadCookie
  )
  assert(
    s1 === 200,
    "TECH_LEAD GET /api/users/[id]/notifications returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    typeof b1?.notifyTickets === "boolean" && typeof b1?.notifyBugs === "boolean",
    "Notification GET response includes boolean notifyTickets and notifyBugs",
    `Got: ${JSON.stringify(b1)}`
  )

  // 2 — GET as DEVELOPER returns 403 (TECH_LEAD only)
  const { status: s2, body: b2 } = await getJson(
    `/api/users/${developerId}/notifications`,
    developerCookie
  )
  assert(
    s2 === 403,
    "DEVELOPER GET /api/users/[id]/notifications returns 403",
    `Expected 403, got ${s2}: ${JSON.stringify(b2)}`
  )

  // 3 — GET with nonexistent ID returns 404
  const { status: s3, body: b3 } = await getJson(
    "/api/users/nonexistent-id-000/notifications",
    techLeadCookie
  )
  assert(
    s3 === 404,
    "GET /api/users/[nonexistent-id]/notifications returns 404",
    `Expected 404, got ${s3}: ${JSON.stringify(b3)}`
  )

  // 4 — PATCH notifyTickets: false as TECH_LEAD returns 200
  const { status: s4, body: b4 } = await patchJson(
    `/api/users/${developerId}/notifications`,
    { notifyTickets: false },
    techLeadCookie
  )
  assert(
    s4 === 200,
    "TECH_LEAD PATCH notifyTickets:false returns 200",
    `Expected 200, got ${s4}: ${JSON.stringify(b4)}`
  )
  assert(
    b4?.notifyTickets === false,
    "PATCH response reflects notifyTickets=false",
    `Got notifyTickets: ${b4?.notifyTickets}`
  )

  // 5 — Verify GET reflects the change made in previous step
  const { status: s5, body: b5 } = await getJson(
    `/api/users/${developerId}/notifications`,
    techLeadCookie
  )
  assert(
    s5 === 200 && b5?.notifyTickets === false,
    "GET reflects the updated notifyTickets=false value",
    `Expected notifyTickets=false, got ${b5?.notifyTickets}`
  )

  // 6 — PATCH with empty body returns 400 with specific error
  const { status: s6, body: b6 } = await patchJson(
    `/api/users/${developerId}/notifications`,
    {},
    techLeadCookie
  )
  assert(
    s6 === 400,
    "PATCH /api/users/[id]/notifications with empty body returns 400",
    `Expected 400, got ${s6}: ${JSON.stringify(b6)}`
  )
  assert(
    typeof b6?.error === "string" &&
      b6.error.toLowerCase().includes("at least one of notifytickets or notifybugs"),
    "Error message mentions 'At least one of notifyTickets or notifyBugs'",
    `Got error: '${b6?.error}'`
  )

  // 7 — PATCH with non-boolean notifyTickets: "yes" returns 400
  const { status: s7, body: b7 } = await patchJson(
    `/api/users/${developerId}/notifications`,
    { notifyTickets: "yes" },
    techLeadCookie
  )
  assert(
    s7 === 400,
    "PATCH notifyTickets:'yes' (non-boolean) returns 400",
    `Expected 400, got ${s7}: ${JSON.stringify(b7)}`
  )

  // 8 — Restore original notification preferences
  const { status: restoreStatus } = await patchJson(
    `/api/users/${developerId}/notifications`,
    { notifyTickets: originalNotifyTickets, notifyBugs: originalNotifyBugs },
    techLeadCookie
  )
  assert(
    restoreStatus === 200,
    "Original notification prefs restored after suite",
    `Expected 200, got ${restoreStatus}`
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Users API Integration Tests ===")

  // Login all needed roles up front
  console.log("\nLogging in test users...")

  const techLeadResult = await loginAs("TECH_LEAD")
  techLeadCookie = techLeadResult.cookie
  if (!techLeadCookie) {
    console.error("FATAL: Could not log in as TECH_LEAD — aborting")
    process.exit(1)
  }

  const developerResult = await loginAs("DEVELOPER")
  developerCookie = developerResult.cookie
  if (!developerCookie) {
    console.error("FATAL: Could not log in as DEVELOPER — aborting")
    process.exit(1)
  }

  const supportMemberResult = await loginAs("SUPPORT_MEMBER")
  supportMemberCookie = supportMemberResult.cookie
  if (!supportMemberCookie) {
    console.error("FATAL: Could not log in as SUPPORT_MEMBER — aborting")
    process.exit(1)
  }

  // Resolve user IDs via GET /api/users/me
  const { body: techLeadMe } = await getJson("/api/users/me", techLeadCookie)
  techLeadId = techLeadMe?.user?.id
  if (!techLeadId) {
    console.error("FATAL: Could not resolve TECH_LEAD user id — aborting")
    process.exit(1)
  }

  const { body: developerMe } = await getJson("/api/users/me", developerCookie)
  developerId = developerMe?.user?.id
  if (!developerId) {
    console.error("FATAL: Could not resolve DEVELOPER user id — aborting")
    process.exit(1)
  }

  const { body: supportMemberMe } = await getJson("/api/users/me", supportMemberCookie)
  supportMemberId = supportMemberMe?.user?.id
  if (!supportMemberId) {
    console.error("FATAL: Could not resolve SUPPORT_MEMBER user id — aborting")
    process.exit(1)
  }

  console.log(`  TECH_LEAD id    : ${techLeadId}`)
  console.log(`  DEVELOPER id    : ${developerId}`)
  console.log(`  SUPPORT_MEMBER id: ${supportMemberId}`)

  // Run all suites sequentially
  await suite1GetUsers()
  await suite2GetMe()
  await suite3PatchMe()
  await suite4PatchPassword()
  await suite5GetUserById()
  await suite6PatchUserById()
  await suite7Notifications()

  // Print final summary
  const { failCount } = summary()
  if (failCount > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Unexpected test runner error:", err)
  process.exit(1)
})
