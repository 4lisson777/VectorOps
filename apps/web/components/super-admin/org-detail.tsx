"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

// ---- Types ----------------------------------------------------------------

interface OrgUser {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  // avatarUrl and ninjaAlias are not returned by the super-admin API
  avatarUrl?: string | null
  ninjaAlias?: string
}

interface OrgDetail {
  id: string
  name: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  userCount: number
  /** API returns totalTicketCount and activeTicketCount as top-level numbers */
  totalTicketCount: number
  activeTicketCount: number
  users: OrgUser[]
}

const ROLE_LABELS: Record<string, string> = {
  TECH_LEAD: "Tech Lead",
  DEVELOPER: "Desenvolvedor",
  SUPPORT_LEAD: "Líder de Suporte",
  SUPPORT_MEMBER: "Membro de Suporte",
  QA: "QA",
}

// ---- OrgDetail (main component) ------------------------------------------

interface OrgDetailProps {
  organizationId: string
}

export function OrgDetail({ organizationId }: OrgDetailProps) {
  const router = useRouter()
  const [org, setOrg] = React.useState<OrgDetail | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Edit form state
  const [editName, setEditName] = React.useState("")
  const [editSlug, setEditSlug] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveMessage, setSaveMessage] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // Impersonation
  const [isImpersonating, setIsImpersonating] = React.useState(false)
  const [impersonateError, setImpersonateError] = React.useState<string | null>(null)

  React.useEffect(() => {
    void fetchOrg()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId])

  async function fetchOrg() {
    setIsLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/super-admin/organizations/${organizationId}`)
      if (!res.ok) {
        setLoadError("Falha ao carregar dados da organização.")
        return
      }
      const data = (await res.json()) as { organization: OrgDetail }
      setOrg(data.organization)
      setEditName(data.organization.name)
      setEditSlug(data.organization.slug)
    } catch {
      setLoadError("Erro de rede. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editName.trim()) return
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const body: Record<string, string> = { name: editName.trim() }
      if (editSlug.trim()) body.slug = editSlug.trim()

      const res = await fetch(`/api/super-admin/organizations/${organizationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      // PATCH returns a partial org shape (no users/ticketCounts)
      const data = (await res.json()) as {
        organization?: Pick<OrgDetail, "id" | "name" | "slug" | "isActive" | "createdAt" | "updatedAt">
        error?: string
      }

      if (!res.ok) {
        setSaveMessage({
          type: "error",
          text: data.error ?? "Falha ao salvar. Tente novamente.",
        })
        return
      }

      if (data.organization) {
        // Merge the partial update into the existing state
        setOrg((prev) =>
          prev ? { ...prev, ...data.organization } : prev
        )
        setEditName(data.organization.name)
        setEditSlug(data.organization.slug)
      }
      setSaveMessage({ type: "success", text: "Organização atualizada." })
    } catch {
      setSaveMessage({ type: "error", text: "Erro de rede." })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleImpersonate() {
    setIsImpersonating(true)
    setImpersonateError(null)
    try {
      const res = await fetch("/api/super-admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setImpersonateError(data.error ?? "Falha ao acessar organização.")
        return
      }
      // Navigate to the organization's main page
      router.push("/dev")
      router.refresh()
    } catch {
      setImpersonateError("Erro de rede. Tente novamente.")
    } finally {
      setIsImpersonating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    )
  }

  if (loadError || !org) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <p className="text-sm text-destructive">{loadError ?? "Organização não encontrada."}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Edit form */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{org.name}</CardTitle>
              <CardDescription className="font-mono text-xs mt-1">
                {org.slug}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={org.isActive ? "outline" : "secondary"}
                className={cn(
                  org.isActive
                    ? "border-green-500/30 text-green-600 dark:text-green-400"
                    : ""
                )}
              >
                {org.isActive ? "Ativa" : "Inativa"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void handleSave(e)} className="flex flex-col gap-4">
            {saveMessage && (
              <div
                role={saveMessage.type === "error" ? "alert" : "status"}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  saveMessage.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                )}
              >
                {saveMessage.text}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="saOrgName">Nome</Label>
                <Input
                  id="saOrgName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="saOrgSlug">Slug</Label>
                <Input
                  id="saOrgSlug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  disabled={isSaving}
                  className="font-mono text-sm"
                  placeholder="minha-empresa"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground block">Membros</span>
                <span className="text-xl font-bold tabular-nums">{org.userCount}</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground block">Tickets ativos</span>
                <span className="text-xl font-bold tabular-nums">{org.activeTicketCount}</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground block">Total tickets</span>
                <span className="text-xl font-bold tabular-nums">{org.totalTicketCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-muted-foreground">
                Criada em:{" "}
                {new Date(org.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <Button
                type="submit"
                disabled={
                  isSaving ||
                  !editName.trim() ||
                  (editName.trim() === org.name && editSlug.trim() === org.slug)
                }
                className={cn(
                  "text-sm font-semibold",
                  "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]"
                )}
              >
                {isSaving ? "Salvando…" : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Impersonation card */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-base text-amber-700 dark:text-amber-400">
            Visualizar como esta organização
          </CardTitle>
          <CardDescription>
            Acesse o sistema com o contexto desta organização para depuração ou
            suporte. Um banner será exibido enquanto estiver em modo de
            visualização.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {impersonateError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {impersonateError}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={isImpersonating || !org.isActive}
            onClick={() => void handleImpersonate()}
            className="self-start border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
          >
            {isImpersonating ? "Acessando…" : "Visualizar como esta organização"}
          </Button>
          {!org.isActive && (
            <p className="text-xs text-muted-foreground">
              Organização inativa — não é possível acessar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* User list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Membros ({org.userCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {org.users.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhum membro encontrado.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {org.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <UserAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl ?? null}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </Badge>
                    {!user.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
