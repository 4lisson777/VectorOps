import { BugForm } from "@/components/tickets/bug-form"

export const metadata = {
  title: "Reportar Bug — VectorOps",
}

// Server component — renders the BugForm client component.
export default function NewBugPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reportar Bug</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reporte um defeito identificado por um cliente ao time dev. Seja o mais específico possível — isso ajuda a equipe a responder mais rápido.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <BugForm />
      </div>
    </div>
  )
}
