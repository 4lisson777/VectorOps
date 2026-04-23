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

// Role-to-home redirect map — mirrors server-side middleware logic
function getRoleHome(role: Role): string {
  if (role === "TECH_LEAD" || role === "DEVELOPER") return "/dev"
  return "/support"
}

interface OrgOption {
  name: string
  slug: string
}

interface FieldError {
  email?: string[]
  password?: string[]
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<FieldError>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  // Multi-org disambiguation state — shown when the API returns 409
  const [orgOptions, setOrgOptions] = React.useState<OrgOption[]>([])
  const [selectedOrgSlug, setSelectedOrgSlug] = React.useState<string>("")
  const isMultiOrg = orgOptions.length > 0

  async function submitLogin(organizationSlug?: string) {
    setIsPending(true)
    try {
      const body: Record<string, string> = { email, password }
      if (organizationSlug) body.organizationSlug = organizationSlug

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = (await res.json()) as {
        user?: { role: Role }
        error?: string
        details?: FieldError
        // 409 multi-org response
        organizations?: OrgOption[]
      }

      if (res.status === 409 && data.organizations) {
        // Show org picker — user has accounts in multiple organizations
        setOrgOptions(data.organizations)
        setSelectedOrgSlug("")
        setServerError(null)
        return
      }

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details)
        } else {
          setServerError(data.error ?? "Falha ao entrar. Tente novamente.")
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setServerError(null)
    setOrgOptions([])

    const errors: FieldError = {}
    if (!email) errors.email = ["Email é obrigatório"]
    if (!password) errors.password = ["Senha é obrigatória"]
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    await submitLogin()
  }

  async function handleOrgSelect() {
    if (!selectedOrgSlug) {
      setServerError("Selecione uma organização para continuar.")
      return
    }
    setServerError(null)
    await submitLogin(selectedOrgSlug)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Server-level error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="email@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!fieldErrors.email}
          disabled={isPending || isMultiOrg}
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!fieldErrors.password}
          disabled={isPending || isMultiOrg}
        />
        {fieldErrors.password && (
          <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
        )}
      </div>

      {/* Multi-org picker — shown only after a 409 response */}
      {isMultiOrg && (
        <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/40 p-3">
          <p className="text-xs font-medium text-foreground">
            Sua conta está em múltiplas organizações. Selecione para qual deseja
            entrar:
          </p>
          <Select
            value={selectedOrgSlug}
            onValueChange={setSelectedOrgSlug}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma organização" />
            </SelectTrigger>
            <SelectContent>
              {orgOptions.map((org) => (
                <SelectItem key={org.slug} value={org.slug}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setOrgOptions([])
                setSelectedOrgSlug("")
              }}
              disabled={isPending}
            >
              Voltar
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPending || !selectedOrgSlug}
              onClick={() => void handleOrgSelect()}
              className={cn(
                "flex-1 text-sm font-semibold",
                "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]",
                "dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
              )}
            >
              {isPending ? "Entrando…" : "Confirmar"}
            </Button>
          </div>
        </div>
      )}

      {/* Submit button — hidden when the org picker is visible */}
      {!isMultiOrg && (
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className={cn(
            "mt-1 h-10 w-full text-sm font-semibold",
            "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]",
            "dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
          )}
        >
          {isPending ? "Entrando…" : "Entrar"}
        </Button>
      )}

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Novo usuário?{" "}
        <Link
          href="/register"
          className="font-medium text-[oklch(0.68_0.22_320)] underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </form>
  )
}
