import { z } from "zod"
import { ALL_ROLES } from "@/lib/types"

export const InviteCreateSchema = z.object({
  role: z.enum(ALL_ROLES as [string, ...string[]], {
    errorMap: () => ({ message: "Cargo inválido" }),
  }),
  // If provided, the invite can only be used by a user with this email address
  email: z.string().email("Deve ser um endereço de e-mail válido").optional(),
  // How long the invite is valid for, in hours. Defaults to 72h.
  expiresInHours: z.number().int().min(1).max(720).default(72),
})

export const OrgCreateSchema = z.object({
  name: z
    .string({ required_error: "O nome da organização é obrigatório." })
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  // Optional slug override — auto-generated from name if absent
  slug: z
    .string()
    .min(2, "O slug deve ter no mínimo 2 caracteres.")
    .max(100, "O slug deve ter no máximo 100 caracteres.")
    .regex(/^[a-z0-9-]+$/, "O slug deve conter apenas letras minúsculas, números e hífens.")
    .optional(),
})

export const OrgUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres.")
    .optional(),
  slug: z
    .string()
    .min(2, "O slug deve ter no mínimo 2 caracteres.")
    .max(100, "O slug deve ter no máximo 100 caracteres.")
    .regex(/^[a-z0-9-]+$/, "O slug deve conter apenas letras minúsculas, números e hífens.")
    .optional(),
  isActive: z.boolean().optional(),
})

export const ImpersonateSchema = z.object({
  organizationId: z
    .string({ required_error: "O ID da organização é obrigatório." })
    .min(1, "O ID da organização não pode ser vazio."),
})

/** Schema used by TECH_LEAD for their own org update (slug is derived, isActive not exposed) */
export const OrgSelfUpdateSchema = z.object({
  name: z
    .string({ required_error: "O nome da organização é obrigatório." })
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
})
