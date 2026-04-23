import { db } from "@/lib/db"
import { getTenantId } from "@/lib/tenant-context"

/**
 * Models that require automatic organizationId injection in all queries.
 * BugReport, TicketEvent, and ReorderRequest are excluded because they are
 * always accessed through their parent Ticket relation and inherit org scope.
 * Organization and Invite are excluded because they are cross-tenant.
 */
const TENANT_SCOPED_MODELS = [
  "user",
  "ticket",
  "notification",
  "helpRequest",
  "helpRequestResponse",
  "checkpoint",
  "checkpointConfig",
  "tvConfig",
  "roleNotificationConfig",
] as const

type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number]

function isTenantScoped(model: string | undefined): model is TenantScopedModel {
  return TENANT_SCOPED_MODELS.includes(model as TenantScopedModel)
}

/**
 * Returns a Prisma client extended to auto-inject organizationId into all
 * queries on tenant-scoped models. Reads the tenant from AsyncLocalStorage
 * context set by runWithTenant() in middleware.
 *
 * Use this in all application API routes. Do NOT use the raw `db` export
 * unless you are in an auth route or super-admin context.
 */
export function getTenantDb() {
  return db.$extends({
    query: {
      $allModels: {
        async findMany({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async findFirst({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async findUnique({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            // findUnique requires a unique constraint; we merge organizationId
            // into the where clause via findUniqueOrThrow-compatible shape.
            // Prisma allows extra fields on the where for findUnique when the
            // model has a compound unique index that includes organizationId.
            const organizationId = getTenantId()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(args.where as any).organizationId = organizationId
          }
          return query(args)
        },

        async count({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async create({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(args.data as any).organizationId = organizationId
          }
          return query(args)
        },

        async createMany({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            if (Array.isArray(args.data)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              args.data = args.data.map((item: any) => ({
                ...item,
                organizationId,
              }))
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(args.data as any).organizationId = organizationId
            }
          }
          return query(args)
        },

        async update({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async updateMany({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async delete({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async deleteMany({ model, operation, args, query }) {
          if (isTenantScoped(model)) {
            const organizationId = getTenantId()
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },
      },
    },
  })
}
