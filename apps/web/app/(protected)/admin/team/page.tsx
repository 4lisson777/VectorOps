import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { TeamManagement } from "@/components/admin/team-management"
import { InviteManagement } from "@/components/admin/invite-management"

export const metadata = {
  title: "Gerenciamento de Equipe — VectorOps",
}

export default async function AdminTeamPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login")
  if (session.role !== "TECH_LEAD") redirect("/dev")

  return (
    <div className="flex min-h-full flex-col gap-8 p-6 lg:p-8">
      <InviteManagement organizationId={session.organizationId!} />
      <TeamManagement />
    </div>
  )
}
