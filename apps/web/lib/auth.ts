import { NextResponse } from "next/server"
import { getSession, type SessionData } from "@/lib/session"
import { runWithTenant } from "@/lib/tenant-context"

/**
 * Reads the current session and returns the session data.
 * Returns null when the request is unauthenticated.
 */
export async function getCurrentSession(): Promise<SessionData | null> {
  const session = await getSession()
  if (!session.userId) return null
  return {
    userId: session.userId,
    role: session.role,
    name: session.name,
    organizationId: session.organizationId,
    isSuperAdmin: session.isSuperAdmin,
  }
}

/**
 * Guards an API route handler that requires authentication.
 * Returns a 401 JSON response when no valid session exists.
 *
 * Usage:
 *   const { session, error } = await requireAuth()
 *   if (error) return error
 */
export async function requireAuth(): Promise<
  | { session: SessionData; error: null }
  | { session: null; error: NextResponse }
> {
  const session = await getCurrentSession()
  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    }
  }
  return { session, error: null }
}

/**
 * Guards an API route that requires a specific role.
 * Returns 401 when unauthenticated, 403 when role is insufficient.
 *
 * Usage:
 *   const { session, error } = await requireRole("TECH_LEAD")
 *   if (error) return error
 */
export async function requireRole(
  ...allowedRoles: string[]
): Promise<
  | { session: SessionData; error: null }
  | { session: null; error: NextResponse }
> {
  const { session, error } = await requireAuth()
  if (error) return { session: null, error }

  if (!allowedRoles.includes(session.role)) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    }
  }

  return { session, error: null }
}

/**
 * Guards an API route that requires platform-level super admin privileges.
 * Returns 401 when unauthenticated, 403 when the user is not a super admin.
 *
 * Usage:
 *   const { session, error } = await requireSuperAdmin()
 *   if (error) return error
 */
export async function requireSuperAdmin(): Promise<
  | { session: SessionData; error: null }
  | { session: null; error: NextResponse }
> {
  const { session, error } = await requireAuth()
  if (error) return { session: null, error }

  if (!session.isSuperAdmin) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    }
  }

  return { session, error: null }
}

/**
 * Guards an API route that requires authentication and sets the tenant context
 * from the session's organizationId. Wraps the provided handler function
 * inside runWithTenant so all calls to getTenantDb() within that handler
 * are automatically scoped to the correct org.
 *
 * Usage:
 *   export async function GET(request: NextRequest) {
 *     return requireTenantAuth((session) => {
 *       // getTenantDb() is now safe to call here
 *       const tdb = getTenantDb()
 *       ...
 *     })
 *   }
 */
export async function requireTenantAuth<T>(
  handler: (session: SessionData) => T | Promise<T>
): Promise<T | NextResponse> {
  const { session, error } = await requireAuth()
  if (error) return error

  return runWithTenant(session.organizationId, () => handler(session))
}

/**
 * Guards an API route that requires a specific role and sets the tenant context.
 * Combines requireRole() and runWithTenant() in one call.
 *
 * Usage:
 *   export async function GET(request: NextRequest) {
 *     return requireTenantRole("TECH_LEAD")((session) => {
 *       const tdb = getTenantDb()
 *       ...
 *     })
 *   }
 */
export function requireTenantRole(
  ...allowedRoles: string[]
): <T>(handler: (session: SessionData) => T | Promise<T>) => Promise<T | NextResponse> {
  return async function <T>(
    handler: (session: SessionData) => T | Promise<T>
  ): Promise<T | NextResponse> {
    const { session, error } = await requireRole(...allowedRoles)
    if (error) return error

    return runWithTenant(session.organizationId, () => handler(session))
  }
}
