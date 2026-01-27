"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, RefreshCw } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const INSTALL_DISMISSED_KEY = "synthweaver-install-dismissed"
const INSTALL_DISMISSED_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showUpdateBanner, setShowUpdateBanner] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)

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
    // Don't register SW in Electron
    if (typeof window !== "undefined" && window.electronAPI?.isElectron) {
      return
    }

    // Check if already installed
    const standalone = checkStandalone()
    setIsStandalone(standalone)

    if (standalone) {
      console.log("[v0] App is running in standalone mode")
      return
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg)
          console.log("[v0] Service Worker registered")

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
      console.log("[v0] beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install banner if not already installed and not recently dismissed
      if (!checkStandalone() && !wasRecentlyDismissed()) {
        console.log("[v0] Showing install banner from beforeinstallprompt")
        setShowInstallBanner(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Show install banner after a delay if browser supports PWA but hasn't fired the event yet
    // This handles cases where the beforeinstallprompt event might be delayed
    const showBannerTimer = setTimeout(() => {
      if (!checkStandalone() && !wasRecentlyDismissed()) {
        // Check if we're in a browser that supports PWA installation
        const isChromium = /Chrome|Chromium|Edge/.test(navigator.userAgent)
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
        const isFirefox = /Firefox/.test(navigator.userAgent)
        
        // Show banner for supported browsers
        if (isChromium || isSafari || isFirefox) {
          console.log("[v0] Showing install banner after delay")
          setShowInstallBanner(true)
        }
      }
    }, 3000) // Show after 3 seconds

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      clearTimeout(showBannerTimer)
    }
  }, [checkStandalone, wasRecentlyDismissed])

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Native install prompt is available
      console.log("[v0] Triggering native install prompt")
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("[v0] User accepted install")
        setShowInstallBanner(false)
      } else {
        console.log("[v0] User dismissed install")
        // Remember dismissal
        localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString())
      }
      setDeferredPrompt(null)
    } else {
      // Fallback for browsers that don't fire beforeinstallprompt (Safari, Firefox)
      // Show instructions for manual installation
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      
      if (isSafari || isIOS) {
        alert("To install Synthweaver Hub:\n\n1. Tap the Share button (box with arrow)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' to confirm")
      } else {
        alert("To install Synthweaver Hub:\n\n1. Click the menu button (three dots) in your browser\n2. Select 'Install App' or 'Add to Home Screen'")
      }
      setShowInstallBanner(false)
      localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString())
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
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[var(--neon-primary)]/20">
              <Download className="w-5 h-5 text-[var(--neon-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install Synthweaver Hub</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Install our app for a better experience with offline support.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleInstall} className="neon-button text-xs">
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-xs"
                >
                  Not now
                </Button>
              </div>
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
