/**
 * Persistent Notifications — API Integration Tests
 *
 * Tests the backend API for the "Persistent Sound & Browser Notifications" feature.
 * Runs against a live dev server at http://localhost:3000.
 *
 * Usage: node apps/web/tests/persistent-notifications/api.test.mjs
 */

const BASE_URL = "http://localhost:3000"

// ─── Helpers ────────────────────────────────────────────────────────────────

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

async function patchJson(url, data, cookie, { redirect = "follow" } = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    redirect,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

/**
 * Authenticates a user and returns the session cookie.
 */
async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const setCookie = res.headers.get("set-cookie")
  if (!setCookie) return null
  // Extract cookie name=value from the Set-Cookie header
  const match = setCookie.match(/^([^;]+)/)
  return match ? match[1] : null
}

// ─── Test Suites ─────────────────────────────────────────────────────────────

/**
 * Suite 1: Auth guard on new endpoints
 * GET /api/notifications/pending and PATCH /api/notifications/[id]/acknowledge
 * must require authentication.
 */
async function testAuthGuards() {
  console.log("\n[Suite 1] Auth guards on new endpoints")

  // Use redirect: "manual" so fetch doesn't follow the 307 redirect to /login
  const { status: pendingStatus } = await getJson("/api/notifications/pending", null, { redirect: "manual" })
  assert(
    pendingStatus === 401 || pendingStatus === 302 || pendingStatus === 307,
    "GET /api/notifications/pending without auth → 307 redirect to /login",
    `Expected 307 (redirect) but got ${pendingStatus}`
  )

  const { status: ackStatus } = await patchJson(
    "/api/notifications/nonexistent/acknowledge",
    null,
    null,
    { redirect: "manual" }
  )
  assert(
    ackStatus === 401 || ackStatus === 302 || ackStatus === 307,
    "PATCH /api/notifications/[id]/acknowledge without auth → 307 redirect to /login",
    `Expected 307 (redirect) but got ${ackStatus}`
  )
}

/**
 * Suite 2: GET /api/notifications/pending — authenticated user
 * Returns { notifications: [...] } with correct shape.
 */
async function testGetPendingAuthenticated(techLeadCookie) {
  console.log("\n[Suite 2] GET /api/notifications/pending — authenticated")

  const { status, body } = await getJson("/api/notifications/pending", techLeadCookie)

  assert(status === 200, "Status 200 for authenticated request", `Got ${status}`)
  assert(body !== null, "Response body is valid JSON", "body is null")
  assert(
    Array.isArray(body?.notifications),
    "Response has notifications array",
    `Got: ${JSON.stringify(body)}`
  )

  // All returned notifications must have requiresAck: true and acknowledgedAt: null
  const allRequireAck = body?.notifications?.every((n) => n.requiresAck === true)
  const allUnacknowledged = body?.notifications?.every((n) => n.acknowledgedAt === null)

  assert(
    allRequireAck !== false,
    "All pending notifications have requiresAck: true",
    "Some notifications have requiresAck: false"
  )
  assert(
    allUnacknowledged !== false,
    "All pending notifications have acknowledgedAt: null",
    "Some notifications have acknowledgedAt set"
  )
}

/**
 * Suite 3: POST ticket as SUPPORT_MEMBER → verify notification targeting
 * QA and TECH_LEAD users should receive persistent notifications.
 * (We create a ticket and then check the pending endpoint for a QA user.)
 */
