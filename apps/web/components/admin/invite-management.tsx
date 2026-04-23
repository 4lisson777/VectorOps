"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import type { Role } from "@/lib/types"

// ---- Types ----------------------------------------------------------------

interface Invite {
  id: string
  code: string
  role: string
  email: string | null
  expiresAt: string
  createdAt: string
  createdBy: { id: string; name: string }
}

// ---- Constants ------------------------------------------------------------

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "SUPPORT_MEMBER", label: "Membro de Suporte" },
  { value: "SUPPORT_LEAD", label: "Líder de Suporte" },
  { value: "DEVELOPER", label: "Desenvolvedor" },
  { value: "QA", label: "QA" },
  { value: "TECH_LEAD", label: "Tech Lead" },
]

const ROLE_LABELS: Record<string, string> = {
  TECH_LEAD: "Tech Lead",
  DEVELOPER: "Desenvolvedor",
  SUPPORT_LEAD: "Líder de Suporte",
  SUPPORT_MEMBER: "Membro de Suporte",
  QA: "QA",
}

const EXPIRY_OPTIONS = [
  { value: "24", label: "24 horas" },
  { value: "48", label: "48 horas" },
  { value: "72", label: "72 horas" },
  { value: "168", label: "7 dias" },
]

// ---- Copy helper ----------------------------------------------------------

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ---- New Invite Dialog ----------------------------------------------------

interface NewInviteDialogProps {
  organizationId: string
  onCreated: (invite: Invite) => void
}

