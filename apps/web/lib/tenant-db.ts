import { db } from "@/lib/db"
import { getTenantId } from "@/lib/tenant-context"

/**
 * Models that require automatic organizationId injection in all queries.
 * BugReport, TicketEvent, and ReorderRequest are excluded because they are
 * always accessed through their parent Ticket relation and inherit org scope.
 * Organization and Invite are excluded because they are cross-tenant.
 *
 * NOTE: Prisma 7 passes PascalCase model names to $extends query hooks,
 * so the names here must match the PascalCase Prisma model names exactly.
 */
const TENANT_SCOPED_MODELS = [
  "User",
  "Ticket",
  "Notification",
  "HelpRequest",
  "HelpRequestResponse",
  "Checkpoint",
  "CheckpointConfig",
  "TvConfig",
  "RoleNotificationConfig",
] as const

type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number]

function isTenantScoped(model: string | undefined): model is TenantScopedModel {
  return TENANT_SCOPED_MODELS.includes(model as TenantScopedModel)
}

/**
 * Returns a Prisma client extended to auto-inject organizationId into all
 * queries on tenant-scoped models.
 *
 * The organizationId is captured eagerly at call time (via getTenantId()) and
 * stored in a closure. This is intentional: Prisma's $extends query hooks run
 * inside the driver adapter's async context, which does NOT inherit the
 * AsyncLocalStorage store from the application. Capturing the value when
 * getTenantDb() is called (always within a runWithTenant() scope set by
 * requireTenantAuth / requireTenantRole) guarantees the correct org is used
 * for every subsequent query on the returned client.
 *
 * Use this in all application API routes. Do NOT use the raw `db` export
 * unless you are in an auth route or super-admin context.
 */
export function getTenantDb() {
  // Capture now, while we are inside a runWithTenant() async context.
  const organizationId = getTenantId()

  return db.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (isTenantScoped(model)) {
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async findFirst({ model, args, query }) {
          if (isTenantScoped(model)) {
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async findUnique({ model, args, query }) {
          if (isTenantScoped(model)) {
            // findUnique requires a unique constraint; we merge organizationId
            // into the where clause via findUniqueOrThrow-compatible shape.
            // Prisma allows extra fields on the where for findUnique when the
            // model has a compound unique index that includes organizationId.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(args.where as any).organizationId = organizationId
          }
          return query(args)
        },

        async count({ model, args, query }) {
          if (isTenantScoped(model)) {
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async create({ model, args, query }) {
          if (isTenantScoped(model)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(args.data as any).organizationId = organizationId
          }
          return query(args)
        },

        async createMany({ model, args, query }) {
          if (isTenantScoped(model)) {
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

        async update({ model, args, query }) {
          if (isTenantScoped(model)) {
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async updateMany({ model, args, query }) {
          if (isTenantScoped(model)) {
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async delete({ model, args, query }) {
          if (isTenantScoped(model)) {
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },

        async deleteMany({ model, args, query }) {
          if (isTenantScoped(model)) {
            args.where = { ...args.where, organizationId }
          }
          return query(args)
        },
      },
    },
  })
}
