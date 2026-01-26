"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ThemeType = "cyber" | "synth" | "hybrid"

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  intensity: number
  setIntensity: (intensity: number) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("synth")
  const [intensity, setIntensity] = useState(100)

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove("theme-cyber", "theme-synth", "theme-hybrid")
    // Add the current theme class
    document.documentElement.classList.add(`theme-${theme}`)
  }, [theme])

  useEffect(() => {
    // Set the CSS variable for intensity
    document.documentElement.style.setProperty("--neon-intensity", String(intensity / 100))
  }, [intensity])

  return <ThemeContext.Provider value={{ theme, setTheme, intensity, setIntensity }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