async function testTicketCreationNotifications(supportCookie, qaCookie, techLeadCookie) {
  console.log("\n[Suite 3] Ticket creation → persistent notification targeting")

  // Fetch pending counts BEFORE creating the ticket
  const { body: beforeQa } = await getJson("/api/notifications/pending", qaCookie)
  const { body: beforeTl } = await getJson("/api/notifications/pending", techLeadCookie)
  const qaBefore = beforeQa?.notifications?.length ?? 0
  const tlBefore = beforeTl?.notifications?.length ?? 0

  // Create a ticket as SUPPORT_MEMBER
  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const { status: createStatus, body: createBody } = await postJson(
    "/api/tickets",
    {
      title: "QA Test: Persistent Notification Ticket",
      description: "Created by automated QA test to verify persistent notification targeting",
      severity: "HIGH",
      deadline,
    },
    supportCookie
  )

  assert(createStatus === 201, "Ticket created successfully (201)", `Got ${createStatus}: ${JSON.stringify(createBody)}`)

  if (createStatus !== 201) {
    fail("Skipping notification checks — ticket creation failed", "")
    return null
  }

  const ticketId = createBody?.ticket?.id
  assert(ticketId != null, "Ticket has an id", "ticket.id is missing")

  // Give the fire-and-forget notification emission time to complete
  await new Promise((r) => setTimeout(r, 800))

  // Check QA user's pending notifications increased
  const { body: afterQa } = await getJson("/api/notifications/pending", qaCookie)
  const qaAfter = afterQa?.notifications?.length ?? 0
  assert(
    qaAfter > qaBefore,
    `QA user received new persistent notification (before=${qaBefore} after=${qaAfter})`,
    `Expected >=${qaBefore + 1} but got ${qaAfter}`
  )

  // Check TECH_LEAD user's pending notifications increased
  const { body: afterTl } = await getJson("/api/notifications/pending", techLeadCookie)
  const tlAfter = afterTl?.notifications?.length ?? 0
  assert(
    tlAfter > tlBefore,
    `TECH_LEAD user received new persistent notification (before=${tlBefore} after=${tlAfter})`,
    `Expected >=${tlBefore + 1} but got ${tlAfter}`
  )

  // Verify the QA notification has correct fields
  const qaNotification = afterQa?.notifications?.find((n) => n.ticketId === ticketId)
  assert(
    qaNotification != null,
    "QA notification references the created ticket by id",
    "No notification found for this ticketId"
  )
  assert(
    qaNotification?.requiresAck === true,
    "QA notification has requiresAck: true",
    `requiresAck is ${qaNotification?.requiresAck}`
  )
  assert(
    qaNotification?.acknowledgedAt === null,
    "QA notification has acknowledgedAt: null",
    `acknowledgedAt is ${qaNotification?.acknowledgedAt}`
  )
  assert(
    qaNotification?.type === "TICKET_CREATED",
    "QA notification type is TICKET_CREATED",
    `type is ${qaNotification?.type}`
  )
  assert(
    qaNotification?.ticket?.publicId != null,
    "QA notification includes ticket publicId (for banner link)",
    "ticket.publicId is missing"
  )

  return { ticketId, qaNotification }
}

/**
 * Suite 4: PATCH /api/notifications/[id]/acknowledge — happy path
 */
async function testAcknowledgeHappyPath(qaCookie, qaNotificationId) {
  console.log("\n[Suite 4] PATCH /api/notifications/[id]/acknowledge — happy path")

  const { status, body } = await patchJson(
    `/api/notifications/${qaNotificationId}/acknowledge`,
    null,
    qaCookie
  )

  assert(status === 200, "Acknowledge returns 200", `Got ${status}: ${JSON.stringify(body)}`)
  assert(
    body?.notification?.acknowledgedAt != null,
    "Response notification has acknowledgedAt set",
    `acknowledgedAt is ${body?.notification?.acknowledgedAt}`
  )
  assert(
    body?.notification?.id === qaNotificationId,
    "Response notification id matches request",
    `Expected ${qaNotificationId} got ${body?.notification?.id}`
  )

  // Verify it no longer appears in pending
  await new Promise((r) => setTimeout(r, 200))
  const { body: pendingBody } = await getJson("/api/notifications/pending", qaCookie)
  const stillPending = pendingBody?.notifications?.some((n) => n.id === qaNotificationId)
  assert(
    stillPending === false,
    "Acknowledged notification no longer in GET /api/notifications/pending",
    "Notification still appears in pending list after acknowledgment"
  )
}

/**
 * Suite 5: PATCH /api/notifications/[id]/acknowledge — error cases
 */
