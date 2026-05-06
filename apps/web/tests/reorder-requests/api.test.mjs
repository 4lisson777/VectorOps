/**
 * Reorder Requests — API Integration Tests
 *
 * Covers:
 *  Suite 1: POST /api/reorder-requests — creation (8 tests)
 *   1.  SUPPORT_MEMBER creates reorder request with valid ticketId, requestedPosition:1 → 201
 *   2.  QA creates reorder request → 201
 *   3.  TECH_LEAD creates reorder request → 201
 *   4.  DEVELOPER creates reorder request → 403
 *   5.  Nonexistent ticketId → 404
 *   6.  Duplicate pending request for same ticket → 409
 *   7.  Missing ticketId → 400
 *   8.  requestedPosition=0 (below min 1) → 400
 *   9.  Unauthenticated → 401/307
 *
 *  Suite 2: GET /api/reorder-requests — list pending (5 tests)
 *  10.  TECH_LEAD sees 200 with reorderRequests array
 *  11.  SUPPORT_LEAD sees 200
 *  12.  QA sees 200
 *  13.  DEVELOPER sees 403
 *  14.  Response contains the request created in Suite 1
 *
 *  Suite 3: PATCH /api/reorder-requests/[id] — approve/decline (6 tests)
 *  15.  TECH_LEAD approves (action:"approve") → 200 with status=APPROVED
 *  16.  SUPPORT_LEAD declines (action:"decline") → 200 with status=DECLINED
 *  17.  Patch already-resolved request → 409
 *  18.  Invalid action value "reject" → 400
 *  19.  Nonexistent ID → 404
 *  20.  DEVELOPER patching → 403
 *
 * Usage:
 *   node apps/web/tests/reorder-requests/api.test.mjs
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - Seed applied: npx prisma db seed (from apps/web/)
 */

import {
  createTestRunner,
  loginAs,
  getJson,
  postJson,
  patchJson,
  BASE_URL,
  makeDeadline,
  sleep,
} from "../_shared/test-harness.mjs"

const { assert, summary } = createTestRunner()

// ─── Shared state across suites ──────────────────────────────────────────────

let cookies = {}
let ticketIds = []

// reorder request created by SUPPORT_MEMBER in Suite 1 (used across suites)
let supportMemberReorderRequestId = null
// additional requests created for Suite 3 approve/decline tests
let approveTargetReorderRequestId = null
let declineTargetReorderRequestId = null

// ─── Setup helpers ────────────────────────────────────────────────────────────

/**
 * Creates a ticket as SUPPORT_MEMBER and returns its DB id.
 * Returns null on failure; test suites that depend on tickets will skip.
 */
async function createTicket(title) {
  const { status, body } = await postJson(
    "/api/tickets",
    {
      title,
      description: "Automated reorder-request test ticket",
      severity: "HIGH",
      deadline: makeDeadline(7),
    },
    cookies.supportMember
  )
  if (status !== 201 || !body?.ticket?.id) return null
  return body.ticket.id
}

// ─── Suite 1: POST /api/reorder-requests — creation ──────────────────────────

