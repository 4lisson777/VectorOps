import { OrgList } from "@/components/super-admin/org-list"

export const metadata = {
  title: "Organizações — Super Admin | VectorOps",
}

export default function SuperAdminOrganizationsPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Organizações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todas as organizações cadastradas no sistema.
        </p>
      </div>
      <OrgList />
    </div>
  )
}
