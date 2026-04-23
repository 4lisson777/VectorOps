import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { LoginSchema } from "@/lib/schemas/auth-schemas"

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limit: 5 attempts per minute per IP
  const ip = getClientIp(request)
  const rateLimit = checkRateLimit(`login:${ip}`, { limit: 5, windowMs: 60_000 })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Muitas solicitações. Tente novamente mais tarde." },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 })
  }

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { email, password, organizationSlug } = parsed.data

  // Find all users matching this email across all organizations.
  // We include the organization so we can disambiguate and check isActive.
  const usersWithOrg = await db.user.findMany({
    where: { email },
    include: { organization: true },
  })

  // Constant-time dummy work when no user exists to prevent timing-based email enumeration.
  if (usersWithOrg.length === 0) {
    await bcrypt.hash(password, 12)
    return NextResponse.json(
      { error: "E-mail ou senha inválidos" },
      { status: 401 }
    )
  }

  // Resolve which user record to authenticate against.
  // Returns the user record or a NextResponse to return early.
  function resolveUser(): (typeof usersWithOrg)[number] | NextResponse {
    if (organizationSlug) {
      // Client specified which org to log into — find the matching record.
      const found = usersWithOrg.find((u) => u.organization.slug === organizationSlug)
      if (!found) {
        return NextResponse.json(
          { error: "E-mail ou senha inválidos" },
          { status: 401 }
        )
      }
      return found
    }

    if (usersWithOrg.length > 1) {
      // Email exists in multiple organizations and no slug was supplied.
      // Return a 409 so the frontend can show an org picker and re-submit.
      const organizations = usersWithOrg.map((u) => ({
        name: u.organization.name,
        slug: u.organization.slug,
      }))
      return NextResponse.json(
        {
          error: "Múltiplas organizações encontradas",
          organizations,
        },
        { status: 409 }
      )
    }

    // Exactly one match — no ambiguity.
    // usersWithOrg.length > 0 is guaranteed by the early return above.
    return usersWithOrg[0]!
  }

  const userOrResponse = resolveUser()
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  // Validate password
  const passwordValid = await bcrypt.compare(password, user.passwordHash)
  if (!passwordValid) {
    return NextResponse.json(
      { error: "E-mail ou senha inválidos" },
      { status: 401 }
    )
  }

  // Check user account status
  if (!user.isActive) {
    return NextResponse.json(
      { error: "Sua conta foi desativada. Entre em contato com um administrador." },
      { status: 403 }
    )
  }

  // Check that the organization is still active
  if (!user.organization.isActive) {
    return NextResponse.json(
      { error: "Esta organização está inativa. Entre em contato com o suporte." },
      { status: 403 }
    )
  }

  const session = await getSession()
  session.userId = user.id
  session.role = user.role
  session.name = user.name
  session.organizationId = user.organizationId
  session.isSuperAdmin = user.isSuperAdmin
  await session.save()

  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        isSuperAdmin: user.isSuperAdmin,
        avatarUrl: user.avatarUrl,
        ninjaAlias: user.ninjaAlias,
        isActive: user.isActive,
        notifyTickets: user.notifyTickets,
        notifyBugs: user.notifyBugs,
        soundEnabled: user.soundEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
    { status: 200 }
  )
}
