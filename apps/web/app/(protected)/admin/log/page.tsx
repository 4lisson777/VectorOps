import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { TicketLog } from "@/components/admin/ticket-log"

export const metadata = {
  title: "Log — VectorOps",
}

export default async function AdminLogPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login")
  if (session.role !== "TECH_LEAD") redirect("/dev")

  return (
    <div className="min-h-full p-6 lg:p-8">
      <TicketLog />
    </div>
  )
}
