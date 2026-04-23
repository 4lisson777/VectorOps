import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { CheckpointConfig } from "@/components/admin/checkpoint-config"

export const metadata = {
  title: "Atualizações de Status — VectorOps",
}

export default async function AdminCheckpointsPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login")
  if (session.role !== "TECH_LEAD") redirect("/dev")

  return (
    <div className="min-h-full p-6 lg:p-8">
      <CheckpointConfig />
    </div>
  )
}
