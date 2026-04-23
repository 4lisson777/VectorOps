import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { AppShell } from "@/components/layout/app-shell"

// Protected layout: validates session and renders AppShell for all authenticated pages.
// The middleware handles the initial redirect for unauthenticated requests;
// this layout provides a secondary check for server-rendered route groups.
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session.userId) {
    redirect("/login")
  }

  // Fetch avatarUrl and org name for the header — minimal selects to keep payload small
  let avatarUrl: string | null = null
  let organizationName: string | null = null
  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        avatarUrl: true,
        isActive: true,
        organization: { select: { name: true } },
      },
    })
    if (!user || !user.isActive) {
      session.destroy()
      redirect("/login")
    }
    avatarUrl = user.avatarUrl
    organizationName = user.organization?.name ?? null
  } catch {
    // DB unavailable during build or early boot — proceed without avatar / org name
  }

  return (
    <AppShell
      session={{
        userId: session.userId,
        role: session.role,
        name: session.name,
        organizationId: session.organizationId,
        isSuperAdmin: session.isSuperAdmin ?? false,
        originalOrganizationId: session.originalOrganizationId,
      }}
      avatarUrl={avatarUrl}
      organizationName={organizationName}
    >
      {children}
    </AppShell>
  )
}
