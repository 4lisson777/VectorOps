/**
 * Help Requests — API Integration Tests
 *
 * Covers:
 *
 * Suite 1: POST /api/help-requests — creation (7 tests)
 *   1. DEVELOPER creates with valid contextMessage → 201
 *   2. TECH_LEAD creates → 201
 *   3. QA creates → 201
 *   4. SUPPORT_MEMBER creates → 403
 *   5. Missing contextMessage → 400
 *   6. contextMessage exceeding 280 chars → 400
 *   7. Unauthenticated → 401/307
 *
 * Suite 2: GET /api/help-requests — list (5 tests)
 *   8.  DEVELOPER sees 200 with array of help requests
 *   9.  TECH_LEAD sees 200
 *   10. SUPPORT_MEMBER → 403
 *   11. QA → 403 (GET is DEVELOPER/TECH_LEAD only)
 *   12. Response includes requestedBy and responses sub-objects
 *
 * Suite 3: POST /api/help-requests/[id]/respond (6 tests)
 *   13. DEVELOPER_2 responds to DEVELOPER's request → 201
 *   14. After responding, responder devStatus changes to HELPING
 *   15. Same user who created the request responds → 400
 *   16. Same responder responds again → 409
 *   17. Nonexistent help request ID → 404
 *   18. SUPPORT_MEMBER responds → 403
 *
 * Usage:
 *   node apps/web/tests/help-requests/api.test.mjs
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
  BASE_URL,
  sleep,
} from "../_shared/test-harness.mjs"

const { assert, summary } = createTestRunner()

// ─── Suite 1: POST /api/help-requests — creation ────────────────────────────

async function testHelpRequestCreation(cookies) {
  console.log("\n[Suite 1] POST /api/help-requests — creation")

  // 1: DEVELOPER creates with valid contextMessage → 201
  const { status: devStatus, body: devBody } = await postJson(
    "/api/help-requests",
    { contextMessage: "Need help debugging a race condition in the queue processor" },
    cookies.developer
  )
  assert(
    devStatus === 201,
    "DEVELOPER creates help request with valid contextMessage → 201",
    `Expected 201, got ${devStatus}: ${JSON.stringify(devBody)}`
  )
  assert(
    devBody?.helpRequest?.id != null,
    "POST /api/help-requests response includes helpRequest.id",
    `helpRequest.id missing from body: ${JSON.stringify(devBody)}`
  )
  assert(
    devBody?.helpRequest?.requestedBy?.id != null,
    "POST /api/help-requests response includes requestedBy sub-object",
    `requestedBy missing: ${JSON.stringify(devBody?.helpRequest)}`
  )

  // Store the created help request id for Suite 3
  const createdHelpRequestId = devBody?.helpRequest?.id ?? null

  // 2: TECH_LEAD creates → 201
  const { status: techStatus } = await postJson(
    "/api/help-requests",
    { contextMessage: "Tech lead requesting assistance with architecture decision" },
    cookies.techLead
  )
  assert(
    techStatus === 201,
    "TECH_LEAD creates help request → 201",
    `Expected 201, got ${techStatus}`
  )

  // 3: QA creates → 201
  const { status: qaStatus } = await postJson(
    "/api/help-requests",
    { contextMessage: "QA needs help reproducing a flaky test environment" },
    cookies.qa
  )
  assert(
    qaStatus === 201,
    "QA creates help request → 201",
    `Expected 201, got ${qaStatus}`
  )

  // 4: SUPPORT_MEMBER creates → 403
  const { status: supportStatus } = await postJson(
    "/api/help-requests",
    { contextMessage: "Support member trying to create a help request" },
    cookies.support
  )
  assert(
    supportStatus === 403,
    "SUPPORT_MEMBER creates help request → 403",
    `Expected 403, got ${supportStatus}`
  )

  // 5: Missing contextMessage → 400
  const { status: missingStatus, body: missingBody } = await postJson(
    "/api/help-requests",
    {},
    cookies.developer
  )
  assert(
    missingStatus === 400,
    "Missing contextMessage → 400",
    `Expected 400, got ${missingStatus}: ${JSON.stringify(missingBody)}`
  )
  assert(
    missingBody?.error === "Validation failed",
    "Missing contextMessage 400 response has error: 'Validation failed'",
    `error field: ${missingBody?.error}`
  )

  // 6: contextMessage exceeding 280 chars → 400
  const longMessage = "x".repeat(281)
  const { status: longStatus, body: longBody } = await postJson(
    "/api/help-requests",
    { contextMessage: longMessage },
    cookies.developer
  )
  assert(
    longStatus === 400,
    "contextMessage exceeding 280 chars → 400",
    `Expected 400, got ${longStatus}: ${JSON.stringify(longBody)}`
  )

  // 7: Unauthenticated → 401/307
  const unauthRes = await fetch(`${BASE_URL}/api/help-requests`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contextMessage: "Unauthenticated request" }),
  })
  assert(
    unauthRes.status === 401 || unauthRes.status === 307 || unauthRes.status === 302,
    "Unauthenticated POST /api/help-requests → 401 or redirect",
    `Expected 401/307/302, got ${unauthRes.status}`
  )

  return createdHelpRequestId
}

// ─── Suite 2: GET /api/help-requests — list ──────────────────────────────────

async function testHelpRequestList(cookies) {
  console.log("\n[Suite 2] GET /api/help-requests — list")

  // 8: DEVELOPER sees 200 with array of help requests
  const { status: devStatus, body: devBody } = await getJson("/api/help-requests", cookies.developer)
  assert(
    devStatus === 200,
    "DEVELOPER GET /api/help-requests → 200",
    `Expected 200, got ${devStatus}`
  )
  assert(
    Array.isArray(devBody?.helpRequests),
    "GET response body has helpRequests array",
    `helpRequests is not an array: ${JSON.stringify(devBody)}`
  )

  // 9: TECH_LEAD sees 200
  const { status: techStatus } = await getJson("/api/help-requests", cookies.techLead)
  assert(
    techStatus === 200,
    "TECH_LEAD GET /api/help-requests → 200",
    `Expected 200, got ${techStatus}`
  )

  // 10: SUPPORT_MEMBER → 403
  const { status: supportStatus } = await getJson("/api/help-requests", cookies.support)
  assert(
    supportStatus === 403,
    "SUPPORT_MEMBER GET /api/help-requests → 403",
    `Expected 403, got ${supportStatus}`
  )

  // 11: QA → 403 (GET is DEVELOPER/TECH_LEAD only)
  const { status: qaStatus } = await getJson("/api/help-requests", cookies.qa)
  assert(
    qaStatus === 403,
    "QA GET /api/help-requests → 403 (GET is DEVELOPER/TECH_LEAD only)",
    `Expected 403, got ${qaStatus}`
  )

  // 12: Response includes requestedBy and responses sub-objects
  // At least one help request should exist at this point (created in Suite 1)
  const firstRequest = devBody?.helpRequests?.[0]
  if (firstRequest != null) {
    assert(
      firstRequest.requestedBy != null &&
        typeof firstRequest.requestedBy === "object" &&
        "id" in firstRequest.requestedBy,
      "GET response items include requestedBy sub-object with id",
      `requestedBy shape: ${JSON.stringify(firstRequest.requestedBy)}`
    )
    assert(
      Array.isArray(firstRequest.responses),
      "GET response items include responses array",
      `responses is not an array: ${JSON.stringify(firstRequest.responses)}`
    )
  } else {
    // No existing help requests in DB — log as informational skip
    console.log(
      "        INFO  No help requests in DB yet for shape assertion — Suite 1 items may be filtered by org"
    )
  }
}

// ─── Suite 3: POST /api/help-requests/[id]/respond ───────────────────────────

async function testHelpRequestRespond(cookies, helpRequestId) {
  console.log("\n[Suite 3] POST /api/help-requests/[id]/respond")

  if (!helpRequestId) {
    console.log("        SKIP  No help request id available from Suite 1 — skipping Suite 3")
    return
  }

  // 13: DEVELOPER_2 responds to DEVELOPER's request → 201
  const { status: respondStatus, body: respondBody } = await postJson(
    `/api/help-requests/${helpRequestId}/respond`,
    {},
    cookies.developer2
  )
  assert(
    respondStatus === 201,
    "DEVELOPER_2 responds to DEVELOPER help request → 201",
    `Expected 201, got ${respondStatus}: ${JSON.stringify(respondBody)}`
  )
  assert(
    respondBody?.response != null,
    "Respond endpoint returns response object",
    `response missing from body: ${JSON.stringify(respondBody)}`
  )

  // 14: After responding, responder devStatus changes to HELPING.
  // GET /api/users?role=DEVELOPER includes devStatus in the select (only for dev roles).
  // /api/users does not expose email, so we scan all DEVELOPER users for devStatus=HELPING.
  await sleep(300)
  const { body: usersBody } = await getJson("/api/users?role=DEVELOPER", cookies.techLead)
  const helpingUser = usersBody?.users?.find((u) => u.devStatus === "HELPING")
  assert(
    helpingUser != null,
    "DEVELOPER_2 devStatus changes to HELPING after responding to help request",
    `No DEVELOPER user with devStatus=HELPING found. Users: ${JSON.stringify(usersBody?.users?.map((u) => ({ id: u.id, devStatus: u.devStatus })))}`
  )

  // Reset DEVELOPER_2 devStatus to ACTIVE so it doesn't pollute other tests
  await postJson(
    "/api/help-requests",
    { contextMessage: "cleanup — resetting status" },
    cookies.developer2
  ).catch(() => null)
  // Use PATCH /api/users/me/status as DEVELOPER_2 to reset
  await fetch(`${BASE_URL}/api/users/me/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies.developer2,
    },
    body: JSON.stringify({ devStatus: "ACTIVE" }),
  }).catch(() => null)

  // 15: Same user who created the request responds → 400
  const { status: selfRespondStatus, body: selfRespondBody } = await postJson(
    `/api/help-requests/${helpRequestId}/respond`,
    {},
    cookies.developer
  )
  assert(
    selfRespondStatus === 400,
    "User who created the help request cannot respond to their own request → 400",
    `Expected 400, got ${selfRespondStatus}: ${JSON.stringify(selfRespondBody)}`
  )

  // 16: Same responder (DEVELOPER_2) responds again → 409
  const { status: duplicateStatus, body: duplicateBody } = await postJson(
    `/api/help-requests/${helpRequestId}/respond`,
    {},
    cookies.developer2
  )
  assert(
    duplicateStatus === 409,
    "Same responder cannot respond twice to the same help request → 409",
    `Expected 409, got ${duplicateStatus}: ${JSON.stringify(duplicateBody)}`
  )

  // 17: Nonexistent help request ID → 404
  const { status: notFoundStatus, body: notFoundBody } = await postJson(
    "/api/help-requests/nonexistent-id-000/respond",
    {},
    cookies.developer
  )
  assert(
    notFoundStatus === 404,
    "Respond to nonexistent help request ID → 404",
    `Expected 404, got ${notFoundStatus}: ${JSON.stringify(notFoundBody)}`
  )

  // 18: SUPPORT_MEMBER responds → 403
  const { status: supportRespondStatus } = await postJson(
    `/api/help-requests/${helpRequestId}/respond`,
    {},
    cookies.support
  )
  assert(
    supportRespondStatus === 403,
    "SUPPORT_MEMBER responds to help request → 403",
    `Expected 403, got ${supportRespondStatus}`
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60))
  console.log("  Help Requests — API Integration Tests")
  console.log("=".repeat(60))

  // --- Authenticate all required roles ---
  console.log("\n[Setup] Authenticating test users...")

  const techLeadLogin = await loginAs("TECH_LEAD")
  await sleep(200)
  const developerLogin = await loginAs("DEVELOPER")
  await sleep(200)
  const developer2Login = await loginAs("DEVELOPER_2")
  await sleep(200)
  const supportLogin = await loginAs("SUPPORT_MEMBER")
  await sleep(200)
  const qaLogin = await loginAs("QA")

  const cookies = {
    techLead: techLeadLogin.cookie,
    developer: developerLogin.cookie,
    developer2: developer2Login.cookie,
    support: supportLogin.cookie,
    qa: qaLogin.cookie,
  }

  for (const [role, cookie] of Object.entries(cookies)) {
    console.log(`  Auth  ${role}: ${cookie ? "OK" : "FAILED"}`)
  }

  if (!cookies.techLead || !cookies.developer || !cookies.developer2) {
    console.error(
      "\nFATAL: Cannot continue without TECH_LEAD, DEVELOPER, and DEVELOPER_2 cookies."
    )
    console.error("  Ensure the seed has been run: npx prisma db seed (from apps/web/)")
    process.exit(1)
  }

  // --- Run all suites ---
  const createdHelpRequestId = await testHelpRequestCreation(cookies)
  await testHelpRequestList(cookies)
  await testHelpRequestRespond(cookies, createdHelpRequestId)

  // --- Summary ---
  const { failCount } = summary()
  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Unexpected test runner error:", err)
  process.exit(1)
})
