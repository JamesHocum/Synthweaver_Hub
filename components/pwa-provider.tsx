"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, RefreshCw } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showUpdateBanner, setShowUpdateBanner] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Don't register SW in Electron
    if (typeof window !== "undefined" && window.electronAPI?.isElectron) {
      return
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg)
          console.log("Service Worker registered")

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
        .catch((err) => console.error("SW registration failed:", err))
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install banner if not already installed
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setShowInstallBanner(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowInstallBanner(false)
    }
    setDeferredPrompt(null)
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
                  onClick={() => setShowInstallBanner(false)}
                  className="text-xs"
                >
                  Not now
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowInstallBanner(false)}
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
