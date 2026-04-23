"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { Role } from "@/lib/types"

function getRoleHome(role: Role): string {
  if (role === "TECH_LEAD" || role === "DEVELOPER") return "/dev"
  return "/support"
}

const ROLE_LABELS: Record<string, string> = {
  TECH_LEAD: "Tech Lead",
  DEVELOPER: "Desenvolvedor",
  SUPPORT_LEAD: "Líder de Suporte",
  SUPPORT_MEMBER: "Membro de Suporte",
  QA: "QA",
}

interface FieldErrors {
  name?: string[]
  email?: string[]
  password?: string[]
  ninjaAlias?: string[]
  organizationName?: string[]
  inviteCode?: string[]
}

interface InviteInfo {
  organizationName: string
  role: string
  email?: string
  expiresAt: string
}

interface RegisterFormProps {
  /** Pre-fill invite code and auto-switch to join mode (from ?invite= URL param) */
  initialInviteCode?: string
}

export function RegisterForm({ initialInviteCode }: RegisterFormProps) {
  const router = useRouter()

  // Common fields
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [ninjaAlias, setNinjaAlias] = React.useState("")

  // Create org specific
  const [organizationName, setOrganizationName] = React.useState("")

  // Join via invite specific
  const [inviteCode, setInviteCode] = React.useState(initialInviteCode ?? "")
  const [inviteInfo, setInviteInfo] = React.useState<InviteInfo | null>(null)
  const [inviteError, setInviteError] = React.useState<string | null>(null)
  const [isValidatingInvite, setIsValidatingInvite] = React.useState(false)

  // Form state
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  // Default to "join" tab if invite code pre-filled
  const defaultTab = initialInviteCode ? "join" : "create"

  // Validate invite code on mount if pre-filled
  React.useEffect(() => {
    if (initialInviteCode) {
      void validateInviteCode(initialInviteCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function validateInviteCode(code: string) {
    const trimmed = code.trim()
    if (!trimmed) {
      setInviteInfo(null)
      setInviteError(null)
      return
    }
    setIsValidatingInvite(true)
    setInviteError(null)
    setInviteInfo(null)
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(trimmed)}`)
      const data = (await res.json()) as InviteInfo & { error?: string }
      if (!res.ok) {
        if (res.status === 404) {
          setInviteError("Código de convite não encontrado.")
        } else if (res.status === 409) {
          setInviteError("Este convite já foi utilizado.")
        } else if (res.status === 410) {
          setInviteError("Este convite expirou.")
        } else if (res.status === 403) {
          setInviteError("Organização inativa.")
        } else {
          setInviteError(data.error ?? "Código de convite inválido.")
        }
      } else {
        setInviteInfo(data)
      }
    } catch {
      setInviteError("Erro ao validar o código. Tente novamente.")
    } finally {
      setIsValidatingInvite(false)
    }
  }

  function handleInviteCodeBlur() {
    if (inviteCode.trim()) {
      void validateInviteCode(inviteCode)
    }
  }

  function handleInviteCodeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      void validateInviteCode(inviteCode)
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    mode: "create" | "join"
  ) {
    e.preventDefault()
    setFieldErrors({})
    setServerError(null)

    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = ["Nome completo é obrigatório"]
    if (!email) errors.email = ["E-mail é obrigatório"]
    if (!password || password.length < 8)
      errors.password = ["A senha deve ter pelo menos 8 caracteres"]

    if (mode === "create") {
      if (!organizationName.trim())
        errors.organizationName = ["Nome da organização é obrigatório"]
    } else {
      if (!inviteCode.trim())
        errors.inviteCode = ["Código de convite é obrigatório"]
      if (inviteError) {
        errors.inviteCode = [inviteError]
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsPending(true)
    try {
      const body: Record<string, string> = { name, email, password }
      if (ninjaAlias.trim()) body.ninjaAlias = ninjaAlias.trim()

      if (mode === "create") {
        body.organizationName = organizationName.trim()
      } else {
        body.inviteCode = inviteCode.trim()
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = (await res.json()) as {
        user?: { role: Role }
        organization?: { name: string }
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

  const commonFields = (
    <>
      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="João Silva"
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
          placeholder="email@empresa.com"
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

      {/* Ninja alias */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ninjaAlias">
          Apelido{" "}
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
    </>
  )

  return (
    <div className="flex flex-col gap-4">
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Criar Organização</TabsTrigger>
          <TabsTrigger value="join">Tenho um Convite</TabsTrigger>
        </TabsList>

        {/* ---- Create org tab ---- */}
        <TabsContent value="create">
          <form
            onSubmit={(e) => handleSubmit(e, "create")}
            noValidate
            className="flex flex-col gap-4 pt-2"
          >
            {/* Org name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organizationName">Nome da Organização</Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Minha Empresa"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                aria-invalid={!!fieldErrors.organizationName}
                disabled={isPending}
              />
              {fieldErrors.organizationName && (
                <p className="text-xs text-destructive">
                  {fieldErrors.organizationName[0]}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Você será o Tech Lead desta organização.
              </p>
            </div>

            {commonFields}

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
              {isPending ? "Criando organização…" : "Criar organização"}
            </Button>
          </form>
        </TabsContent>

        {/* ---- Join via invite tab ---- */}
        <TabsContent value="join">
          <form
            onSubmit={(e) => handleSubmit(e, "join")}
            noValidate
            className="flex flex-col gap-4 pt-2"
          >
            {/* Invite code */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inviteCode">Código de Convite</Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="Ex: AB3XYZ89"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase())
                  setInviteInfo(null)
                  setInviteError(null)
                }}
                onBlur={handleInviteCodeBlur}
                onKeyDown={handleInviteCodeKeyDown}
                aria-invalid={!!fieldErrors.inviteCode || !!inviteError}
                disabled={isPending}
                className="font-mono text-base tracking-widest uppercase"
              />
              {isValidatingInvite && (
                <p className="text-xs text-muted-foreground">
                  Validando código…
                </p>
              )}
              {inviteError && !isValidatingInvite && (
                <p className="text-xs text-destructive">{inviteError}</p>
              )}
              {fieldErrors.inviteCode && !inviteError && (
                <p className="text-xs text-destructive">
                  {fieldErrors.inviteCode[0]}
                </p>
              )}
              {/* Invite info preview */}
              {inviteInfo && !inviteError && (
                <div className="rounded-md border border-border bg-muted/50 p-3 flex flex-col gap-1">
                  <p className="text-xs font-semibold text-foreground">
                    {inviteInfo.organizationName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Cargo:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {ROLE_LABELS[inviteInfo.role] ?? inviteInfo.role}
                    </Badge>
                  </div>
                  {inviteInfo.email && (
                    <p className="text-xs text-muted-foreground">
                      Restrito ao email:{" "}
                      <span className="font-medium text-foreground">
                        {inviteInfo.email}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {commonFields}

            <Button
              type="submit"
              size="lg"
              disabled={isPending || isValidatingInvite}
              className={cn(
                "mt-1 h-10 w-full text-sm font-semibold",
                "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]",
                "dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
              )}
            >
              {isPending ? "Entrando na organização…" : "Entrar na organização"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-[oklch(0.68_0.22_320)] underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
