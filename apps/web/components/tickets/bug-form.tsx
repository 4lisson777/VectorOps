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
import { generateClickUpMarkdown } from "@/lib/clickup-export"

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  affectedModule: z.string().min(1, "Módulo afetado é obrigatório"),
  stepsToReproduce: z.string().min(1, "Passos para reproduzir são obrigatórios"),
  expectedBehavior: z.string().min(1, "Comportamento esperado é obrigatório"),
  actualBehavior: z.string().min(1, "Comportamento atual é obrigatório"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    required_error: "Severidade é obrigatória",
  }),
  deadline: z.string().min(1, "Prazo é obrigatório"),
  environment: z.enum(["PRODUCTION", "STAGING", "OTHER"], {
    required_error: "Ambiente é obrigatório",
  }),
  customerId: z.string().optional(),
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
  {
    value: "CRITICAL",
    label: "Crítica",
    dot: "bg-black dark:bg-gray-800 border border-gray-600",
  },
]

const ENVIRONMENT_OPTIONS: { value: FormData["environment"]; label: string }[] =
  [
    { value: "PRODUCTION", label: "Produção" },
    { value: "STAGING", label: "Homologação" },
    { value: "OTHER", label: "Outro" },
  ]

export function BugForm() {
  const router = useRouter()

  const [title, setTitle] = React.useState("")
  const [affectedModule, setAffectedModule] = React.useState("")
  const [stepsToReproduce, setStepsToReproduce] = React.useState("")
  const [expectedBehavior, setExpectedBehavior] = React.useState("")
  const [actualBehavior, setActualBehavior] = React.useState("")
  const [severity, setSeverity] = React.useState<FormData["severity"] | "">("")
  const [deadline, setDeadline] = React.useState("")
  const [environment, setEnvironment] = React.useState<
    FormData["environment"] | ""
  >("")
  const [customerId, setCustomerId] = React.useState("")

  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)
  const [clipboardMsg, setClipboardMsg] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  // "Copy to ClickUp Format" is only active when these three fields are filled
  const canCopyClickUp =
    title.trim().length > 0 &&
    affectedModule.trim().length > 0 &&
    stepsToReproduce.trim().length > 0

  async function handleCopyClickUp() {
    if (!canCopyClickUp) return

    const markdown = generateClickUpMarkdown({
      publicId: "BUG-???",
      title,
      affectedModule,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      severity: severity || "LOW",
      deadline: deadline || "TBD",
      environment: environment || "OTHER",
      customerId: customerId || undefined,
    })

    try {
      await navigator.clipboard.writeText(markdown)
      setClipboardMsg("Copiado para a área de transferência!")
      setTimeout(() => setClipboardMsg(null), 2000)
    } catch {
      setClipboardMsg("Falha ao copiar — por favor, copie manualmente.")
      setTimeout(() => setClipboardMsg(null), 3000)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setServerError(null)
    setSuccessMsg(null)

    const result = schema.safeParse({
      title,
      affectedModule,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      severity,
      deadline,
      environment,
      customerId: customerId || undefined,
    })

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
      const description = [
        `Módulo afetado: ${result.data.affectedModule}`,
        `\nPassos para reproduzir:\n${result.data.stepsToReproduce}`,
        `\nComportamento esperado:\n${result.data.expectedBehavior}`,
        `\nComportamento atual:\n${result.data.actualBehavior}`,
      ].join("\n")

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, description, type: "BUG" }),
      })

      const data = (await res.json()) as { error?: string }

      if (!res.ok) {
        setServerError(
          data.error ?? "Falha ao reportar o bug. Tente novamente."
        )
        return
      }

      setSuccessMsg("Bug reportado com sucesso")
      setTimeout(() => router.push("/support/queue"), 800)
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
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          type="text"
          placeholder="Breve descrição do bug"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!fieldErrors.title}
          disabled={isPending}
        />
        {fieldErrors.title && (
          <p className="text-xs text-destructive">{fieldErrors.title}</p>
        )}
      </div>

      {/* Affected Module */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="affectedModule">Módulo / Tela Afetada</Label>
        <Input
          id="affectedModule"
          type="text"
          placeholder="ex: Tela de faturas de clientes, Tela de login"
          value={affectedModule}
          onChange={(e) => setAffectedModule(e.target.value)}
          aria-invalid={!!fieldErrors.affectedModule}
          disabled={isPending}
        />
        {fieldErrors.affectedModule && (
          <p className="text-xs text-destructive">{fieldErrors.affectedModule}</p>
        )}
      </div>

      {/* Steps to Reproduce */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="stepsToReproduce">Passos para Reproduzir</Label>
        <Textarea
          id="stepsToReproduce"
          placeholder={"1. Vá para...\n2. Clique em...\n3. Veja o erro"}
          value={stepsToReproduce}
          onChange={(e) => setStepsToReproduce(e.target.value)}
          aria-invalid={!!fieldErrors.stepsToReproduce}
          disabled={isPending}
          rows={4}
          className="resize-y font-mono text-sm"
        />
        {fieldErrors.stepsToReproduce && (
          <p className="text-xs text-destructive">
            {fieldErrors.stepsToReproduce}
          </p>
        )}
      </div>

      {/* Expected / Actual Behavior */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expectedBehavior">Comportamento Esperado</Label>
          <Textarea
            id="expectedBehavior"
            placeholder="O que deveria ter acontecido?"
            value={expectedBehavior}
            onChange={(e) => setExpectedBehavior(e.target.value)}
            aria-invalid={!!fieldErrors.expectedBehavior}
            disabled={isPending}
            rows={3}
            className="resize-y"
          />
          {fieldErrors.expectedBehavior && (
            <p className="text-xs text-destructive">
              {fieldErrors.expectedBehavior}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="actualBehavior">Comportamento Atual</Label>
          <Textarea
            id="actualBehavior"
            placeholder="O que realmente aconteceu?"
            value={actualBehavior}
            onChange={(e) => setActualBehavior(e.target.value)}
            aria-invalid={!!fieldErrors.actualBehavior}
            disabled={isPending}
            rows={3}
            className="resize-y"
          />
          {fieldErrors.actualBehavior && (
            <p className="text-xs text-destructive">
              {fieldErrors.actualBehavior}
            </p>
          )}
        </div>
      </div>

      {/* Severity + Environment */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="severity">Severidade</Label>
          <Select
            value={severity}
            onValueChange={(v) => setSeverity(v as FormData["severity"])}
            disabled={isPending}
          >
            <SelectTrigger id="severity" aria-invalid={!!fieldErrors.severity}>
              <SelectValue placeholder="Selecione a severidade" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-block size-2.5 rounded-full",
                        opt.dot
                      )}
                    />
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="environment">Ambiente</Label>
          <Select
            value={environment}
            onValueChange={(v) =>
              setEnvironment(v as FormData["environment"])
            }
            disabled={isPending}
          >
            <SelectTrigger
              id="environment"
              aria-invalid={!!fieldErrors.environment}
            >
              <SelectValue placeholder="Selecione o ambiente" />
            </SelectTrigger>
            <SelectContent>
              {ENVIRONMENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.environment && (
            <p className="text-xs text-destructive">
              {fieldErrors.environment}
            </p>
          )}
        </div>
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

      {/* Customer ID (optional) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customerId">
          Nome / ID do Cliente{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="customerId"
          type="text"
          placeholder="ex: Acme Corp ou CUST-1234"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          disabled={isPending}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ClickUp copy button */}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCopyClickUp}
          disabled={!canCopyClickUp || isPending}
          className="w-full"
        >
          {/* Clipboard icon */}
          <svg
            className="mr-2 size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          </svg>
          Copiar para Formato ClickUp
        </Button>
        {clipboardMsg && (
          <p
            role="status"
            className="text-center text-xs text-muted-foreground"
          >
            {clipboardMsg}
          </p>
        )}
        {!canCopyClickUp && (
          <p className="text-center text-xs text-muted-foreground">
            Preencha título, módulo afetado e passos para reproduzir para habilitar este botão.
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className={cn(
          "h-10 w-full text-sm font-semibold",
          "bg-[oklch(0.68_0.22_320)] text-white hover:bg-[oklch(0.58_0.22_320)]"
        )}
      >
        {isPending ? "Enviando…" : "Reportar Bug"}
      </Button>
    </form>
  )
}
