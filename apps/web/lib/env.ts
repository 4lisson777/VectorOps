/**
 * Validates required environment variables at import time.
 * Import this module early in the application lifecycle (e.g., root layout)
 * to ensure the app fails fast if critical configuration is missing.
 */

const REQUIRED_ENV_VARS = ["SESSION_SECRET", "DATABASE_URL"] as const

if (process.env.SKIP_ENV_VALIDATION !== "true") {
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      throw new Error(
        `Missing required environment variable: ${key}. ` +
          `Check your .env file or container configuration.`
      )
    }
  }

  const secret = process.env.SESSION_SECRET
  if (secret && secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long.")
  }
}

export const env = {
  SESSION_SECRET: process.env.SESSION_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? "3000",
} as const
