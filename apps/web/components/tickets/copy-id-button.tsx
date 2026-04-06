"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface CopyIdButtonProps {
  publicId: string
}

// Small inline button that copies the ticket's publicId to clipboard.
export function CopyIdButton({ publicId }: CopyIdButtonProps) {
  const [copied, setCopied] = React.useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(publicId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Clique para copiar o ID"
      className={cn(
        "font-mono text-sm font-semibold rounded px-2 py-0.5 transition-colors",
        copied
          ? "bg-green-500/20 text-green-700 dark:text-green-400"
          : "bg-muted text-muted-foreground hover:bg-muted/70"
      )}
    >
      {copied ? "Copiado!" : publicId}
    </button>
  )
}