async function suitePost() {
  console.log("\n[Suite 1] POST /api/reorder-requests — creation")

  const [ticketA, ticketB, ticketC] = ticketIds

  // 1 — SUPPORT_MEMBER creates with valid payload → 201
  let body1
  if (ticketA) {
    const { status, body } = await postJson(
      "/api/reorder-requests",
      { ticketId: ticketA, requestedPosition: 1, reason: "Urgent client request" },
      cookies.supportMember
    )
    body1 = body
    assert(
      status === 201,
      "SUPPORT_MEMBER creates reorder request → 201",
      `Expected 201, got ${status}: ${JSON.stringify(body)}`
    )
    assert(
      body?.reorderRequest?.id != null,
      "Response contains reorderRequest with id",
      `reorderRequest.id missing: ${JSON.stringify(body)}`
    )
    assert(
      body?.reorderRequest?.status === "PENDING",
      "Newly created reorder request has status PENDING",
      `Expected PENDING, got ${body?.reorderRequest?.status}`
    )
    supportMemberReorderRequestId = body?.reorderRequest?.id ?? null
  } else {
    console.log("        SKIP  Test 1 — no ticketA available")
  }

  // 2 — QA creates → 201
  if (ticketB) {
    const { status, body } = await postJson(
      "/api/reorder-requests",
      { ticketId: ticketB, requestedPosition: 2 },
      cookies.qa
    )
    assert(
      status === 201,
      "QA creates reorder request → 201",
      `Expected 201, got ${status}: ${JSON.stringify(body)}`
    )
    // Store for Suite 3 approve test
    approveTargetReorderRequestId = body?.reorderRequest?.id ?? null
  } else {
    console.log("        SKIP  Test 2 — no ticketB available")
  }

  // 3 — TECH_LEAD creates → 201
  if (ticketC) {
    const { status, body } = await postJson(
      "/api/reorder-requests",
      { ticketId: ticketC, requestedPosition: 3 },
      cookies.techLead
    )
    assert(
      status === 201,
      "TECH_LEAD creates reorder request → 201",
      `Expected 201, got ${status}: ${JSON.stringify(body)}`
    )
    // Store for Suite 3 decline test
    declineTargetReorderRequestId = body?.reorderRequest?.id ?? null
  } else {
    console.log("        SKIP  Test 3 — no ticketC available")
  }

  // 4 — DEVELOPER creates → 403
  if (ticketA) {
    const { status, body } = await postJson(
      "/api/reorder-requests",
      { ticketId: ticketA, requestedPosition: 1 },
      cookies.developer
    )
    assert(
      status === 403,
      "DEVELOPER creates reorder request → 403",
      `Expected 403, got ${status}: ${JSON.stringify(body)}`
    )
  } else {
    // DEVELOPER rejection is checked via a dummy id — the 403 fires before any DB lookup
    const { status } = await postJson(
      "/api/reorder-requests",
      { ticketId: "dummy-ticket-id", requestedPosition: 1 },
      cookies.developer
    )
    assert(
      status === 403,
      "DEVELOPER creates reorder request → 403",
      `Expected 403, got ${status}`
    )
  }

  // 5 — Nonexistent ticketId → 404
  const { status: s5, body: b5 } = await postJson(
    "/api/reorder-requests",
    { ticketId: "nonexistent-ticket-id-xyz", requestedPosition: 1 },
    cookies.supportMember
  )
  assert(
    s5 === 404,
    "Nonexistent ticketId → 404",
    `Expected 404, got ${s5}: ${JSON.stringify(b5)}`
  )
  assert(
    b5?.error === "Ticket not found",
    "404 response body says 'Ticket not found'",
    `Error message: ${b5?.error}`
  )

  // 6 — Duplicate pending request for same ticket → 409
  // ticketA already has a PENDING request from test 1
  if (ticketA && supportMemberReorderRequestId) {
    const { status: s6, body: b6 } = await postJson(
      "/api/reorder-requests",
      { ticketId: ticketA, requestedPosition: 2 },
      cookies.supportMember
    )
    assert(
      s6 === 409,
      "Duplicate pending request for same ticket → 409",
      `Expected 409, got ${s6}: ${JSON.stringify(b6)}`
    )
    assert(
      typeof b6?.error === "string" && b6.error.toLowerCase().includes("pending"),
      "409 response body mentions 'pending'",
      `Error message: ${b6?.error}`
    )
  } else {
    console.log("        SKIP  Test 6 — no ticketA or prior request id")
  }

  // 7 — Missing ticketId → 400
  const { status: s7, body: b7 } = await postJson(
    "/api/reorder-requests",
    { requestedPosition: 1 },
    cookies.supportMember
  )
  assert(
    s7 === 400,
    "Missing ticketId → 400",
    `Expected 400, got ${s7}: ${JSON.stringify(b7)}`
  )
  assert(
    b7?.error === "Validation failed",
    "400 body has error: 'Validation failed'",
    `Error: ${b7?.error}`
  )

  // 8 — requestedPosition=0 (below min 1) → 400
  const { status: s8, body: b8 } = await postJson(
    "/api/reorder-requests",
    { ticketId: "some-ticket-id", requestedPosition: 0 },
    cookies.supportMember
  )
  assert(
    s8 === 400,
    "requestedPosition=0 (below min 1) → 400",
    `Expected 400, got ${s8}: ${JSON.stringify(b8)}`
  )

  // 9 — Unauthenticated → 401/307
  const unauthRes = await fetch(`${BASE_URL}/api/reorder-requests`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId: "any-id", requestedPosition: 1 }),
  })
  assert(
    unauthRes.status === 401 || unauthRes.status === 302 || unauthRes.status === 307,
    "Unauthenticated POST /api/reorder-requests → 401/307 auth redirect",
    `Expected 401 or 307, got ${unauthRes.status}`
  )
}

// ─── Suite 2: GET /api/reorder-requests — list pending ───────────────────────

