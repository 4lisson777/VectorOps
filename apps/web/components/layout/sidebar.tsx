"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import type { Role } from "@/lib/types"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  count?: number
}

interface NavSection {
  label: string
  items: NavItem[]
}

function VectorMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <line x1="5" y1="19" x2="19" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="13" x2="14" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 5 L15 5 M19 5 L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function PainelIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function QuadroIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="5" height="18" rx="1" />
      <rect x="10" y="3" width="5" height="12" rx="1" />
      <rect x="17" y="3" width="5" height="15" rx="1" />
    </svg>
  )
}

function EntradaIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" strokeLinecap="round" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M15 5H21a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4V6a1 1 0 0 1 1-1h6" />
      <path d="M9 5V3m0 18v-2M9 13v-2" />
    </svg>
  )
}

function BugIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 2c0 1.1.9 2 2 2h4a2 2 0 1 0 0-4h-4a2 2 0 0 0-2 2Z" />
      <path d="M12 4v16M8 8H4M16 8h4M6 12H2M18 12h4M8 16H5M16 16h3" />
      <path d="M8 4a4 4 0 0 0-4 4v4a8 8 0 0 0 16 0V8a4 4 0 0 0-4-4" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function EquipeIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="8" r="3" />
      <path d="M2 20c0-3 3.1-5 7-5" />
      <path d="M14 20c0-3 2.5-5 6-5" />
      <path d="M9 15c2.5 0 5 2 5 5" />
    </svg>
  )
}

function NotificacaoIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function ConfigIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function LogIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function getNavItems(role: Role): { primary: NavSection; secondary?: NavSection } {
  const supportPrimary: NavItem[] = [
    { label: "Painel", href: "/support", icon: <PainelIcon /> },
    { label: "Quadro", href: "/support/queue", icon: <QuadroIcon /> },
    { label: "Meus Tickets", href: "/support/my-items", icon: <UserIcon /> },
  ]
  const supportSecondary: NavItem[] = [
    { label: "Abrir Chamado", href: "/support/ticket/new", icon: <TicketIcon /> },
    { label: "Reportar Bug", href: "/support/bug/new", icon: <BugIcon /> },
  ]

  const devPrimary: NavItem[] = [
    { label: "Painel", href: "/dev", icon: <PainelIcon /> },
    { label: "Quadro", href: "/dev/queue", icon: <QuadroIcon /> },
  ]
  const adminPrimary: NavItem[] = [
    { label: "Painel", href: "/dev", icon: <PainelIcon /> },
    { label: "Quadro", href: "/dev/queue", icon: <QuadroIcon /> },
    { label: "Painel Geral", href: "/admin", icon: <EntradaIcon /> },
  ]
  const adminSecondary: NavItem[] = [
    { label: "Equipe", href: "/admin/team", icon: <EquipeIcon /> },
    { label: "Notificações", href: "/admin/notifications", icon: <NotificacaoIcon /> },
    { label: "Atualizações de Status", href: "/admin/checkpoints", icon: <ConfigIcon /> },
    { label: "Log", href: "/admin/log", icon: <LogIcon /> },
  ]
  const qaPrimary: NavItem[] = [
    { label: "Painel", href: "/dev", icon: <PainelIcon /> },
    { label: "Quadro", href: "/dev/queue", icon: <QuadroIcon /> },
    { label: "Painel Geral", href: "/admin", icon: <EntradaIcon /> },
  ]
  const qaSecondary: NavItem[] = [
    { label: "Notificações", href: "/admin/notifications", icon: <NotificacaoIcon /> },
    { label: "Log", href: "/admin/log", icon: <LogIcon /> },
  ]

  switch (role) {
    case "SUPPORT_MEMBER":
    case "SUPPORT_LEAD":
      return {
        primary: { label: "Trabalho", items: supportPrimary },
        secondary: { label: "Ações", items: supportSecondary },
      }
    case "DEVELOPER":
      return {
        primary: { label: "Trabalho", items: devPrimary },
      }
    case "TECH_LEAD":
      return {
        primary: { label: "Trabalho", items: adminPrimary },
        secondary: { label: "Organização", items: adminSecondary },
      }
    case "QA":
      return {
        primary: { label: "Trabalho", items: qaPrimary },
        secondary: { label: "Organização", items: qaSecondary },
      }
    default:
      return {
        primary: { label: "Trabalho", items: supportPrimary },
        secondary: { label: "Ações", items: supportSecondary },
      }
  }
}

interface SidebarProps {
  role: Role
  isOpen: boolean
  onClose: () => void
  userName?: string
  userInitials?: string
}

export function Sidebar({ role, isOpen, onClose, userName, userInitials }: SidebarProps) {
  const pathname = usePathname()
  const { primary, secondary } = getNavItems(role)

  function isActive(href: string) {
    if (href === "/dev" || href === "/support" || href === "/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const navLink = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-2.5 rounded px-2.5 py-[7px] text-[13px] font-medium transition-colors",
        isActive(item.href)
          ? "bg-sidebar-accent text-sidebar-foreground"
          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      style={isActive(item.href)
        ? { boxShadow: "inset 2px 0 0 var(--sidebar-primary)" }
        : { color: "color-mix(in oklab, var(--sidebar-foreground) 72%, transparent)" }
      }
    >
      {item.icon}
      <span className="flex-1">{item.label}</span>
      {item.count !== undefined && (
        <span className="ml-auto font-mono text-[10px] opacity-70">{item.count}</span>
      )}
    </Link>
  )

  const navSection = (label: string, items: NavItem[]) => (
    <div className="flex flex-col gap-0.5">
      <div className="px-2.5 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: "color-mix(in oklab, var(--sidebar-foreground) 45%, transparent)" }}>
        {label}
      </div>
      {items.map(navLink)}
    </div>
  )

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar lg:static lg:z-auto lg:translate-x-0",
          "border-r border-sidebar-border transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-[56px] shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded bg-sidebar-primary">
            <VectorMark className="size-4 text-white" />
          </div>
          <span className="font-mono font-semibold tracking-tight text-sidebar-foreground">
            vector<span className="text-sidebar-primary">ops</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
          {navSection(primary.label, primary.items)}

          {secondary && secondary.items.length > 0 && (
            navSection(secondary.label, secondary.items)
          )}
        </nav>

        {/* Sidebar footer */}
        {userName && (
          <div className="flex items-center gap-2.5 border-t border-sidebar-border px-3 py-3">
            <div
              className="flex shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold text-white"
              style={{ width: 30, height: 30, background: "var(--sidebar-primary)" }}
            >
              {userInitials ?? userName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-sidebar-foreground">{userName}</div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
