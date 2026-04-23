// Minimal interface for the ticket.findFirst operation — compatible with both
// Prisma.TransactionClient and the extended client's transaction type.
interface TicketFindFirstClient {
  ticket: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findFirst(args?: any): Promise<{ publicId: string } | null>
  }
}

export async function generatePublicId(
  type: "TICKET" | "BUG",
  tx: TicketFindFirstClient
): Promise<string> {
  const prefix = type === "TICKET" ? "TKT" : "BUG"
  // Find the highest existing publicId for this type to determine the next sequence number
  const result = await tx.ticket.findFirst({
    where: { publicId: { startsWith: prefix + "-" } },
    orderBy: { publicId: "desc" },
    select: { publicId: true },
  })
  let nextNum = 1
  if (result?.publicId) {
    const parts = result.publicId.split("-")
    const num = parts[1] !== undefined ? parseInt(parts[1], 10) : NaN
    if (!isNaN(num)) nextNum = num + 1
  }
  return `${prefix}-${String(nextNum).padStart(4, "0")}`
}
