"use client"

import { useEffect } from "react"
import Link from "next/link"

// Global error boundary — shown when an unhandled error bubbles up from any route.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error for observability; in production this would go to a monitoring service
    console.error("[VectorOps] Unhandled error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[oklch(0.12_0.03_265)] p-8 text-center">
      {/* Smoke bomb icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/20">
        <svg
          className="size-12 text-destructive"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </div>

      {/* Error message */}
      <div>
        <p className="text-sm font-medium tracking-widest text-destructive uppercase">
          Falha Crítica
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Fumaça no Dojo</h1>
        <p className="mt-3 max-w-md text-sm text-white/50">
          Um erro inesperado interrompeu a missão. O tech lead foi notificado.
          {error.digest && (
            <span className="block mt-1 font-mono text-xs opacity-60">
              Ref: {error.digest}
            </span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center justify-center rounded-md bg-[oklch(0.56_0.22_15)] px-4 text-sm font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_15)]"
        >
          Tentar Novamente
        </button>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-md border border-white/20 px-4 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          Voltar à Base
        </Link>
      </div>
    </div>
  )
}
