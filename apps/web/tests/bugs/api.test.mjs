/**
 * Bugs — API Integration Tests
 *
 * Covers all bug-related endpoints:
 *
 * Suite 1: POST /api/bugs — creation (8 tests)
 *   1. SUPPORT_MEMBER creates bug with all required fields → 201
 *   2. Response publicId matches /^BUG-\d{4}$/ format
 *   3. Response includes bugReport data (affectedModule, stepsToReproduce, etc.)
 *   4. DEVELOPER creating → 403 (only SUPPORT_MEMBER, SUPPORT_LEAD, QA)
 *   5. Missing affectedModule → 400
 *   6. Missing stepsToReproduce → 400
 *   7. Invalid environment value "TESTING" → 400
 *   8. Unauthenticated → 401/307
 *
 * Suite 2: GET /api/bugs — list and filter (5 tests)
 *   1. Returns 200 with bugs array (only BUG type)
 *   2. ?severity=MEDIUM filters by severity
 *   3. ?status=OPEN filters by status
 *   4. ?search=BUG searches by publicId prefix
 *   5. ?page=1&limit=5 pagination works
 *
 * Suite 3: GET /api/bugs/[id] — detail (4 tests)
 *   1. Lookup by publicId (BUG-XXXX) → 200 with bug, bugReport, events
 *   2. Lookup by cuid → 200
 *   3. GET a TICKET type by ID via /api/bugs/[id] → 404 (scoped to BUG only)
 *   4. Nonexistent ID → 404
 *
 * Suite 4: PATCH /api/bugs/[id] — update (5 tests)
 *   1. OPEN → IN_PROGRESS as DEVELOPER → 200
 *   2. Severity change as TECH_LEAD → 200
 *   3. Severity change as DEVELOPER → 403
 *   4. Invalid transition OPEN → DONE → 422
 *   5. PATCH targeting a TICKET type via /api/bugs/[id] → 404
 *
 * Suite 5: DELETE /api/bugs/[id] — cancel (5 tests)
 *   1. Delete OPEN bug as SUPPORT_MEMBER → 200, status=CANCELLED
 *   2. Delete IN_PROGRESS bug → 422 "Only OPEN bugs can be cancelled"
 *   3. Delete as QA → 200
 *   4. Delete as DEVELOPER → 403
 *   5. Nonexistent ID → 404
 *
 * Suite 6: GET /api/bugs/[id]/clickup-export (4 tests)
 *   1. Returns 200 with { markdown } object (markdown is a string)
 *   2. Markdown contains bug title, severity, and affected module
 *   3. Nonexistent ID → 404
 *   4. TICKET type ID → 404
 *
 * Usage:
 *   node apps/web/tests/bugs/api.test.mjs
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - Seed has been applied: cd apps/web && npx prisma db seed
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
  makeDeadline,
} from "../_shared/test-harness.mjs"

// ─── Shared runner instance ──────────────────────────────────────────────────

const { assert, summary } = createTestRunner()

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Builds a complete valid bug payload. All fields required by bugCreateSchema
 * are included. Optional `overrides` let individual tests tweak/omit fields.
 */
function makeBugPayload(overrides = {}) {
  return {
    title: "Login page crashes on empty password",
    description: "Reproducible on all browsers when the password field is left blank.",
    severity: "HIGH",
    deadline: makeDeadline(7),
    affectedModule: "Authentication",
    stepsToReproduce: "1. Open /login\n2. Leave password blank\n3. Click submit",
    expectedBehavior: "Validation error is shown",
    actualBehavior: "Application throws a 500 error",
    environment: "PRODUCTION",
    ...overrides,
  }
}

// ─── Suite 1: POST /api/bugs — creation ──────────────────────────────────────

