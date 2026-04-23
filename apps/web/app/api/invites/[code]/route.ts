import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

type RouteContext = { params: Promise<{ code: string }> }

/**
 * GET /api/invites/[code]
 * Public endpoint — no authentication required.
 * Validates an invite code and returns safe metadata (org name, role, email restriction).
 * Does NOT return org ID or sensitive user data.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { code } = await context.params

  const invite = await db.invite.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      organization: {
        select: { name: true, isActive: true },
      },
    },
  })

  if (!invite) {
    return NextResponse.json(
      { error: "Código de convite inválido." },
      { status: 404 }
    )
  }

  if (invite.usedAt) {
    return NextResponse.json(
      { error: "Este código de convite já foi utilizado." },
      { status: 409 }
    )
  }

  if (invite.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Este código de convite expirou." },
      { status: 410 }
    )
  }

  if (!invite.organization.isActive) {
    return NextResponse.json(
      { error: "Esta organização está inativa." },
      { status: 403 }
    )
  }

  return NextResponse.json(
    {
      organizationName: invite.organization.name,
      role: invite.role,
      // Only include the email restriction if one was set — the frontend
      // uses this to pre-fill and lock the email field in the registration form.
      ...(invite.email ? { email: invite.email } : {}),
      expiresAt: invite.expiresAt,
    },
    { status: 200 }
  )
}
