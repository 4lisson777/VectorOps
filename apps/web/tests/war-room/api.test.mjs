/**
 * War Room — API Integration Tests
 *
 * Covers:
 *  Suite 1: GET /api/war-room — initial state (2 tests)
 *    1. Authenticated user receives 200 with correct response shape
 *    2. Unauthenticated request returns 401/307
 *
 *  Suite 2: POST /api/war-room — start (5 tests)
 *    3. TECH_LEAD starts with title "Emergency War Room" → 200 with war room data
 *    4. TECH_LEAD starts with title and message → 200, message is included
 *    5. DEVELOPER starting → 403
 *    6. SUPPORT_MEMBER starting → 403
 *    7. Empty title → 400
 *
 *  Suite 3: GET /api/war-room after activation (1 test)
 *    8. GET after POST returns active war room with correct title
 *
 *  Suite 4: DELETE /api/war-room — end (4 tests)
 *    9.  TECH_LEAD ends → 200
 *    10. After DELETE, GET returns null/inactive war room
 *    11. DEVELOPER ending → 403
 *    12. QA ending → 403
 *
 *  Suite 5: Cleanup (1 test)
 *    13. War room is ended as TECH_LEAD at the end of tests
 *
 * Usage:
 *   node apps/web/tests/war-room/api.test.mjs
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - Seed applied: npx prisma db seed (from apps/web/)
 *
 * Note: War room state is held in-memory (not the database).
 *       Tests run sequentially so state carries across suites.
 */

import {
  createTestRunner,
  loginAs,
  getJson,
  postJson,
  deleteJson,
} from "../_shared/test-harness.mjs"

const { assert, summary } = createTestRunner()

// ─── Suite 1: GET /api/war-room — initial state ──────────────────────────────

async function testGetInitialState(techLeadCookie) {
  console.log("\n[Suite 1] GET /api/war-room — initial state")

  // 1. Authenticated user receives 200 with correct response shape
  const { status, body } = await getJson("/api/war-room", techLeadCookie)
  assert(
    status === 200,
    "Authenticated GET /api/war-room returns 200",
    `Expected 200, got ${status}`
  )
  assert(
    Object.prototype.hasOwnProperty.call(body ?? {}, "warRoom"),
    "GET response body has warRoom key",
    `Response body missing warRoom key: ${JSON.stringify(body)}`
  )

  // 2. Unauthenticated request returns 401/307
  const res = await fetch("http://localhost:3000/api/war-room", { redirect: "manual" })
  assert(
    res.status === 401 || res.status === 302 || res.status === 307,
    "Unauthenticated GET /api/war-room returns 401/307 redirect",
    `Expected 401 or 307, got ${res.status}`
  )
}

// ─── Suite 2: POST /api/war-room — start ────────────────────────────────────

async function testPostStart(techLeadCookie, developerCookie, supportCookie) {
  console.log("\n[Suite 2] POST /api/war-room — start")

  // 3. TECH_LEAD starts with title → 200 with war room data
  const { status: startStatus, body: startBody } = await postJson(
    "/api/war-room",
    { title: "Emergency War Room" },
    techLeadCookie
  )
  assert(
    startStatus === 200,
    "TECH_LEAD can POST /api/war-room with title → 200",
    `Expected 200, got ${startStatus}: ${JSON.stringify(startBody)}`
  )
  assert(
    startBody?.warRoom?.title === "Emergency War Room",
    "POST response warRoom.title matches sent title",
    `Expected 'Emergency War Room', got ${startBody?.warRoom?.title}`
  )
  assert(
    startBody?.warRoom?.startedAt != null,
    "POST response warRoom.startedAt is present",
    `startedAt is missing: ${JSON.stringify(startBody?.warRoom)}`
  )
  assert(
    startBody?.warRoom?.startedById != null,
    "POST response warRoom.startedById is present",
    `startedById is missing: ${JSON.stringify(startBody?.warRoom)}`
  )

  // End the war room before the next sub-test to start fresh
  await deleteJson("/api/war-room", techLeadCookie)

  // 4. TECH_LEAD starts with title and message → 200, message is included
  const { status: withMsgStatus, body: withMsgBody } = await postJson(
    "/api/war-room",
    { title: "War Room With Message", message: "All hands on deck" },
    techLeadCookie
  )
  assert(
    withMsgStatus === 200,
    "TECH_LEAD can POST /api/war-room with title and message → 200",
    `Expected 200, got ${withMsgStatus}: ${JSON.stringify(withMsgBody)}`
  )
  assert(
    withMsgBody?.warRoom?.message === "All hands on deck",
    "POST response warRoom.message matches sent message",
    `Expected 'All hands on deck', got ${withMsgBody?.warRoom?.message}`
  )

  // End again before testing forbidden roles (clean state not required for 403 tests,
  // but keeps in-memory state predictable)
  await deleteJson("/api/war-room", techLeadCookie)

  // 5. DEVELOPER starting → 403
  const { status: devStatus } = await postJson(
    "/api/war-room",
    { title: "Dev War Room Attempt" },
    developerCookie
  )
  assert(
    devStatus === 403,
    "DEVELOPER cannot POST /api/war-room → 403",
    `Expected 403, got ${devStatus}`
  )

  // 6. SUPPORT_MEMBER starting → 403
  const { status: supportStatus } = await postJson(
    "/api/war-room",
    { title: "Support War Room Attempt" },
    supportCookie
  )
  assert(
    supportStatus === 403,
    "SUPPORT_MEMBER cannot POST /api/war-room → 403",
    `Expected 403, got ${supportStatus}`
  )

  // 7. Empty title → 400
  const { status: emptyTitleStatus, body: emptyTitleBody } = await postJson(
    "/api/war-room",
    { title: "" },
    techLeadCookie
  )
  assert(
    emptyTitleStatus === 400,
    "POST /api/war-room with empty title returns 400",
    `Expected 400, got ${emptyTitleStatus}: ${JSON.stringify(emptyTitleBody)}`
  )
}

