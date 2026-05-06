/**
 * Ticket Notification Flow — API Integration Tests
 *
 * Covers:
 *  1. QA role can call POST /api/tickets/:id/assign (new permission)
 *  2. DEVELOPER self-assign guard is still enforced (regression)
 *  3. Ticket creation → QA receives persistent notification (requiresAck: true)
 *  4. Ticket creation → TECH_LEAD receives persistent notification (requiresAck: true)
 *  5. QA assigns ticket → Developer receives persistent notification (requiresAck: true)
 *  6. Developer can acknowledge their notification
 *  7. Acknowledged notification no longer appears in pending
 *  8. TECH_LEAD retains full permission on assign endpoint (regression)
 *  9. SUPPORT_MEMBER is rejected from assign endpoint (403)
 * 10. ticket-actions.tsx static analysis: QA block present, TECH_LEAD block present
 * 11. page.tsx static analysis: developer fetch runs for both QA and TECH_LEAD roles
 *
 * Usage:
 *   node apps/web/tests/ticket-notification-flow/api.test.mjs
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

function makeDeadline() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
}

// ─── Suite 1: Static code analysis — ticket-actions.tsx ─────────────────────

async function testTicketActionsStaticAnalysis() {
  console.log("\n[Suite 1] Static: ticket-actions.tsx — QA block + TECH_LEAD regression")

  const fs = await import("fs")
  const filePath =
    "/home/alisson/web/personal/vectorops/apps/web/components/tickets/ticket-actions.tsx"
  const content = fs.readFileSync(filePath, "utf8")

  // 1a: isQA boolean must be declared
  assert(
    content.includes("const isQA = currentUserRole === \"QA\""),
    "ticket-actions.tsx declares isQA boolean",
    "isQA declaration not found"
  )

  // 1b: QA is allowed through the early-return guard
  assert(
    content.includes("!isTechLead && !canActAsdev && !isQA"),
    "Early-return guard includes !isQA (QA users are allowed through)",
    "!isQA not found in the early-return guard condition"
  )

  // 1c: QA section renders ONLY the Responsável dropdown
  const qaBlock = content.slice(
    content.indexOf("{isQA && ("),
    content.indexOf("{isQA && (") + 600
  )
  assert(
    qaBlock.includes("Responsável"),
    "QA block renders the Responsável assignment dropdown",
    "Responsável label not found inside QA block"
  )

  // 1d: QA block must NOT contain the Status dropdown (guard against regression)
  // The Status Select is inside {statusOptions.length > 0 && ...} which is OUTSIDE the isQA block
  // We check that the isQA block itself does NOT contain "Status" as a label
  assert(
    !qaBlock.includes("<Label") || qaBlock.split("<Label").length <= 2,
    "QA block renders at most one Label (Responsável only — no Status/Severidade/Prazo labels inside it)",
    "QA block appears to contain multiple Labels which suggests unwanted controls leaked in"
  )

  // 1e: TECH_LEAD block still renders Severidade + Prazo controls (regression check)
  // Use a generous slice (3000 chars) — the isTechLead block contains Severidade + Prazo + Responsável
  const techLeadBlock = content.slice(
    content.indexOf("{isTechLead && ("),
    content.indexOf("{isTechLead && (") + 3000
  )
  assert(
    techLeadBlock.includes("Severidade"),
    "TECH_LEAD block retains Severidade dropdown (regression check)",
    "Severidade not found in TECH_LEAD block"
  )
  assert(
    techLeadBlock.includes("Prazo"),
    "TECH_LEAD block retains Prazo date picker (regression check)",
    "Prazo not found in TECH_LEAD block"
  )
  assert(
    techLeadBlock.includes("Responsável"),
    "TECH_LEAD block retains Responsável reassign dropdown (regression check)",
    "Responsável not found in TECH_LEAD block"
  )

  // 1f: Developer "Atribuir a mim" button still present (regression check)
  assert(
    content.includes("Atribuir a mim"),
    "Developer Atribuir a mim button is still present (regression check)",
    "Atribuir a mim button not found in ticket-actions.tsx"
  )
}

// ─── Suite 2: Static code analysis — page.tsx developer fetch ────────────────

async function testPageStaticAnalysis() {
  console.log("\n[Suite 2] Static: ticket detail page.tsx — developer fetch for QA role")

  const fs = await import("fs")
  const filePath =
    "/home/alisson/web/personal/vectorops/apps/web/app/(protected)/ticket/[publicId]/page.tsx"
  const content = fs.readFileSync(filePath, "utf8")

  // Developer fetch condition includes QA
  assert(
    content.includes('session.role === "TECH_LEAD" || session.role === "QA"'),
    "page.tsx fetches developers for both TECH_LEAD and QA roles",
    "Developer fetch condition does not include both TECH_LEAD and QA"
  )

  // Both DEVELOPER and TECH_LEAD are valid assignment targets
  assert(
    content.includes('"DEVELOPER", "TECH_LEAD"') || content.includes('"DEVELOPER"') && content.includes('"TECH_LEAD"'),
    "Developer list query includes both DEVELOPER and TECH_LEAD roles as valid targets",
    "Developer query roles not found"
  )
}

// ─── Suite 3: Auth guards on assign endpoint ─────────────────────────────────

async function testAssignAuthGuards() {
  console.log("\n[Suite 3] Auth guards — POST /api/tickets/:id/assign")

  // Use redirect: "manual" to capture the raw 307 before Node follows it to /login (200)
  const res = await fetch(`${BASE_URL}/api/tickets/some-id/assign`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignedToId: "some-user-id" }),
  })
  assert(
    res.status === 401 || res.status === 302 || res.status === 307,
    "Unauthenticated assign request → 307 redirect to /login (auth guard fires)",
    `Got ${res.status}`
  )
}

// ─── Suite 4: Role-based access on assign endpoint ───────────────────────────

async function testAssignRoleAccess(cookies) {
  console.log("\n[Suite 4] Role-based access on assign endpoint")

  // SUPPORT_MEMBER cannot assign (403 Forbidden)
  // Use a dummy ticket id — the 403 should be returned before any DB lookup
  const { status: supportStatus, body: supportBody } = await postJson(
    "/api/tickets/dummy-id/assign",
    { assignedToId: "dummy-user-id" },
    cookies.support
  )
  assert(
    supportStatus === 403,
    "SUPPORT_MEMBER is rejected from assign endpoint (403)",
    `Expected 403 but got ${supportStatus}: ${JSON.stringify(supportBody)}`
  )

  // QA can reach the assign endpoint (gets past role guard — will get 404 for dummy ticket)
  const { status: qaStatus } = await postJson(
    "/api/tickets/dummy-ticket-that-doesnt-exist/assign",
    { assignedToId: "dummy-user-id" },
    cookies.qa
  )
  assert(
    qaStatus !== 403,
    "QA role passes the assign endpoint role guard (does not receive 403)",
    `QA received 403 — role guard is rejecting QA unexpectedly`
  )

  // TECH_LEAD can reach the assign endpoint
  const { status: tlStatus } = await postJson(
    "/api/tickets/dummy-ticket-that-doesnt-exist/assign",
    { assignedToId: "dummy-user-id" },
    cookies.techLead
  )
  assert(
    tlStatus !== 403,
    "TECH_LEAD role passes the assign endpoint role guard (regression check)",
    `TECH_LEAD received 403 — regression in role guard`
  )
}

// ─── Suite 5: Ticket creation → QA + TECH_LEAD persistent notifications ──────

async function testTicketCreationNotifications(cookies) {
  console.log("\n[Suite 5] Ticket creation → persistent notifications for QA + TECH_LEAD")

  // Snapshot pending counts before
  const { body: beforeQa } = await getJson("/api/notifications/pending", cookies.qa)
  const { body: beforeTl } = await getJson("/api/notifications/pending", cookies.techLead)
  const qaBefore = beforeQa?.notifications?.length ?? 0
  const tlBefore = beforeTl?.notifications?.length ?? 0

  // Create ticket as SUPPORT_MEMBER
  const { status: createStatus, body: createBody } = await postJson(
    "/api/tickets",
    {
      title: "QA Flow Test: Persistent Notification Ticket",
      description: "Automated QA test — ticket notification flow regression",
      severity: "HIGH",
      deadline: makeDeadline(),
    },
    cookies.support
  )

  assert(createStatus === 201, "Ticket created (201) by SUPPORT_MEMBER", `Got ${createStatus}: ${JSON.stringify(createBody)}`)

  if (createStatus !== 201) {
    fail("Skipping notification assertions — ticket creation failed", "")
    return null
  }

  const ticketId = createBody?.ticket?.id
  assert(ticketId != null, "Created ticket has an id", "ticket.id missing")

  // Wait for fire-and-forget notification emission
  await new Promise((r) => setTimeout(r, 900))

  // QA should have a new pending notification
  const { body: afterQa } = await getJson("/api/notifications/pending", cookies.qa)
  const qaAfter = afterQa?.notifications?.length ?? 0
  assert(
    qaAfter > qaBefore,
    `QA received a persistent notification after ticket creation (before=${qaBefore} after=${qaAfter})`,
    `Count did not increase: before=${qaBefore} after=${qaAfter}`
  )

  // TECH_LEAD should have a new pending notification
  const { body: afterTl } = await getJson("/api/notifications/pending", cookies.techLead)
  const tlAfter = afterTl?.notifications?.length ?? 0
  assert(
    tlAfter > tlBefore,
    `TECH_LEAD received a persistent notification after ticket creation (before=${tlBefore} after=${tlAfter})`,
    `Count did not increase: before=${tlBefore} after=${tlAfter}`
  )

  // Verify QA notification fields
  const qaNotification = afterQa?.notifications?.find((n) => n.ticketId === ticketId)
  assert(
    qaNotification != null,
    "QA notification references the created ticket id",
    "No notification found matching the created ticketId"
  )
  assert(
    qaNotification?.requiresAck === true,
    "QA notification has requiresAck: true (persistent)",
    `requiresAck is ${qaNotification?.requiresAck}`
  )
  assert(
    qaNotification?.acknowledgedAt === null,
    "QA notification starts with acknowledgedAt: null",
    `acknowledgedAt is ${qaNotification?.acknowledgedAt}`
  )
  assert(
    qaNotification?.type === "TICKET_CREATED",
    "QA notification type is TICKET_CREATED",
    `type is ${qaNotification?.type}`
  )
  assert(
    qaNotification?.ticket?.publicId != null,
    "QA notification payload includes ticket publicId",
    "ticket.publicId missing from notification"
  )

  // Verify TECH_LEAD notification fields
  const tlNotification = afterTl?.notifications?.find((n) => n.ticketId === ticketId)
  assert(
    tlNotification != null,
    "TECH_LEAD notification references the created ticket id",
    "No TECH_LEAD notification found for this ticketId"
  )
  assert(
    tlNotification?.requiresAck === true,
    "TECH_LEAD notification has requiresAck: true (persistent)",
    `requiresAck is ${tlNotification?.requiresAck}`
  )
  assert(
    tlNotification?.type === "TICKET_CREATED",
    "TECH_LEAD notification type is TICKET_CREATED",
    `type is ${tlNotification?.type}`
  )

  return { ticketId, qaNotificationId: qaNotification?.id }
}

// ─── Suite 6: QA assigns ticket → developer persistent notification ───────────

async function testQaAssignTriggersDeveloperNotification(cookies, ticketId) {
  console.log("\n[Suite 6] QA assigns ticket → developer receives persistent notification")

  if (!ticketId) {
    console.log("        SKIP  No ticketId from Suite 5")
    return null
  }

  // Resolve developer user id
  const { body: devMe } = await getJson("/api/auth/me", cookies.developer)
  const devUserId = devMe?.user?.id

  if (!devUserId) {
    console.log("        SKIP  Could not resolve developer user id")
    return null
  }

  // Snapshot developer pending notifications before
  const { body: beforeBody } = await getJson("/api/notifications/pending", cookies.developer)
  const devBefore = beforeBody?.notifications?.length ?? 0

  // QA performs the assignment
  const { status: assignStatus, body: assignBody } = await postJson(
    `/api/tickets/${ticketId}/assign`,
    { assignedToId: devUserId },
    cookies.qa
  )

  assert(
    assignStatus === 200,
    "QA can assign ticket to developer (200)",
    `Got ${assignStatus}: ${JSON.stringify(assignBody)}`
  )

  if (assignStatus !== 200) {
    fail("Skipping developer notification check — assign call failed", "")
    return null
  }

  // Wait for fire-and-forget notification
  await new Promise((r) => setTimeout(r, 900))

  // Developer should have new pending notification
  const { body: afterBody } = await getJson("/api/notifications/pending", cookies.developer)
  const devAfter = afterBody?.notifications?.length ?? 0
  assert(
    devAfter > devBefore,
    `Developer received persistent notification after QA assignment (before=${devBefore} after=${devAfter})`,
    `Count did not increase: before=${devBefore} after=${devAfter}`
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
  assert(
    assignNotif?.acknowledgedAt === null,
    "Developer TICKET_ASSIGNED notification starts unacknowledged",
    `acknowledgedAt is ${assignNotif?.acknowledgedAt}`
  )

  return { assignNotifId: assignNotif?.id }
}

// ─── Suite 7: Developer acknowledges notification (happy path) ────────────────

async function testDeveloperAcknowledgesNotification(cookies, assignNotifId) {
  console.log("\n[Suite 7] Developer acknowledges TICKET_ASSIGNED notification")

  if (!assignNotifId) {
    console.log("        SKIP  No assignNotifId from Suite 6")
    return
  }

  const { status, body } = await patchJson(
    `/api/notifications/${assignNotifId}/acknowledge`,
    null,
    cookies.developer
  )

  assert(status === 200, "Acknowledge returns 200", `Got ${status}: ${JSON.stringify(body)}`)
  assert(
    body?.notification?.acknowledgedAt != null,
    "Acknowledged notification has acknowledgedAt set in response",
    `acknowledgedAt is ${body?.notification?.acknowledgedAt}`
  )
  assert(
    body?.notification?.id === assignNotifId,
    "Response notification id matches the one acknowledged",
    `Expected ${assignNotifId} got ${body?.notification?.id}`
  )

  // Give DB a moment then verify it's gone from pending
  await new Promise((r) => setTimeout(r, 300))
  const { body: pendingBody } = await getJson("/api/notifications/pending", cookies.developer)
  const stillPending = pendingBody?.notifications?.some((n) => n.id === assignNotifId)
  assert(
    stillPending === false,
    "Acknowledged notification no longer appears in GET /api/notifications/pending",
    "Notification still in pending list after acknowledgment"
  )

  // Double-acknowledge → 409
  const { status: doubleStatus } = await patchJson(
    `/api/notifications/${assignNotifId}/acknowledge`,
    null,
    cookies.developer
  )
  assert(
    doubleStatus === 409,
    "Double-acknowledge returns 409",
    `Got ${doubleStatus}`
  )
}

// ─── Suite 8: DEVELOPER self-assign guard regression ─────────────────────────

async function testDeveloperSelfAssignGuard(cookies) {
  console.log("\n[Suite 8] DEVELOPER self-assign guard regression")

  // Get developer user id
  const { body: devMe } = await getJson("/api/auth/me", cookies.developer)
  const devUserId = devMe?.user?.id

  if (!devUserId) {
    console.log("        SKIP  Could not resolve developer user id")
    return
  }

  // Get another developer user id (to attempt cross-assign)
  const { body: techMe } = await getJson("/api/auth/me", cookies.techLead)
  const techLeadId = techMe?.user?.id

  if (!techLeadId) {
    console.log("        SKIP  Could not resolve tech lead user id")
    return
  }

  // DEVELOPER tries to assign to someone else → 403
  // Use a dummy ticket id; role check fires before the DB ticket lookup
  const { status: crossAssignStatus, body: crossBody } = await postJson(
    "/api/tickets/dummy-ticket-id-for-guard-test/assign",
    { assignedToId: techLeadId },
    cookies.developer
  )
  assert(
    crossAssignStatus === 403,
    "DEVELOPER cannot assign ticket to another user (403 — self-assign only guard)",
    `Expected 403 but got ${crossAssignStatus}: ${JSON.stringify(crossBody)}`
  )

  // DEVELOPER assigning to self should pass the role guard (gets 404 for dummy ticket, not 403)
  const { status: selfAssignStatus } = await postJson(
    "/api/tickets/dummy-ticket-id-for-guard-test/assign",
    { assignedToId: devUserId },
    cookies.developer
  )
  assert(
    selfAssignStatus !== 403,
    "DEVELOPER self-assign passes the role guard (regression check — not rejected with 403)",
    `Self-assign returned 403 unexpectedly`
  )
}

// ─── Suite 9: QA acknowledge ownership — cross-user isolation ─────────────────

async function testQaAcknowledgeOwnership(cookies) {
  console.log("\n[Suite 9] QA cannot acknowledge TECH_LEAD notification (ownership)")

  const { body: tlPending } = await getJson("/api/notifications/pending", cookies.techLead)
  const tlNotif = tlPending?.notifications?.[0]

  if (!tlNotif) {
    console.log("        SKIP  No TECH_LEAD pending notification available for ownership test")
    return
  }

  const { status } = await patchJson(
    `/api/notifications/${tlNotif.id}/acknowledge`,
    null,
    cookies.qa
  )
  assert(
    status === 404,
    "QA cannot acknowledge a TECH_LEAD notification (ownership enforced → 404)",
    `Expected 404 but got ${status}`
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60))
  console.log(" Ticket Notification Flow — Integration Tests")
  console.log("=".repeat(60))

  // --- Authenticate all roles ---
  console.log("\n[Setup] Authenticating test users...")

  // Sequential logins to avoid concurrent bcrypt contention
  const supportCookie = await login("bruno@vectorops.dev", "Password123!")
  await new Promise((r) => setTimeout(r, 300))
  const qaCookie = await login("nicoli@vectorops.dev", "Password123!")
  await new Promise((r) => setTimeout(r, 300))
  const techLeadCookie = await login("alisson@vector.ops", "Password123!")
  await new Promise((r) => setTimeout(r, 300))
  const developerCookie = await login("matheus@vectorops.dev", "Password123!")

  const cookies = {
    support: supportCookie,
    qa: qaCookie,
    techLead: techLeadCookie,
    developer: developerCookie,
  }

  const roleNames = { support: "SUPPORT_MEMBER (Bruno)", qa: "QA (Nicoli)", techLead: "TECH_LEAD (Alisson Lima)", developer: "DEVELOPER (Matheus)" }
  for (const [key, cookie] of Object.entries(cookies)) {
    console.log(`  Auth  ${roleNames[key]}: ${cookie ? "OK" : "FAILED"}`)
  }

  if (!cookies.qa || !cookies.techLead || !cookies.developer || !cookies.support) {
    console.log("\n  CRITICAL: One or more required users failed to authenticate.")
    console.log("  Ensure the seed has been applied: npm run db:seed (from apps/web/)")
    process.exit(1)
  }

  // --- Run all suites ---
  await testTicketActionsStaticAnalysis()
  await testPageStaticAnalysis()
  await testAssignAuthGuards()
  await testAssignRoleAccess(cookies)

  const suite5Result = await testTicketCreationNotifications(cookies)
  const ticketId = suite5Result?.ticketId ?? null

  // Acknowledge the QA TICKET_CREATED notification immediately so it doesn't
  // interfere with Suite 9's ownership check (QA pending list stays lean)
  if (suite5Result?.qaNotificationId) {
    await patchJson(
      `/api/notifications/${suite5Result.qaNotificationId}/acknowledge`,
      null,
      cookies.qa
    )
  }

  const suite6Result = await testQaAssignTriggersDeveloperNotification(cookies, ticketId)
  await testDeveloperAcknowledgesNotification(cookies, suite6Result?.assignNotifId ?? null)
  await testDeveloperSelfAssignGuard(cookies)
  await testQaAcknowledgeOwnership(cookies)

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
