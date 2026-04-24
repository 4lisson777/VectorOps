/**
 * Status Change — API Integration Tests
 *
 * Covers:
 *  1.  DEVELOPER can PATCH own devStatus via /api/users/me/status
 *  2.  TECH_LEAD can PATCH own devStatus via /api/users/me/status
 *  3.  QA can PATCH own devStatus via /api/users/me/status
 *  4.  SUPPORT_MEMBER is rejected from /api/users/me/status (403)
 *  5.  PATCH with an invalid devStatus enum value is rejected (400)
 *  6.  PATCH with an empty body (no devStatus, no currentTask) is rejected (400)
 *  7.  DEVELOPER can PATCH currentTask independently (devStatus unchanged)
 *  8.  DEVELOPER can POST checkpoint to /api/checkpoints
 *  9.  TECH_LEAD can POST checkpoint to /api/checkpoints
 * 10.  QA is rejected from POST /api/checkpoints (403)
 * 11.  Checkpoint with isBlocked=true sets devStatus to BLOCKED
 * 12.  Checkpoint with isBlocked=false sets devStatus to ACTIVE
 * 13.  Checkpoint requires currentTask (empty string rejected)
 * 14.  TECH_LEAD can GET /api/checkpoints history
 * 15.  DEVELOPER is rejected from GET /api/checkpoints history (403)
 *
 * Usage:
 *   node apps/web/tests/status-change/api.test.mjs
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - Seed has been applied: npx prisma db seed (from apps/web/)
 */

const BASE_URL = "http://localhost:3000"

// ─── Harness ────────────────────────────────────────────────────────────────

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

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const setCookie = res.headers.get("set-cookie")
  if (!setCookie) return null
  const match = setCookie.match(/^([^;]+)/)
  return match ? match[1] : null
}

async function patchJson(url, data, cookie) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(data),
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

async function getJson(url, cookie) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: cookie ? { Cookie: cookie } : {},
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

// ─── Seed credentials ────────────────────────────────────────────────────────

const DEVELOPER_EMAIL = "matheus@vectorops.dev"
const TECH_LEAD_EMAIL = "alisson@vector.ops"
const QA_EMAIL = "nicoli@vectorops.dev"
const SUPPORT_EMAIL = "alisson.rosa@vectorops.dev"
const PASSWORD = "Password123!"

// ─── Suite 1: PATCH /api/users/me/status — role permissions ─────────────────

async function testStatusPatchPermissions() {
  console.log("\n[Suite 1] PATCH /api/users/me/status — role permissions")

  const devCookie = await login(DEVELOPER_EMAIL, PASSWORD)
  assert(devCookie !== null, "Developer login succeeds", "No session cookie returned")

  const techCookie = await login(TECH_LEAD_EMAIL, PASSWORD)
  assert(techCookie !== null, "Tech Lead login succeeds", "No session cookie returned")

  const qaCookie = await login(QA_EMAIL, PASSWORD)
  assert(qaCookie !== null, "QA login succeeds", "No session cookie returned")

  const supportCookie = await login(SUPPORT_EMAIL, PASSWORD)
  assert(supportCookie !== null, "Support login succeeds", "No session cookie returned")

  // 1 — DEVELOPER can update status
  if (devCookie) {
    const { status, body } = await patchJson(
      "/api/users/me/status",
      { devStatus: "ACTIVE" },
      devCookie
    )
    assert(status === 200, "DEVELOPER can PATCH devStatus", `Expected 200, got ${status}`)
    assert(
      body?.devStatus === "ACTIVE",
      "Response contains updated devStatus",
      `Expected devStatus=ACTIVE, got ${body?.devStatus}`
    )
  }

  // 2 — TECH_LEAD can update status
  if (techCookie) {
    const { status } = await patchJson(
      "/api/users/me/status",
      { devStatus: "ACTIVE" },
      techCookie
    )
    assert(status === 200, "TECH_LEAD can PATCH devStatus", `Expected 200, got ${status}`)
  }

  // 3 — QA can update status
  if (qaCookie) {
    const { status } = await patchJson(
      "/api/users/me/status",
      { devStatus: "ACTIVE" },
      qaCookie
    )
    assert(status === 200, "QA can PATCH devStatus", `Expected 200, got ${status}`)
  }

  // 4 — SUPPORT_MEMBER is rejected
  if (supportCookie) {
    const { status } = await patchJson(
      "/api/users/me/status",
      { devStatus: "ACTIVE" },
      supportCookie
    )
    assert(
      status === 403,
      "SUPPORT_MEMBER is rejected from PATCH devStatus (403)",
      `Expected 403, got ${status}`
    )
  }
}

