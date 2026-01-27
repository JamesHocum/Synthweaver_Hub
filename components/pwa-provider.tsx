"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, RefreshCw, Monitor, Smartphone, Apple, Chrome } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

type Platform = "windows" | "mac" | "linux" | "android" | "ios" | "unknown"

const INSTALL_DISMISSED_KEY = "synthweaver-install-dismissed"
const INSTALL_DISMISSED_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// GitHub releases URL - update this to your actual releases page
const GITHUB_RELEASES_URL = "https://github.com/JamesHocum/Synthweaver_Hub/releases"

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showUpdateBanner, setShowUpdateBanner] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [platform, setPlatform] = useState<Platform>("unknown")
  const [isMobile, setIsMobile] = useState(false)

  // Detect platform
  const detectPlatform = useCallback((): Platform => {
    if (typeof window === "undefined") return "unknown"
    const ua = navigator.userAgent.toLowerCase()
    const platform = navigator.platform?.toLowerCase() || ""
    
    if (/iphone|ipad|ipod/.test(ua)) return "ios"
    if (/android/.test(ua)) return "android"
    if (/win/.test(platform) || /win/.test(ua)) return "windows"
    if (/mac/.test(platform) || /mac/.test(ua)) return "mac"
    if (/linux/.test(platform) || /linux/.test(ua)) return "linux"
    return "unknown"
  }, [])

  // Check if mobile device
  const checkIsMobile = useCallback((): boolean => {
    if (typeof window === "undefined") return false
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
  }, [])

  // Check if user previously dismissed the banner
  const wasRecentlyDismissed = useCallback(() => {
    if (typeof window === "undefined") return true
    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY)
    if (!dismissed) return false
    const dismissedTime = parseInt(dismissed, 10)
    return Date.now() - dismissedTime < INSTALL_DISMISSED_DURATION
  }, [])

  // Check if app is running in standalone mode (already installed)
  const checkStandalone = useCallback(() => {
    if (typeof window === "undefined") return false
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://")
    )
  }, [])

  useEffect(() => {
    // Detect platform on mount
    setPlatform(detectPlatform())
    setIsMobile(checkIsMobile())

    // Don't register SW in Electron
    if (typeof window !== "undefined" && window.electronAPI?.isElectron) {
      return
    }

    // Check if already installed
    const standalone = checkStandalone()
    setIsStandalone(standalone)

    if (standalone) {
      return
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg)

          // Check for updates
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setShowUpdateBanner(true)
                }
              })
            }
          })
        })
        .catch((err) => console.error("[v0] SW registration failed:", err))
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install banner if not already installed and not recently dismissed
      if (!checkStandalone() && !wasRecentlyDismissed()) {
        setShowInstallBanner(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Show install banner after a delay
    const showBannerTimer = setTimeout(() => {
      if (!checkStandalone() && !wasRecentlyDismissed()) {
        setShowInstallBanner(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      clearTimeout(showBannerTimer)
    }
  }, [checkStandalone, wasRecentlyDismissed, detectPlatform, checkIsMobile])

  // Handle PWA install
  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setShowInstallBanner(false)
      } else {
        localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString())
      }
      setDeferredPrompt(null)
    } else {
      // Fallback instructions for browsers that don't fire beforeinstallprompt
      if (platform === "ios") {
        alert("To install Synthweaver Hub:\n\n1. Tap the Share button (box with arrow)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' to confirm")
      } else {
        alert("To install Synthweaver Hub as a PWA:\n\n1. Click the menu button (three dots) in your browser\n2. Select 'Install App' or 'Add to Home Screen'")
      }
    }
  }

  // Handle desktop app download
  const handleDesktopDownload = () => {
    window.open(GITHUB_RELEASES_URL, "_blank")
  }

  // Get desktop download label based on platform
  const getDesktopLabel = () => {
    switch (platform) {
      case "windows": return "Download for Windows"
      case "mac": return "Download for macOS"
      case "linux": return "Download for Linux"
      default: return "Download Desktop App"
    }
  }

  // Get platform icon
  const PlatformIcon = () => {
    switch (platform) {
      case "mac": return <Apple className="w-4 h-4" />
      case "windows": return <Monitor className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString())
  }

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage("skipWaiting")
      setShowUpdateBanner(false)
      window.location.reload()
    }
  }

  return (
    <>
      {children}

      {/* Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50 p-4 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[var(--neon-primary)]/20">
              <Download className="w-5 h-5 text-[var(--neon-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install Synthweaver Hub</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isMobile 
                  ? "Install the app for offline support and a native experience."
                  : "Choose how you'd like to install Synthweaver Hub on your device."
                }
              </p>
              
              {/* Mobile: Single install option */}
              {isMobile ? (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={handlePWAInstall} className="neon-button text-xs">
                    <Smartphone className="w-3 h-3 mr-1.5" />
                    Install App
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-xs">
                    Not now
                  </Button>
                </div>
              ) : (
                /* Desktop: Two options - PWA and Electron */
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handlePWAInstall} className="neon-button text-xs flex-1">
                      <Chrome className="w-3 h-3 mr-1.5" />
                      Install as PWA
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleDesktopDownload} 
                      variant="outline"
                      className="text-xs flex-1 neon-border hover:bg-[var(--neon-primary)]/10"
                    >
                      <PlatformIcon />
                      <span className="ml-1.5">{getDesktopLabel()}</span>
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-xs w-full">
                    Not now
                  </Button>
                </div>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Update Banner */}
      {showUpdateBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[var(--neon-primary)]/20">
              <RefreshCw className="w-5 h-5 text-[var(--neon-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Update Available</h3>
              <p className="text-xs text-muted-foreground mt-1">
                A new version of Synthweaver Hub is available.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleUpdate} className="neon-button text-xs">
                  Update Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowUpdateBanner(false)}
                  className="text-xs"
                >
                  Later
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowUpdateBanner(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
