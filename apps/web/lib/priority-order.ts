import { Severity } from "@/generated/prisma/client"

// Minimal interface for the ticket.count operation — compatible with both
// Prisma.TransactionClient and the extended client's transaction type.
// The extended client returns `number | {}` for count; we accept either.
interface TicketCountClient {
  ticket: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    count(args?: any): Promise<number | object>
  }
}

// Lower weight number = higher priority. CRITICAL tickets always rank first.
const SEVERITY_WEIGHT: Record<Severity, number> = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
}

export async function calculatePriorityOrder(
  severity: Severity,
  tx: TicketCountClient
): Promise<number> {
  const weight = SEVERITY_WEIGHT[severity]
  // Count all active tickets whose severity has equal or higher priority weight.
  // The new ticket is placed after them — i.e., its position = count + 1.
  const result = await tx.ticket.count({
    where: {
      status: { notIn: ["DONE", "CANCELLED"] },
      severity: {
        in: (Object.keys(SEVERITY_WEIGHT) as Severity[]).filter(
          (s) => SEVERITY_WEIGHT[s] <= weight
        ),
      },
    },
  })
  // The extended client may return `number | {}` — coerce to number
  const count = typeof result === "number" ? result : 0
  return count + 1
}