// ─── Suite 2: PATCH /api/users/me/status — validation ───────────────────────

async function testStatusPatchValidation() {
  console.log("\n[Suite 2] PATCH /api/users/me/status — input validation")

  const devCookie = await login(DEVELOPER_EMAIL, PASSWORD)
  if (!devCookie) {
    fail("Suite 2 setup", "Could not log in as DEVELOPER")
    return
  }

  // 5 — Invalid enum value is rejected
  const { status: invalidStatus, body: invalidBody } = await patchJson(
    "/api/users/me/status",
    { devStatus: "NOT_A_REAL_STATUS" },
    devCookie
  )
  assert(
    invalidStatus === 400,
    "Invalid devStatus enum value is rejected (400)",
    `Expected 400, got ${invalidStatus}: ${JSON.stringify(invalidBody)}`
  )

  // 6 — Empty body (neither devStatus nor currentTask) is rejected
  const { status: emptyStatus } = await patchJson(
    "/api/users/me/status",
    {},
    devCookie
  )
  assert(
    emptyStatus === 400,
    "Empty PATCH body (no devStatus, no currentTask) is rejected (400)",
    `Expected 400, got ${emptyStatus}`
  )

  // 7 — currentTask can be updated without touching devStatus
  const { status: taskStatus, body: taskBody } = await patchJson(
    "/api/users/me/status",
    { currentTask: "Testing the status change flow" },
    devCookie
  )
  assert(
    taskStatus === 200,
    "DEVELOPER can PATCH currentTask without devStatus",
    `Expected 200, got ${taskStatus}`
  )
  assert(
    taskBody?.currentTask === "Testing the status change flow",
    "Response contains updated currentTask",
    `Got ${taskBody?.currentTask}`
  )
}

// ─── Suite 3: POST /api/checkpoints — role permissions ──────────────────────

async function testCheckpointPostPermissions() {
  console.log("\n[Suite 3] POST /api/checkpoints — role permissions")

  const devCookie = await login(DEVELOPER_EMAIL, PASSWORD)
  const techCookie = await login(TECH_LEAD_EMAIL, PASSWORD)
  const qaCookie = await login(QA_EMAIL, PASSWORD)

  // 8 — DEVELOPER can post a checkpoint
  if (devCookie) {
    const { status, body } = await postJson(
      "/api/checkpoints",
      { currentTask: "Working on status change tests", isBlocked: false },
      devCookie
    )
    assert(
      status === 201,
      "DEVELOPER can POST checkpoint",
      `Expected 201, got ${status}: ${JSON.stringify(body)}`
    )
    assert(
      body?.checkpoint?.currentTask === "Working on status change tests",
      "Checkpoint response contains currentTask",
      `Got ${body?.checkpoint?.currentTask}`
    )
  }

  // 9 — TECH_LEAD can post a checkpoint
  if (techCookie) {
    const { status } = await postJson(
      "/api/checkpoints",
      { currentTask: "Tech lead checkpoint", isBlocked: false },
      techCookie
    )
    assert(
      status === 201,
      "TECH_LEAD can POST checkpoint",
      `Expected 201, got ${status}`
    )
  }

  // 10 — QA is rejected from checkpoints
  if (qaCookie) {
    const { status } = await postJson(
      "/api/checkpoints",
      { currentTask: "QA checkpoint attempt", isBlocked: false },
      qaCookie
    )
    assert(
      status === 403,
      "QA is rejected from POST /api/checkpoints (403)",
      `Expected 403, got ${status}`
    )
  }
}

