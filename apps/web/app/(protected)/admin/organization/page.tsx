import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { OrganizationSettings } from "@/components/admin/organization-settings"
import { InviteManagement } from "@/components/admin/invite-management"

export const metadata = {
  title: "Organização — VectorOps",
}

// TECH_LEAD only — allows managing org settings and invite codes.
export default async function OrganizationPage() {
  const session = await getSession()

  if (!session.userId) redirect("/login")
  if (session.role !== "TECH_LEAD") redirect("/dev")

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Organização</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure sua organização e gerencie convites de acesso.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <OrganizationSettings />
        <InviteManagement organizationId={session.organizationId} />
      </div>
    </div>
  )
}
