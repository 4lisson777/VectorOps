import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { generateNinjaAlias } from "@/lib/ninja-alias"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { generateOrgSlug } from "@/lib/invite-code"
import {
  RegisterCreateOrgSchema,
  RegisterJoinOrgSchema,
} from "@/lib/schemas/auth-schemas"
import { ALL_ROLES, type Role } from "@/lib/types"

// Default RoleNotificationConfig values applied to each new organization.
// Mirrors the seed script defaults so orgs start with a consistent baseline.
const DEFAULT_ROLE_NOTIFICATION_CONFIGS = ALL_ROLES.map((role) => ({
  role,
  notifyOnCreation: false,
  notifyOnAssignment: false,
}))

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limit: 30 attempts per minute per IP (internal app; test suites need headroom)
  const ip = getClientIp(request)
  const rateLimit = checkRateLimit(`register:${ip}`, { limit: 30, windowMs: 60_000 })
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

  // Detect mode from the request body shape.
  // Exactly one of organizationName or inviteCode must be present.
  const hasOrgName =
    typeof body === "object" &&
    body !== null &&
    "organizationName" in body
  const hasInviteCode =
    typeof body === "object" &&
    body !== null &&
    "inviteCode" in body

  if (hasOrgName && hasInviteCode) {
    return NextResponse.json(
      { error: "Forneça organizationName ou inviteCode, não ambos." },
      { status: 400 }
    )
  }

  if (!hasOrgName && !hasInviteCode) {
    return NextResponse.json(
      { error: "É necessário fornecer organizationName (criar org) ou inviteCode (entrar em org)." },
      { status: 400 }
    )
  }

  if (hasOrgName) {
    return handleCreateOrg(body)
  }

  return handleJoinOrg(body)
}

/**
 * Mode 1 — Create Organization.
 * Creates the org, the first TECH_LEAD user, and default org configs.
 */
async function handleCreateOrg(body: unknown): Promise<NextResponse> {
  const parsed = RegisterCreateOrgSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, email, password, organizationName, ninjaAlias } = parsed.data

  // Generate a URL-safe slug from the org name
  const slug = generateOrgSlug(organizationName)
  if (!slug) {
    return NextResponse.json(
      { error: "Nome da organização inválido — não foi possível gerar um slug." },
      { status: 400 }
    )
  }

  // Check slug uniqueness
  const existingOrg = await db.organization.findUnique({ where: { slug } })
  if (existingOrg) {
    return NextResponse.json(
      { error: "Já existe uma organização com um nome similar. Escolha um nome diferente." },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const alias = ninjaAlias?.trim() || generateNinjaAlias()

  // Create org, user, and all default configs in a single transaction.
  const result = await db.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: organizationName, slug },
    })

    const user = await tx.user.create({
      data: {
        organizationId: org.id,
        name,
        email,
        passwordHash,
        role: "TECH_LEAD" as Role,
        ninjaAlias: alias,
      },
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
      },
    })

    // Seed the default configs for this new organization
    await tx.checkpointConfig.create({
      data: { organizationId: org.id },
    })

    await tx.tvConfig.create({
      data: { organizationId: org.id },
    })

    await tx.roleNotificationConfig.createMany({
      data: DEFAULT_ROLE_NOTIFICATION_CONFIGS.map((cfg) => ({
        ...cfg,
        organizationId: org.id,
      })),
    })

    return { org, user }
  })

  // Start a session immediately after successful registration
  const session = await getSession()
  session.userId = result.user.id
  session.role = result.user.role
  session.name = result.user.name
  session.organizationId = result.user.organizationId
  session.isSuperAdmin = result.user.isSuperAdmin
  await session.save()

  return NextResponse.json(
    {
      user: result.user,
      organization: {
        id: result.org.id,
        name: result.org.name,
        slug: result.org.slug,
      },
    },
    { status: 201 }
  )
}

/**
 * Mode 2 — Join Organization via Invite Code.
 * Validates the invite, creates the user with the invite's role and org,
 * and marks the invite as used.
 */
async function handleJoinOrg(body: unknown): Promise<NextResponse> {
  const parsed = RegisterJoinOrgSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, email, password, inviteCode, ninjaAlias } = parsed.data

  // Look up and validate the invite
  const invite = await db.invite.findUnique({
    where: { code: inviteCode.toUpperCase() },
    include: { organization: true },
  })

  if (!invite) {
    return NextResponse.json(
      { error: "Código de convite inválido." },
      { status: 400 }
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

  // If the invite was restricted to a specific email, enforce it
  if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json(
      { error: "Este convite foi criado para outro endereço de e-mail." },
      { status: 403 }
    )
  }

  // Check that email is not already taken within this org
  const existing = await db.user.findFirst({
    where: { organizationId: invite.organizationId, email },
  })
  if (existing) {
    return NextResponse.json(
      { error: "Este endereço de e-mail já está registrado nesta organização." },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const alias = ninjaAlias?.trim() || generateNinjaAlias()

  // Create user and mark invite as used atomically
  const result = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        organizationId: invite.organizationId,
        name,
        email,
        passwordHash,
        role: invite.role,
        ninjaAlias: alias,
      },
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
      },
    })

    await tx.invite.update({
      where: { id: invite.id },
      data: {
        usedById: user.id,
        usedAt: new Date(),
      },
    })

    return user
  })

  // Start a session immediately after successful registration
  const session = await getSession()
  session.userId = result.id
  session.role = result.role
  session.name = result.name
  session.organizationId = result.organizationId
  session.isSuperAdmin = result.isSuperAdmin
  await session.save()

  return NextResponse.json(
    {
      user: result,
      organization: {
        id: invite.organization.id,
        name: invite.organization.name,
        slug: invite.organization.slug,
      },
    },
    { status: 201 }
  )
}
