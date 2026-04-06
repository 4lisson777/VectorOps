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
import { Skeleton } from "@workspace/ui/components/skeleton"

interface DevWithPrefs {
  id: string
  name: string
  ninjaAlias: string
  avatarUrl: string | null
  role: string
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

export function NotificationRouting() {
  const [devs, setDevs] = React.useState<DevWithPrefs[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  // Track in-flight toggles to prevent double-submissions
  const [pending, setPending] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    void loadDevs()
  }, [])

  async function loadDevs() {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch("/api/users?role=DEVELOPER&isActive=true")
      if (!res.ok) throw new Error("Failed to load developers")
      const data = await res.json() as {
        users: Array<{
          id: string
          name: string
          ninjaAlias: string
          avatarUrl: string | null
          role: string
        }>
      }

      // Fetch notification prefs for all devs in parallel
      const prefsResults = await Promise.all(
        data.users.map(async (user) => {
          try {
            const r = await fetch(`/api/users/${user.id}/notifications`)
            if (!r.ok) return { notifyTickets: true, notifyBugs: true }
            return r.json() as Promise<{ notifyTickets: boolean; notifyBugs: boolean }>
          } catch {
            return { notifyTickets: true, notifyBugs: true }
          }
        })
      )

      setDevs(
        data.users.map((user, i) => {
          const prefs = prefsResults[i] ?? { notifyTickets: true, notifyBugs: true }
          return {
            ...user,
            notifyTickets: prefs.notifyTickets,
            notifyBugs: prefs.notifyBugs,
          }
        })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
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
    setDevs((prev) =>
      prev.map((d) => (d.id === userId ? { ...d, [field]: value } : d))
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
        setDevs((prev) =>
          prev.map((d) => (d.id === userId ? { ...d, [field]: !value } : d))
        )
      }
    } catch {
      // Revert on error
      setDevs((prev) =>
        prev.map((d) => (d.id === userId ? { ...d, [field]: !value } : d))
      )
    } finally {
      setPending((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  if (isLoading) {
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

  if (devs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum desenvolvedor ativo encontrado.</p>
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Desenvolvedor</TableHead>
            <TableHead className="text-center">Notificações de Chamados</TableHead>
            <TableHead className="text-center">Notificações de Bugs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devs.map((dev) => (
            <TableRow key={dev.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    {dev.avatarUrl && (
                      <AvatarImage src={dev.avatarUrl} alt={dev.name} />
                    )}
                    <AvatarFallback className="bg-[oklch(0.56_0.22_15)] text-white text-xs">
                      {getInitials(dev.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{dev.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dev.ninjaAlias}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={dev.notifyTickets}
                  disabled={pending.has(`${dev.id}:notifyTickets`)}
                  onCheckedChange={(checked) =>
                    void handleToggle(dev.id, "notifyTickets", checked)
                  }
                  aria-label={`Toggle ticket notifications for ${dev.name}`}
                />
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={dev.notifyBugs}
                  disabled={pending.has(`${dev.id}:notifyBugs`)}
                  onCheckedChange={(checked) =>
                    void handleToggle(dev.id, "notifyBugs", checked)
                  }
                  aria-label={`Toggle bug notifications for ${dev.name}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
