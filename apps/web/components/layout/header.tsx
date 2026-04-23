"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Badge } from "@workspace/ui/components/badge"
import { SeverityBadge } from "@workspace/ui/components/severity-badge"
import { cn } from "@workspace/ui/lib/utils"
import { NotificationCenter } from "@/components/layout/notification-center"
import { UserAvatar } from "@/components/user-avatar"
import type { SessionData } from "@/lib/session"

// ---- Icon helpers --------------------------------------------------------

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 text-muted-foreground", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

// ---- Search result types -------------------------------------------------

interface SearchResult {
  id: string
  publicId: string
  title: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: string
  type: "TICKET" | "BUG"
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Progresso",
  WAITING_FOR_INFO: "Aguardando",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
}

// Pattern to detect a direct public ID navigation (TKT-XXXX or BUG-XXXX)
const PUBLIC_ID_PATTERN = /^(TKT|BUG)-\d{1,4}$/i

// ---- GlobalSearch --------------------------------------------------------

function GlobalSearch() {
  const router = useRouter()
  const [searchValue, setSearchValue] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Ctrl+K / Cmd+K to focus search
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  async function performSearch(query: string) {
    if (!query || query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch(
        `/api/tickets?search=${encodeURIComponent(query)}&limit=8`
      )
      if (!res.ok) return
      const data = (await res.json()) as { tickets: SearchResult[] }
      setResults(data.tickets)
      setIsOpen(data.tickets.length > 0)
    } catch {
      // Silently ignore
    } finally {
      setIsSearching(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearchValue(val)

    // Skip search API for direct public ID navigation patterns
    if (PUBLIC_ID_PATTERN.test(val.trim())) {
      setResults([])
      setIsOpen(false)
      return
    }

    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void performSearch(val.trim())
    }, 300)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = searchValue.trim()
    if (!query) return

    if (PUBLIC_ID_PATTERN.test(query)) {
      router.push(`/ticket/${query.toUpperCase()}`)
      setSearchValue("")
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  function handleResultClick(publicId: string) {
    router.push(`/ticket/${publicId}`)
    setSearchValue("")
    setIsOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  function handleBlur() {
    // Delay so clicks inside dropdown are registered first
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
      }
    }, 150)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 items-center">
      <div className="relative w-full max-w-sm">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          placeholder="Pesquisar ou pressione Ctrl+K…"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          aria-label="Pesquisa global"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          autoComplete="off"
          className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-12 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        {/* Keyboard hint */}
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5">
          <kbd className="inline-flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </span>

        {/* Dropdown results */}
        {isOpen && (
          <div
            ref={dropdownRef}
            role="listbox"
            className="absolute left-0 top-full z-50 mt-1 w-full min-w-[340px] rounded-lg border border-border bg-popover shadow-lg"
          >
            {isSearching ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Pesquisando…
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-3 text-sm italic text-muted-foreground">
                Nenhum resultado encontrado.
              </div>
            ) : (
              <ul className="max-h-72 overflow-y-auto py-1">
                {results.map((result) => (
                  <li key={result.id} role="option" aria-selected="false">
                    <button
                      type="button"
                      onClick={() => handleResultClick(result.publicId)}
                      className="flex w-full flex-col gap-1 px-4 py-2.5 text-left hover:bg-muted focus:bg-muted focus:outline-none"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-medium text-muted-foreground">
                          {result.publicId}
                        </span>
                        <SeverityBadge severity={result.severity} />
                        <Badge variant="outline" className="text-xs">
                          {STATUS_LABELS[result.status] ?? result.status}
                        </Badge>
                        <Badge
                          variant={result.type === "BUG" ? "destructive" : "outline"}
                          className={cn(
                            "text-xs",
                            result.type === "BUG"
                              ? "border-[oklch(0.68_0.22_320)] bg-[oklch(0.68_0.22_320)]/10 text-[oklch(0.68_0.22_320)]"
                              : ""
                          )}
                        >
                          {result.type === "BUG" ? "Bug" : "Chamado"}
                        </Badge>
                      </div>
                      <span className="line-clamp-1 text-sm text-foreground">
                        {result.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

// ---- Impersonation Banner ------------------------------------------------

interface ImpersonationBannerProps {
  organizationName: string
}

function ImpersonationBanner({ organizationName }: ImpersonationBannerProps) {
  const router = useRouter()
  const [isStopping, setIsStopping] = React.useState(false)

  async function handleStopImpersonating() {
    setIsStopping(true)
    try {
      await fetch("/api/super-admin/stop-impersonating", { method: "POST" })
      router.push("/super-admin")
      router.refresh()
    } catch {
      // Ignore — page will reload
    } finally {
      setIsStopping(false)
    }
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
        <span className="font-medium text-amber-700 dark:text-amber-300">
          Visualizando como:{" "}
          <span className="font-semibold">{organizationName}</span>
        </span>
      </div>
      <button
        type="button"
        onClick={() => void handleStopImpersonating()}
        disabled={isStopping}
        className="rounded px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/25 transition-colors disabled:opacity-50"
      >
        {isStopping ? "Voltando…" : "Voltar"}
      </button>
    </div>
  )
}

// ---- Header --------------------------------------------------------------

interface HeaderProps {
  session: SessionData
  avatarUrl?: string | null
  /** Organization name from /api/auth/me; shown next to the logo */
  organizationName?: string | null
  onMenuClick: () => void
}

export function Header({ session, avatarUrl, organizationName, onMenuClick }: HeaderProps) {
  const router = useRouter()

  const isImpersonating =
    session.isSuperAdmin &&
    !!session.originalOrganizationId &&
    session.originalOrganizationId !== session.organizationId

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex flex-col shrink-0">
      {/* Impersonation banner — only shown to super-admin while impersonating */}
      {isImpersonating && organizationName && (
        <ImpersonationBanner organizationName={organizationName} />
      )}

      <header className="flex h-[54px] shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        {/* Hamburger — only on small screens */}
        <button
          type="button"
          aria-label="Abrir menu de navegação"
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <MenuIcon />
        </button>

        {/* Org name badge — visible on larger screens */}
        {organizationName && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground/40 text-sm" aria-hidden="true">/</span>
            <span className="text-muted-foreground text-sm truncate max-w-[160px]">
              {organizationName}
            </span>
          </div>
        )}

        {/* Global search with debounced dropdown + Ctrl+K */}
        <GlobalSearch />

        {/* Notification center — live bell with unread badge and popover list */}
        <NotificationCenter />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Menu do usuário ${session.name}`}
              className="flex items-center gap-2 rounded-md p-1 hover:bg-muted"
            >
              <UserAvatar
                name={session.name}
                avatarUrl={avatarUrl}
                size="sm"
              />
              <span className="hidden text-sm font-medium sm:inline">
                {session.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{session.name}</span>
                <span className="text-xs text-muted-foreground">
                  {session.role?.replace(/_/g, " ")}
                </span>
                {organizationName && (
                  <span className="text-xs text-muted-foreground truncate">
                    {organizationName}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <UserIcon />
                Perfil
              </Link>
            </DropdownMenuItem>
            {session.isSuperAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/super-admin" className="flex items-center gap-2">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M12 2L13.09 8.26L19 6L15.45 11.25L22 12L15.45 12.75L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.75L2 12L8.55 11.25L5 6L10.91 8.26L12 2Z" />
                    </svg>
                    Super Admin
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
            >
              <LogOutIcon />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  )
}
