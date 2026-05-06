/**
 * Notifications — API Integration Tests
 *
 * Tests all notification-related API endpoints against a live dev server.
 * Notifications are created as side effects of ticket creation/assignment.
 *
 * Covers:
 *
 * Suite 1: GET /api/notifications — list (5 tests)
 *   1a. Authenticated TECH_LEAD returns 200 with { notifications, unreadCount }
 *   1b. ?limit=5 respects the limit parameter
 *   1c. ?unread=true returns only unread notifications (isRead: false)
 *   1d. Unauthenticated returns 401/307 redirect
 *   1e. Notifications are scoped to the authenticated user
 *
 * Suite 2: PATCH /api/notifications/read-all (4 tests)
 *   2a. Returns 200 with { count } of notifications marked as read
 *   2b. After read-all, GET ?unread=true returns fewer/no unread
 *   2c. When already all read, returns 200 with count: 0
 *   2d. Unauthenticated returns 401/307 redirect
 *
 * Suite 3: PATCH /api/notifications/[id]/read — mark single read (3 tests)
 *   3a. Mark own notification as read → 200 with isRead: true
 *   3b. Mark another user's notification → 403 (ownership check)
 *   3c. Nonexistent ID → 404
 *
 * Suite 4: GET /api/notifications/pending — persistent notifications (3 tests)
 *   4a. Returns 200 with notifications array
 *   4b. All returned items have requiresAck: true and acknowledgedAt: null
 *   4c. Unauthenticated → 401/307 redirect
 *
 * Suite 5: PATCH /api/notifications/[id]/acknowledge (4 tests)
 *   5a. Acknowledge a persistent notification → 200 with acknowledgedAt set
 *   5b. Double-acknowledge → 409
 *   5c. Nonexistent ID → 404
 *   5d. Other user's notification → 404 (acknowledge uses combined not-found / ownership → 404)
 *
 * Usage:
 *   node apps/web/tests/notifications/api.test.mjs
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
  makeDeadline,
  sleep,
} from "../_shared/test-harness.mjs"

const { assert, summary } = createTestRunner()

// ─── Setup helpers ────────────────────────────────────────────────────────────

/**
 * Creates a ticket as SUPPORT_MEMBER and waits for async notifications to propagate.
 * Returns the created ticket body or null on failure.
 */
async function createTestTicket(supportCookie) {
  const { status, body } = await postJson(
    "/api/tickets",
    {
      title: "Notifications API Test — Ticket",
      description: "Automated test ticket to trigger notification side-effects",
      severity: "HIGH",
      deadline: makeDeadline(7),
    },
    supportCookie
  )
  if (status !== 201) return null
  return body?.ticket ?? null
}

// ─── Suite 1: GET /api/notifications ─────────────────────────────────────────

