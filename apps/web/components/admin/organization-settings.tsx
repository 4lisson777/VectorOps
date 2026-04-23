"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

// ---- Types ----------------------------------------------------------------

interface OrgData {
  id: string
  name: string
  slug: string
  isActive: boolean
  createdAt: string
  userCount: number
}

// ---- Organization Settings -----------------------------------------------

export function OrganizationSettings() {
  const [org, setOrg] = React.useState<OrgData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const [name, setName] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveMessage, setSaveMessage] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  React.useEffect(() => {
    void fetchOrg()
  }, [])

  async function fetchOrg() {
    setIsLoading(true)
    setLoadError(null)
    try {
      const res = await fetch("/api/organizations/current")
      if (!res.ok) {
        setLoadError("Falha ao carregar dados da organização.")
        return
      }
      const data = (await res.json()) as { organization: OrgData }
      setOrg(data.organization)
      setName(data.organization.name)
    } catch {
      setLoadError("Erro de rede. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return

    setIsSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch("/api/organizations/current", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = (await res.json()) as {
        organization?: OrgData
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
        setOrg(data.organization)
        setName(data.organization.name)
      }
      setSaveMessage({ type: "success", text: "Organização atualizada com sucesso." })
    } catch {
      setSaveMessage({ type: "error", text: "Erro de rede. Tente novamente." })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-1/3" />
        </CardContent>
      </Card>
    )
  }

  if (loadError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button variant="outline" size="sm" onClick={() => void fetchOrg()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Configurações da Organização</CardTitle>
        <CardDescription>
          Gerencie as informações da sua organização.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => void handleSave(e)} className="flex flex-col gap-5">
          {/* Save status message */}
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

          {/* Org name (editable) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgName">Nome da Organização</Label>
            <Input
              id="orgName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              placeholder="Nome da organização"
            />
          </div>

          {/* Slug (read-only) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgSlug">
              Slug{" "}
              <span className="text-muted-foreground font-normal">(somente leitura)</span>
            </Label>
            <Input
              id="orgSlug"
              type="text"
              value={org?.slug ?? ""}
              readOnly
              disabled
              className="font-mono text-sm opacity-70"
            />
            <p className="text-xs text-muted-foreground">
              O slug é gerado automaticamente a partir do nome e identifica sua
              organização internamente.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Membros
              </span>
              <span className="text-2xl font-bold tabular-nums">
                {org?.userCount ?? "—"}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Criada em
              </span>
              <span className="text-sm font-medium">
                {org?.createdAt
                  ? new Date(org.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving || !name.trim() || name.trim() === org?.name}
              className={cn(
                "text-sm font-semibold",
                "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]",
                "dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
              )}
            >
              {isSaving ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
