#!/usr/bin/env node

/**
 * Run All API Integration Tests
 *
 * Executes all test suites sequentially and reports aggregate results.
 *
 * Usage:
 *   node apps/web/tests/run-all.mjs           # run all suites
 *   node apps/web/tests/run-all.mjs --new     # run only new suites (skip legacy)
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - Seed has been applied: npx prisma db seed (from apps/web/)
 */

import { execSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const NEW_SUITES = [
  "admin",
  "users",
  "tickets",
  "bugs",
  "notifications",
  "reorder-requests",
  "help-requests",
  "war-room",
]

const LEGACY_SUITES = [
  "status-change",
  "multitenancy",
  "persistent-notifications",
  "role-notification-config",
  "ticket-notification-flow",
]

const onlyNew = process.argv.includes("--new")
const suites = onlyNew ? NEW_SUITES : [...NEW_SUITES, ...LEGACY_SUITES]

let passed = 0
let failed = 0
const failedSuites = []

console.log("╔══════════════════════════════════════════╗")
console.log("║   ShinobiOps API Integration Tests       ║")
console.log("╚══════════════════════════════════════════╝")
console.log(`\nRunning ${suites.length} test suites...\n`)

for (const suite of suites) {
  const file = resolve(__dirname, suite, "api.test.mjs")
  console.log(`\n${"─".repeat(50)}`)
  console.log(`  Suite: ${suite}`)
  console.log(`${"─".repeat(50)}`)

  try {
    execSync(`node ${file}`, { stdio: "inherit", timeout: 120_000 })
    passed++
  } catch (err) {
    failed++
    failedSuites.push(suite)
    console.log(`\n  *** Suite "${suite}" exited with errors ***\n`)
  }
}

console.log("\n╔══════════════════════════════════════════╗")
console.log("║   Aggregate Results                      ║")
console.log("╚══════════════════════════════════════════╝")
console.log(`\n  Suites run:    ${suites.length}`)
console.log(`  Suites passed: ${passed}`)
console.log(`  Suites failed: ${failed}`)
if (failedSuites.length > 0) {
  console.log(`\n  Failed suites:`)
  for (const s of failedSuites) {
    console.log(`    - ${s}`)
  }
}
console.log()

process.exit(failed > 0 ? 1 : 0)
