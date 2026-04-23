import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireSuperAdmin } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { ImpersonateSchema } from "@/lib/schemas/organization-schemas"

/**
 * POST /api/super-admin/impersonate
 * Switches the current session's organizationId to the target organization,
 * enabling the super admin to act within that org's context for debugging.
 * The original organizationId is preserved in session.originalOrganizationId.
 * Auth: super admin only.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { session: authSession, error } = await requireSuperAdmin()
  if (error) return error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 })
  }

  const parsed = ImpersonateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { organizationId } = parsed.data

  // Verify the target org exists
  const targetOrg = await db.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, slug: true, isActive: true },
  })

  if (!targetOrg) {
    return NextResponse.json(
      { error: "Organização não encontrada." },
      { status: 404 }
    )
  }

  // Audit log — full audit trail can be persisted in a future phase
  console.warn(
    `[SUPER_ADMIN_IMPERSONATE] userId=${authSession.userId} switching from orgId=${authSession.organizationId} to orgId=${organizationId} (${targetOrg.name})`
  )

  const session = await getSession()

  // Preserve the original org only on the first impersonation (avoid nested overwrite)
  if (!session.originalOrganizationId) {
    session.originalOrganizationId = session.organizationId
  }

  session.organizationId = organizationId
  await session.save()

  return NextResponse.json({
    message: "Impersonação iniciada com sucesso.",
    organization: {
      id: targetOrg.id,
      name: targetOrg.name,
      slug: targetOrg.slug,
      isActive: targetOrg.isActive,
    },
    isImpersonating: true,
    originalOrganizationId: session.originalOrganizationId,
  })
}