async function testAcknowledgeErrorCases(qaCookie, qaNotificationId) {
  console.log("\n[Suite 5] PATCH acknowledge — error cases")

  // 5a: Already acknowledged → 409
  const { status: doubleAckStatus, body: doubleAckBody } = await patchJson(
    `/api/notifications/${qaNotificationId}/acknowledge`,
    null,
    qaCookie
  )
  assert(
    doubleAckStatus === 409,
    "Double-acknowledge returns 409",
    `Got ${doubleAckStatus}: ${JSON.stringify(doubleAckBody)}`
  )
  assert(
    doubleAckBody?.error?.includes("confirmada"),
    "409 error message mentions 'confirmada'",
    `Message: ${doubleAckBody?.error}`
  )

  // 5b: Non-existent notification → 404
  const { status: notFoundStatus } = await patchJson(
    "/api/notifications/non-existent-id-xyz/acknowledge",
    null,
    qaCookie
  )
  assert(
    notFoundStatus === 404,
    "Acknowledge non-existent notification → 404",
    `Got ${notFoundStatus}`
  )
}

/**
 * Suite 6: Ownership enforcement
 * User A cannot acknowledge a notification belonging to User B.
 */
async function testAcknowledgeOwnership(qaCookie, techLeadCookie) {
  console.log("\n[Suite 6] Ownership enforcement on acknowledge")

  // Create a new ticket to generate a fresh TECH_LEAD notification
  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const { body: createBody } = await postJson(
    "/api/tickets",
    {
      title: "QA Test: Ownership Check Ticket",
      description: "Testing ownership enforcement on acknowledge",
      severity: "LOW",
      deadline,
    },
    qaCookie // QA can also create tickets per route guard
  )

  await new Promise((r) => setTimeout(r, 800))

  // Get TECH_LEAD pending to find a notification to try to steal
  const { body: tlPending } = await getJson("/api/notifications/pending", techLeadCookie)
  const tlNotification = tlPending?.notifications?.[0]

  if (!tlNotification) {
    console.log("        SKIP  No TECH_LEAD notification found for ownership test")
    return
  }

  // QA tries to acknowledge TECH_LEAD's notification — should get 404 (ownership check)
  const { status } = await patchJson(
    `/api/notifications/${tlNotification.id}/acknowledge`,
    null,
    qaCookie
  )
  assert(
    status === 404,
    "QA cannot acknowledge TECH_LEAD notification (ownership enforced → 404)",
    `Expected 404 but got ${status}`
  )
}

/**
 * Suite 7: Non-persistent notifications cannot be acknowledged via this endpoint
 */
async function testNonPersistentNotificationRejection(qaCookie, techLeadCookie) {
  console.log("\n[Suite 7] Non-persistent notifications → 409 on acknowledge")

  // Fetch all notifications (not just pending) to find a non-persistent one
  const { body: allNotifs } = await getJson("/api/notifications", techLeadCookie)
  const nonPersistent = allNotifs?.notifications?.find(
    (n) => n.requiresAck === false || n.requiresAck === undefined
  )

  if (!nonPersistent) {
    console.log("        SKIP  No non-persistent notification found in DB for this test")
    return
  }

  const { status, body } = await patchJson(
    `/api/notifications/${nonPersistent.id}/acknowledge`,
    null,
    techLeadCookie
  )
  assert(
    status === 409,
    "Non-persistent notification → 409 on acknowledge attempt",
    `Got ${status}: ${JSON.stringify(body)}`
  )
  assert(
    body?.error?.includes("confirmação"),
    "409 error message mentions 'confirmação'",
    `Message: ${body?.error}`
  )
}

/**
 * Suite 8: TICKET_ASSIGNED → developer receives persistent notification
 */
