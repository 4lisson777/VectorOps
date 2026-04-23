import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("Deve ser um endereço de e-mail válido"),
  password: z.string().min(1, "Senha é obrigatória"),
  // Optional: provided by the frontend when the user belongs to multiple orgs
  // and we need to disambiguate which org to log into.
  organizationSlug: z.string().optional(),
})

export const RegisterCreateOrgSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  email: z.string().email("Deve ser um endereço de e-mail válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  organizationName: z.string().min(1, "Nome da organização é obrigatório").max(100),
  ninjaAlias: z.string().max(50).optional(),
})

export const RegisterJoinOrgSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  email: z.string().email("Deve ser um endereço de e-mail válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  inviteCode: z.string().min(1, "Código de convite é obrigatório"),
  ninjaAlias: z.string().max(50).optional(),
})
