import { getIronSession } from "iron-session"
import type { IronSession, SessionOptions } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  userId: string
  role: string
  name: string
  organizationId: string
  isSuperAdmin: boolean
  /** Set during super-admin impersonation; holds the original org id so it can be restored. */
  originalOrganizationId?: string
}

// Session cookie lives for 7 days
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const isProduction = process.env.NODE_ENV === "production"

export const sessionOptions: SessionOptions = {
  cookieName: "shinobiops_session",
  password: (() => {
    const secret = process.env.SESSION_SECRET
    if (!secret && process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET environment variable is required in production")
    }
    return secret ?? "fallback-dev-secret-min-32-chars!!"
  })(),
  cookieOptions: {
    httpOnly: true,
    // Use Secure + SameSite=Strict in production for maximum protection
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  },
}

/**
 * Returns the current iron-session for the incoming request.
 * Must be called from a Server Component, API Route Handler, or Server Action.
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}
