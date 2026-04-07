"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { SSEProvider } from "@/lib/sse-context"
import { PersistentNotificationManager } from "@/components/notifications/persistent-notification-manager"
import type { SessionData } from "@/lib/session"
import type { Role } from "@/lib/types"

interface AppShellProps {
  session: SessionData
  avatarUrl?: string | null
  children: React.ReactNode
}

// AppShell wraps authenticated pages with the header + sidebar layout.
// Sidebar open/close state lives here so both components share it.
export function AppShell({ session, avatarUrl, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        role={session.role as Role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area — wrapped in SSEProvider so all children share one EventSource */}
      <SSEProvider>
        {/* Persistent notification overlay — lives inside SSEProvider for SSE access */}
        <PersistentNotificationManager />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            session={session}
            avatarUrl={avatarUrl}
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </SSEProvider>
    </div>
  )
}
