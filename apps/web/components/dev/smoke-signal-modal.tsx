"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"

const MAX_CHARS = 280

interface SmokeSignalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SmokeSignalModal({ open, onOpenChange }: SmokeSignalModalProps) {
  const [message, setMessage] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function handleClose() {
    if (isSubmitting) return
    setMessage("")
    setError(null)
    onOpenChange(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/help-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contextMessage: trimmed }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? "Falha ao enviar pedido de ajuda.")
        return
      }
      handleClose()
    } catch {
      setError("Erro de rede. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const remaining = MAX_CHARS - message.length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pedir Ajuda</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="context-message">
              Com o que você precisa de ajuda?
            </Label>
            <Textarea
              id="context-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Descreva brevemente no que você está travado…"
              rows={4}
              disabled={isSubmitting}
              className="resize-none"
              autoFocus
            />
            <p
              className={`text-right text-xs ${
                remaining <= 20 ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {remaining} caracteres restantes
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || message.trim().length === 0}
            >
              {isSubmitting ? "Enviando…" : "Pedir Ajuda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