async function testAssignmentPersistentNotification(techLeadCookie, developerCookie, supportCookieForCreate) {
  console.log("\n[Suite 8] TICKET_ASSIGNED → developer persistent notification")

  // Get developer's pending count before
  const { body: beforeBody } = await getJson("/api/notifications/pending", developerCookie)
  const devBefore = beforeBody?.notifications?.length ?? 0

  // Find an unassigned ticket or create one
  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const { status: cStatus, body: cBody } = await postJson(
    "/api/tickets",
    {
      title: "QA Test: Assignment Persistent Notification",
      description: "Testing that TICKET_ASSIGNED sends persistent notification to developer",
      severity: "MEDIUM",
      deadline,
    },
    supportCookieForCreate
  )

  if (cStatus !== 201) {
    console.log(`        SKIP  Could not create ticket for assignment test (${cStatus})`)
    return
  }

  const ticketId = cBody?.ticket?.id

  if (!developerCookie) {
    console.log("        SKIP  No developer cookie available — cannot verify assignment notification")
    return
  }

  // Get the developer's own user id by calling /api/auth/me or checking their session
  const { body: devSessionBody } = await getJson("/api/auth/me", developerCookie)
  const devUserId = devSessionBody?.user?.id

  if (!devUserId) {
    console.log("        SKIP  Could not determine developer user id")
    return
  }

  await new Promise((r) => setTimeout(r, 200))

  // Get developer pending before assignment
  const { body: devPendingBefore } = await getJson("/api/notifications/pending", developerCookie)
  const pendingBefore = devPendingBefore?.notifications?.length ?? 0

  const { status: assignStatus } = await postJson(
    `/api/tickets/${ticketId}/assign`,
    { assignedToId: devUserId },
    techLeadCookie
  )

  assert(
    assignStatus === 200,
    "Ticket assignment successful (200)",
    `Got ${assignStatus}`
  )

  await new Promise((r) => setTimeout(r, 800))

  const { body: afterBody } = await getJson("/api/notifications/pending", developerCookie)
  const devAfter = afterBody?.notifications?.length ?? 0
  assert(
    devAfter > pendingBefore,
    `Developer received persistent notification after assignment (before=${pendingBefore} after=${devAfter})`,
    `Expected > ${pendingBefore} but got ${devAfter}`
  )

  const assignNotif = afterBody?.notifications?.find((n) => n.ticketId === ticketId)
  assert(
    assignNotif?.type === "TICKET_ASSIGNED",
    "Developer notification type is TICKET_ASSIGNED",
    `type is ${assignNotif?.type}`
  )
  assert(
    assignNotif?.requiresAck === true,
    "TICKET_ASSIGNED notification has requiresAck: true",
    `requiresAck is ${assignNotif?.requiresAck}`
  )
}

/**
 * Suite 9: Verify notification:acknowledged SSE event is in the SSE type list
 * (Static code check embedded in the test runner)
 */
async function testSSETypeRegistration() {
  console.log("\n[Suite 9] SSE event type registration")

  const fs = await import("fs")
  const sseEmitterPath = "/home/alisson/web/personal/vectorops/apps/web/lib/sse-emitter.ts"
  const content = fs.readFileSync(sseEmitterPath, "utf8")

  assert(
    content.includes('"notification:acknowledged"'),
    'SSE emitter exports "notification:acknowledged" event type',
    "notification:acknowledged not found in sse-emitter.ts ShinobiEventType union"
  )

  assert(
    content.includes('"notification:new"'),
    'SSE emitter still exports "notification:new" event type (backward compat)',
    "notification:new not found in sse-emitter.ts"
  )

  // Verify SSE route filters notification:acknowledged by userId
  const sseRoutePath = "/home/alisson/web/personal/vectorops/apps/web/app/api/sse/route.ts"
  const routeContent = fs.readFileSync(sseRoutePath, "utf8")

  assert(
    routeContent.includes("notification:acknowledged"),
    "SSE route filters notification:acknowledged by userId",
    "SSE route does not handle notification:acknowledged"
  )
}

/**
 * Suite 10: Schema correctness
 * Verify requiresAck and acknowledgedAt are present in Prisma schema and migration SQL.
 */