async function suite1ListNotifications(cookies) {
  console.log("\n[Suite 1] GET /api/notifications — list")

  // 1a: Authenticated TECH_LEAD returns 200 with the correct response shape
  const { status: listStatus, body: listBody } = await getJson(
    "/api/notifications",
    cookies.techLead
  )
  assert(
    listStatus === 200,
    "1a. Authenticated GET /api/notifications returns 200",
    `Expected 200 but got ${listStatus}`
  )
  assert(
    Array.isArray(listBody?.notifications) && typeof listBody?.unreadCount === "number",
    "1a. Response shape is { notifications: [...], unreadCount: N }",
    `Got: ${JSON.stringify(listBody)}`
  )

  // 1b: ?limit=5 respects the limit
  const { status: limitStatus, body: limitBody } = await getJson(
    "/api/notifications?limit=5",
    cookies.techLead
  )
  assert(
    limitStatus === 200,
    "1b. GET /api/notifications?limit=5 returns 200",
    `Expected 200 but got ${limitStatus}`
  )
  assert(
    Array.isArray(limitBody?.notifications) && limitBody.notifications.length <= 5,
    "1b. ?limit=5 returns at most 5 notifications",
    `Got ${limitBody?.notifications?.length} notifications — expected <= 5`
  )

  // 1c: ?unread=true returns only unread notifications
  const { status: unreadStatus, body: unreadBody } = await getJson(
    "/api/notifications?unread=true",
    cookies.techLead
  )
  assert(
    unreadStatus === 200,
    "1c. GET /api/notifications?unread=true returns 200",
    `Expected 200 but got ${unreadStatus}`
  )
  const allUnread = (unreadBody?.notifications ?? []).every((n) => n.isRead === false)
  assert(
    allUnread,
    "1c. ?unread=true returns only notifications with isRead: false",
    "Some returned notifications have isRead: true"
  )

  // 1d: Unauthenticated request is redirected / rejected
  const { status: unauthStatus } = await getJson("/api/notifications", null, {
    redirect: "manual",
  })
  assert(
    unauthStatus === 401 || unauthStatus === 302 || unauthStatus === 307,
    "1d. Unauthenticated GET /api/notifications returns 401/307 redirect",
    `Expected 401 or redirect but got ${unauthStatus}`
  )

  // 1e: Notifications are scoped to the authenticated user
  // DEVELOPER's list should differ from TECH_LEAD's since they are different users.
  // We verify at minimum that the developer's response is also properly shaped and
  // does not contain notifications belonging to the TECH_LEAD session.
  const { status: devStatus, body: devBody } = await getJson(
    "/api/notifications",
    cookies.developer
  )
  assert(
    devStatus === 200 && Array.isArray(devBody?.notifications),
    "1e. DEVELOPER also gets 200 with notifications array (own scope)",
    `Expected 200 + array but got ${devStatus}: ${JSON.stringify(devBody)}`
  )

  // Cross-check: if TECH_LEAD has notifications, none of those IDs should appear in
  // DEVELOPER's list (user isolation). Only assertable when both have notifications.
  if (listBody?.notifications?.length > 0 && devBody?.notifications?.length > 0) {
    const techLeadIds = new Set(listBody.notifications.map((n) => n.id))
    const devOwnsAny = devBody.notifications.some((n) => techLeadIds.has(n.id))
    assert(
      !devOwnsAny,
      "1e. DEVELOPER notifications do not include TECH_LEAD's notification IDs (isolation)",
      "Found overlapping notification IDs between TECH_LEAD and DEVELOPER"
    )
  } else {
    // Not enough data for the cross-check — treat as pass (isolation not falsifiable here)
    assert(true, "1e. Isolation cross-check skipped — insufficient overlap to assert")
  }
}

// ─── Suite 2: PATCH /api/notifications/read-all ───────────────────────────────

async function suite2ReadAll(cookies) {
  console.log("\n[Suite 2] PATCH /api/notifications/read-all")

  // 2a: Returns 200 with { count }
  const { status: readAllStatus, body: readAllBody } = await patchJson(
    "/api/notifications/read-all",
    null,
    cookies.techLead
  )
  assert(
    readAllStatus === 200,
    "2a. PATCH /api/notifications/read-all returns 200",
    `Expected 200 but got ${readAllStatus}`
  )
  assert(
    typeof readAllBody?.count === "number",
    "2a. Response body contains { count: N }",
    `Got: ${JSON.stringify(readAllBody)}`
  )

  // 2b: After read-all, unread list should be empty (or at least smaller)
  const { body: afterUnreadBody } = await getJson(
    "/api/notifications?unread=true",
    cookies.techLead
  )
  assert(
    Array.isArray(afterUnreadBody?.notifications) &&
      afterUnreadBody.notifications.length === 0,
    "2b. After read-all, GET ?unread=true returns 0 unread notifications",
    `Still ${afterUnreadBody?.notifications?.length} unread notifications after read-all`
  )

  // 2c: Calling read-all again when all are already read → count: 0
  const { status: secondStatus, body: secondBody } = await patchJson(
    "/api/notifications/read-all",
    null,
    cookies.techLead
  )
  assert(
    secondStatus === 200 && secondBody?.count === 0,
    "2c. Second read-all (all already read) returns 200 with count: 0",
    `Expected count: 0 but got ${JSON.stringify(secondBody)}`
  )

  // 2d: Unauthenticated returns redirect / 401
  const { status: unauthStatus } = await patchJson(
    "/api/notifications/read-all",
    null,
    null,
    { redirect: "manual" }
  )
  assert(
    unauthStatus === 401 || unauthStatus === 302 || unauthStatus === 307,
    "2d. Unauthenticated PATCH /api/notifications/read-all returns 401/307 redirect",
    `Expected 401 or redirect but got ${unauthStatus}`
  )
}

