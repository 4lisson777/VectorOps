import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { generateInviteCode } from "@/lib/invite-code"
import { InviteCreateSchema } from "@/lib/schemas/organization-schemas"

type RouteContext = { params: Promise<{ id: string }> }

/**
 * POST /api/organizations/[id]/invites
 * Creates an invite for the specified organization.
 * Requires: TECH_LEAD of the same organization.
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id: orgId } = await context.params

  const { session, error } = await requireRole("TECH_LEAD")
  if (error) return error

  // A TECH_LEAD can only create invites for their own organization
  if (session.organizationId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Verify the organization exists and is active
  const org = await db.organization.findUnique({ where: { id: orgId } })
  if (!org) {
    return NextResponse.json({ error: "Organização não encontrada." }, { status: 404 })
  }
  if (!org.isActive) {
    return NextResponse.json({ error: "Esta organização está inativa." }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 })
  }

  const parsed = InviteCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { role, email, expiresInHours } = parsed.data

  // Generate a unique invite code, retrying if there's a collision (extremely rare)
  let code: string
  let attempts = 0
  do {
    code = generateInviteCode()
    const collision = await db.invite.findUnique({ where: { code } })
    if (!collision) break
    attempts++
  } while (attempts < 5)

  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)

  const invite = await db.invite.create({
    data: {
      organizationId: orgId,
      code,
      role: role as Parameters<typeof db.invite.create>[0]["data"]["role"],
      email: email ?? null,
      expiresAt,
      createdById: session.userId,
    },
    select: {
      id: true,
      code: true,
      role: true,
      email: true,
      expiresAt: true,
      createdAt: true,
      createdBy: {
        select: { id: true, name: true },
      },
    },
  })

  return NextResponse.json({ invite }, { status: 201 })
}

/**
 * GET /api/organizations/[id]/invites
 * Lists all non-expired, non-used invites for the organization.
 * Requires: TECH_LEAD of the same organization.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id: orgId } = await context.params

  const { session, error } = await requireRole("TECH_LEAD")
  if (error) return error

  if (session.organizationId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const invites = await db.invite.findMany({
    where: {
      organizationId: orgId,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      code: true,
      role: true,
      email: true,
      expiresAt: true,
      createdAt: true,
      createdBy: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ invites }, { status: 200 })
}
