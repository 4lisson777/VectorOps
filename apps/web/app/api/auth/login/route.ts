import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const LoginSchema = z.object({
  email: z.string().email("Deve ser um endereço de e-mail válido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

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

  const { email, password } = parsed.data

  const user = await db.user.findUnique({ where: { email } })

  // Use a constant-time comparison path regardless of whether the user exists
  // to avoid timing-based email enumeration.
  if (!user) {
    await bcrypt.hash(password, 12) // dummy work to equalize timing
    return NextResponse.json(
      { error: "E-mail ou senha inválidos" },
      { status: 401 }
    )
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash)
  if (!passwordValid) {
    return NextResponse.json(
      { error: "E-mail ou senha inválidos" },
      { status: 401 }
    )
  }

  if (!user.isActive) {
    return NextResponse.json(
      { error: "Sua conta foi desativada. Entre em contato com um administrador." },
      { status: 403 }
    )
  }

  const session = await getSession()
  session.userId = user.id
  session.role = user.role
  session.name = user.name
  await session.save()

  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
