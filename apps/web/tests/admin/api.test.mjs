/**
 * Admin — API Integration Tests
 *
 * Covers admin, organization, super-admin, and miscellaneous endpoints:
 *
 * Suite 1:  GET    /api/admin/users                    (6 tests)
 * Suite 2:  PATCH  /api/admin/users/[id]               (8 tests)
 * Suite 3:  POST   /api/admin/users/[id]/avatar        (5 tests)
 * Suite 4:  GET    /api/admin/stats                    (4 tests)
 * Suite 5:  GET    /api/admin/tv-config                (3 tests)
 *           PATCH  /api/admin/tv-config                (6 tests)
 * Suite 6:  GET    /api/admin/checkpoints/config       (2 tests)
 *           PATCH  /api/admin/checkpoints/config       (7 tests)
 * Suite 7:  GET    /api/admin/checkpoints/history      (4 tests)
 * Suite 8:  GET    /api/organizations/current          (2 tests)
 *           PATCH  /api/organizations/current          (4 tests)
 * Suite 9:  GET    /api/super-admin/users              (5 tests)
 * Suite 10: Misc   /api/health, /api/auth/logout, /api/auth/me (3 tests)
 *
 * Usage:
 *   node apps/web/tests/admin/api.test.mjs
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
  postFormData,
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
let qaCookie = null

// User IDs resolved via GET /api/users/me — populated in main()
let techLeadId = null
let developerId = null
let supportMemberId = null

// Minimal 1x1 transparent PNG for avatar upload tests
const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
)

// ─── Suite 1: GET /api/admin/users ───────────────────────────────────────────

async function suite1GetAdminUsers() {
  console.log("\n[Suite 1] GET /api/admin/users — list and filter")

  // 1 — TECH_LEAD sees 200 with users array
  const { status: s1, body: b1 } = await getJson("/api/admin/users", techLeadCookie)
  assert(
    s1 === 200,
    "TECH_LEAD GET /api/admin/users returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    Array.isArray(b1?.users),
    "Response body contains a users array",
    `Got ${JSON.stringify(b1)}`
  )

  // 2 — ?role=DEVELOPER filters by role
  const { status: s2, body: b2 } = await getJson(
    "/api/admin/users?role=DEVELOPER",
    techLeadCookie
  )
  assert(
    s2 === 200,
    "?role=DEVELOPER returns 200",
    `Expected 200, got ${s2}`
  )
  const devUsers = b2?.users ?? []
  const allAreDev = devUsers.length > 0 && devUsers.every((u) => u.role === "DEVELOPER")
  assert(
    allAreDev,
    "?role=DEVELOPER returns only DEVELOPER users",
    `Got roles: ${devUsers.map((u) => u.role).join(", ")} (count: ${devUsers.length})`
  )

  // 3 — ?isActive=true filters by active users
  const { status: s3, body: b3 } = await getJson(
    "/api/admin/users?isActive=true",
    techLeadCookie
  )
  assert(
    s3 === 200,
    "?isActive=true returns 200",
    `Expected 200, got ${s3}`
  )
  assert(
    Array.isArray(b3?.users),
    "?isActive=true response contains a users array",
    `Got ${JSON.stringify(b3)}`
  )

  // 4 — ?search=matheus searches by name/email
  const { status: s4, body: b4 } = await getJson(
    "/api/admin/users?search=matheus",
    techLeadCookie
  )
  assert(
    s4 === 200,
    "?search=matheus returns 200",
    `Expected 200, got ${s4}`
  )
  const searchUsers = b4?.users ?? []
  const matchesMatheus = searchUsers.some(
    (u) =>
      u.name?.toLowerCase().includes("matheus") ||
      u.email?.toLowerCase().includes("matheus")
  )
  assert(
    matchesMatheus,
    "?search=matheus results contain a user matching 'matheus'",
    `Got users: ${JSON.stringify(searchUsers.map((u) => ({ name: u.name, email: u.email })))}`
  )

  // 5 — DEVELOPER is forbidden (403)
  const { status: s5, body: b5 } = await getJson("/api/admin/users", developerCookie)
  assert(
    s5 === 403,
    "DEVELOPER GET /api/admin/users returns 403",
    `Expected 403, got ${s5}: ${JSON.stringify(b5)}`
  )

  // 6 — SUPPORT_MEMBER is forbidden (403)
  const { status: s6, body: b6 } = await getJson("/api/admin/users", supportMemberCookie)
  assert(
    s6 === 403,
    "SUPPORT_MEMBER GET /api/admin/users returns 403",
    `Expected 403, got ${s6}: ${JSON.stringify(b6)}`
  )
}

// ─── Suite 2: PATCH /api/admin/users/[id] ────────────────────────────────────

async function suite2PatchAdminUser() {
  console.log("\n[Suite 2] PATCH /api/admin/users/[id] — admin role/active update")

  // Capture original developer role and active status to restore at end
  const { body: devOriginal } = await getJson("/api/admin/users", techLeadCookie)
  const devRecord = (devOriginal?.users ?? []).find((u) => u.id === developerId)
  const originalRole = devRecord?.role ?? "DEVELOPER"
  const originalIsActive = devRecord?.isActive ?? true

  // 1 — TECH_LEAD changes another user's role to SUPPORT_LEAD → 200
  const { status: s1, body: b1 } = await patchJson(
    `/api/admin/users/${developerId}`,
    { role: "SUPPORT_LEAD" },
    techLeadCookie
  )
  assert(
    s1 === 200,
    "TECH_LEAD PATCH role to SUPPORT_LEAD returns 200",
    `Expected 200, got ${s1}: ${JSON.stringify(b1)}`
  )
  assert(
    b1?.user?.role === "SUPPORT_LEAD",
    "Response reflects updated role = SUPPORT_LEAD",
    `Got role: '${b1?.user?.role}'`
  )

  // Restore role back to DEVELOPER before continuing
  await patchJson(`/api/admin/users/${developerId}`, { role: "DEVELOPER" }, techLeadCookie)

  // 2 — TECH_LEAD deactivates a user (isActive: false) → 200
  const { status: s2, body: b2 } = await patchJson(
    `/api/admin/users/${developerId}`,
    { isActive: false },
    techLeadCookie
  )
  assert(
    s2 === 200,
    "TECH_LEAD deactivates user (isActive: false) returns 200",
    `Expected 200, got ${s2}: ${JSON.stringify(b2)}`
  )
  assert(
    b2?.user?.isActive === false,
    "Response reflects isActive = false",
    `Got isActive: ${b2?.user?.isActive}`
  )

  // Reactivate immediately so subsequent tests can use the developer cookie
  await patchJson(`/api/admin/users/${developerId}`, { isActive: true }, techLeadCookie)

  // 3 — TECH_LEAD deactivates self → 422 "cannot deactivate your own account"
  const { status: s3, body: b3 } = await patchJson(
    `/api/admin/users/${techLeadId}`,
    { isActive: false },
    techLeadCookie
  )
  assert(
    s3 === 422,
    "TECH_LEAD deactivating self returns 422",
    `Expected 422, got ${s3}: ${JSON.stringify(b3)}`
  )
  assert(
    typeof b3?.error === "string" &&
      b3.error.toLowerCase().includes("cannot deactivate your own account"),
    "Error message mentions 'cannot deactivate your own account'",
    `Got error: '${b3?.error}'`
  )

  // 4 — Empty body → 400 "No fields to update"
  const { status: s4, body: b4 } = await patchJson(
    `/api/admin/users/${developerId}`,
    {},
    techLeadCookie
  )
  assert(
    s4 === 400,
    "Empty body returns 400",
    `Expected 400, got ${s4}: ${JSON.stringify(b4)}`
  )
  assert(
    typeof b4?.error === "string" && b4.error.toLowerCase().includes("no fields to update"),
    "Error message mentions 'No fields to update'",
    `Got error: '${b4?.error}'`
  )

  // 5 — Invalid role value → 400 (QA is not in the admin patch enum)
  const { status: s5, body: b5 } = await patchJson(
    `/api/admin/users/${developerId}`,
    { role: "QA" },
    techLeadCookie
  )
  assert(
    s5 === 400,
    "Invalid role value 'QA' returns 400",
    `Expected 400, got ${s5}: ${JSON.stringify(b5)}`
  )

  // 6 — Nonexistent user ID → 404
  const { status: s6, body: b6 } = await patchJson(
    "/api/admin/users/nonexistent-user-000",
    { role: "DEVELOPER" },
    techLeadCookie
  )
  assert(
    s6 === 404,
    "Nonexistent user ID returns 404",
    `Expected 404, got ${s6}: ${JSON.stringify(b6)}`
  )

  // 7 — DEVELOPER patching → 403
  const { status: s7, body: b7 } = await patchJson(
    `/api/admin/users/${supportMemberId}`,
    { role: "DEVELOPER" },
    developerCookie
  )
  assert(
    s7 === 403,
    "DEVELOPER PATCH /api/admin/users/[id] returns 403",
    `Expected 403, got ${s7}: ${JSON.stringify(b7)}`
  )

  // 8 — Restore original role and active status
  const { status: restoreStatus } = await patchJson(
    `/api/admin/users/${developerId}`,
    { role: originalRole, isActive: originalIsActive },
    techLeadCookie
  )
  assert(
    restoreStatus === 200,
    "Developer original role and isActive restored after suite",
    `Expected 200, got ${restoreStatus}`
  )
}

// ─── Suite 3: POST /api/admin/users/[id]/avatar ──────────────────────────────

async function suite3UploadAvatar() {
  console.log("\n[Suite 3] POST /api/admin/users/[id]/avatar — avatar upload")

  // 1 — TECH_LEAD uploads valid PNG → 200 with avatarUrl
  const pngForm = new FormData()
  pngForm.append("avatar", new Blob([PNG_1x1], { type: "image/png" }), "avatar.png")
  const { status: s1, body: b1 } = await postFormData(
    `/api/admin/users/${developerId}/avatar`,
    pngForm,
    techLeadCookie
  )
  assert(
    s1 === 200,
    "TECH_LEAD uploads valid PNG avatar → 200",
    `Expected 200, got ${s1}: ${JSON.stringify(b1)}`
  )
  assert(
    typeof b1?.avatarUrl === "string" && b1.avatarUrl.startsWith("/avatars/"),
    "Response includes avatarUrl starting with '/avatars/'",
    `Got avatarUrl: '${b1?.avatarUrl}'`
  )

  // 2 — No file in form data → 400
  const emptyForm = new FormData()
  const { status: s2, body: b2 } = await postFormData(
    `/api/admin/users/${developerId}/avatar`,
    emptyForm,
    techLeadCookie
  )
  assert(
    s2 === 400,
    "No file in form data returns 400",
    `Expected 400, got ${s2}: ${JSON.stringify(b2)}`
  )
  assert(
    typeof b2?.error === "string" &&
      b2.error.toLowerCase().includes("avatar field is required"),
    "Error message mentions 'avatar field is required'",
    `Got error: '${b2?.error}'`
  )

  // 3 — Invalid file type (text file) → 400
  const textForm = new FormData()
  textForm.append(
    "avatar",
    new Blob(["hello world"], { type: "text/plain" }),
    "avatar.txt"
  )
  const { status: s3, body: b3 } = await postFormData(
    `/api/admin/users/${developerId}/avatar`,
    textForm,
    techLeadCookie
  )
  assert(
    s3 === 400,
    "Invalid file type (text/plain) returns 400",
    `Expected 400, got ${s3}: ${JSON.stringify(b3)}`
  )
  assert(
    typeof b3?.error === "string" &&
      b3.error.toLowerCase().includes("only png, jpeg, and webp"),
    "Error message mentions accepted image types",
    `Got error: '${b3?.error}'`
  )

  // 4 — Nonexistent user ID → 404
  const pngForm2 = new FormData()
  pngForm2.append("avatar", new Blob([PNG_1x1], { type: "image/png" }), "avatar.png")
  const { status: s4, body: b4 } = await postFormData(
    "/api/admin/users/nonexistent-user-000/avatar",
    pngForm2,
    techLeadCookie
  )
  assert(
    s4 === 404,
    "Nonexistent user ID returns 404",
    `Expected 404, got ${s4}: ${JSON.stringify(b4)}`
  )

  // 5 — DEVELOPER uploading → 403
  const pngForm3 = new FormData()
  pngForm3.append("avatar", new Blob([PNG_1x1], { type: "image/png" }), "avatar.png")
  const { status: s5, body: b5 } = await postFormData(
    `/api/admin/users/${developerId}/avatar`,
    pngForm3,
    developerCookie
  )
  assert(
    s5 === 403,
    "DEVELOPER POST /api/admin/users/[id]/avatar returns 403",
    `Expected 403, got ${s5}: ${JSON.stringify(b5)}`
  )
}

// ─── Suite 4: GET /api/admin/stats ───────────────────────────────────────────

async function suite4GetAdminStats() {
  console.log("\n[Suite 4] GET /api/admin/stats — dashboard statistics")

  // 1 — TECH_LEAD → 200 with expected stats shape
  const { status: s1, body: b1 } = await getJson("/api/admin/stats", techLeadCookie)
  assert(
    s1 === 200,
    "TECH_LEAD GET /api/admin/stats returns 200",
    `Expected 200, got ${s1}`
  )
  const hasExpectedFields =
    Array.isArray(b1?.ticketsByStatus) &&
    Array.isArray(b1?.ticketsBySeverity) &&
    typeof b1?.assignedCount === "number" &&
    typeof b1?.unassignedCount === "number" &&
    Array.isArray(b1?.developerWorkload)
  assert(
    hasExpectedFields,
    "Stats response includes ticketsByStatus, ticketsBySeverity, assignedCount, unassignedCount, developerWorkload",
    `Got keys: ${Object.keys(b1 ?? {}).join(", ")}`
  )

  // 2 — QA → 200 (QA is allowed on this route)
  const { status: s2 } = await getJson("/api/admin/stats", qaCookie)
  assert(
    s2 === 200,
    "QA GET /api/admin/stats returns 200",
    `Expected 200, got ${s2}`
  )

  // 3 — DEVELOPER → 403
  const { status: s3, body: b3 } = await getJson("/api/admin/stats", developerCookie)
  assert(
    s3 === 403,
    "DEVELOPER GET /api/admin/stats returns 403",
    `Expected 403, got ${s3}: ${JSON.stringify(b3)}`
  )

  // 4 — SUPPORT_MEMBER → 403
  const { status: s4, body: b4 } = await getJson("/api/admin/stats", supportMemberCookie)
  assert(
    s4 === 403,
    "SUPPORT_MEMBER GET /api/admin/stats returns 403",
    `Expected 403, got ${s4}: ${JSON.stringify(b4)}`
  )
}

// ─── Suite 5: GET/PATCH /api/admin/tv-config ─────────────────────────────────

async function suite5TvConfig() {
  console.log("\n[Suite 5] GET/PATCH /api/admin/tv-config — TV display configuration")

  // Capture original values before any mutations
  const { body: originalBody } = await getJson("/api/admin/tv-config", techLeadCookie)
  const originalRefreshInterval = originalBody?.config?.refreshInterval
  const originalIsEnabled = originalBody?.config?.isEnabled

  // 1 — GET as TECH_LEAD → 200 with config object
  const { status: s1, body: b1 } = await getJson("/api/admin/tv-config", techLeadCookie)
  assert(
    s1 === 200,
    "TECH_LEAD GET /api/admin/tv-config returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    b1?.config !== null && typeof b1?.config === "object",
    "Response includes a config object",
    `Got ${JSON.stringify(b1)}`
  )

  // 2 — GET as QA → 200 (QA is allowed)
  const { status: s2 } = await getJson("/api/admin/tv-config", qaCookie)
  assert(
    s2 === 200,
    "QA GET /api/admin/tv-config returns 200",
    `Expected 200, got ${s2}`
  )

  // 3 — GET as DEVELOPER → 403
  const { status: s3, body: b3 } = await getJson("/api/admin/tv-config", developerCookie)
  assert(
    s3 === 403,
    "DEVELOPER GET /api/admin/tv-config returns 403",
    `Expected 403, got ${s3}: ${JSON.stringify(b3)}`
  )

  // 4 — PATCH refreshInterval:60 → 200
  const { status: s4, body: b4 } = await patchJson(
    "/api/admin/tv-config",
    { refreshInterval: 60 },
    techLeadCookie
  )
  assert(
    s4 === 200,
    "PATCH refreshInterval:60 returns 200",
    `Expected 200, got ${s4}: ${JSON.stringify(b4)}`
  )
  assert(
    b4?.config?.refreshInterval === 60,
    "Response reflects updated refreshInterval = 60",
    `Got refreshInterval: ${b4?.config?.refreshInterval}`
  )

  // 5 — PATCH isEnabled:false → 200
  const { status: s5, body: b5 } = await patchJson(
    "/api/admin/tv-config",
    { isEnabled: false },
    techLeadCookie
  )
  assert(
    s5 === 200,
    "PATCH isEnabled:false returns 200",
    `Expected 200, got ${s5}: ${JSON.stringify(b5)}`
  )
  assert(
    b5?.config?.isEnabled === false,
    "Response reflects isEnabled = false",
    `Got isEnabled: ${b5?.config?.isEnabled}`
  )

  // 6 — PATCH refreshInterval:5 (below min of 10) → 400
  const { status: s6, body: b6 } = await patchJson(
    "/api/admin/tv-config",
    { refreshInterval: 5 },
    techLeadCookie
  )
  assert(
    s6 === 400,
    "PATCH refreshInterval:5 (below min 10) returns 400",
    `Expected 400, got ${s6}: ${JSON.stringify(b6)}`
  )

  // 7 — PATCH refreshInterval:500 (above max of 300) → 400
  const { status: s7, body: b7 } = await patchJson(
    "/api/admin/tv-config",
    { refreshInterval: 500 },
    techLeadCookie
  )
  assert(
    s7 === 400,
    "PATCH refreshInterval:500 (above max 300) returns 400",
    `Expected 400, got ${s7}: ${JSON.stringify(b7)}`
  )

  // 8 — PATCH empty body → 400 "No fields to update"
  const { status: s8, body: b8 } = await patchJson(
    "/api/admin/tv-config",
    {},
    techLeadCookie
  )
  assert(
    s8 === 400,
    "PATCH empty body returns 400",
    `Expected 400, got ${s8}: ${JSON.stringify(b8)}`
  )
  assert(
    typeof b8?.error === "string" && b8.error.toLowerCase().includes("no fields to update"),
    "Error message mentions 'No fields to update'",
    `Got error: '${b8?.error}'`
  )

  // 9 — Restore original values
  const { status: restoreStatus } = await patchJson(
    "/api/admin/tv-config",
    {
      refreshInterval: originalRefreshInterval,
      isEnabled: originalIsEnabled,
    },
    techLeadCookie
  )
  assert(
    restoreStatus === 200,
    "TV config original values restored after suite",
    `Expected 200, got ${restoreStatus}`
  )
}

// ─── Suite 6: GET/PATCH /api/admin/checkpoints/config ────────────────────────

async function suite6CheckpointConfig() {
  console.log("\n[Suite 6] GET/PATCH /api/admin/checkpoints/config — checkpoint configuration")

  // Capture original values before any mutations
  const { body: originalBody } = await getJson(
    "/api/admin/checkpoints/config",
    techLeadCookie
  )
  const originalIntervalMinutes = originalBody?.config?.intervalMinutes
  const originalIsEnabled = originalBody?.config?.isEnabled
  const originalActiveHoursStart = originalBody?.config?.activeHoursStart
  const originalActiveHoursEnd = originalBody?.config?.activeHoursEnd

  // 1 — GET as TECH_LEAD → 200 with config
  const { status: s1, body: b1 } = await getJson(
    "/api/admin/checkpoints/config",
    techLeadCookie
  )
  assert(
    s1 === 200,
    "TECH_LEAD GET /api/admin/checkpoints/config returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    b1?.config !== null && typeof b1?.config === "object",
    "Response includes a config object",
    `Got ${JSON.stringify(b1)}`
  )

  // 2 — GET as DEVELOPER → 403
  const { status: s2, body: b2 } = await getJson(
    "/api/admin/checkpoints/config",
    developerCookie
  )
  assert(
    s2 === 403,
    "DEVELOPER GET /api/admin/checkpoints/config returns 403",
    `Expected 403, got ${s2}: ${JSON.stringify(b2)}`
  )

  // 3 — PATCH intervalMinutes:90 → 200
  const { status: s3, body: b3 } = await patchJson(
    "/api/admin/checkpoints/config",
    { intervalMinutes: 90 },
    techLeadCookie
  )
  assert(
    s3 === 200,
    "PATCH intervalMinutes:90 returns 200",
    `Expected 200, got ${s3}: ${JSON.stringify(b3)}`
  )
  assert(
    b3?.config?.intervalMinutes === 90,
    "Response reflects updated intervalMinutes = 90",
    `Got intervalMinutes: ${b3?.config?.intervalMinutes}`
  )

  // 4 — PATCH isEnabled:false → 200
  const { status: s4, body: b4 } = await patchJson(
    "/api/admin/checkpoints/config",
    { isEnabled: false },
    techLeadCookie
  )
  assert(
    s4 === 200,
    "PATCH isEnabled:false returns 200",
    `Expected 200, got ${s4}: ${JSON.stringify(b4)}`
  )
  assert(
    b4?.config?.isEnabled === false,
    "Response reflects isEnabled = false",
    `Got isEnabled: ${b4?.config?.isEnabled}`
  )

  // 5 — PATCH intervalMinutes:10 (below min of 30) → 400
  const { status: s5, body: b5 } = await patchJson(
    "/api/admin/checkpoints/config",
    { intervalMinutes: 10 },
    techLeadCookie
  )
  assert(
    s5 === 400,
    "PATCH intervalMinutes:10 (below min 30) returns 400",
    `Expected 400, got ${s5}: ${JSON.stringify(b5)}`
  )

  // 6 — PATCH intervalMinutes:500 (above max of 480) → 400
  const { status: s6, body: b6 } = await patchJson(
    "/api/admin/checkpoints/config",
    { intervalMinutes: 500 },
    techLeadCookie
  )
  assert(
    s6 === 400,
    "PATCH intervalMinutes:500 (above max 480) returns 400",
    `Expected 400, got ${s6}: ${JSON.stringify(b6)}`
  )

  // 7 — PATCH activeHoursStart with invalid format "9am" → 400
  const { status: s7, body: b7 } = await patchJson(
    "/api/admin/checkpoints/config",
    { activeHoursStart: "9am" },
    techLeadCookie
  )
  assert(
    s7 === 400,
    "PATCH activeHoursStart:'9am' (invalid format) returns 400",
    `Expected 400, got ${s7}: ${JSON.stringify(b7)}`
  )

  // 8 — PATCH empty body → 400 "No fields to update"
  const { status: s8, body: b8 } = await patchJson(
    "/api/admin/checkpoints/config",
    {},
    techLeadCookie
  )
  assert(
    s8 === 400,
    "PATCH empty body returns 400",
    `Expected 400, got ${s8}: ${JSON.stringify(b8)}`
  )
  assert(
    typeof b8?.error === "string" && b8.error.toLowerCase().includes("no fields to update"),
    "Error message mentions 'No fields to update'",
    `Got error: '${b8?.error}'`
  )

  // 9 — Restore original values
  const restorePayload = {
    isEnabled: originalIsEnabled,
    intervalMinutes: originalIntervalMinutes,
  }
  // Only include activeHours if they were present in the original config
  if (originalActiveHoursStart != null) {
    restorePayload.activeHoursStart = originalActiveHoursStart
  }
  if (originalActiveHoursEnd != null) {
    restorePayload.activeHoursEnd = originalActiveHoursEnd
  }
  const { status: restoreStatus } = await patchJson(
    "/api/admin/checkpoints/config",
    restorePayload,
    techLeadCookie
  )
  assert(
    restoreStatus === 200,
    "Checkpoint config original values restored after suite",
    `Expected 200, got ${restoreStatus}`
  )
}

// ─── Suite 7: GET /api/admin/checkpoints/history ─────────────────────────────

async function suite7CheckpointHistory() {
  console.log("\n[Suite 7] GET /api/admin/checkpoints/history — checkpoint history")

  // 1 — TECH_LEAD → 200 with checkpoints array, total, page
  const { status: s1, body: b1 } = await getJson(
    "/api/admin/checkpoints/history",
    techLeadCookie
  )
  assert(
    s1 === 200,
    "TECH_LEAD GET /api/admin/checkpoints/history returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    Array.isArray(b1?.checkpoints) &&
      typeof b1?.total === "number" &&
      typeof b1?.page === "number",
    "Response includes checkpoints array, total, and page",
    `Got keys: ${Object.keys(b1 ?? {}).join(", ")}`
  )

  // 2 — ?page=1&limit=5 pagination works
  const { status: s2, body: b2 } = await getJson(
    "/api/admin/checkpoints/history?page=1&limit=5",
    techLeadCookie
  )
  assert(
    s2 === 200,
    "?page=1&limit=5 returns 200",
    `Expected 200, got ${s2}`
  )
  assert(
    Array.isArray(b2?.checkpoints) && b2.checkpoints.length <= 5,
    "Pagination respects limit=5 (at most 5 results returned)",
    `Got ${b2?.checkpoints?.length} results`
  )
  assert(
    b2?.page === 1,
    "Response page equals requested page (1)",
    `Got page: ${b2?.page}`
  )

  // 3 — ?userId=<developerId> filter returns only that developer's checkpoints
  const { status: s3, body: b3 } = await getJson(
    `/api/admin/checkpoints/history?userId=${developerId}`,
    techLeadCookie
  )
  assert(
    s3 === 200,
    `?userId=${developerId} filter returns 200`,
    `Expected 200, got ${s3}`
  )
  const allMatchDev = (b3?.checkpoints ?? []).every(
    (cp) => cp.userId === developerId || cp.user?.id === developerId
  )
  assert(
    allMatchDev,
    "All returned checkpoints belong to the filtered userId",
    `Got checkpoints: ${JSON.stringify((b3?.checkpoints ?? []).map((cp) => ({ userId: cp.userId })))}`
  )

  // 4 — DEVELOPER → 403
  const { status: s4, body: b4 } = await getJson(
    "/api/admin/checkpoints/history",
    developerCookie
  )
  assert(
    s4 === 403,
    "DEVELOPER GET /api/admin/checkpoints/history returns 403",
    `Expected 403, got ${s4}: ${JSON.stringify(b4)}`
  )
}

// ─── Suite 8: GET/PATCH /api/organizations/current ───────────────────────────

async function suite8OrganizationsCurrent() {
  console.log("\n[Suite 8] GET/PATCH /api/organizations/current — organization self-management")

  // Capture original org name before any mutation
  const { body: originalOrgBody } = await getJson(
    "/api/organizations/current",
    techLeadCookie
  )
  const originalOrgName = originalOrgBody?.organization?.name

  // 1 — GET authenticated → 200 with org details
  const { status: s1, body: b1 } = await getJson(
    "/api/organizations/current",
    techLeadCookie
  )
  assert(
    s1 === 200,
    "Authenticated GET /api/organizations/current returns 200",
    `Expected 200, got ${s1}`
  )
  const orgFields = b1?.organization
  const hasExpectedOrgFields =
    typeof orgFields?.id === "string" &&
    typeof orgFields?.name === "string" &&
    typeof orgFields?.slug === "string" &&
    typeof orgFields?.userCount === "number"
  assert(
    hasExpectedOrgFields,
    "Response includes id, name, slug, userCount",
    `Got org: ${JSON.stringify(orgFields)}`
  )

  // 2 — Unauthenticated → 401 or 307
  const { status: s2 } = await getJson("/api/organizations/current", null, {
    redirect: "manual",
  })
  assert(
    s2 === 401 || s2 === 307,
    "Unauthenticated GET /api/organizations/current is rejected (401 or 307)",
    `Expected 401 or 307, got ${s2}`
  )

  // 3 — PATCH name as TECH_LEAD → 200
  const { status: s3, body: b3 } = await patchJson(
    "/api/organizations/current",
    { name: "VectorOps Test Update" },
    techLeadCookie
  )
  assert(
    s3 === 200,
    "TECH_LEAD PATCH /api/organizations/current with new name returns 200",
    `Expected 200, got ${s3}: ${JSON.stringify(b3)}`
  )
  assert(
    b3?.organization?.name === "VectorOps Test Update",
    "Response reflects updated organization name",
    `Got name: '${b3?.organization?.name}'`
  )

  // 4 — DEVELOPER patching → 403
  const { status: s4, body: b4 } = await patchJson(
    "/api/organizations/current",
    { name: "Unauthorized Change" },
    developerCookie
  )
  assert(
    s4 === 403,
    "DEVELOPER PATCH /api/organizations/current returns 403",
    `Expected 403, got ${s4}: ${JSON.stringify(b4)}`
  )

  // 5 — PATCH name with fewer than 2 chars → 400
  const { status: s5, body: b5 } = await patchJson(
    "/api/organizations/current",
    { name: "X" },
    techLeadCookie
  )
  assert(
    s5 === 400,
    "PATCH name < 2 chars returns 400",
    `Expected 400, got ${s5}: ${JSON.stringify(b5)}`
  )

  // 6 — Restore original org name
  const { status: restoreStatus } = await patchJson(
    "/api/organizations/current",
    { name: originalOrgName },
    techLeadCookie
  )
  assert(
    restoreStatus === 200,
    "Original org name restored after suite",
    `Expected 200, got ${restoreStatus}`
  )
}

// ─── Suite 9: GET /api/super-admin/users ─────────────────────────────────────

async function suite9SuperAdminUsers() {
  console.log("\n[Suite 9] GET /api/super-admin/users — cross-tenant user list")

  // 1 — Super admin (alisson@vector.ops, isSuperAdmin) → 200 with users from all orgs
  const { status: s1, body: b1 } = await getJson("/api/super-admin/users", techLeadCookie)
  assert(
    s1 === 200,
    "Super admin GET /api/super-admin/users returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    Array.isArray(b1?.users) && typeof b1?.pagination === "object",
    "Response includes users array and pagination object",
    `Got keys: ${Object.keys(b1 ?? {}).join(", ")}`
  )
  // Verify each user includes organization details
  const firstUser = (b1?.users ?? [])[0]
  assert(
    firstUser == null || typeof firstUser?.organization === "object",
    "User records include organization details",
    `Got firstUser: ${JSON.stringify(firstUser)}`
  )

  // 2 — ?organizationId filters by org — use the TECH_LEAD's own org
  const { body: orgBody } = await getJson("/api/organizations/current", techLeadCookie)
  const currentOrgId = orgBody?.organization?.id
  if (currentOrgId) {
    const { status: s2, body: b2 } = await getJson(
      `/api/super-admin/users?organizationId=${currentOrgId}`,
      techLeadCookie
    )
    assert(
      s2 === 200,
      "?organizationId filter returns 200",
      `Expected 200, got ${s2}: ${JSON.stringify(b2)}`
    )
    const allInOrg = (b2?.users ?? []).every((u) => u.organizationId === currentOrgId)
    assert(
      allInOrg,
      "All returned users belong to the filtered organizationId",
      `Got organizationIds: ${(b2?.users ?? []).map((u) => u.organizationId).join(", ")}`
    )
  } else {
    assert(false, "?organizationId filter works", "Could not resolve current org ID for filter test")
  }

  // 3 — ?role=DEVELOPER filters by role
  const { status: s3, body: b3 } = await getJson(
    "/api/super-admin/users?role=DEVELOPER",
    techLeadCookie
  )
  assert(
    s3 === 200,
    "?role=DEVELOPER returns 200",
    `Expected 200, got ${s3}`
  )
  const allDevRole = (b3?.users ?? []).every((u) => u.role === "DEVELOPER")
  assert(
    allDevRole,
    "All users returned by ?role=DEVELOPER have role DEVELOPER",
    `Got roles: ${(b3?.users ?? []).map((u) => u.role).join(", ")}`
  )

  // 4 — ?search=alisson searches by name/email
  const { status: s4, body: b4 } = await getJson(
    "/api/super-admin/users?search=alisson",
    techLeadCookie
  )
  assert(
    s4 === 200,
    "?search=alisson returns 200",
    `Expected 200, got ${s4}`
  )
  const matchesAlisson = (b4?.users ?? []).some(
    (u) =>
      u.name?.toLowerCase().includes("alisson") ||
      u.email?.toLowerCase().includes("alisson")
  )
  assert(
    matchesAlisson,
    "?search=alisson results contain a user matching 'alisson'",
    `Got users: ${JSON.stringify((b4?.users ?? []).map((u) => ({ name: u.name, email: u.email })))}`
  )

  // 5 — Non-super-admin (DEVELOPER) → 403
  const { status: s5, body: b5 } = await getJson("/api/super-admin/users", developerCookie)
  assert(
    s5 === 403,
    "Non-super-admin DEVELOPER GET /api/super-admin/users returns 403",
    `Expected 403, got ${s5}: ${JSON.stringify(b5)}`
  )
}

// ─── Suite 10: Misc endpoints ─────────────────────────────────────────────────

async function suite10Misc() {
  console.log("\n[Suite 10] Misc — health, logout, and session invalidation")

  // 1 — GET /api/health → 200 with { status: "ok", timestamp }
  const { status: s1, body: b1 } = await getJson("/api/health", null)
  assert(
    s1 === 200,
    "GET /api/health returns 200",
    `Expected 200, got ${s1}`
  )
  assert(
    b1?.status === "ok" && typeof b1?.timestamp === "string",
    "Health response includes { status: 'ok', timestamp: string }",
    `Got ${JSON.stringify(b1)}`
  )

  // Obtain a fresh session cookie for logout test (so we don't invalidate the main cookies)
  const { cookie: tempCookie } = await loginAs("SUPPORT_MEMBER")

  // 2 — POST /api/auth/logout → 200 "Logged out successfully"
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: tempCookie },
    body: "{}",
  })
  const b2 = await logoutRes.json().catch(() => null)
  assert(
    logoutRes.status === 200,
    "POST /api/auth/logout returns 200",
    `Expected 200, got ${logoutRes.status}: ${JSON.stringify(b2)}`
  )
  assert(
    b2?.message === "Logged out successfully",
    "Logout response message is 'Logged out successfully'",
    `Got message: '${b2?.message}'`
  )

  // 3 — After logout, GET /api/auth/me should fail (401 or 307)
  // iron-session uses stateless encrypted cookies; destroy() clears the cookie via Set-Cookie.
  // Use the cleared cookie from the logout response for the next request.
  const clearedCookieHeader = logoutRes.headers.get("set-cookie") ?? ""
  const clearedCookie = clearedCookieHeader.split(";")[0] || ""
  const { status: s3 } = await getJson("/api/auth/me", clearedCookie, { redirect: "manual" })
  assert(
    s3 === 401 || s3 === 307,
    "GET /api/auth/me with invalidated session returns 401 or 307",
    `Expected 401 or 307, got ${s3}`
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Admin API Integration Tests ===")

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

  const qaResult = await loginAs("QA")
  qaCookie = qaResult.cookie
  if (!qaCookie) {
    console.error("FATAL: Could not log in as QA — aborting")
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

  console.log(`  TECH_LEAD id      : ${techLeadId}`)
  console.log(`  DEVELOPER id      : ${developerId}`)
  console.log(`  SUPPORT_MEMBER id : ${supportMemberId}`)

  // Run all suites sequentially
  await suite1GetAdminUsers()
  await suite2PatchAdminUser()
  await suite3UploadAvatar()
  await suite4GetAdminStats()
  await suite5TvConfig()
  await suite6CheckpointConfig()
  await suite7CheckpointHistory()
  await suite8OrganizationsCurrent()
  await suite9SuperAdminUsers()
  // Suite 10 (logout) runs last because it destroys a session
  await suite10Misc()

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
