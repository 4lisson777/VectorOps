/**
 * Shared Test Harness for ShinobiOps API Integration Tests
 *
 * Provides common utilities used across all test suites:
 * - Test runner with pass/fail/assert/summary
 * - HTTP helpers (login, getJson, postJson, patchJson, deleteJson, postFormData)
 * - Seed credential helpers
 */

export const BASE_URL = "http://localhost:3000"
export const PASSWORD = "Password123!"

// Seed user emails by role (VectorOps org)
const SEED_EMAILS = {
  TECH_LEAD: "alisson@vector.ops",
  DEVELOPER: "matheus@vectorops.dev",
  DEVELOPER_2: "marcos@vectorops.dev",
  DEVELOPER_3: "ivson@vectorops.dev",
  DEVELOPER_4: "guilherme@vectorops.dev",
  SUPPORT_LEAD: "alisson.rosa@vectorops.dev",
  SUPPORT_MEMBER: "bruno@vectorops.dev",
  SUPPORT_MEMBER_2: "leticia@vectorops.dev",
  QA: "nicoli@vectorops.dev",
}

// ─── Test Runner ────────────────────────────────────────────────────────────

export function createTestRunner() {
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

  function summary() {
    console.log("\n════════════════════════════════════════")
    console.log(`  Total: ${passCount + failCount}  |  PASS: ${passCount}  |  FAIL: ${failCount}`)
    if (failures.length > 0) {
      console.log("\n  Failed tests:")
      for (const f of failures) {
        console.log(`    ✗ ${f.name}`)
        console.log(`      ${f.reason}`)
      }
    }
    console.log("════════════════════════════════════════\n")
    return { passCount, failCount, failures }
  }

  return { pass, fail, assert, summary }
}

// ─── HTTP Helpers ───────────────────────────────────────────────────────────

export async function login(email, password, organizationSlug) {
  const maxRetries = 12
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const reqBody = { email, password }
    if (organizationSlug) reqBody.organizationSlug = organizationSlug
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
    if (res.status === 429 && attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 5_000))
      continue
    }
    const setCookie = res.headers.get("set-cookie")
    let cookie = null
    if (setCookie) {
      const match = setCookie.match(/^([^;]+)/)
      cookie = match ? match[1] : null
    }
    const resBody = await res.json().catch(() => null)
    return { status: res.status, cookie, body: resBody }
  }
}

export async function loginAs(role, organizationSlug) {
  const email = SEED_EMAILS[role]
  if (!email) throw new Error(`Unknown role: ${role}`)
  return login(email, PASSWORD, organizationSlug)
}

export async function getJson(url, cookie, { redirect = "follow" } = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    redirect,
    headers: cookie ? { Cookie: cookie } : {},
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

export async function postJson(url, data, cookie) {
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

export async function patchJson(url, data, cookie, { redirect = "follow" } = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    redirect,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: data != null ? JSON.stringify(data) : undefined,
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

export async function deleteJson(url, cookie) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: cookie ? { Cookie: cookie } : {},
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

export async function postFormData(url, formData, cookie) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: cookie ? { Cookie: cookie } : {},
    body: formData,
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

// ─── Utilities ──────────────────────────────────────────────────────────────

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function makeDeadline(days = 7) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export { SEED_EMAILS }
