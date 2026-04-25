// Validates required environment variables at startup; throws if any are missing.
import "@/lib/env"

import type { Metadata } from "next"
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vectorops.inovar.com"

export const metadata: Metadata = {
  title: {
    default: "VectorOps · Signals in. Vectors out.",
    template: "%s | VectorOps",
  },
  description:
    "A support-to-engineering work-vector engine. Every ticket resolves into direction + magnitude + owner.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "VectorOps",
    title: "VectorOps · Signals in. Vectors out.",
    description:
      "A support-to-engineering work-vector engine. Every ticket resolves into direction + magnitude + owner.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Signals in. Vectors out.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VectorOps · Signals in. Vectors out.",
    description:
      "A support-to-engineering work-vector engine. Every ticket resolves into direction + magnitude + owner.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
      className={cn("antialiased", ibmPlexSans.variable, jetbrainsMono.variable)}
    >
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
