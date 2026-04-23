import { TicketForm } from "@/components/tickets/ticket-form"

export const metadata = {
  title: "Novo Chamado — VectorOps",
}

// Server component — renders the TicketForm client component.
export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Abrir Chamado</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Envie uma solicitação para o time dev — ajustes, configurações, correções de dados ou qualquer outra coisa.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <TicketForm />
      </div>
    </div>
  )
}
