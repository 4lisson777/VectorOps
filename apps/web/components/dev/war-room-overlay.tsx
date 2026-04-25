"use client"

import * as React from "react"
import type { WarRoomData } from "@/lib/war-room-state"

interface WarRoomOverlayProps {
  warRoom: WarRoomData
  onDismiss: () => void
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "agora mesmo"
  if (minutes === 1) return "há 1 min"
  return `há ${minutes} min`
}

// Alert siren SVG icon
function SirenIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="size-16"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 3" />
      <path
        d="M24 10v4M10 24H6M38 24h4M14.1 14.1l2.8 2.8M33.9 14.1l-2.8 2.8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 30a8 8 0 1 1 16 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="13" y="30" width="22" height="5" rx="2" fill="currentColor" />
    </svg>
  )
}

export function WarRoomOverlay({ warRoom, onDismiss }: WarRoomOverlayProps) {
  const [elapsed, setElapsed] = React.useState(() => formatRelativeTime(warRoom.startedAt))

  // Update "X min ago" label every 30 seconds
  React.useEffect(() => {
    const id = setInterval(() => {
      setElapsed(formatRelativeTime(warRoom.startedAt))
    }, 30_000)
    return () => clearInterval(id)
  }, [warRoom.startedAt])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ backgroundColor: "oklch(0.08 0.02 250 / 0.97)" }}
      role="alertdialog"
      aria-modal="true"
      aria-label="War Room ativo"
    >
      {/* Pulsing outer ring */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="size-[480px] animate-ping rounded-full opacity-10"
          style={{ backgroundColor: "oklch(0.62 0.25 20)" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="size-[320px] rounded-full opacity-[0.06]"
          style={{
            backgroundColor: "oklch(0.62 0.25 20)",
            animation: "war-room-breathe 2.4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content card */}
      <div
        className="relative z-10 mx-4 flex w-full max-w-md flex-col items-center gap-6 rounded-[6px] border px-8 py-10 text-center shadow-2xl"
        style={{
          backgroundColor: "oklch(0.12 0.02 250)",
          borderColor: "oklch(0.62 0.25 20 / 0.6)",
          boxShadow: "0 0 60px oklch(0.62 0.25 20 / 0.2)",
        }}
      >
        {/* Icon */}
        <div style={{ color: "oklch(0.72 0.25 20)" }}>
          <SirenIcon />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1">
          <p
            className="font-mono text-xs font-semibold uppercase tracking-[0.2em] opacity-70"
            style={{ color: "oklch(0.72 0.25 20)" }}
          >
            War Room
          </p>
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ color: "oklch(0.92 0.02 250)" }}
          >
            {warRoom.title}
          </h1>
        </div>

        {/* Message */}
        {warRoom.message && (
          <p
            className="max-w-sm text-sm leading-relaxed"
            style={{ color: "oklch(0.75 0.02 250)" }}
          >
            {warRoom.message}
          </p>
        )}

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: "oklch(0.62 0.25 20 / 0.25)" }}
        />

        {/* Meta */}
        <p
          className="text-xs"
          style={{ color: "oklch(0.55 0.02 250)" }}
        >
          Iniciado por{" "}
          <span className="font-semibold" style={{ color: "oklch(0.72 0.02 250)" }}>
            {warRoom.startedByName}
          </span>{" "}
          · {elapsed}
        </p>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="mt-2 w-full rounded-[6px] px-6 py-3 text-sm font-bold tracking-wide transition-opacity hover:opacity-90 active:opacity-80"
          style={{
            backgroundColor: "oklch(0.62 0.25 20)",
            color: "oklch(0.98 0.01 250)",
          }}
        >
          Entendido
        </button>
      </div>

      <style>{`
        @keyframes war-room-breathe {
          0%, 100% { transform: scale(1); opacity: 0.06; }
          50% { transform: scale(1.08); opacity: 0.12; }
        }
      `}</style>
    </div>
  )
}

// Compact sticky banner shown after the overlay is dismissed while war room is still active
interface WarRoomBannerProps {
  warRoom: WarRoomData
  onReopen: () => void
  isTechLead: boolean
  onEnd?: () => void
  isEnding?: boolean
}

export function WarRoomBanner({
  warRoom,
  onReopen,
  isTechLead,
  onEnd,
  isEnding,
}: WarRoomBannerProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-[6px] border px-4 py-2.5 text-sm font-medium"
      style={{
        borderColor: "oklch(0.62 0.25 20 / 0.5)",
        backgroundColor: "oklch(0.62 0.25 20 / 0.12)",
        color: "oklch(0.82 0.08 20)",
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* Pulsing dot */}
        <span className="relative flex size-2 shrink-0">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: "oklch(0.72 0.25 20)" }}
          />
          <span
            className="relative inline-flex size-2 rounded-full"
            style={{ backgroundColor: "oklch(0.62 0.25 20)" }}
          />
        </span>
        <span>
          <span className="font-mono text-xs uppercase tracking-widest opacity-70">WAR ROOM</span>
          {" · "}
          <span className="font-semibold">{warRoom.title}</span>
          <span className="ml-2 opacity-60 text-xs">por {warRoom.startedByName}</span>
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onReopen}
          className="rounded px-2.5 py-1 text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity"
        >
          Ver
        </button>
        {isTechLead && onEnd && (
          <button
            onClick={onEnd}
            disabled={isEnding}
            className="rounded px-2.5 py-1 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{
              backgroundColor: "oklch(0.62 0.25 20 / 0.3)",
              color: "oklch(0.92 0.06 20)",
            }}
          >
            {isEnding ? "Encerrando…" : "Encerrar"}
          </button>
        )}
      </div>
    </div>
  )
}