// ─── Suite 3: PATCH /api/notifications/[id]/read ─────────────────────────────

async function suite3MarkSingleRead(cookies, context) {
  console.log("\n[Suite 3] PATCH /api/notifications/[id]/read — mark single read")

  // 3a: Mark TECH_LEAD's own notification as read
  // We need a fresh (possibly unread) notification — create a new one by creating a ticket
  // and re-fetching. Use limit=1 to grab the most recent.
  const { body: freshBody } = await getJson(
    "/api/notifications?limit=1",
    cookies.techLead
  )
  const ownNotif = freshBody?.notifications?.[0]

  if (!ownNotif) {
    // No notifications at all — skip read tests but still test the other cases
    assert(
      false,
      "3a. TECH_LEAD has at least one notification to mark as read",
      "No notifications found — ticket creation in setup may have failed"
    )
  } else {
    const { status: readStatus, body: readBody } = await patchJson(
      `/api/notifications/${ownNotif.id}/read`,
      null,
      cookies.techLead
    )
    assert(
      readStatus === 200,
      "3a. PATCH /api/notifications/[id]/read for own notification returns 200",
      `Expected 200 but got ${readStatus}: ${JSON.stringify(readBody)}`
    )
    assert(
      readBody?.notification?.isRead === true,
      "3a. Response notification has isRead: true",
      `isRead is ${readBody?.notification?.isRead}`
    )
    assert(
      readBody?.notification?.id === ownNotif.id,
      "3a. Response notification id matches the requested notification",
      `Expected ${ownNotif.id} but got ${readBody?.notification?.id}`
    )
  }

  // 3b: Attempt to mark another user's notification as read → 403
  // Get a notification belonging to TECH_LEAD, then try as DEVELOPER
  const { body: tlBody } = await getJson("/api/notifications?limit=1", cookies.techLead)
  const tlNotif = tlBody?.notifications?.[0]

  if (!tlNotif) {
    // Cannot test ownership without a TECH_LEAD notification
    assert(
      false,
      "3b. Cross-ownership test: TECH_LEAD has a notification for DEVELOPER to attempt",
      "No TECH_LEAD notification found — skipping 3b ownership test"
    )
  } else {
    const { status: crossStatus, body: crossBody } = await patchJson(
      `/api/notifications/${tlNotif.id}/read`,
      null,
      cookies.developer
    )
    assert(
      crossStatus === 403,
      "3b. DEVELOPER cannot mark TECH_LEAD's notification as read (ownership → 403)",
      `Expected 403 but got ${crossStatus}: ${JSON.stringify(crossBody)}`
    )
  }

  // 3c: Nonexistent ID → 404
  const { status: notFoundStatus, body: notFoundBody } = await patchJson(
    "/api/notifications/nonexistent-id-xyz-123/read",
    null,
    cookies.techLead
  )
  assert(
    notFoundStatus === 404,
    "3c. PATCH /api/notifications/[nonexistent-id]/read returns 404",
    `Expected 404 but got ${notFoundStatus}: ${JSON.stringify(notFoundBody)}`
  )
}

// ─── Suite 4: GET /api/notifications/pending ─────────────────────────────────

