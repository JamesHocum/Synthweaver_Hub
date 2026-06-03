import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PWAProvider } from "@/components/pwa-provider"
import { DemoModeProvider } from "@/contexts/demo-mode-context"
import { DemoOverlay } from "@/components/demo-overlay"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Synthweaver Hub | Repository Management Reimagined",
  description:
    "A next-generation repository platform combining the power of GitHub, Hugging Face, and AI-powered development tools.",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Synthweaver Hub",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icons/icon-512x512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [
      { url: "/icons/icon-152x152.jpg", sizes: "152x152", type: "image/jpeg" },
      { url: "/icons/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="theme-synth">
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        <DemoModeProvider>
          <PWAProvider>
            {children}
          </PWAProvider>
          <DemoOverlay />
        </DemoModeProvider>
        <Analytics />
      </body>
    </html>
  )
}
