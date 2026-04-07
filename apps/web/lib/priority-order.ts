import { Severity } from "@/generated/prisma/client"
import { Prisma } from "@/generated/prisma/client"

type TransactionClient = Prisma.TransactionClient

// Lower weight number = higher priority. CRITICAL tickets always rank first.
const SEVERITY_WEIGHT: Record<Severity, number> = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
}

export async function calculatePriorityOrder(
  severity: Severity,
  tx: TransactionClient
): Promise<number> {
  const weight = SEVERITY_WEIGHT[severity]
  // Count all active tickets whose severity has equal or higher priority weight.
  // The new ticket is placed after them — i.e., its position = count + 1.
  const count = await tx.ticket.count({
    where: {
      status: { notIn: ["DONE", "CANCELLED"] },
      severity: {
        in: (Object.keys(SEVERITY_WEIGHT) as Severity[]).filter(
          (s) => SEVERITY_WEIGHT[s] <= weight
        ),
      },
    },
  })
  return count + 1
}