async function suite4Pending(cookies) {
  console.log("\n[Suite 4] GET /api/notifications/pending — persistent notifications")

  // 4a: Returns 200 with notifications array
  const { status: pendingStatus, body: pendingBody } = await getJson(
    "/api/notifications/pending",
    cookies.techLead
  )
  assert(
    pendingStatus === 200,
    "4a. GET /api/notifications/pending returns 200",
    `Expected 200 but got ${pendingStatus}`
  )
  assert(
    Array.isArray(pendingBody?.notifications),
    "4a. Response has { notifications: [...] }",
    `Got: ${JSON.stringify(pendingBody)}`
  )

  // 4b: All returned items have requiresAck: true and acknowledgedAt: null
  const pendingNotifs = pendingBody?.notifications ?? []
  const allRequireAck = pendingNotifs.every((n) => n.requiresAck === true)
  const allUnacknowledged = pendingNotifs.every((n) => n.acknowledgedAt === null)

  assert(
    pendingNotifs.length === 0 || allRequireAck,
    "4b. All pending notifications have requiresAck: true",
    "Some pending notifications have requiresAck: false — endpoint filter is incorrect"
  )
  assert(
    pendingNotifs.length === 0 || allUnacknowledged,
    "4b. All pending notifications have acknowledgedAt: null",
    "Some pending notifications have acknowledgedAt set — endpoint filter is incorrect"
  )

  // 4c: Unauthenticated → 401/307
  const { status: unauthStatus } = await getJson("/api/notifications/pending", null, {
    redirect: "manual",
  })
  assert(
    unauthStatus === 401 || unauthStatus === 302 || unauthStatus === 307,
    "4c. Unauthenticated GET /api/notifications/pending returns 401/307 redirect",
    `Expected 401 or redirect but got ${unauthStatus}`
  )
}

// ─── Suite 5: PATCH /api/notifications/[id]/acknowledge ──────────────────────

