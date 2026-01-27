"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { ArrowRight, Github, Cloud, Zap, Puzzle, Download, Monitor, Apple, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

type Platform = "windows" | "mac" | "linux" | "android" | "ios" | "unknown"

const GITHUB_RELEASES_URL = "https://github.com/JamesHocum/Synthweaver_Hub/releases"

export function HeroSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [platform, setPlatform] = useState<Platform>("unknown")
  const [isMobile, setIsMobile] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  const detectPlatform = useCallback((): Platform => {
    if (typeof window === "undefined") return "unknown"
    const ua = navigator.userAgent.toLowerCase()
    const plat = navigator.platform?.toLowerCase() || ""
    
    if (/iphone|ipad|ipod/.test(ua)) return "ios"
    if (/android/.test(ua)) return "android"
    if (/win/.test(plat) || /win/.test(ua)) return "windows"
    if (/mac/.test(plat) || /mac/.test(ua)) return "mac"
    if (/linux/.test(plat) || /linux/.test(ua)) return "linux"
    return "unknown"
  }, [])

  useEffect(() => {
    setPlatform(detectPlatform())
    setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    )

    const handlePrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handlePrompt)
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt)
  }, [detectPlatform])

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    } else if (platform === "ios") {
      alert("To install Synthweaver Hub:\n\n1. Tap the Share button\n2. Tap 'Add to Home Screen'\n3. Tap 'Add'")
    } else {
      alert("To install as PWA:\n\n1. Click the menu (three dots) in your browser\n2. Select 'Install App' or 'Add to Home Screen'")
    }
  }

  const handleDesktopDownload = () => {
    window.open(GITHUB_RELEASES_URL, "_blank")
  }

  const getDesktopLabel = () => {
    switch (platform) {
      case "windows": return "Windows"
      case "mac": return "macOS"
      case "linux": return "Linux"
      default: return "Desktop"
    }
  }

  const PlatformIcon = platform === "mac" ? Apple : Monitor
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-[var(--neon-primary)] animate-pulse" />
          <span className="text-sm text-muted-foreground">Repository Management Reimagined</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          <span className="neon-text">Synthweaver</span>
        </h1>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight neon-text-secondary mb-6">Hub</h2>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
          A next-generation repository platform combining the power of{" "}
          <span className="neon-text font-medium">GitHub</span>,{" "}
          <span className="neon-text font-medium">Hugging Face</span>, and{" "}
          <span className="neon-text font-medium">AI-powered</span> development tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button className="neon-button px-6 py-2.5 font-semibold">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="neon-border bg-transparent hover:bg-[var(--neon-primary)]/10">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </div>

        {/* Download Options - Only show if not already installed */}
        {!isStandalone && (
          <div className="mb-16">
            <p className="text-sm text-muted-foreground mb-4">Available on all platforms</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* PWA Install */}
              <Button 
                onClick={handlePWAInstall}
                variant="outline" 
                size="sm"
                className="neon-border bg-transparent hover:bg-[var(--neon-primary)]/10 min-w-[160px]"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Install as PWA
              </Button>
              
              {/* Desktop Download - Only show on desktop */}
              {!isMobile && (
                <Button 
                  onClick={handleDesktopDownload}
                  variant="outline" 
                  size="sm"
                  className="neon-border bg-transparent hover:bg-[var(--neon-primary)]/10 min-w-[160px]"
                >
                  <PlatformIcon className="mr-2 h-4 w-4" />
                  Download for {getDesktopLabel()}
                </Button>
              )}

              {/* All Downloads Link */}
              <Button 
                onClick={handleDesktopDownload}
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="mr-2 h-4 w-4" />
                All Downloads
              </Button>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <FeatureCard
            icon={<Cloud className="h-6 w-6" />}
            title="Multi-Platform Sync"
            description="Seamlessly sync with GitHub, GitLab, and more"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="AI-Powered Tools"
            description="Intelligent code generation and review"
          />
          <FeatureCard
            icon={<Puzzle className="h-6 w-6" />}
            title="Extensible Platform"
            description="Build and install custom extensions"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="neon-card rounded-xl p-6 text-center">
      <div className="neon-icon mb-4 flex justify-center">{icon}</div>
      <h3 className="text-sm font-semibold neon-text mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