async function suiteGet() {
  console.log("\n[Suite 2] GET /api/reorder-requests — list pending")

  // 10 — TECH_LEAD sees 200 with reorderRequests array
  const { status: s10, body: b10 } = await getJson("/api/reorder-requests", cookies.techLead)
  assert(
    s10 === 200,
    "TECH_LEAD GET /api/reorder-requests → 200",
    `Expected 200, got ${s10}`
  )
  assert(
    Array.isArray(b10?.reorderRequests),
    "Response body has reorderRequests array",
    `reorderRequests is not an array: ${JSON.stringify(b10)}`
  )

  // 11 — SUPPORT_LEAD sees 200
  const { status: s11, body: b11 } = await getJson("/api/reorder-requests", cookies.supportLead)
  assert(
    s11 === 200,
    "SUPPORT_LEAD GET /api/reorder-requests → 200",
    `Expected 200, got ${s11}: ${JSON.stringify(b11)}`
  )

  // 12 — QA sees 200
  const { status: s12, body: b12 } = await getJson("/api/reorder-requests", cookies.qa)
  assert(
    s12 === 200,
    "QA GET /api/reorder-requests → 200",
    `Expected 200, got ${s12}: ${JSON.stringify(b12)}`
  )

  // 13 — DEVELOPER sees 403
  const { status: s13 } = await getJson("/api/reorder-requests", cookies.developer)
  assert(
    s13 === 403,
    "DEVELOPER GET /api/reorder-requests → 403",
    `Expected 403, got ${s13}`
  )

  // 14 — Response contains the request created in Suite 1
  if (supportMemberReorderRequestId && Array.isArray(b10?.reorderRequests)) {
    const found = b10.reorderRequests.some((r) => r.id === supportMemberReorderRequestId)
    assert(
      found,
      "Response contains the SUPPORT_MEMBER reorder request created in Suite 1",
      `Request id ${supportMemberReorderRequestId} not found in list: ${JSON.stringify(b10.reorderRequests.map((r) => r.id))}`
    )
    // Also verify the shape of a returned item
    const item = b10.reorderRequests.find((r) => r.id === supportMemberReorderRequestId)
    assert(
      item?.ticket?.publicId != null && item?.requestedBy?.name != null,
      "Reorder request item includes nested ticket.publicId and requestedBy.name",
      `Item shape: ${JSON.stringify(item)}`
    )
  } else {
    console.log("        SKIP  Test 14 — no prior request id or reorderRequests array missing")
  }
}

// ─── Suite 3: PATCH /api/reorder-requests/[id] — approve/decline ─────────────

