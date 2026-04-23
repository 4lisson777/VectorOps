import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { TeamManagement } from "@/components/admin/team-management"

export const metadata = {
  title: "Gerenciamento de Equipe — VectorOps",
}

export default async function AdminTeamPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login")
  if (session.role !== "TECH_LEAD") redirect("/dev")

  return (
    <div className="min-h-full p-6 lg:p-8">
      <TeamManagement />
    </div>
  )
}
