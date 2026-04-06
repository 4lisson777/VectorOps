import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { generateNinjaAlias } from "@/lib/ninja-alias"
import { ALL_ROLES, type SafeUser } from "@/lib/types"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const RegisterSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  email: z.string().email("Deve ser um endereço de e-mail válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  role: z.enum(
    ALL_ROLES as [string, ...string[]],
    { errorMap: () => ({ message: "Cargo inválido" }) }
  ),
  ninjaAlias: z.string().max(50).optional(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limit: 5 attempts per minute per IP
  const ip = getClientIp(request)
  const rateLimit = checkRateLimit(`register:${ip}`, { limit: 5, windowMs: 60_000 })
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

  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Falha na validação", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, email, password, role, ninjaAlias } = parsed.data

  // Enforce email uniqueness before attempting insertion
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: "Este endereço de e-mail já está registrado" },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const alias = ninjaAlias?.trim() || generateNinjaAlias()

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role as SafeUser["role"],
      ninjaAlias: alias,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
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

  // Start a session immediately after successful registration
  const session = await getSession()
  session.userId = user.id
  session.role = user.role
  session.name = user.name
  await session.save()

  return NextResponse.json({ user }, { status: 201 })
}