async function suitePatch() {
  console.log("\n[Suite 3] PATCH /api/reorder-requests/[id] — approve/decline")

  // 15 — TECH_LEAD approves → 200 with status=APPROVED
  if (approveTargetReorderRequestId) {
    const { status: s15, body: b15 } = await patchJson(
      `/api/reorder-requests/${approveTargetReorderRequestId}`,
      { action: "approve" },
      cookies.techLead
    )
    assert(
      s15 === 200,
      "TECH_LEAD approves reorder request → 200",
      `Expected 200, got ${s15}: ${JSON.stringify(b15)}`
    )
    assert(
      b15?.reorderRequest?.status === "APPROVED",
      "Approved reorder request has status=APPROVED in response",
      `status=${b15?.reorderRequest?.status}`
    )
    assert(
      b15?.ticket?.id != null,
      "Approve response includes the reordered ticket",
      `ticket missing in response: ${JSON.stringify(b15)}`
    )
  } else {
    console.log("        SKIP  Test 15 — no approveTargetReorderRequestId")
  }

  // 16 — SUPPORT_LEAD declines → 200 with status=DECLINED
  if (declineTargetReorderRequestId) {
    const { status: s16, body: b16 } = await patchJson(
      `/api/reorder-requests/${declineTargetReorderRequestId}`,
      { action: "decline" },
      cookies.supportLead
    )
    assert(
      s16 === 200,
      "SUPPORT_LEAD declines reorder request → 200",
      `Expected 200, got ${s16}: ${JSON.stringify(b16)}`
    )
    assert(
      b16?.reorderRequest?.status === "DECLINED",
      "Declined reorder request has status=DECLINED in response",
      `status=${b16?.reorderRequest?.status}`
    )
  } else {
    console.log("        SKIP  Test 16 — no declineTargetReorderRequestId")
  }

  // 17 — Patch already-resolved request → 409 "not pending"
  // Use the approved request id (now status=APPROVED, no longer PENDING)
  const resolvedId = approveTargetReorderRequestId ?? declineTargetReorderRequestId
  if (resolvedId) {
    const { status: s17, body: b17 } = await patchJson(
      `/api/reorder-requests/${resolvedId}`,
      { action: "approve" },
      cookies.techLead
    )
    assert(
      s17 === 409,
      "Patching already-resolved request → 409",
      `Expected 409, got ${s17}: ${JSON.stringify(b17)}`
    )
  } else {
    console.log("        SKIP  Test 17 — no resolved request id available")
  }

  // 18 — Invalid action value "reject" → 400
  // Use a pending request if available (SUPPORT_MEMBER's), or any id (validation fires before DB lookup)
  const anyId = supportMemberReorderRequestId ?? "some-request-id"
  const { status: s18, body: b18 } = await patchJson(
    `/api/reorder-requests/${anyId}`,
    { action: "reject" },
    cookies.techLead
  )
  assert(
    s18 === 400,
    "Invalid action value 'reject' → 400",
    `Expected 400, got ${s18}: ${JSON.stringify(b18)}`
  )

  // 19 — Nonexistent ID → 404
  const { status: s19, body: b19 } = await patchJson(
    "/api/reorder-requests/nonexistent-request-id-xyz",
    { action: "approve" },
    cookies.techLead
  )
  assert(
    s19 === 404,
    "Nonexistent reorder request ID → 404",
    `Expected 404, got ${s19}: ${JSON.stringify(b19)}`
  )

  // 20 — DEVELOPER patching → 403
  const patchTargetId = supportMemberReorderRequestId ?? "some-request-id"
  const { status: s20, body: b20 } = await patchJson(
    `/api/reorder-requests/${patchTargetId}`,
    { action: "approve" },
    cookies.developer
  )
  assert(
    s20 === 403,
    "DEVELOPER PATCH /api/reorder-requests/[id] → 403",
    `Expected 403, got ${s20}: ${JSON.stringify(b20)}`
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60))
  console.log("  Reorder Requests — API Integration Tests")
  console.log("=".repeat(60))

  // --- Authenticate required roles ---
  console.log("\n[Setup] Authenticating test users...")

  // Sequential logins to avoid concurrent bcrypt contention
  const techLeadResult = await loginAs("TECH_LEAD")
  await sleep(300)
  const supportLeadResult = await loginAs("SUPPORT_LEAD")
  await sleep(300)
  const supportMemberResult = await loginAs("SUPPORT_MEMBER")
  await sleep(300)
  const qaResult = await loginAs("QA")
  await sleep(300)
  const developerResult = await loginAs("DEVELOPER")

  cookies = {
    techLead: techLeadResult.cookie,
    supportLead: supportLeadResult.cookie,
    supportMember: supportMemberResult.cookie,
    qa: qaResult.cookie,
    developer: developerResult.cookie,
  }

  const roleLabels = {
    techLead: "TECH_LEAD (alisson@vector.ops)",
    supportLead: "SUPPORT_LEAD (alisson.rosa@vectorops.dev)",
    supportMember: "SUPPORT_MEMBER (bruno@vectorops.dev)",
    qa: "QA (nicoli@vectorops.dev)",
    developer: "DEVELOPER (matheus@vectorops.dev)",
  }
  for (const [key, cookie] of Object.entries(cookies)) {
    console.log(`  Auth  ${roleLabels[key]}: ${cookie ? "OK" : "FAILED"}`)
  }

  if (!cookies.techLead || !cookies.supportMember || !cookies.supportLead || !cookies.qa || !cookies.developer) {
    console.log("\n  CRITICAL: One or more required users failed to authenticate.")
    console.log("  Ensure the seed has been applied: npm run db:seed (from apps/web/)")
    process.exit(1)
  }

  // --- Create test tickets (SUPPORT_MEMBER creates tickets per route guard) ---
  console.log("\n[Setup] Creating test tickets as SUPPORT_MEMBER...")

  const ticketA = await createTicket("Reorder Test Ticket A — Suite 1 SUPPORT_MEMBER")
  await sleep(200)
  const ticketB = await createTicket("Reorder Test Ticket B — Suite 1 QA")
  await sleep(200)
  const ticketC = await createTicket("Reorder Test Ticket C — Suite 1 TECH_LEAD")

  ticketIds = [ticketA, ticketB, ticketC]
  console.log(`  Ticket A: ${ticketA ?? "FAILED"}`)
  console.log(`  Ticket B: ${ticketB ?? "FAILED"}`)
  console.log(`  Ticket C: ${ticketC ?? "FAILED"}`)

  if (!ticketA || !ticketB || !ticketC) {
    console.log("\n  WARNING: One or more test tickets could not be created.")
    console.log("  Some tests will be skipped. Check server logs if this is unexpected.")
  }

  // --- Run all suites ---
  await suitePost()
  await suiteGet()
  await suitePatch()

  // --- Summary ---
  const { failCount } = summary()
  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Test runner error:", err)
  process.exit(1)
})