// ─── Suite 3: GET /api/war-room after activation ────────────────────────────

async function testGetAfterActivation(techLeadCookie) {
  console.log("\n[Suite 3] GET /api/war-room — after activation")

  // Start a fresh war room for this suite
  await postJson("/api/war-room", { title: "Active War Room" }, techLeadCookie)

  // 8. GET returns active war room with correct title
  const { status, body } = await getJson("/api/war-room", techLeadCookie)
  assert(
    status === 200,
    "GET /api/war-room returns 200 after war room is started",
    `Expected 200, got ${status}`
  )
  assert(
    body?.warRoom?.title === "Active War Room",
    "GET response reflects active war room title",
    `Expected 'Active War Room', got ${body?.warRoom?.title}`
  )
}

// ─── Suite 4: DELETE /api/war-room — end ────────────────────────────────────

async function testDelete(techLeadCookie, developerCookie, qaCookie) {
  console.log("\n[Suite 4] DELETE /api/war-room — end")

  // Ensure a war room is active before testing deletion
  await postJson("/api/war-room", { title: "War Room To End" }, techLeadCookie)

  // 9. TECH_LEAD ends → 200
  const { status: deleteStatus, body: deleteBody } = await deleteJson(
    "/api/war-room",
    techLeadCookie
  )
  assert(
    deleteStatus === 200,
    "TECH_LEAD can DELETE /api/war-room → 200",
    `Expected 200, got ${deleteStatus}: ${JSON.stringify(deleteBody)}`
  )
  assert(
    deleteBody?.success === true,
    "DELETE response has success: true",
    `Expected success=true, got: ${JSON.stringify(deleteBody)}`
  )

  // 10. After DELETE, GET returns null/inactive war room
  const { status: getStatus, body: getBody } = await getJson("/api/war-room", techLeadCookie)
  assert(
    getStatus === 200,
    "GET /api/war-room returns 200 after DELETE",
    `Expected 200, got ${getStatus}`
  )
  assert(
    getBody?.warRoom === null,
    "GET response shows warRoom as null after DELETE",
    `Expected warRoom=null, got: ${JSON.stringify(getBody?.warRoom)}`
  )

  // 11. DEVELOPER ending → 403
  // Start war room again so there is something to attempt to delete
  await postJson("/api/war-room", { title: "Persistent War Room" }, techLeadCookie)

  const { status: devDeleteStatus } = await deleteJson("/api/war-room", developerCookie)
  assert(
    devDeleteStatus === 403,
    "DEVELOPER cannot DELETE /api/war-room → 403",
    `Expected 403, got ${devDeleteStatus}`
  )

  // 12. QA ending → 403
  const { status: qaDeleteStatus } = await deleteJson("/api/war-room", qaCookie)
  assert(
    qaDeleteStatus === 403,
    "QA cannot DELETE /api/war-room → 403",
    `Expected 403, got ${qaDeleteStatus}`
  )
}

// ─── Suite 5: Cleanup ────────────────────────────────────────────────────────

async function testCleanup(techLeadCookie) {
  console.log("\n[Suite 5] Cleanup — ensure war room is ended")

  // 13. End war room as TECH_LEAD; ignore errors if already inactive
  const { status } = await deleteJson("/api/war-room", techLeadCookie)
  assert(
    status === 200 || status === 404,
    "Cleanup: DELETE /api/war-room as TECH_LEAD succeeds (200) or was already inactive (404)",
    `Unexpected status during cleanup: ${status}`
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60))
  console.log("  War Room — API Integration Tests")
  console.log("=".repeat(60))

  // Login required roles
  console.log("\n[Setup] Authenticating test users...")
  const { cookie: techLeadCookie } = await loginAs("TECH_LEAD")
  const { cookie: developerCookie } = await loginAs("DEVELOPER")
  const { cookie: supportCookie } = await loginAs("SUPPORT_MEMBER")
  const { cookie: qaCookie } = await loginAs("QA")

  console.log(`  TECH_LEAD:      ${techLeadCookie ? "OK" : "FAILED"}`)
  console.log(`  DEVELOPER:      ${developerCookie ? "OK" : "FAILED"}`)
  console.log(`  SUPPORT_MEMBER: ${supportCookie ? "OK" : "FAILED"}`)
  console.log(`  QA:             ${qaCookie ? "OK" : "FAILED"}`)

  if (!techLeadCookie) {
    console.error("\nFATAL: Could not log in as TECH_LEAD. Is the dev server running?")
    process.exit(1)
  }

  // Ensure war room is in a clean (inactive) state before running tests
  console.log("\n[Setup] Resetting war room state...")
  await deleteJson("/api/war-room", techLeadCookie).catch(() => {})

  // Run suites
  await testGetInitialState(techLeadCookie)
  await testPostStart(techLeadCookie, developerCookie, supportCookie)
  await testGetAfterActivation(techLeadCookie)
  await testDelete(techLeadCookie, developerCookie, qaCookie)
  await testCleanup(techLeadCookie)

  // Print summary
  const { failCount } = summary()
  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Unexpected test runner error:", err)
  process.exit(1)
})