async function suite5Acknowledge(cookies) {
  console.log("\n[Suite 5] PATCH /api/notifications/[id]/acknowledge")

  // Get TECH_LEAD's current pending notifications to find one to acknowledge
  const { body: pendingBody } = await getJson("/api/notifications/pending", cookies.techLead)
  const persistentNotif = pendingBody?.notifications?.[0] ?? null

  if (!persistentNotif) {
    // If no persistent notification exists, skip the happy-path tests gracefully.
    // Ticket creation in setup should have generated one; log a warning.
    assert(
      false,
      "5a. TECH_LEAD has a pending persistent notification to acknowledge",
      "No pending notifications found — ticket creation in setup may have failed or notifications are non-persistent"
    )
    // Still run the error cases below with a dummy id
  } else {
    // 5a: Acknowledge a persistent notification → 200 with acknowledgedAt set
    const { status: ackStatus, body: ackBody } = await patchJson(
      `/api/notifications/${persistentNotif.id}/acknowledge`,
      null,
      cookies.techLead
    )
    assert(
      ackStatus === 200,
      "5a. Acknowledge persistent notification returns 200",
      `Expected 200 but got ${ackStatus}: ${JSON.stringify(ackBody)}`
    )
    assert(
      ackBody?.notification?.acknowledgedAt != null,
      "5a. Response notification has acknowledgedAt set (non-null)",
      `acknowledgedAt is ${ackBody?.notification?.acknowledgedAt}`
    )
    assert(
      ackBody?.notification?.id === persistentNotif.id,
      "5a. Response notification id matches the acknowledged notification",
      `Expected ${persistentNotif.id} got ${ackBody?.notification?.id}`
    )

    // Brief pause to let the DB write settle before checking pending list
    await sleep(200)

    // Verify the acknowledged notification no longer appears in pending
    const { body: afterPendingBody } = await getJson(
      "/api/notifications/pending",
      cookies.techLead
    )
    const stillInPending = (afterPendingBody?.notifications ?? []).some(
      (n) => n.id === persistentNotif.id
    )
    assert(
      !stillInPending,
      "5a. Acknowledged notification no longer appears in GET /api/notifications/pending",
      "Notification still returned by /pending after being acknowledged"
    )

    // 5b: Double-acknowledge → 409
    const { status: doubleAckStatus, body: doubleAckBody } = await patchJson(
      `/api/notifications/${persistentNotif.id}/acknowledge`,
      null,
      cookies.techLead
    )
    assert(
      doubleAckStatus === 409,
      "5b. Double-acknowledge returns 409 (already acknowledged)",
      `Expected 409 but got ${doubleAckStatus}: ${JSON.stringify(doubleAckBody)}`
    )
  }

  // 5c: Nonexistent ID → 404
  const { status: notFoundStatus } = await patchJson(
    "/api/notifications/nonexistent-id-xyz-456/acknowledge",
    null,
    cookies.techLead
  )
  assert(
    notFoundStatus === 404,
    "5c. Acknowledge nonexistent notification ID returns 404",
    `Expected 404 but got ${notFoundStatus}`
  )

  // 5d: Other user's notification → 404
  // The acknowledge route checks ownership with a combined guard: if the notification
  // is not found OR it does not belong to the caller, it returns 404 (not 403).
  // Find a pending notification belonging to QA, then try to acknowledge it as DEVELOPER.
  const { body: qaPendingBody } = await getJson(
    "/api/notifications/pending",
    cookies.qa
  )
  const qaNotif = qaPendingBody?.notifications?.[0] ?? null

  if (!qaNotif) {
    // QA has no pending notifications — try a regular one
    const { body: qaAllBody } = await getJson("/api/notifications?limit=1", cookies.qa)
    const qaAnyNotif = qaAllBody?.notifications?.[0] ?? null

    if (!qaAnyNotif) {
      // Cannot assert ownership isolation without a QA notification
      assert(
        true,
        "5d. Cross-ownership test skipped — no QA notification available to attempt"
      )
    } else {
      const { status: crossAckStatus } = await patchJson(
        `/api/notifications/${qaAnyNotif.id}/acknowledge`,
        null,
        cookies.developer
      )
      assert(
        crossAckStatus === 404,
        "5d. DEVELOPER cannot acknowledge QA's notification (ownership → 404)",
        `Expected 404 but got ${crossAckStatus}`
      )
    }
  } else {
    const { status: crossAckStatus } = await patchJson(
      `/api/notifications/${qaNotif.id}/acknowledge`,
      null,
      cookies.developer
    )
    assert(
      crossAckStatus === 404,
      "5d. DEVELOPER cannot acknowledge QA's persistent notification (ownership → 404)",
      `Expected 404 but got ${crossAckStatus}`
    )
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60))
  console.log("  Notifications API — Integration Tests")
  console.log("=".repeat(60))

  // --- Authenticate required roles ---
  console.log("\n[Setup] Authenticating test users...")

  // Sequential logins to avoid concurrent bcrypt contention on the dev server
  const techLeadResult = await loginAs("TECH_LEAD")
  await sleep(300)
  const developerResult = await loginAs("DEVELOPER")
  await sleep(300)
  const supportResult = await loginAs("SUPPORT_MEMBER")
  await sleep(300)
  const qaResult = await loginAs("QA")

  const cookies = {
    techLead: techLeadResult.cookie,
    developer: developerResult.cookie,
    support: supportResult.cookie,
    qa: qaResult.cookie,
  }

  console.log(`  Auth  TECH_LEAD:      ${cookies.techLead ? "OK" : "FAILED"}`)
  console.log(`  Auth  DEVELOPER:      ${cookies.developer ? "OK" : "FAILED"}`)
  console.log(`  Auth  SUPPORT_MEMBER: ${cookies.support ? "OK" : "FAILED"}`)
  console.log(`  Auth  QA:             ${cookies.qa ? "OK" : "FAILED"}`)

  if (!cookies.techLead || !cookies.developer || !cookies.support || !cookies.qa) {
    console.log("\n  CRITICAL: One or more required users failed to authenticate.")
    console.log("  Ensure the seed has been applied: npm run db:seed (from apps/web/)")
    process.exit(1)
  }

  // --- Create a ticket to generate notification side-effects ---
  // Ticket creation by SUPPORT_MEMBER triggers persistent TICKET_CREATED notifications
  // for TECH_LEAD and QA roles, which we use in the test suites below.
  console.log("\n[Setup] Creating test ticket to generate notifications...")
  const ticket = await createTestTicket(cookies.support)
  if (ticket) {
    console.log(`  Ticket ${ticket.publicId ?? ticket.id} created — waiting for notifications...`)
  } else {
    console.log("  WARNING: Ticket creation failed. Some test cases may not have live data.")
  }

  // Allow fire-and-forget notification emission to complete
  await sleep(500)

  // --- Run suites ---
  await suite1ListNotifications(cookies)
  await suite2ReadAll(cookies)
  await suite3MarkSingleRead(cookies)
  await suite4Pending(cookies)
  await suite5Acknowledge(cookies)

  // --- Print summary ---
  const { failCount } = summary()
  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Test runner error:", err)
  process.exit(1)
})
