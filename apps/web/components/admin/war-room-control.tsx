"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import type { WarRoomData } from "@/lib/war-room-state"

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "agora mesmo"
  if (minutes === 1) return "há 1 min"
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  return hours === 1 ? "há 1 h" : `há ${hours} h`
}

export function WarRoomControl() {
  const [warRoom, setWarRoom] = React.useState<WarRoomData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [title, setTitle] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [isStarting, setIsStarting] = React.useState(false)
  const [isEnding, setIsEnding] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [elapsed, setElapsed] = React.useState<string>("")

  React.useEffect(() => {
    void fetchWarRoom()
  }, [])

  // Keep elapsed time updated while a war room is active
  React.useEffect(() => {
    if (!warRoom) return
    setElapsed(formatRelativeTime(warRoom.startedAt))
    const id = setInterval(() => {
      setElapsed(formatRelativeTime(warRoom.startedAt))
    }, 30_000)
    return () => clearInterval(id)
  }, [warRoom])

  async function fetchWarRoom() {
    try {
      const res = await fetch("/api/war-room")
      if (res.ok) {
        const data = (await res.json()) as { warRoom: WarRoomData | null }
        setWarRoom(data.warRoom)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStart() {
    setIsStarting(true)
    setError(null)
    try {
      const res = await fetch("/api/war-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "War Room",
          message: message.trim() || null,
        }),
      })
      if (!res.ok) throw new Error()
      const data = (await res.json()) as { warRoom: WarRoomData }
      setWarRoom(data.warRoom)
      setTitle("")
      setMessage("")
    } catch {
      setError("Falha ao iniciar o War Room. Tente novamente.")
    } finally {
      setIsStarting(false)
    }
  }

  async function handleEnd() {
    setIsEnding(true)
    setError(null)
    try {
      const res = await fetch("/api/war-room", { method: "DELETE" })
      if (!res.ok) throw new Error()
      setWarRoom(null)
    } catch {
      setError("Falha ao encerrar o War Room. Tente novamente.")
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <Card
      style={
        warRoom
          ? {
              borderColor: "oklch(0.62 0.25 20 / 0.5)",
              boxShadow: "0 0 24px oklch(0.62 0.25 20 / 0.12)",
            }
          : undefined
      }
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base">War Room</CardTitle>
          {warRoom && (
            <span className="relative flex size-2">
              <span
                className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: "oklch(0.72 0.25 20)" }}
              />
              <span
                className="relative inline-flex size-2 rounded-full"
                style={{ backgroundColor: "oklch(0.62 0.25 20)" }}
              />
            </span>
          )}
        </div>
        {warRoom && (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: "oklch(0.62 0.25 20 / 0.15)",
              color: "oklch(0.72 0.25 20)",
            }}
          >
            Ativo
          </span>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : warRoom ? (
          /* Active war room view */
          <div className="flex flex-col gap-4">
            <div
              className="flex flex-col gap-1 rounded-[6px] border p-3"
              style={{
                borderColor: "oklch(0.62 0.25 20 / 0.3)",
                backgroundColor: "oklch(0.62 0.25 20 / 0.06)",
              }}
            >
              <p className="text-sm font-semibold" style={{ color: "oklch(0.82 0.1 20)" }}>
                {warRoom.title}
              </p>
              {warRoom.message && (
                <p className="text-xs text-muted-foreground">{warRoom.message}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Iniciado por{" "}
                <span className="font-medium text-foreground">{warRoom.startedByName}</span>
                {elapsed && <> · {elapsed}</>}
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="button"
              onClick={() => void handleEnd()}
              disabled={isEnding}
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              {isEnding ? "Encerrando…" : "Encerrar War Room"}
            </Button>
          </div>
        ) : (
          /* Start war room form */
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Convoca toda a equipe de desenvolvimento com um alerta visual e sonoro imediato.
            </p>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wr-title">Título</Label>
              <Input
                id="wr-title"
                placeholder="War Room"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wr-message">
                Mensagem{" "}
                <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="wr-message"
                placeholder="Detalhe o motivo ou o que a equipe deve fazer…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={300}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="button"
              onClick={() => void handleStart()}
              disabled={isStarting}
              className="font-semibold"
              style={{
                backgroundColor: "oklch(0.62 0.25 20)",
                color: "oklch(0.98 0.01 250)",
              }}
            >
              {isStarting ? "Iniciando…" : "Iniciar War Room"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
