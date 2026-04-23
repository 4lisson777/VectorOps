import * as React from "react"

function VectorMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="5" y1="19" x2="19" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="13" x2="14" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 5 L15 5 M19 5 L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "1.1fr 1fr" }}>
      {/* Left — brand layer (physics/English OK here) */}
      <div
        className="relative flex flex-col justify-between overflow-hidden p-12"
        style={{ backgroundColor: "oklch(0.17 0.02 250)", color: "#fff" }}
      >
        {/* Dot grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
        />
        {/* Watermark arrow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-60px] right-[-60px] opacity-35"
          style={{ width: 360, height: 360 }}
        >
          <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="p" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#c95bff" stopOpacity="0" />
                <stop offset="1" stopColor="#c95bff" />
              </linearGradient>
            </defs>
            <line x1="40" y1="560" x2="540" y2="60" stroke="url(#p)" strokeWidth="4" strokeLinecap="round" />
            <path d="M540 60 L480 60 M540 60 L540 120" stroke="#c95bff" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-[6px]"
            style={{ width: 40, height: 40, background: "oklch(0.68 0.22 320)", boxShadow: "0 0 0 4px color-mix(in oklab, oklch(0.68 0.22 320) 25%, transparent)" }}
          >
            <VectorMark className="size-5 text-white" />
          </div>
          <span className="font-mono text-[22px] font-semibold tracking-tight">
            vector<span style={{ color: "oklch(0.68 0.22 320)" }}>ops</span>
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 max-w-[460px]">
          <div
            className="mb-7 inline-block rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.65)", borderColor: "rgba(255,255,255,0.15)" }}
          >
            internal · v2.0
          </div>
          <h2 className="mb-4 text-[38px] font-bold leading-[1.08] tracking-tight">
            Signals in.<br />
            <span style={{ color: "oklch(0.68 0.22 320)" }}>Vectors out.</span>
          </h2>
          <p className="max-w-[400px] text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Every support ticket is a signal. VectorOps resolves each one into a vector — direction, magnitude, owner — so your team ships in the same direction.
          </p>
          <div className="mt-6 font-mono text-xs tracking-wide" style={{ color: "oklch(0.78 0.17 195)" }}>
            ψ = Σ cᵢ · vᵢ &nbsp;·&nbsp; the field is the team
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          v2.0.0 · © 2026 Inovar Systems
        </div>
      </div>

      {/* Right — product layer (PT-BR, plain language) */}
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  )
}
