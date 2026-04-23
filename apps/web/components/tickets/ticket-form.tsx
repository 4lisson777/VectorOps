"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(120, "O título deve ter no máximo 120 caracteres"),
  description: z.string().min(1, "Descrição é obrigatória"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    required_error: "Severidade é obrigatória",
  }),
  deadline: z.string().min(1, "Prazo é obrigatório"),
})

type FormData = z.infer<typeof schema>
type FieldErrors = Partial<Record<keyof FormData, string>>

const SEVERITY_OPTIONS: {
  value: FormData["severity"]
  label: string
  dot: string
}[] = [
  { value: "LOW", label: "Baixa", dot: "bg-gray-200 border border-gray-400" },
  { value: "MEDIUM", label: "Média", dot: "bg-green-500" },
  { value: "HIGH", label: "Alta", dot: "bg-red-500" },
  { value: "CRITICAL", label: "Crítica", dot: "bg-black dark:bg-gray-800 border border-gray-600" },
]

export function TicketForm() {
  const router = useRouter()

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [severity, setSeverity] = React.useState<FormData["severity"] | "">("")
  const [deadline, setDeadline] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  const titleRemaining = 120 - title.length

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setServerError(null)
    setSuccessMsg(null)

    const result = schema.safeParse({ title, description, severity, deadline })
    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormData
        if (!errors[key]) errors[key] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setIsPending(true)
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, type: "TICKET" }),
      })

      const data = (await res.json()) as { ticket?: { publicId: string }; error?: string }

      if (!res.ok) {
        setServerError(data.error ?? "Falha ao criar o chamado. Tente novamente.")
        return
      }

      setSuccessMsg("Chamado criado com sucesso")
      // Brief delay so the user sees the success message before redirect
      const publicId = data.ticket?.publicId
      setTimeout(() => router.push(publicId ? `/ticket/${publicId}` : "/support/queue"), 800)
    } catch {
      setServerError("Erro de rede. Verifique sua conexão.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
        >
          {successMsg}
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">Título</Label>
          <span
            className={cn(
              "text-xs tabular-nums",
              titleRemaining < 20
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {title.length}/120
          </span>
        </div>
        <Input
          id="title"
          type="text"
          placeholder="Breve descrição da solicitação"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!fieldErrors.title}
          disabled={isPending}
        />
        {fieldErrors.title && (
          <p className="text-xs text-destructive">{fieldErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Forneça o contexto completo: o que precisa ser feito, por que e quaisquer detalhes relevantes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!fieldErrors.description}
          disabled={isPending}
          rows={5}
          className="resize-y"
        />
        {fieldErrors.description && (
          <p className="text-xs text-destructive">{fieldErrors.description}</p>
        )}
      </div>

      {/* Severity */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="severity">Severidade</Label>
        <Select
          value={severity}
          onValueChange={(v) => setSeverity(v as FormData["severity"])}
          disabled={isPending}
        >
          <SelectTrigger id="severity" aria-invalid={!!fieldErrors.severity}>
            <SelectValue placeholder="Selecione o nível de severidade" />
          </SelectTrigger>
          <SelectContent>
            {SEVERITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className="flex items-center gap-2">
                  <span className={cn("inline-block size-2.5 rounded-full", opt.dot)} />
                  {opt.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.severity && (
          <p className="text-xs text-destructive">{fieldErrors.severity}</p>
        )}
      </div>

      {/* Deadline */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deadline">Prazo</Label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={isPending}
          aria-invalid={!!fieldErrors.deadline}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
            "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[color-scheme:light] dark:[color-scheme:dark]"
          )}
          min={new Date().toISOString().split("T")[0]}
        />
        {fieldErrors.deadline && (
          <p className="text-xs text-destructive">{fieldErrors.deadline}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className={cn(
          "mt-1 h-10 w-full text-sm font-semibold",
          "bg-[oklch(0.18_0.05_265)] text-white hover:bg-[oklch(0.24_0.06_265)]",
          "dark:bg-[oklch(0.68_0.22_320)] dark:hover:bg-[oklch(0.58_0.22_320)]"
        )}
      >
        {isPending ? "Enviando chamado…" : "Enviar Chamado"}
      </Button>
    </form>
  )
}