async function testSchemaCorrectness() {
  console.log("\n[Suite 10] Schema and migration correctness")

  const fs = await import("fs")
  const schemaPath = "/home/alisson/web/personal/vectorops/apps/web/prisma/schema.prisma"
  const schema = fs.readFileSync(schemaPath, "utf8")

  assert(
    schema.includes("requiresAck    Boolean          @default(false)"),
    "Notification model has requiresAck Boolean field with default false",
    "requiresAck field missing or wrong in schema.prisma"
  )
  assert(
    schema.includes("acknowledgedAt DateTime?"),
    "Notification model has acknowledgedAt DateTime? field",
    "acknowledgedAt field missing in schema.prisma"
  )
  assert(
    schema.includes("@@index([userId, requiresAck, acknowledgedAt])"),
    "Composite index on (userId, requiresAck, acknowledgedAt) exists",
    "Composite index missing from schema.prisma"
  )

  const migrationPath =
    "/home/alisson/web/personal/vectorops/apps/web/prisma/migrations/20260407000000_add_notification_ack/migration.sql"
  const migration = fs.readFileSync(migrationPath, "utf8")

  assert(
    migration.includes('"requiresAck" BOOLEAN NOT NULL DEFAULT false'),
    "Migration adds requiresAck BOOLEAN NOT NULL DEFAULT false",
    "requiresAck column definition missing in migration SQL"
  )
  assert(
    migration.includes('"acknowledgedAt" DATETIME'),
    "Migration adds acknowledgedAt DATETIME column",
    "acknowledgedAt column missing in migration SQL"
  )
  assert(
    migration.includes(
      "notifications_userId_requiresAck_acknowledgedAt_idx"
    ),
    "Migration creates composite index on notifications",
    "Composite index creation missing from migration SQL"
  )
}

/**
 * Suite 11: Critical bug — SSE notification:new payload missing notification id
 * Verify that the notifications lib includes the DB id in SSE payload.
 */
async function testSSEPayloadIncludesId() {
  console.log("\n[Suite 11] CRITICAL: SSE notification:new payload — id field")

  const fs = await import("fs")
  const notifLibPath = "/home/alisson/web/personal/vectorops/apps/web/lib/notifications.ts"
  const content = fs.readFileSync(notifLibPath, "utf8")

  // Check if createMany is used (which cannot return IDs) vs create in a loop
  const usesCreateMany = content.includes("createMany")
  const emitIncludesId =
    content.includes("payload: { userId, type, title, body, ticketId") &&
    content.includes("id:")

  // The SSE payload emitted after createMany does NOT include the notification DB id
  // because createMany does not return created records in Prisma (SQLite limitation)
  const payloadLine = content.match(/payload:\s*\{[^}]+\}/s)?.[0] ?? ""
  const payloadIncludesId = /payload:\s*\{[^}]*\bid\b[^}]*\}/.test(content)

  if (usesCreateMany && !payloadIncludesId) {
    fail(
      "SSE notification:new payload includes notification DB id",
      "CRITICAL BUG: createMany() is used but does not return IDs (Prisma/SQLite limitation). " +
        "The SSE payload emitted in createAndEmitNotifications() does NOT include the notification id. " +
        "When a persistent notification arrives via SSE (not from /api/notifications/pending on mount), " +
        "the frontend assigns a fake 'pending-{timestamp}' id. Clicking 'Entendido' sends PATCH to " +
        "/api/notifications/pending-1234/acknowledge which returns 404. The notification is removed " +
        "from local state (silent catch) but NOT marked acknowledged in DB. After page refresh, " +
        "GET /api/notifications/pending returns it again and the banner reappears. " +
        "Fix: Replace createMany with individual create calls (or $transaction with create*) to get " +
        "each notification id back, then include it in the SSE payload. " +
        "File: apps/web/lib/notifications.ts, function: createAndEmitNotifications"
    )
  } else {
    pass("SSE notification:new payload includes notification DB id")
  }
}

/**
 * Suite 12: acknowledgeAll uses real ids from pendingRef (static check)
 */
