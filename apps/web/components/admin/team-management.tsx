"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

// ---- Types ----------------------------------------------------------------

type Role = "TECH_LEAD" | "DEVELOPER" | "SUPPORT_LEAD" | "SUPPORT_MEMBER" | "QA"

interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl: string | null
  ninjaAlias: string
  isActive: boolean
  devStatus: string | null
  currentTask: string | null
  updatedAt: string
}

const ROLE_LABELS: Record<Role, string> = {
  TECH_LEAD: "Tech Lead",
  DEVELOPER: "Desenvolvedor",
  SUPPORT_LEAD: "Líder de Suporte",
  SUPPORT_MEMBER: "Membro de Suporte",
  QA: "QA",
}

// ---- Upload icon ----------------------------------------------------------

function UploadIcon() {
  return (
    <svg
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

// ---- TeamManagement component ---------------------------------------------

export function TeamManagement() {
  const [users, setUsers] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Filters
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL")
  const [activeFilter, setActiveFilter] = React.useState<string>("ALL")

  // Per-row saving state
  const [savingRoleFor, setSavingRoleFor] = React.useState<string | null>(null)
  const [savingActiveFor, setSavingActiveFor] = React.useState<string | null>(null)
  const [uploadingFor, setUploadingFor] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const uploadTargetId = React.useRef<string | null>(null)

  async function loadUsers() {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (roleFilter !== "ALL") params.set("role", roleFilter)
      if (activeFilter !== "ALL") params.set("isActive", activeFilter)

      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to load users")
      const data = (await res.json()) as { users: User[] }
      setUsers(data.users)
    } catch {
      setError("Não foi possível carregar os membros da equipe. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Load on mount and when filters change (debounced for search)
  const searchDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      void loadUsers()
    }, 300)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, activeFilter])

  async function handleRoleChange(userId: string, newRole: Role) {
    setSavingRoleFor(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error("Failed to update role")
      const data = (await res.json()) as { user: User }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: data.user.role } : u))
      )
    } catch {
      // Silently revert — the UI will stay on old value from state
    } finally {
      setSavingRoleFor(null)
    }
  }

  async function handleActiveToggle(userId: string, isActive: boolean) {
    setSavingActiveFor(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      if (res.status === 422) {
        // Cannot deactivate own account
        return
      }
      if (!res.ok) throw new Error("Failed to update status")
      const data = (await res.json()) as { user: User }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: data.user.isActive } : u
        )
      )
    } catch {
      // Silently ignore
    } finally {
      setSavingActiveFor(null)
    }
  }

  function handleAvatarButtonClick(userId: string) {
    uploadTargetId.current = userId
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const userId = uploadTargetId.current
    if (!file || !userId) return

    // Reset input so same file can be re-selected later
    e.target.value = ""

    setUploadingFor(userId)
    try {
      const formData = new FormData()
      formData.append("avatar", file)
      const res = await fetch(`/api/admin/users/${userId}/avatar`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = (await res.json()) as { avatarUrl: string }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, avatarUrl: data.avatarUrl } : u
        )
      )
    } catch {
      // Silently ignore
    } finally {
      setUploadingFor(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento da Equipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie funções, status e avatares para todos os membros da equipe.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          type="search"
          placeholder="Buscar nome ou e-mail…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 max-w-xs"
        />

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-56">
            <SelectValue placeholder="Filtrar por função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as funções</SelectItem>
            <SelectItem value="TECH_LEAD">Tech Lead</SelectItem>
            <SelectItem value="DEVELOPER">Desenvolvedor</SelectItem>
            <SelectItem value="SUPPORT_LEAD">Líder de Suporte</SelectItem>
            <SelectItem value="SUPPORT_MEMBER">Membro de Suporte</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        aria-hidden="true"
        onChange={handleFileChange}
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="hidden sm:table-cell">Apelido</TableHead>
              <TableHead className="hidden lg:table-cell">Última Atividade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Avatar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
            const filteredUsers = search
              ? users.filter(
                  (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
                )
              : users
            return isLoading ? null : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-sm italic text-muted-foreground"
                >
                  Nenhum membro da equipe encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  {/* Avatar */}
                  <TableCell>
                    <UserAvatar
                      name={user.name}
                      avatarUrl={user.avatarUrl}
                      size="sm"
                    />
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <span className="text-sm font-medium">{user.name}</span>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {user.email}
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(val) =>
                        void handleRoleChange(user.id, val as Role)
                      }
                      disabled={savingRoleFor === user.id}
                    >
                      <SelectTrigger className="h-8 w-40 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key} className="text-xs">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Alias */}
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {user.ninjaAlias}
                    </span>
                  </TableCell>

                  {/* Last active */}
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  {/* Active toggle */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(val) =>
                          void handleActiveToggle(user.id, val)
                        }
                        disabled={savingActiveFor === user.id}
                        aria-label={`Toggle active status for ${user.name}`}
                      />
                      <Badge
                        variant="outline"
                        className={cn(
                          "hidden text-xs sm:inline-flex",
                          user.isActive
                            ? "border-green-500/30 text-green-600 dark:text-green-400"
                            : "border-muted text-muted-foreground"
                        )}
                      >
                        {user.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Avatar upload */}
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                      disabled={uploadingFor === user.id}
                      onClick={() => handleAvatarButtonClick(user.id)}
                    >
                      <UploadIcon />
                      {uploadingFor === user.id ? "Enviando…" : "Enviar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )
          })()}
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="size-9 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-36" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-12 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-20" />
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
