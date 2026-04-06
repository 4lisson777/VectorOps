"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { generateClickUpMarkdown, type BugExportData } from "@/lib/clickup-export"

interface ClickUpCopyButtonProps {
  bug: BugExportData
}

// Button that generates a ClickUp-formatted Markdown block and copies it to clipboard.
export function ClickUpCopyButton({ bug }: ClickUpCopyButtonProps) {
  const [msg, setMsg] = React.useState<string | null>(null)

  async function handleCopy() {
    const markdown = generateClickUpMarkdown(bug)
    try {
      await navigator.clipboard.writeText(markdown)
      setMsg("Copiado para a área de transferência!")
    } catch {
      setMsg("Falha ao copiar — tente novamente.")
    }
    setTimeout(() => setMsg(null), 2500)
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        {/* Clipboard icon */}
        <svg
          className="mr-2 size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        </svg>
        Copiar para Formato ClickUp
      </Button>
      {msg && (
        <p role="status" className="text-xs text-muted-foreground">
          {msg}
        </p>
      )}
    </div>
  )
}
