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
}

// Shuriken icon
function ShurikenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

// Simple SVG icon helpers
function GridIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M15 5H21a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4V6a1 1 0 0 1 1-1h6" />
      <path d="M9 5V3m0 18v-2M9 13v-2" />
    </svg>
  )
}

function BugIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 2c0 1.1.9 2 2 2h4a2 2 0 1 0 0-4h-4a2 2 0 0 0-2 2Z" />
      <path d="M12 4v16M8 8H4M16 8h4M6 12H2M18 12h4M8 16H5M16 16h3" />
      <path d="M8 4a4 4 0 0 0-4 4v4a8 8 0 0 0 16 0V8a4 4 0 0 0-4-4" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function TeamIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="8" r="3" />
      <path d="M2 20c0-3 3.1-5 7-5" />
      <path d="M14 20c0-3 2.5-5 6-5" />
      <path d="M9 15c2.5 0 5 2 5 5" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function ScrollIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 21h12a2 2 0 0 0 0-4H8a2 2 0 0 1 0-4h12a2 2 0 0 0 0-4H8a2 2 0 1 1 0-4h8" />
    </svg>
  )
}

function getNavItems(role: Role): { primary: NavItem[]; secondary?: NavItem[] } {
  const supportPrimary: NavItem[] = [
    { label: "Início do Suporte", href: "/support", icon: <GridIcon /> },
    { label: "Fila de Chamados", href: "/support/queue", icon: <ListIcon /> },
    { label: "Meus Itens", href: "/support/my-items", icon: <UserIcon /> },
  ]
  const supportSecondary: NavItem[] = [
    { label: "Novo Chamado", href: "/support/ticket/new", icon: <TicketIcon /> },
    { label: "Reportar Bug", href: "/support/bug/new", icon: <BugIcon /> },
  ]

  const devPrimary: NavItem[] = [
    { label: "Painel Ninja", href: "/dev", icon: <GridIcon /> },
    { label: "Painel de Missões", href: "/dev/queue", icon: <ListIcon /> },
  ]
  const adminPrimary: NavItem[] = [
    { label: "Painel Ninja", href: "/dev", icon: <GridIcon /> },
    { label: "Painel de Missões", href: "/dev/queue", icon: <ListIcon /> },
    { label: "Dojô de Comando", href: "/admin", icon: <ShurikenIcon /> },
  ]
  const adminSecondary: NavItem[] = [
    { label: "Equipe", href: "/admin/team", icon: <TeamIcon /> },
    { label: "Notificações", href: "/admin/notifications", icon: <BellIcon /> },
    { label: "Pergaminhos de Status", href: "/admin/checkpoints", icon: <ClockIcon /> },
    { label: "Log", href: "/admin/log", icon: <ScrollIcon /> },
  ]
  const qaPrimary: NavItem[] = [
    { label: "Painel Ninja", href: "/dev", icon: <GridIcon /> },
    { label: "Painel de Missões", href: "/dev/queue", icon: <ListIcon /> },
    { label: "Dojô de Comando", href: "/admin", icon: <ShurikenIcon /> },
  ]
  const qaSecondary: NavItem[] = [
    { label: "Notificações", href: "/admin/notifications", icon: <BellIcon /> },
    { label: "Log", href: "/admin/log", icon: <ScrollIcon /> },
  ]

  switch (role) {
    case "SUPPORT_MEMBER":
    case "SUPPORT_LEAD":
      return { primary: supportPrimary, secondary: supportSecondary }
    case "DEVELOPER":
      return { primary: devPrimary }
    case "TECH_LEAD":
      return { primary: adminPrimary, secondary: adminSecondary }
    case "QA":
      return { primary: qaPrimary, secondary: qaSecondary }
    default:
      return { primary: supportPrimary, secondary: supportSecondary }
  }
}

interface SidebarProps {
  role: Role
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { primary, secondary } = getNavItems(role)

  function isActive(href: string) {
    // Exact match for home routes, prefix match for others
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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive(item.href)
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {item.icon}
      {item.label}
    </Link>
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
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sidebar-primary shadow-sm">
            <ShurikenIcon className="size-4 text-white" />
          </div>
          <span className="font-bold text-sidebar-foreground tracking-wide">
            Shinobi<span className="text-sidebar-primary">Ops</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {primary.map(navLink)}
          </div>

          {secondary && secondary.length > 0 && (
            <>
              <div className="my-3 h-px bg-sidebar-border" />
              <div className="flex flex-col gap-1">
                {secondary.map(navLink)}
              </div>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