async function testBugCreation(supportCookie, devCookie) {
  console.log("\n[Suite 1] POST /api/bugs — creation")

  // Test 1 — SUPPORT_MEMBER can create a bug with all required fields → 201
  let createdBug = null
  {
    const { status, body } = await postJson("/api/bugs", makeBugPayload(), supportCookie)
    assert(
      status === 201,
      "SUPPORT_MEMBER creates bug with all required fields → 201",
      `Expected 201, got ${status}: ${JSON.stringify(body)}`
    )
    createdBug = body?.bug ?? null
  }

  // Test 2 — publicId matches /^BUG-\d{4}$/
  assert(
    createdBug !== null && /^BUG-\d{4}$/.test(createdBug?.publicId ?? ""),
    "Response publicId matches /^BUG-\\d{4}$/ format",
    `Got publicId: "${createdBug?.publicId}"`
  )

  // Test 3 — Response includes bugReport data
  {
    const { status, body } = await getJson(`/api/bugs/${createdBug?.publicId}`, supportCookie)
    const bugReport = body?.bug?.bugReport
    assert(
      status === 200 &&
        bugReport?.affectedModule === "Authentication" &&
        typeof bugReport?.stepsToReproduce === "string" &&
        typeof bugReport?.expectedBehavior === "string" &&
        typeof bugReport?.actualBehavior === "string" &&
        bugReport?.environment === "PRODUCTION",
      "Response includes bugReport data (affectedModule, stepsToReproduce, etc.)",
      `bugReport: ${JSON.stringify(bugReport)}`
    )
  }

  // Test 4 — DEVELOPER creating → 403
  {
    const { status, body } = await postJson("/api/bugs", makeBugPayload(), devCookie)
    assert(
      status === 403,
      "DEVELOPER creating bug → 403 (only SUPPORT_MEMBER, SUPPORT_LEAD, QA allowed)",
      `Expected 403, got ${status}: ${JSON.stringify(body)}`
    )
  }

  // Test 5 — Missing affectedModule → 400
  {
    const payload = makeBugPayload()
    delete payload.affectedModule
    const { status, body } = await postJson("/api/bugs", payload, supportCookie)
    assert(
      status === 400,
      "Missing affectedModule → 400",
      `Expected 400, got ${status}: ${JSON.stringify(body)}`
    )
  }

  // Test 6 — Missing stepsToReproduce → 400
  {
    const payload = makeBugPayload()
    delete payload.stepsToReproduce
    const { status, body } = await postJson("/api/bugs", payload, supportCookie)
    assert(
      status === 400,
      "Missing stepsToReproduce → 400",
      `Expected 400, got ${status}: ${JSON.stringify(body)}`
    )
  }

  // Test 7 — Invalid environment value "TESTING" → 400
  {
    const { status, body } = await postJson(
      "/api/bugs",
      makeBugPayload({ environment: "TESTING" }),
      supportCookie
    )
    assert(
      status === 400,
      'Invalid environment value "TESTING" → 400',
      `Expected 400, got ${status}: ${JSON.stringify(body)}`
    )
  }

  // Test 8 — Unauthenticated → 401/307
  {
    const res = await fetch(`${BASE_URL}/api/bugs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "manual",
      body: JSON.stringify(makeBugPayload()),
    })
    assert(
      res.status === 401 || res.status === 307,
      "Unauthenticated POST /api/bugs → 401 or 307",
      `Expected 401 or 307, got ${res.status}`
    )
  }

  return createdBug
}

// ─── Suite 2: GET /api/bugs — list and filter ─────────────────────────────────

async function testBugList(supportCookie) {
  console.log("\n[Suite 2] GET /api/bugs — list and filter")

  // Create a known MEDIUM bug to ensure filter tests have data to work with
  await postJson(
    "/api/bugs",
    makeBugPayload({ severity: "MEDIUM", title: "BUG filter test medium" }),
    supportCookie
  )

  // Test 1 — Returns 200 with bugs array (only BUG type)
  {
    const { status, body } = await getJson("/api/bugs", supportCookie)
    const bugs = body?.bugs ?? []
    assert(
      status === 200 && Array.isArray(bugs),
      "GET /api/bugs returns 200 with bugs array",
      `Expected 200 + array, got ${status}: ${JSON.stringify(body)}`
    )
    // All returned items must have type BUG
    const hasNonBug = bugs.some((b) => b.type !== "BUG")
    assert(
      !hasNonBug,
      "GET /api/bugs only returns BUG type items",
      `Found non-BUG items in response`
    )
  }

  // Test 2 — ?severity=MEDIUM filters by severity
  {
    const { status, body } = await getJson("/api/bugs?severity=MEDIUM", supportCookie)
    const bugs = body?.bugs ?? []
    const allMedium = bugs.every((b) => b.severity === "MEDIUM")
    assert(
      status === 200 && allMedium,
      "?severity=MEDIUM filters results to MEDIUM bugs only",
      `Got status ${status}, bugs severities: ${JSON.stringify(bugs.map((b) => b.severity))}`
    )
  }

  // Test 3 — ?status=OPEN filters by status
  {
    const { status, body } = await getJson("/api/bugs?status=OPEN", supportCookie)
    const bugs = body?.bugs ?? []
    const allOpen = bugs.every((b) => b.status === "OPEN")
    assert(
      status === 200 && allOpen,
      "?status=OPEN filters results to OPEN bugs only",
      `Got status ${status}, bug statuses: ${JSON.stringify(bugs.map((b) => b.status))}`
    )
  }

  // Test 4 — ?search=BUG searches by publicId prefix
  {
    const { status, body } = await getJson("/api/bugs?search=BUG", supportCookie)
    assert(
      status === 200 && Array.isArray(body?.bugs),
      "?search=BUG returns 200 with bugs array",
      `Got ${status}: ${JSON.stringify(body)}`
    )
  }

  // Test 5 — ?page=1&limit=5 pagination works
  {
    const { status, body } = await getJson("/api/bugs?page=1&limit=5", supportCookie)
    const bugs = body?.bugs ?? []
    assert(
      status === 200 && Array.isArray(bugs) && bugs.length <= 5 && body?.page === 1,
      "?page=1&limit=5 returns at most 5 bugs with page=1 in response",
      `Got ${status}, bugs count: ${bugs.length}, page: ${body?.page}`
    )
  }
}

// ─── Suite 3: GET /api/bugs/[id] — detail ────────────────────────────────────

async function testBugDetail(supportCookie, createdBug) {
  console.log("\n[Suite 3] GET /api/bugs/[id] — detail")

  // Test 1 — Lookup by publicId (BUG-XXXX) → 200 with bug, bugReport, events
  {
    const publicId = createdBug?.publicId
    const { status, body } = await getJson(`/api/bugs/${publicId}`, supportCookie)
    assert(
      status === 200 &&
        body?.bug?.publicId === publicId &&
        body?.bug?.bugReport !== undefined &&
        Array.isArray(body?.bug?.events),
      "Lookup by publicId (BUG-XXXX) → 200 with bug, bugReport, events",
      `Got ${status}: bug=${JSON.stringify(body?.bug?.publicId)}, bugReport=${!!body?.bug?.bugReport}, events=${Array.isArray(body?.bug?.events)}`
    )
  }

  // Test 2 — Lookup by internal cuid → 200
  {
    const cuid = createdBug?.id
    const { status, body } = await getJson(`/api/bugs/${cuid}`, supportCookie)
    assert(
      status === 200 && body?.bug?.id === cuid,
      "Lookup by internal cuid → 200",
      `Expected 200 + matching id, got ${status}: ${JSON.stringify(body?.bug?.id)}`
    )
  }

  // Test 3 — GET a TICKET type by its ID via /api/bugs/[id] → 404 (scoped to BUG only)
  {
    // First create a real TICKET so we have a valid ID to try against /api/bugs
    const { body: ticketBody } = await postJson(
      "/api/tickets",
      {
        title: "Test ticket for bug scope isolation",
        description: "This is a plain ticket, not a bug",
        severity: "LOW",
        deadline: makeDeadline(7),
      },
      supportCookie
    )
    const ticketId = ticketBody?.ticket?.id
    if (ticketId) {
      const { status, body } = await getJson(`/api/bugs/${ticketId}`, supportCookie)
      assert(
        status === 404,
        "GET /api/bugs/[ticket-id] for a TICKET type → 404 (bug endpoint scoped to BUG only)",
        `Expected 404, got ${status}: ${JSON.stringify(body)}`
      )
    } else {
      assert(false, "GET /api/bugs/[ticket-id] scope test — could not create a TICKET to test with", `ticketBody: ${JSON.stringify(ticketBody)}`)
    }
  }

  // Test 4 — Nonexistent ID → 404
  {
    const { status, body } = await getJson("/api/bugs/nonexistent-id-12345", supportCookie)
    assert(
      status === 404,
      "GET /api/bugs/[nonexistent-id] → 404",
      `Expected 404, got ${status}: ${JSON.stringify(body)}`
    )
  }
}

// ─── Suite 4: PATCH /api/bugs/[id] — update ──────────────────────────────────

async function testBugUpdate(supportCookie, devCookie, techLeadCookie) {
  console.log("\n[Suite 4] PATCH /api/bugs/[id] — update")

  // Create a fresh bug for update tests using a support member cookie
  const { body: freshBugBody } = await postJson(
    "/api/bugs",
    makeBugPayload({ title: "Bug for PATCH tests" }),
    supportCookie
  )
  const freshBug = freshBugBody?.bug

  if (!freshBug?.id) {
    assert(false, "Suite 4 setup — could not create fresh bug for PATCH tests", `body: ${JSON.stringify(freshBugBody)}`)
    return
  }

  // Test 1 — OPEN → IN_PROGRESS as DEVELOPER → 200
  {
    const { status, body } = await patchJson(
      `/api/bugs/${freshBug.id}`,
      { status: "IN_PROGRESS" },
      devCookie
    )
    assert(
      status === 200 && body?.bug?.status === "IN_PROGRESS",
      "DEVELOPER can transition bug OPEN → IN_PROGRESS → 200",
      `Expected 200 + IN_PROGRESS, got ${status}: ${JSON.stringify(body?.bug?.status)}`
    )
  }

  // Test 2 — Severity change as TECH_LEAD → 200
  {
    const { status, body } = await patchJson(
      `/api/bugs/${freshBug.id}`,
      { severity: "CRITICAL" },
      techLeadCookie
    )
    assert(
      status === 200 && body?.bug?.severity === "CRITICAL",
      "TECH_LEAD can change bug severity → 200",
      `Expected 200 + CRITICAL severity, got ${status}: ${JSON.stringify(body?.bug?.severity)}`
    )
  }

  // Test 3 — Severity change as DEVELOPER → 403
  {
    const { status, body } = await patchJson(
      `/api/bugs/${freshBug.id}`,
      { severity: "LOW" },
      devCookie
    )
    assert(
      status === 403,
      "DEVELOPER cannot change bug severity → 403",
      `Expected 403, got ${status}: ${JSON.stringify(body)}`
    )
  }

  // Test 4 — Invalid transition OPEN → DONE → 422
  // Create another fresh bug (still OPEN) for the invalid transition test
  {
    const { body: openBugBody } = await postJson(
      "/api/bugs",
      makeBugPayload({ title: "Bug for invalid transition test" }),
      supportCookie
    )
    const openBugId = openBugBody?.bug?.id
    if (openBugId) {
      const { status, body } = await patchJson(
        `/api/bugs/${openBugId}`,
        { status: "DONE" },
        devCookie
      )
      assert(
        status === 422,
        "Invalid transition OPEN → DONE → 422",
        `Expected 422, got ${status}: ${JSON.stringify(body)}`
      )
    } else {
      assert(false, "Invalid transition test setup — could not create fresh OPEN bug", `body: ${JSON.stringify(openBugBody)}`)
    }
  }

  // Test 5 — PATCH targeting a TICKET type via /api/bugs/[id] → 404
  {
    const { body: ticketBody } = await postJson(
      "/api/tickets",
      {
        title: "Ticket for bug PATCH scope test",
        description: "Plain ticket used to verify /api/bugs/[id] scope isolation",
        severity: "LOW",
        deadline: makeDeadline(7),
      },
      supportCookie
    )
    const ticketId = ticketBody?.ticket?.id
    if (ticketId) {
      const { status, body } = await patchJson(
        `/api/bugs/${ticketId}`,
        { status: "IN_PROGRESS" },
        devCookie
      )
      assert(
        status === 404,
        "PATCH /api/bugs/[ticket-id] for a TICKET type → 404 (scoped to BUG only)",
        `Expected 404, got ${status}: ${JSON.stringify(body)}`
      )
    } else {
      assert(false, "PATCH scope test — could not create a TICKET to test with", `ticketBody: ${JSON.stringify(ticketBody)}`)
    }
  }
}

// ─── Suite 5: DELETE /api/bugs/[id] — cancel ─────────────────────────────────

async function testBugDelete(supportCookie, qaCookie, devCookie) {
  console.log("\n[Suite 5] DELETE /api/bugs/[id] — cancel")

  // Test 1 — Delete OPEN bug as SUPPORT_MEMBER → 200, status=CANCELLED
  {
    const { body: newBugBody } = await postJson(
      "/api/bugs",
      makeBugPayload({ title: "Bug to delete as SUPPORT_MEMBER" }),
      supportCookie
    )
    const bugId = newBugBody?.bug?.id
    if (bugId) {
      const { status, body } = await deleteJson(`/api/bugs/${bugId}`, supportCookie)
      assert(
        status === 200 && body?.bug?.status === "CANCELLED",
        "SUPPORT_MEMBER can DELETE OPEN bug → 200, status=CANCELLED",
        `Expected 200 + CANCELLED, got ${status}: ${JSON.stringify(body?.bug?.status)}`
      )
    } else {
      assert(false, "DELETE test 1 setup — could not create bug", `body: ${JSON.stringify(newBugBody)}`)
    }
  }

  // Test 2 — Delete IN_PROGRESS bug → 422 "Only OPEN bugs can be cancelled"
  {
    // Create a bug and transition it to IN_PROGRESS first
    const { body: inProgressBody } = await postJson(
      "/api/bugs",
      makeBugPayload({ title: "Bug to move to IN_PROGRESS then attempt delete" }),
      supportCookie
    )
    const inProgressBugId = inProgressBody?.bug?.id
    if (inProgressBugId) {
      // Move to IN_PROGRESS (DEVELOPER can do this)
      await patchJson(`/api/bugs/${inProgressBugId}`, { status: "IN_PROGRESS" }, devCookie)
      // Now try to DELETE — should fail with 422
      const { status, body } = await deleteJson(`/api/bugs/${inProgressBugId}`, supportCookie)
      assert(
        status === 422,
        "DELETE IN_PROGRESS bug → 422 (Only OPEN bugs can be cancelled)",
        `Expected 422, got ${status}: ${JSON.stringify(body)}`
      )
      assert(
        typeof body?.error === "string" && body.error.includes("Only OPEN bugs can be cancelled"),
        "DELETE IN_PROGRESS error message matches expected text",
        `Got error: "${body?.error}"`
      )
    } else {
      assert(false, "DELETE test 2 setup — could not create IN_PROGRESS bug", `body: ${JSON.stringify(inProgressBody)}`)
    }
  }

  // Test 3 — Delete as QA → 200
  {
    const { body: qaBugBody } = await postJson(
      "/api/bugs",
      makeBugPayload({ title: "Bug to delete as QA" }),
      qaCookie
    )
    const qaBugId = qaBugBody?.bug?.id
    if (qaBugId) {
      const { status, body } = await deleteJson(`/api/bugs/${qaBugId}`, qaCookie)
      assert(
        status === 200 && body?.bug?.status === "CANCELLED",
        "QA can DELETE OPEN bug → 200, status=CANCELLED",
        `Expected 200 + CANCELLED, got ${status}: ${JSON.stringify(body?.bug?.status)}`
      )
    } else {
      assert(false, "DELETE test 3 setup — could not create bug as QA", `body: ${JSON.stringify(qaBugBody)}`)
    }
  }

  // Test 4 — Delete as DEVELOPER → 403
  {
    const { body: devDeleteBugBody } = await postJson(
      "/api/bugs",
      makeBugPayload({ title: "Bug that DEVELOPER should NOT be able to delete" }),
      supportCookie
    )
    const devDeleteBugId = devDeleteBugBody?.bug?.id
    if (devDeleteBugId) {
      const { status, body } = await deleteJson(`/api/bugs/${devDeleteBugId}`, devCookie)
      assert(
        status === 403,
        "DEVELOPER cannot DELETE bug → 403",
        `Expected 403, got ${status}: ${JSON.stringify(body)}`
      )
    } else {
      assert(false, "DELETE test 4 setup — could not create bug", `body: ${JSON.stringify(devDeleteBugBody)}`)
    }
  }

  // Test 5 — Nonexistent ID → 404
  {
    const { status, body } = await deleteJson("/api/bugs/nonexistent-cuid-99999", supportCookie)
    assert(
      status === 404,
      "DELETE /api/bugs/[nonexistent-id] → 404",
      `Expected 404, got ${status}: ${JSON.stringify(body)}`
    )
  }
}

// ─── Suite 6: GET /api/bugs/[id]/clickup-export ───────────────────────────────

async function testClickupExport(supportCookie) {
  console.log("\n[Suite 6] GET /api/bugs/[id]/clickup-export")

  // Create a fresh bug for export tests with a recognizable title and affectedModule
  const exportTitle = "Clickup Export Test Bug"
  const exportModule = "PaymentGateway"
  const { body: exportBugBody } = await postJson(
    "/api/bugs",
    makeBugPayload({ title: exportTitle, affectedModule: exportModule, severity: "CRITICAL" }),
    supportCookie
  )
  const exportBug = exportBugBody?.bug
  const exportPublicId = exportBug?.publicId
  const exportBugId = exportBug?.id

  // Test 1 — Returns 200 with { markdown } object where markdown is a string
  let markdown = null
  {
    const { status, body } = await getJson(
      `/api/bugs/${exportPublicId}/clickup-export`,
      supportCookie
    )
    assert(
      status === 200 && typeof body?.markdown === "string" && body.markdown.length > 0,
      "GET /api/bugs/[id]/clickup-export returns 200 with { markdown } string",
      `Got ${status}, markdown type: ${typeof body?.markdown}, length: ${body?.markdown?.length}`
    )
    markdown = body?.markdown ?? null
  }

  // Test 2 — Markdown contains bug title, severity, and affected module
  {
    const containsTitle = markdown !== null && markdown.includes(exportTitle)
    const containsSeverity = markdown !== null && markdown.includes("CRITICAL")
    const containsModule = markdown !== null && markdown.includes(exportModule)
    assert(
      containsTitle && containsSeverity && containsModule,
      "Clickup export markdown contains bug title, severity, and affected module",
      `title=${containsTitle}, severity=${containsSeverity}, module=${containsModule}\nMarkdown snippet: ${markdown?.slice(0, 200)}`
    )
  }

  // Test 3 — Nonexistent ID → 404
  {
    const { status, body } = await getJson(
      "/api/bugs/nonexistent-id-export-test/clickup-export",
      supportCookie
    )
    assert(
      status === 404,
      "GET /api/bugs/[nonexistent-id]/clickup-export → 404",
      `Expected 404, got ${status}: ${JSON.stringify(body)}`
    )
  }

  // Test 4 — TICKET type ID → 404
  {
    const { body: ticketBody } = await postJson(
      "/api/tickets",
      {
        title: "Ticket for clickup-export scope test",
        description: "Plain ticket, not a bug",
        severity: "LOW",
        deadline: makeDeadline(7),
      },
      supportCookie
    )
    const ticketId = ticketBody?.ticket?.id
    if (ticketId) {
      const { status, body } = await getJson(
        `/api/bugs/${ticketId}/clickup-export`,
        supportCookie
      )
      assert(
        status === 404,
        "GET /api/bugs/[ticket-id]/clickup-export for a TICKET type → 404 (scoped to BUG only)",
        `Expected 404, got ${status}: ${JSON.stringify(body)}`
      )
    } else {
      assert(false, "Clickup-export scope test — could not create a TICKET to test with", `ticketBody: ${JSON.stringify(ticketBody)}`)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Bugs API Integration Tests ===")
  console.log(`Target: ${BASE_URL}`)
  console.log("")

  // Log in all needed roles up front
  const [supportResult, devResult, techLeadResult, qaResult] = await Promise.all([
    loginAs("SUPPORT_MEMBER"),
    loginAs("DEVELOPER"),
    loginAs("TECH_LEAD"),
    loginAs("QA"),
  ])

  const supportCookie = supportResult.cookie
  const devCookie = devResult.cookie
  const techLeadCookie = techLeadResult.cookie
  const qaCookie = qaResult.cookie

  if (!supportCookie) {
    console.error("FATAL: Could not log in as SUPPORT_MEMBER — aborting tests.")
    process.exit(2)
  }
  if (!devCookie) {
    console.error("FATAL: Could not log in as DEVELOPER — aborting tests.")
    process.exit(2)
  }
  if (!techLeadCookie) {
    console.error("FATAL: Could not log in as TECH_LEAD — aborting tests.")
    process.exit(2)
  }
  if (!qaCookie) {
    console.error("FATAL: Could not log in as QA — aborting tests.")
    process.exit(2)
  }

  try {
    const createdBug = await testBugCreation(supportCookie, devCookie)
    await testBugList(supportCookie)
    await testBugDetail(supportCookie, createdBug)
    await testBugUpdate(supportCookie, devCookie, techLeadCookie)
    await testBugDelete(supportCookie, qaCookie, devCookie)
    await testClickupExport(supportCookie)
  } catch (err) {
    console.error("\nFATAL ERROR in test runner:", err)
    process.exit(2)
  }

  const { failCount } = summary()
  process.exit(failCount > 0 ? 1 : 0)
}

main().catch(console.error)