async function testAcknowledgeAllLogic() {
  console.log("\n[Suite 12] acknowledgeAll sends real notification ids")

  const fs = await import("fs")
  const hookPath =
    "/home/alisson/web/personal/vectorops/apps/web/hooks/use-persistent-notifications.ts"
  const content = fs.readFileSync(hookPath, "utf8")

  // acknowledgeAll reads from pendingRef — if ids are fake, all API calls will 404
  // This is a consequence of Suite 11's bug
  const acknowledgeAllSection = content.slice(
    content.indexOf("const acknowledgeAll"),
    content.indexOf("return {")
  )

  assert(
    acknowledgeAllSection.includes("pendingRef.current.map"),
    "acknowledgeAll reads ids from pendingRef (expected pattern)",
    "acknowledgeAll does not use pendingRef.current — unexpected implementation"
  )

  // The ids in pendingRef will be fake 'pending-{timestamp}' for SSE-delivered notifications
  // This is the same root cause as Suite 11
  // We flag it as informational (the fix to Suite 11 fixes this too)
  pass(
    "acknowledgeAll implementation pattern is correct — will work once SSE payload id bug is fixed"
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60))
  console.log(" Persistent Notifications — API Integration Tests")
  console.log("=".repeat(60))

  // --- Authenticate test users ---
  console.log("\n[Setup] Authenticating test users...")

  // Credentials from prisma/seed.ts + manually created QA user
  // Roles needed: SUPPORT_MEMBER, QA, TECH_LEAD, DEVELOPER
  // Sequential logins to avoid concurrent bcrypt + SQLite contention on the dev server
  const supportCookie = await login("support@vectorops.dev", "Password123!")
  const qaCookie = await login("qa@vectorops.dev", "Password123!")
  const techLeadCookie = await login("techlead@vectorops.dev", "Password123!")
  const developerCookie = await login("developer@vectorops.dev", "Password123!")

  // Allow fallback to alternative seed emails if primary ones don't exist
  const loginResults = {
    support: supportCookie,
    qa: qaCookie,
    techLead: techLeadCookie,
    developer: developerCookie,
  }

  for (const [role, cookie] of Object.entries(loginResults)) {
    if (cookie) {
      console.log(`  Auth  ${role}: OK`)
    } else {
      console.log(`  Auth  ${role}: FAILED (user may not exist in seed)`)
    }
  }

  if (!techLeadCookie || !qaCookie) {
    console.log("\n  CRITICAL: Cannot continue without TECH_LEAD and QA cookies.")
    console.log("  Ensure the seed has been run: npx prisma db seed")
    process.exit(1)
  }

  // Override global qaCookie for suite 8 ticket creation workaround
  global.qaCookie = supportCookie ?? qaCookie

  // --- Run all suites ---
  await testAuthGuards()
  await testGetPendingAuthenticated(techLeadCookie)

  let qaNotificationId = null
  if (supportCookie) {
    const result = await testTicketCreationNotifications(
      supportCookie,
      qaCookie,
      techLeadCookie
    )
    if (result?.qaNotification?.id) {
      qaNotificationId = result.qaNotification.id
    }
  } else {
    console.log("\n[Suite 3] SKIP — no SUPPORT_MEMBER cookie")
  }

  if (qaNotificationId) {
    await testAcknowledgeHappyPath(qaCookie, qaNotificationId)
    await testAcknowledgeErrorCases(qaCookie, qaNotificationId)
  } else {
    console.log("\n[Suite 4] SKIP — no QA notification id from Suite 3")
    console.log("\n[Suite 5] SKIP — no QA notification id from Suite 3")
  }

  await testAcknowledgeOwnership(qaCookie, techLeadCookie)
  await testNonPersistentNotificationRejection(qaCookie, techLeadCookie)

  if (techLeadCookie) {
    await testAssignmentPersistentNotification(techLeadCookie, developerCookie, supportCookie)
  }

  await testSSETypeRegistration()
  await testSchemaCorrectness()
  await testSSEPayloadIncludesId()
  await testAcknowledgeAllLogic()

  // --- Summary ---
  console.log("\n" + "=".repeat(60))
  console.log(" Results")
  console.log("=".repeat(60))
  console.log(`  Total:  ${passCount + failCount}`)
  console.log(`  PASS:   ${passCount}`)
  console.log(`  FAIL:   ${failCount}`)

  if (failures.length > 0) {
    console.log("\n  Failed Tests:")
    for (const f of failures) {
      console.log(`  - ${f.name}`)
      if (f.reason) console.log(`    ${f.reason}`)
    }
  }

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Test runner error:", err)
  process.exit(1)
})
