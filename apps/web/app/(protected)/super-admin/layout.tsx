import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

/**
 * Super-admin layout.
 * Provides a secondary server-side isSuperAdmin guard on top of the middleware check.
 * Any server component within this layout can safely assume the user is a super admin.
 */
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session.userId) {
    redirect("/login")
  }

  if (!session.isSuperAdmin) {
    // Redirect non-super-admins to their role home (middleware already handles this,
    // but the server-component check provides defense in depth)
    redirect("/dev")
  }

  return <>{children}</>
}
