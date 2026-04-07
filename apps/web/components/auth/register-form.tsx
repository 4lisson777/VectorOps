"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import type { Role } from "@/lib/types"

function getRoleHome(role: Role): string {
  if (role === "TECH_LEAD" || role === "DEVELOPER") return "/dev"
  return "/support"
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "SUPPORT_MEMBER", label: "Membro de Suporte" },
  { value: "SUPPORT_LEAD", label: "Líder de Suporte" },
  { value: "DEVELOPER", label: "Ninja (Desenvolvedor)" },
  { value: "TECH_LEAD", label: "Jōnin (Tech Lead)" },
]

interface FieldErrors {
  name?: string[]
  email?: string[]
  password?: string[]
  role?: string[]
  ninjaAlias?: string[]
}

export function RegisterForm() {
  const router = useRouter()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<Role | "">("")
  const [ninjaAlias, setNinjaAlias] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setServerError(null)

    // Basic client-side validation
    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = ["Nome completo é obrigatório"]
    if (!email) errors.email = ["E-mail é obrigatório"]
    if (!password || password.length < 8)
      errors.password = ["A senha deve ter pelo menos 8 caracteres"]
    if (!role) errors.role = ["Por favor, selecione seu cargo"]
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsPending(true)
    try {
      const body: Record<string, string> = { name, email, password, role }
      if (ninjaAlias.trim()) body.ninjaAlias = ninjaAlias.trim()

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = (await res.json()) as {
        user?: { role: Role }
        error?: string
        details?: FieldErrors
      }

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details)
        } else {
          setServerError(data.error ?? "Cadastro falhou. Tente novamente.")
        }
        return
      }

      if (data.user) {
        router.push(getRoleHome(data.user.role))
        router.refresh()
      }
    } catch {
      setServerError("Erro de rede. Verifique sua conexão.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Ryu Hayabusa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!fieldErrors.name}
          disabled={isPending}
        />
        {fieldErrors.name && (
          <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ninja@inovar.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!fieldErrors.email}
          disabled={isPending}
        />
        {fieldErrors.email && (
          <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mín. 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!fieldErrors.password}
          disabled={isPending}
        />
        {fieldErrors.password && (
          <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
        )}
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="role">Cargo</Label>
        <Select
          value={role}
          onValueChange={(v) => setRole(v as Role)}
          disabled={isPending}
        >
          <SelectTrigger id="role" aria-invalid={!!fieldErrors.role}>
            <SelectValue placeholder="Selecione seu cargo" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.role && (
          <p className="text-xs text-destructive">{fieldErrors.role[0]}</p>
        )}
      </div>

      {/* Ninja alias */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ninjaAlias">
          Ninja Alias{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="ninjaAlias"
          type="text"
          placeholder="Gerado automaticamente se vazio"
          value={ninjaAlias}
          onChange={(e) => setNinjaAlias(e.target.value)}
          disabled={isPending}
        />
        {fieldErrors.ninjaAlias && (
          <p className="text-xs text-destructive">{fieldErrors.ninjaAlias[0]}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className={cn(
          "mt-1 h-10 w-full text-sm font-semibold",
          "bg-[oklch(0.56_0.22_15)] text-white hover:bg-[oklch(0.50_0.22_15)]",
          "dark:bg-[oklch(0.56_0.22_15)] dark:hover:bg-[oklch(0.50_0.22_15)]"
        )}
      >
        {isPending ? "Entrando para o clã…" : "Entrar para o Clã"}
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Já é shinobi?{" "}
        <Link
          href="/login"
          className="font-medium text-[oklch(0.56_0.22_15)] underline-offset-4 hover:underline"
        >
          Entrar no Dojo
        </Link>
      </p>
    </form>
  )
}
