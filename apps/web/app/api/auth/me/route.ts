import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(): Promise<NextResponse> {
  const session = await getSession()

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      organizationId: true,
      isSuperAdmin: true,
      avatarUrl: true,
      ninjaAlias: true,
      isActive: true,
      notifyTickets: true,
      notifyBugs: true,
      soundEnabled: true,
      createdAt: true,
      updatedAt: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!user || !user.isActive) {
    // Session references a non-existent or deactivated user — clear it
    session.destroy()
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Flatten organization fields into the response for convenient access
  const { organization, ...userFields } = user
  return NextResponse.json(
    {
      user: {
        ...userFields,
        organizationName: organization.name,
        organizationSlug: organization.slug,
      },
    },
    { status: 200 }
  )
}
