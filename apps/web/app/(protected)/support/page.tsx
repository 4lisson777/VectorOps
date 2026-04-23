import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export const metadata = {
  title: "Suporte — VectorOps",
}

// Support home — action selection screen.
// Two prominent CTAs: Report a Bug (Threat Report), Open a Ticket.
export default function SupportPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 p-8">
      {/* Page heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Início do Suporte</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O que você precisa reportar para a equipe de desenvolvimento?
        </p>
      </div>

      {/* Action cards */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Open a Ticket */}
        <Link
          href="/support/ticket/new"
          className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-[oklch(0.56_0.22_15)] hover:shadow-md"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-[oklch(0.56_0.22_15)]/10">
            {/* Ticket icon */}
            <svg
              className="size-8 text-muted-foreground transition-colors group-hover:text-[oklch(0.56_0.22_15)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M15 5H21a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4V6a1 1 0 0 1 1-1h6" />
              <path d="M9 5V3m0 18v-2M9 13v-2" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold">Abrir Chamado</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Ajustes de funcionalidade, configurações, correções de dados e outras tarefas para o time dev
            </p>
          </div>
          <Button
            size="sm"
            asChild
            className="mt-auto bg-[oklch(0.18_0.05_265)] text-white hover:bg-[oklch(0.24_0.06_265)] dark:bg-[oklch(0.56_0.22_15)] dark:hover:bg-[oklch(0.50_0.22_15)]"
          >
            <span>Abrir Chamado</span>
          </Button>
        </Link>

        {/* Report a Bug (Threat Report) */}
        <Link
          href="/support/bug/new"
          className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-[oklch(0.56_0.22_15)] hover:shadow-md"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-[oklch(0.56_0.22_15)]/10">
            {/* Bug icon */}
            <svg
              className="size-8 text-muted-foreground transition-colors group-hover:text-[oklch(0.56_0.22_15)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M8 2c0 1.1.9 2 2 2h4a2 2 0 0 0 0-4h-4a2 2 0 0 0-2 2Z" />
              <path d="M12 4v16" />
              <path d="M8 6a4 4 0 0 0-4 4v4a8 8 0 0 0 16 0v-4a4 4 0 0 0-4-4H8Z" />
              <path d="M4 10H2M22 10h-2M4 16H2M22 16h-2" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold">Reportar Bug</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Erros reportados por clientes que parecem ser defeitos no software
            </p>
          </div>
          <Button
            size="sm"
            asChild
            className="mt-auto bg-[oklch(0.56_0.22_15)] text-white hover:bg-[oklch(0.50_0.22_15)]"
          >
            <span>Reportar Bug</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
