import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { NinjaBoard } from "@/components/dev/ninja-board"
import type { DevCardData } from "@/components/dev/developer-card"

export const metadata = {
  title: "Painel — VectorOps",
}

export default async function NinjaBoardPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login")

  const devs = await db.user.findMany({
    where: {
      role: { in: ["DEVELOPER", "TECH_LEAD"] },
      isActive: true,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      ninjaAlias: true,
      avatarUrl: true,
      devStatus: true,
      currentTask: true,
      assignedTickets: {
        where: {
          status: { in: ["OPEN", "IN_PROGRESS", "WAITING_FOR_INFO"] },
        },
        take: 1,
        orderBy: { priorityOrder: "asc" },
        select: {
          publicId: true,
          title: true,
          severity: true,
          type: true,
        },
      },
    },
  })

  const serialized: DevCardData[] = devs.map((d) => ({
    id: d.id,
    name: d.name,
    ninjaAlias: d.ninjaAlias,
    avatarUrl: d.avatarUrl,
    devStatus: d.devStatus,
    currentTask: d.currentTask,
    assignedTicket: d.assignedTickets[0] ?? null,
  }))

  return (
    <NinjaBoard
      initialDevs={serialized}
      currentUserId={session.userId}
      currentUserRole={session.role}
    />
  )
}
