import * as React from "react"

// Minimal layout for unauthenticated pages: no header, no sidebar.
// Centers form content on a themed navy background.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[oklch(0.12_0.03_265)] px-4">
      {/* Decorative background pattern — subtle grid lines for "mission board" feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, oklch(0.97 0 0) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, oklch(0.97 0 0) 0px, transparent 1px, transparent 40px)",
        }}
      />

      {/* Logo / wordmark */}
      <div className="mb-8 flex flex-col items-center gap-1">
        {/* Shuriken icon — inline SVG for zero-dependency */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.56_0.22_15)] shadow-lg shadow-[oklch(0.56_0.22_15)]/30">
          <svg
            className="size-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Shuriken shape */}
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="12" cy="12" r="2" fill="oklch(0.12 0.03 265)" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-wide text-white">
          Shinobi<span className="text-[oklch(0.56_0.22_15)]">Ops</span>
        </h1>
        <p className="text-xs text-white/40">Inovar Sistemas — Ferramenta Interna</p>
      </div>

      {/* Form card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
        {children}
      </div>
    </div>
  )
}