function NewInviteDialog({ organizationId, onCreated }: NewInviteDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [role, setRole] = React.useState<Role | "">("")
  const [emailRestriction, setEmailRestriction] = React.useState("")
  const [expiresInHours, setExpiresInHours] = React.useState("24")
  const [isPending, setIsPending] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  // Created invite shown inline after creation
  const [createdInvite, setCreatedInvite] = React.useState<Invite | null>(null)
  const [copied, setCopied] = React.useState(false)

  function resetForm() {
    setRole("")
    setEmailRestriction("")
    setExpiresInHours("24")
    setServerError(null)
    setCreatedInvite(null)
    setCopied(false)
  }

  function handleOpenChange(val: boolean) {
    if (!val) resetForm()
    setOpen(val)
  }

  function getInviteLink(code: string) {
    return `${window.location.origin}/register?invite=${code}`
  }

  async function handleCopyLink(code: string) {
    const ok = await copyToClipboard(getInviteLink(code))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!role) return
    setIsPending(true)
    setServerError(null)

    try {
      const body: Record<string, unknown> = {
        role,
        expiresInHours: Number(expiresInHours),
      }
      if (emailRestriction.trim()) body.email = emailRestriction.trim()

      const res = await fetch(
        `/api/organizations/${organizationId}/invites`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )

      const data = (await res.json()) as {
        invite?: Invite
        error?: string
      }

      if (!res.ok) {
        setServerError(data.error ?? "Falha ao criar convite. Tente novamente.")
        return
      }

      if (data.invite) {
        setCreatedInvite(data.invite)
        onCreated(data.invite)
      }
    } catch {
      setServerError("Erro de rede. Tente novamente.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={cn(
            "text-sm font-semibold",
            "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]",
            "dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
          )}
        >
          + Novo Convite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Criar Convite</DialogTitle>
          <DialogDescription>
            Gere um link de convite para um novo membro entrar na organização.
          </DialogDescription>
        </DialogHeader>

        {createdInvite ? (
          /* Success state — show copyable invite link */
          <div className="flex flex-col gap-4">
            <div
              role="status"
              className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
            >
              Convite criado com sucesso!
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Código do convite</Label>
              <div className="rounded-md border border-border bg-muted px-4 py-3 text-center font-mono text-2xl font-bold tracking-widest text-foreground">
                {createdInvite.code}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Link de convite</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={getInviteLink(createdInvite.code)}
                  className="font-mono text-xs"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCopyLink(createdInvite.code)}
                  className="shrink-0"
                >
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Expira em:{" "}
              {new Date(createdInvite.expiresAt).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
              {" · "}
              Cargo:{" "}
              <span className="font-medium">
                {ROLE_LABELS[createdInvite.role] ?? createdInvite.role}
              </span>
            </p>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
            {serverError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {serverError}
              </div>
            )}

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inviteRole">Cargo</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as Role)}
                disabled={isPending}
              >
                <SelectTrigger id="inviteRole">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email restriction (optional) */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inviteEmail">
                Email{" "}
                <span className="font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="Deixe vazio para permitir qualquer email"
                value={emailRestriction}
                onChange={(e) => setEmailRestriction(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Expiry */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inviteExpiry">Validade</Label>
              <Select
                value={expiresInHours}
                onValueChange={setExpiresInHours}
                disabled={isPending}
              >
                <SelectTrigger id="inviteExpiry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || !role}
                className={cn(
                  "text-sm font-semibold",
                  "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]",
                  "dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
                )}
              >
                {isPending ? "Criando…" : "Criar convite"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ---- Invite Row -----------------------------------------------------------

interface InviteRowProps {
  invite: Invite
  organizationId: string
  onRevoked: (inviteId: string) => void
}

function InviteRow({ invite, organizationId, onRevoked }: InviteRowProps) {
  const [isRevoking, setIsRevoking] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  function getInviteLink(code: string) {
    return `${window.location.origin}/register?invite=${code}`
  }

  async function handleCopy() {
    const ok = await copyToClipboard(getInviteLink(invite.code))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleRevoke() {
    if (!confirm(`Revogar o convite "${invite.code}"?`)) return
    setIsRevoking(true)
    try {
      const res = await fetch(
        `/api/organizations/${organizationId}/invites/${invite.id}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        onRevoked(invite.id)
      }
    } catch {
      // Ignore — row remains visible; user can try again
    } finally {
      setIsRevoking(false)
    }
  }

  const expiresAt = new Date(invite.expiresAt)
  const isExpiringSoon =
    expiresAt.getTime() - Date.now() < 1000 * 60 * 60 * 24 // < 24h

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 min-w-0">
        {/* Code + role */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-bold tracking-widest text-foreground">
            {invite.code}
          </span>
          <Badge variant="outline" className="text-xs">
            {ROLE_LABELS[invite.role] ?? invite.role}
          </Badge>
          {invite.email && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {invite.email}
            </Badge>
          )}
        </div>
        {/* Expiry + creator */}
        <p className={cn("text-xs", isExpiringSoon ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
          Expira:{" "}
          {expiresAt.toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
          {isExpiringSoon && " (expira em breve)"}
          {" · "}
          Criado por {invite.createdBy.name}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void handleCopy()}
          className="text-xs"
        >
          {copied ? "Copiado!" : "Copiar Link"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isRevoking}
          onClick={() => void handleRevoke()}
          className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
        >
          {isRevoking ? "Revogando…" : "Revogar"}
        </Button>
      </div>
    </div>
  )
}

// ---- Invite Management (main component) ----------------------------------

interface InviteManagementProps {
  organizationId: string
}

export function InviteManagement({ organizationId }: InviteManagementProps) {
  const [invites, setInvites] = React.useState<Invite[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    void fetchInvites()
  }, [])

  async function fetchInvites() {
    setIsLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/organizations/${organizationId}/invites`)
      if (!res.ok) {
        setLoadError("Falha ao carregar convites.")
        return
      }
      const data = (await res.json()) as { invites: Invite[] }
      setInvites(data.invites)
    } catch {
      setLoadError("Erro de rede. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleCreated(invite: Invite) {
    setInvites((prev) => [invite, ...prev])
  }

  function handleRevoked(inviteId: string) {
    setInvites((prev) => prev.filter((inv) => inv.id !== inviteId))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Convites Ativos</CardTitle>
            <CardDescription className="mt-1">
              Gerencie os convites para novos membros ingressarem na organização.
            </CardDescription>
          </div>
          <NewInviteDialog
            organizationId={organizationId}
            onCreated={handleCreated}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-destructive">{loadError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchInvites()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : invites.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum convite ativo no momento.
            </p>
            <p className="text-xs text-muted-foreground">
              Crie um convite para adicionar novos membros à organização.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {invites.map((invite) => (
              <InviteRow
                key={invite.id}
                invite={invite}
                organizationId={organizationId}
                onRevoked={handleRevoked}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
