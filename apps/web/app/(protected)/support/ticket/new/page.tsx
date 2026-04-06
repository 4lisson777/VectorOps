import { TicketForm } from "@/components/tickets/ticket-form"

export const metadata = {
  title: "Novo Chamado (Missão) — ShinobiOps",
}

// Server component — renders the TicketForm client component.
export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Open a Ticket</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit a request to the dev team — feature tweaks, configuration, data fixes, or anything else.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <TicketForm />
      </div>
    </div>
  )
}
