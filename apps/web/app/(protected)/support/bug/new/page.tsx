import { BugForm } from "@/components/tickets/bug-form"

export const metadata = {
  title: "Reportar Alvo (Bug) — ShinobiOps",
}

// Server component — renders the BugForm client component.
export default function NewBugPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Threat Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Report a customer-reported defect to the dev team. Be as specific as possible — it helps the ninjas respond faster.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <BugForm />
      </div>
    </div>
  )
}
