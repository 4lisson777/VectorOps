import { cn } from "@workspace/ui/lib/utils"

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

interface SeverityBadgeProps {
  severity: Severity
  className?: string
}

// Plasma luminance ramp — monotonic single-hue scale (m2–m5).
// Replaces the old white/green/red/black hue-mixed system.
// m2=Baixa, m3=Média, m4=Alta, m5=Crítica
const severityConfig: Record<Severity, { label: string; level: "m2" | "m3" | "m4" | "m5" }> = {
  LOW:      { label: "Baixa",   level: "m2" },
  MEDIUM:   { label: "Média",   level: "m3" },
  HIGH:     { label: "Alta",    level: "m4" },
  CRITICAL: { label: "Crítica", level: "m5" },
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  const l = config.level
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold",
        className
      )}
      style={{
        backgroundColor: `var(--${l}-bg)`,
        color: `var(--${l}-fg)`,
        borderColor: `var(--${l}-br)`,
      }}
    >
      {config.label}
    </span>
  )
}
