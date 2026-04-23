import * as React from "react"

// Vector arrow mark — the VectorOps logo glyph: arrow at ~17° with tick at midpoint.
// Brand layer: physics vocabulary is permitted on the auth hero.
function VectorMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="4" y1="17" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="14,5 20,7 18,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Tick at midpoint — denotes unit vector length */}
      <line x1="11" y1="13" x2="13" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[oklch(0.17_0.02_250)] px-4">
      {/* Drafting-paper grid lines — brand layer texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vo-auth-grid"
      />

      {/* Logo / wordmark — brand layer */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[oklch(0.68_0.22_320)] shadow-lg shadow-[oklch(0.68_0.22_320)]/30">
          <VectorMark className="size-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Vector<span className="text-[oklch(0.68_0.22_320)]">Ops</span>
        </h1>
        {/* Physics tagline — brand layer only, never appears in product UI */}
        <p className="font-mono text-[11px] tracking-wide text-white/40">
          Signals in. Vectors out.
        </p>
      </div>

      {/* Form card */}
      <div className="relative w-full max-w-sm rounded-[6px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
        {children}
      </div>
    </div>
  )
}
