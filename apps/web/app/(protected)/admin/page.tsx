import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { CommandDojoOverview } from "@/components/admin/command-dojo-overview"

export const metadata = {
  title: "Painel Geral — VectorOps",
}

export default async function AdminPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login")
  if (session.role !== "TECH_LEAD") redirect("/dev")

  // Stats and TV config are fetched client-side on mount.
  // Pass nulls so the component fetches immediately after hydration.
  return (
    <div className="min-h-full p-6 lg:p-8">
      <CommandDojoOverview initialStats={null} initialTvConfig={null} />
    </div>
  )
}
