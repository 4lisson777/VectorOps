import { cn } from "@workspace/ui/lib/utils"

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

interface SeverityBadgeProps {
  severity: Severity
  className?: string
}

const severityConfig: Record<
  Severity,
  { label: string; className: string }
> = {
  LOW: {
    label: "Baixa",
    className:
      "bg-white border-gray-300 text-gray-800 dark:bg-white dark:border-gray-400 dark:text-gray-900",
  },
  MEDIUM: {
    label: "Média",
    className:
      "bg-green-600 border-green-700 text-white dark:bg-green-600 dark:border-green-700",
  },
  HIGH: {
    label: "Alta",
    className:
      "bg-red-600 border-red-700 text-white dark:bg-red-600 dark:border-red-700",
  },
  CRITICAL: {
    label: "Crítica",
    className:
      "bg-black border-black text-white dark:bg-gray-950 dark:border-gray-800",
  },
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
