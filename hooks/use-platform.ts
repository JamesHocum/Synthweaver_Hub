"use client"

import { useEffect, useState } from "react"

export type Platform = "web" | "pwa" | "electron" | "unknown"
export type OS = "windows" | "macos" | "linux" | "ios" | "android" | "unknown"

interface PlatformInfo {
  platform: Platform
  os: OS
  isElectron: boolean
  isPWA: boolean
  isOnline: boolean
  version?: string
}

declare global {
  interface Window {
    electronAPI?: {
      getPlatform: () => Promise<string>
      getVersion: () => Promise<string>
      getTheme: () => Promise<string>
      isElectron: boolean
    }
  }
}

export function usePlatform(): PlatformInfo {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    platform: "unknown",
    os: "unknown",
    isElectron: false,
    isPWA: false,
    isOnline: true,
  })

  useEffect(() => {
    const detectPlatform = async () => {
      // Check if running in Electron
      const isElectron = typeof window !== "undefined" && !!window.electronAPI?.isElectron

      // Check if running as PWA
      const isPWA =
        typeof window !== "undefined" &&
        (window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as Navigator & { standalone?: boolean }).standalone === true)

      // Detect OS
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : ""
      let os: OS = "unknown"

      if (isElectron && window.electronAPI) {
        const electronPlatform = await window.electronAPI.getPlatform()
        if (electronPlatform === "darwin") os = "macos"
        else if (electronPlatform === "win32") os = "windows"
        else if (electronPlatform === "linux") os = "linux"
      } else {
        if (userAgent.includes("win")) os = "windows"
        else if (userAgent.includes("mac")) os = "macos"
        else if (userAgent.includes("linux")) os = "linux"
        else if (userAgent.includes("iphone") || userAgent.includes("ipad")) os = "ios"
        else if (userAgent.includes("android")) os = "android"
      }

      // Determine platform type
      let platform: Platform = "web"
      if (isElectron) platform = "electron"
      else if (isPWA) platform = "pwa"

      // Get version if in Electron
      let version: string | undefined
      if (isElectron && window.electronAPI) {
        version = await window.electronAPI.getVersion()
      }

      setPlatformInfo({
        platform,
        os,
        isElectron,
        isPWA,
        isOnline: navigator.onLine,
        version,
      })
    }

    detectPlatform()

    // Listen for online/offline events
    const handleOnline = () => setPlatformInfo((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setPlatformInfo((prev) => ({ ...prev, isOnline: false }))

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return platformInfo
}
