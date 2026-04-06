// Validates required environment variables at startup; throws if any are missing.
import "@/lib/env"

import type { Metadata } from "next"
import { Geist_Mono, Roboto } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "ShinobiOps",
    template: "%s | ShinobiOps",
  },
  description:
    "Internal issue escalation and team coordination platform for Inovar Sistemas.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", roboto.variable, fontMono.variable)}
    >
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
