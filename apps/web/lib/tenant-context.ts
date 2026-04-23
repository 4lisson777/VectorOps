import { AsyncLocalStorage } from "node:async_hooks"

interface TenantContext {
  organizationId: string
}

const tenantStorage = new AsyncLocalStorage<TenantContext>()

/**
 * Wraps a function execution with a tenant context, making the organizationId
 * available to all code within the call stack via getTenantId().
 * Used by middleware to set the context at the start of each request.
 */
export function runWithTenant<T>(organizationId: string, fn: () => T): T {
  return tenantStorage.run({ organizationId }, fn)
}

/**
 * Returns the current request's organizationId.
 * Throws if called outside of a tenant context (i.e., not within runWithTenant).
 * Use this in all tenant-scoped API routes.
 */
export function getTenantId(): string {
  const ctx = tenantStorage.getStore()
  if (!ctx) throw new Error("Tenant context not set")
  return ctx.organizationId
}

/**
 * Returns the current request's organizationId, or null if no context is set.
 * Use this in super-admin routes that operate outside tenant scope.
 */
export function getTenantIdOptional(): string | null {
  return tenantStorage.getStore()?.organizationId ?? null
}
