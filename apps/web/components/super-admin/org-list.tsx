"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import { Switch } from "@workspace/ui/components/switch"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

// ---- Types ----------------------------------------------------------------

interface OrgSummary {
  id: string
  name: string
  slug: string
  isActive: boolean
  userCount: number
  ticketCount: number
  createdAt: string
}

interface OrgListResponse {
  organizations: OrgSummary[]
  pagination: {
    total: number
    page: number
    totalPages: number
    limit: number
  }
}

// ---- Create Org Dialog ---------------------------------------------------

interface CreateOrgDialogProps {
  onCreated: (org: OrgSummary) => void
}

function CreateOrgDialog({ onCreated }: CreateOrgDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [isPending, setIsPending] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)

  function handleOpenChange(val: boolean) {
    if (!val) {
      setName("")
      setServerError(null)
    }
    setOpen(val)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return
    setIsPending(true)
    setServerError(null)

    try {
      const res = await fetch("/api/super-admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = (await res.json()) as {
        organization?: Omit<OrgSummary, "userCount" | "ticketCount">
        error?: string
      }

      if (!res.ok) {
        setServerError(data.error ?? "Falha ao criar organização.")
        return
      }

      if (data.organization) {
        // POST response doesn't include counts — default to 0
        onCreated({ ...data.organization, userCount: 0, ticketCount: 0 })
        setOpen(false)
        setName("")
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
            "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]"
          )}
        >
          + Criar Organização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nova Organização</DialogTitle>
          <DialogDescription>
            Crie uma nova organização vazia. Um Tech Lead pode ser adicionado
            via convite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          {serverError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newOrgName">Nome da Organização</Label>
            <Input
              id="newOrgName"
              type="text"
              placeholder="Nome da organização"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              autoFocus
            />
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
              disabled={isPending || !name.trim()}
              className={cn(
                "text-sm font-semibold",
                "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]"
              )}
            >
              {isPending ? "Criando…" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---- OrgList (main component) --------------------------------------------

export function OrgList() {
  const router = useRouter()
  const [orgs, setOrgs] = React.useState<OrgSummary[]>([])
  const [total, setTotal] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [togglingId, setTogglingId] = React.useState<string | null>(null)

  // Debounce search
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    void fetchOrgs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchOrgs(searchQuery?: string) {
    setIsLoading(true)
    setLoadError(null)
    try {
      const params = new URLSearchParams({ limit: "50" })
      if (searchQuery) params.set("search", searchQuery)
      const res = await fetch(`/api/super-admin/organizations?${params}`)
      if (!res.ok) {
        setLoadError("Falha ao carregar organizações.")
        return
      }
      const data = (await res.json()) as OrgListResponse
      setOrgs(data.organizations)
      setTotal(data.pagination.total)
    } catch {
      setLoadError("Erro de rede. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void fetchOrgs(val.trim() || undefined)
    }, 300)
  }

  async function handleToggleActive(org: OrgSummary) {
    setTogglingId(org.id)
    try {
      const res = await fetch(`/api/super-admin/organizations/${org.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !org.isActive }),
      })
      if (res.ok) {
        setOrgs((prev) =>
          prev.map((o) =>
            o.id === org.id ? { ...o, isActive: !org.isActive } : o
          )
        )
      }
    } catch {
      // Ignore — state reverts visually on re-render
    } finally {
      setTogglingId(null)
    }
  }

  function handleCreated(org: OrgSummary) {
    setOrgs((prev) => [org, ...prev])
    setTotal((t) => t + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Input
            type="search"
            placeholder="Buscar organização…"
            value={search}
            onChange={handleSearchChange}
            className="pl-8"
          />
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
            <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {total} organização{total !== 1 ? "s" : ""}
          </span>
          <CreateOrgDialog onCreated={handleCreated} />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button variant="outline" size="sm" onClick={() => void fetchOrgs(search)}>
            Tentar novamente
          </Button>
        </div>
      ) : orgs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search ? "Nenhuma organização encontrada." : "Nenhuma organização cadastrada."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead className="text-center">Membros</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Tickets</TableHead>
                <TableHead className="hidden lg:table-cell">Criada em</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((org) => (
                <TableRow
                  key={org.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/super-admin/organizations/${org.id}`)}
                >
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="font-mono text-xs text-muted-foreground">
                      {org.slug}
                    </span>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {org.userCount}
                  </TableCell>
                  <TableCell className="text-center tabular-nums hidden sm:table-cell">
                    {org.ticketCount}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={org.isActive}
                        onCheckedChange={() => void handleToggleActive(org)}
                        disabled={togglingId === org.id}
                        aria-label={org.isActive ? "Desativar organização" : "Ativar organização"}
                      />
                      <Badge
                        variant={org.isActive ? "outline" : "secondary"}
                        className={cn(
                          "text-xs hidden xl:inline-flex",
                          org.isActive ? "border-green-500/30 text-green-600 dark:text-green-400" : ""
                        )}
                      >
                        {org.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
