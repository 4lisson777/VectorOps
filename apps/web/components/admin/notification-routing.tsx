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
import { Switch } from "@workspace/ui/components/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"

type RoleKey = "TECH_LEAD" | "DEVELOPER" | "QA" | "SUPPORT_LEAD" | "SUPPORT_MEMBER"

const ROLE_LABELS: Record<RoleKey, string> = {
  TECH_LEAD: "Lider Tecnico",
  DEVELOPER: "Desenvolvedor",
  QA: "QA",
  SUPPORT_LEAD: "Lider de Suporte",
  SUPPORT_MEMBER: "Membro de Suporte",
}

interface MemberWithPrefs {
  id: string
  name: string
  ninjaAlias: string
  avatarUrl: string | null
  role: RoleKey
  notifyTickets: boolean
  notifyBugs: boolean
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

interface NotificationRoutingProps {
  /**
   * Roles that have notifyOnCreation = true at the role level.
   * When provided, only users belonging to these roles are shown.
   * When null (still loading role configs), falls back to showing DEVELOPER only.
   * When empty array, shows an informational message instead of a user list.
   */
  eligibleRoles: RoleKey[] | null
}

export function NotificationRouting({ eligibleRoles }: NotificationRoutingProps) {
  const [members, setMembers] = React.useState<MemberWithPrefs[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  // Track in-flight toggles to prevent double-submissions
  const [pending, setPending] = React.useState<Set<string>>(new Set())

  // Re-fetch whenever the eligible roles list changes (parent config toggled)
  React.useEffect(() => {
    void loadMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(eligibleRoles)])

  async function loadMembers() {
    // While the role config is still loading, wait — don't fetch with stale roles
    if (eligibleRoles === null) return

    try {
      setIsLoading(true)
      setError(null)

      if (eligibleRoles.length === 0) {
        // No roles have creation notifications enabled — nothing to show
        setMembers([])
        setIsLoading(false)
        return
      }

      // Fetch users for all eligible roles in parallel
      const roleResponses = await Promise.all(
        eligibleRoles.map((role) =>
          fetch(`/api/users?role=${role}&isActive=true`).then((r) => {
            if (!r.ok) throw new Error(`Falha ao carregar usuarios para o papel ${role}`)
            return r.json() as Promise<{
              users: Array<{
                id: string
                name: string
                ninjaAlias: string
                avatarUrl: string | null
                role: RoleKey
              }>
            }>
          })
        )
      )

      // Flatten into a single list; each user carries their role for the badge
      const allUsers = roleResponses.flatMap((res) => res.users)

      // Fetch notification prefs for all users in parallel
      const prefsResults = await Promise.all(
        allUsers.map(async (user) => {
          try {
            const r = await fetch(`/api/users/${user.id}/notifications`)
            if (!r.ok) return { notifyTickets: true, notifyBugs: true }
            return r.json() as Promise<{ notifyTickets: boolean; notifyBugs: boolean }>
          } catch {
            return { notifyTickets: true, notifyBugs: true }
          }
        })
      )

      setMembers(
        allUsers.map((user, i) => {
          const prefs = prefsResults[i] ?? { notifyTickets: true, notifyBugs: true }
          return {
            ...user,
            notifyTickets: prefs.notifyTickets,
            notifyBugs: prefs.notifyBugs,
          }
        })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggle(
    userId: string,
    field: "notifyTickets" | "notifyBugs",
    value: boolean
  ) {
    const key = `${userId}:${field}`
    if (pending.has(key)) return

    // Optimistic update
    setMembers((prev) =>
      prev.map((m) => (m.id === userId ? { ...m, [field]: value } : m))
    )
    setPending((prev) => new Set(prev).add(key))

    try {
      const res = await fetch(`/api/users/${userId}/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })
      if (!res.ok) {
        // Revert on failure
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, [field]: !value } : m))
        )
      }
    } catch {
      // Revert on error
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, [field]: !value } : m))
      )
    } finally {
      setPending((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  if (isLoading || eligibleRoles === null) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        {error}
      </div>
    )
  }

  if (eligibleRoles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum papel esta habilitado para receber notificacoes de criacao. Ative ao menos um papel na secao acima para configurar o roteamento individual.
      </p>
    )
  }

  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum membro ativo encontrado nos papeis habilitados.</p>
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">Membro</TableHead>
            <TableHead className="text-center">Notificacoes de Chamados</TableHead>
            <TableHead className="text-center">Notificacoes de Bugs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    {member.avatarUrl && (
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                    )}
                    <AvatarFallback className="bg-[oklch(0.68_0.22_320)] text-white text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {ROLE_LABELS[member.role]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {member.ninjaAlias}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={member.notifyTickets}
                  disabled={pending.has(`${member.id}:notifyTickets`)}
                  onCheckedChange={(checked) =>
                    void handleToggle(member.id, "notifyTickets", checked)
                  }
                  aria-label={`Ativar notificacoes de chamados para ${member.name}`}
                />
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={member.notifyBugs}
                  disabled={pending.has(`${member.id}:notifyBugs`)}
                  onCheckedChange={(checked) =>
                    void handleToggle(member.id, "notifyBugs", checked)
                  }
                  aria-label={`Ativar notificacoes de bugs para ${member.name}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
