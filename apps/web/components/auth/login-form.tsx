"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import type { Role } from "@/lib/types"

// Role-to-home redirect map — mirrors server-side middleware logic
function getRoleHome(role: Role): string {
  if (role === "TECH_LEAD" || role === "DEVELOPER") return "/dev"
  return "/support"
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setServerError(null)

    // Basic client-side validation
    const errors: FieldError = {}
    if (!email) errors.email = ["Email é obrigatório"]
    if (!password) errors.password = ["Senha é obrigatória"]
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsPending(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = (await res.json()) as {
        user?: { role: Role }
        error?: string
        details?: FieldError
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
          placeholder="email@inovar.com"
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!fieldErrors.password}
          disabled={isPending}
        />
        {fieldErrors.password && (
          <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
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
        {isPending ? "Entrando…" : "Entrar"}
      </Button>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Novo usuário?{" "}
        <Link
          href="/register"
          className="font-medium text-[oklch(0.56_0.22_15)] underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </form>
  )
}
