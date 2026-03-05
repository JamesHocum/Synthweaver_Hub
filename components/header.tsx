"use client"

import Image from "next/image"
import { Sparkles, Settings2, Github } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme, intensity, setIntensity } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image src="/images/brand-logo.png" alt="Synthweaver Hub Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold neon-text">Synthweaver</span>
            <span className="text-xs text-muted-foreground">Hub</span>
          </div>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Integrations
          </a>
          <a href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </nav>

        {/* Theme Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle Buttons */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-border p-1">
            <button
              onClick={() => setTheme("cyber")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                theme === "cyber" ? "neon-button" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Cyber
            </button>
            <button
              onClick={() => setTheme("synth")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                theme === "synth" ? "neon-button" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Synth
            </button>
            <button
              onClick={() => setTheme("hybrid")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                theme === "hybrid" ? "neon-button" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Hybrid
            </button>
          </div>

          {/* Intensity Slider */}
          <div className="hidden lg:flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[intensity]}
              onValueChange={(value) => setIntensity(value[0])}
              max={100}
              min={20}
              step={1}
              className="w-24"
            />
            <span className="text-xs text-muted-foreground w-8">{intensity}%</span>
          </div>

          {/* Connect Button */}
          <Button
            variant="outline"
            size="sm"
            className="neon-border text-foreground hover:bg-[var(--neon-primary)]/10 bg-transparent"
          >
            <Github className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>
    </header>
  )
}
