"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { cn } from "@workspace/ui/lib/utils"

// Derive a consistent color index from the name string
function nameToColorIndex(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % FALLBACK_COLORS.length
}

// Predefined set of accessible background/text color pairs
const FALLBACK_COLORS = [
  "bg-[oklch(0.68_0.22_320)] text-white",       // crimson
  "bg-[oklch(0.45_0.18_265)] text-white",       // navy-ish
  "bg-emerald-600 text-white",
  "bg-violet-600 text-white",
  "bg-amber-600 text-white",
  "bg-sky-600 text-white",
  "bg-rose-600 text-white",
  "bg-teal-600 text-white",
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0]?.[0] ?? "?").toUpperCase()
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase()
}

const SIZE_CLASSES = {
  sm: "size-7 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
} as const

interface UserAvatarProps {
  name: string
  avatarUrl?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({ name, avatarUrl, size = "md", className }: UserAvatarProps) {
  const colorClass = FALLBACK_COLORS[nameToColorIndex(name)] ?? FALLBACK_COLORS[0]!
  const initials = getInitials(name)

  return (
    <Avatar className={cn(SIZE_CLASSES[size], className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback className={cn("font-semibold", colorClass)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
