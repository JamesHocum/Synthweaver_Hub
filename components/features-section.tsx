"use client"

import { GitBranch, Code2, Users, Shield, Sparkles, Eye, Terminal, Boxes } from "lucide-react"

const features = [
  {
    icon: GitBranch,
    title: "Git Integration",
    description: "Full Git support with branch management, commit history, and merge operations.",
  },
  {
    icon: Code2,
    title: "Code Browser",
    description: "Syntax-highlighted code viewer with neon-themed styling and search.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Role-based access control, code reviews, and activity tracking.",
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description: "Enterprise-grade security for your repositories and sensitive data.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description: "Built-in AI for code generation, review suggestions, and automation.",
  },
  {
    icon: Eye,
    title: "Visual Themes",
    description: "Customizable neon aesthetics with Cyberpunk, Synthwave, and Hybrid modes.",
  },
  {
    icon: Terminal,
    title: "Integrated Terminal",
    description: "Built-in terminal for running commands without leaving the platform.",
  },
  {
    icon: Boxes,
    title: "Extension System",
    description: "Expandable platform with a marketplace for custom tools and plugins.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful <span className="neon-text">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to manage repositories, collaborate with teams, and build amazing software.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="neon-card rounded-xl p-5 transition-transform hover:scale-[1.02]">
              <div className="neon-icon mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--neon-primary)]/10">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold neon-text mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