// ─── Suite 4: POST /api/checkpoints — devStatus propagation ─────────────────

async function testCheckpointStatusPropagation() {
  console.log("\n[Suite 4] POST /api/checkpoints — devStatus propagation")

  const devCookie = await login(DEVELOPER_EMAIL, PASSWORD)
  if (!devCookie) {
    fail("Suite 4 setup", "Could not log in as DEVELOPER")
    return
  }

  // 11 — isBlocked=true sets devStatus to BLOCKED on the user record
  await postJson(
    "/api/checkpoints",
    { currentTask: "Blocked on a dependency", isBlocked: true },
    devCookie
  )
  // Give SSE emission a tick
  await new Promise((r) => setTimeout(r, 300))
  const { body: meBlocked } = await getJson("/api/users/me", devCookie)
  assert(
    meBlocked?.user?.devStatus === "BLOCKED",
    "isBlocked=true checkpoint sets devStatus to BLOCKED",
    `Expected BLOCKED, got ${meBlocked?.user?.devStatus}`
  )

  // 12 — isBlocked=false sets devStatus to ACTIVE on the user record
  await postJson(
    "/api/checkpoints",
    { currentTask: "Back to normal", isBlocked: false },
    devCookie
  )
  await new Promise((r) => setTimeout(r, 300))
  const { body: meActive } = await getJson("/api/users/me", devCookie)
  assert(
    meActive?.user?.devStatus === "ACTIVE",
    "isBlocked=false checkpoint sets devStatus to ACTIVE",
    `Expected ACTIVE, got ${meActive?.user?.devStatus}`
  )

  // 13 — Empty currentTask is rejected
  const { status: emptyTask } = await postJson(
    "/api/checkpoints",
    { currentTask: "", isBlocked: false },
    devCookie
  )
  assert(
    emptyTask === 400,
    "Checkpoint with empty currentTask is rejected (400)",
    `Expected 400, got ${emptyTask}`
  )
}

// ─── Suite 5: GET /api/checkpoints — history access ─────────────────────────

async function testCheckpointHistory() {
  console.log("\n[Suite 5] GET /api/checkpoints — history access")

  const techCookie = await login(TECH_LEAD_EMAIL, PASSWORD)
  const devCookie = await login(DEVELOPER_EMAIL, PASSWORD)

  // 14 — TECH_LEAD can get checkpoint history
  if (techCookie) {
    const { status, body } = await getJson("/api/checkpoints", techCookie)
    assert(
      status === 200,
      "TECH_LEAD can GET /api/checkpoints history",
      `Expected 200, got ${status}`
    )
    assert(
      Array.isArray(body?.checkpoints),
      "History response contains checkpoints array",
      `Got ${JSON.stringify(body)}`
    )
  }

  // 15 — DEVELOPER is rejected from checkpoint history
  if (devCookie) {
    const { status } = await getJson("/api/checkpoints", devCookie)
    assert(
      status === 403,
      "DEVELOPER is rejected from GET /api/checkpoints history (403)",
      `Expected 403, got ${status}`
    )
  }
}

// ─── Run all suites ──────────────────────────────────────────────────────────

async function run() {
  console.log("=== Status Change API Tests ===")

  await testStatusPatchPermissions()
  await testStatusPatchValidation()
  await testCheckpointPostPermissions()
  await testCheckpointStatusPropagation()
  await testCheckpointHistory()

  console.log(`\n=== Results: ${passCount} passed, ${failCount} failed ===`)
  if (failures.length > 0) {
    console.log("\nFailures:")
    for (const { name, reason } of failures) {
      console.log(`  • ${name}: ${reason}`)
    }
    process.exit(1)
  }
}

run().catch((err) => {
  console.error("Unexpected test runner error:", err)
  process.exit(1)
})
