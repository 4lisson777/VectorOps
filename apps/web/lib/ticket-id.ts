import { Prisma } from "@/generated/prisma/client"

type TransactionClient = Prisma.TransactionClient

export async function generatePublicId(
  type: "TICKET" | "BUG",
  tx: TransactionClient
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
