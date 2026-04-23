import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireRole } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string; inviteId: string }> }

/**
 * DELETE /api/organizations/[id]/invites/[inviteId]
 * Revokes an invite by setting its expiresAt to now, making it immediately invalid.
 * Requires: TECH_LEAD of the same organization.
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id: orgId, inviteId } = await context.params

  const { session, error } = await requireRole("TECH_LEAD")
  if (error) return error

  if (session.organizationId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const invite = await db.invite.findUnique({ where: { id: inviteId } })

  if (!invite) {
    return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 })
  }

  // Ensure the invite belongs to the org the TECH_LEAD manages
  if (invite.organizationId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (invite.usedAt) {
    return NextResponse.json(
      { error: "Este convite já foi utilizado e não pode ser revogado." },
      { status: 409 }
    )
  }

  // Soft-revoke: set expiresAt to now so the invite is immediately invalid
  const revoked = await db.invite.update({
    where: { id: inviteId },
    data: { expiresAt: new Date() },
    select: {
      id: true,
      code: true,
      role: true,
      email: true,
      expiresAt: true,
    },
  })

  return NextResponse.json({ invite: revoked }, { status: 200 })
}
