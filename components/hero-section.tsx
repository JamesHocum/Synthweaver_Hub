"use client"

import type React from "react"

import { ArrowRight, Github, Cloud, Zap, Puzzle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDemoMode } from "@/contexts/demo-mode-context"
import Link from "next/link"

export function HeroSection() {
  const { startDemo } = useDemoMode()
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-[var(--neon-primary)] animate-pulse" />
          <span className="text-sm text-muted-foreground">Repository Management Reimagined</span>
        </div>

        {/* Main Title */}
        <h1 data-demo="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
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
          <Button className="neon-button px-6 py-2.5 font-semibold" asChild>
            <Link href="/auth/login">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="neon-border bg-transparent hover:bg-[var(--neon-primary)]/10" asChild>
            <a href="https://github.com/JamesHocum/Synthweaver_Hub" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Demo Mode Button */}
        <div className="mb-16">
          <Button
            onClick={startDemo}
            variant="ghost"
            className="group relative overflow-hidden rounded-full border px-6 py-2 transition-all hover:scale-105"
            style={{
              borderColor: "var(--neon-primary)",
              color: "var(--neon-primary)",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--neon-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Play className="mr-2 h-4 w-4" />
            Try Demo Mode
            <span className="ml-2 text-xs opacity-70">(Interactive Tour)</span>
          </Button>
        </div>

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
