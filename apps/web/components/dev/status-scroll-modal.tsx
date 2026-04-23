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
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"

interface StatusScrollModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted?: () => void
}

export function StatusScrollModal({
  open,
  onOpenChange,
  onSubmitted,
}: StatusScrollModalProps) {
  const [currentTask, setCurrentTask] = React.useState("")
  const [isBlocked, setIsBlocked] = React.useState(false)
  const [notes, setNotes] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function handleClose() {
    if (isSubmitting) return
    onOpenChange(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedTask = currentTask.trim()
    if (!trimmedTask) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/checkpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentTask: trimmedTask,
          isBlocked,
          notes: notes.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? "Falha ao enviar atualização.")
        return
      }
      // Reset form
      setCurrentTask("")
      setIsBlocked(false)
      setNotes("")
      onSubmitted?.()
      onOpenChange(false)
    } catch {
      setError("Erro de rede. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualização de Status</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Informe sua equipe no que você está trabalhando agora.
        </p>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-task">
              No que você está trabalhando? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="current-task"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Descreva sua tarefa atual…"
              disabled={isSubmitting}
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is-blocked">Você está bloqueado?</Label>
            <Switch
              id="is-blocked"
              checked={isBlocked}
              onCheckedChange={setIsBlocked}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Qualquer bloqueador, contexto ou notas adicionais…"
              rows={3}
              disabled={isSubmitting}
              className="resize-none"
            />
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
              Dispensar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || currentTask.trim().length === 0}
            >
              {isSubmitting ? "Enviando…" : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
