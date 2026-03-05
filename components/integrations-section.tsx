"use client"

import { Github, Smile, Database, Code, Cloud, Bot, Puzzle } from "lucide-react"
import Image from "next/image"

const integrations = [
  {
    icon: Github,
    name: "GitHub",
    description: "Full repository sync & import",
    url: "https://github.com",
  },
  {
    icon: Smile,
    name: "Hugging Face",
    description: "Models & datasets hosting",
    url: "https://huggingface.co",
  },
  {
    icon: Database,
    name: "Supabase",
    description: "Backend database & auth",
    url: "https://supabase.com",
  },
  {
    icon: Code,
    name: "V0",
    description: "Design-to-code generation",
    url: "https://v0.dev",
  },
  {
    icon: Cloud,
    name: "Stackblitz",
    description: "Cloud IDE integration",
    url: "https://stackblitz.com",
  },
  {
    customLogo: "/images/cyberpunk-termux-logo.jpg",
    name: "Cyberpunk Termux",
    description: "Neural terminal IDE",
    url: "https://cyberpunk-termux.spell-weaver-studio.com/",
  },
  {
    icon: Bot,
    name: "Aetheris AI",
    description: "AI dev platform",
    url: "#",
  },
  {
    icon: Puzzle,
    name: "Extensions",
    description: "Custom plugin marketplace",
    url: "#",
  },
]

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="neon-text">Integrations</span> Hub
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Connect with your favorite tools and platforms. Built for flexibility and expandability.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {integrations.map((integration, index) => (
            <a
              key={index}
              href={integration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-card rounded-xl p-5 text-center transition-transform hover:scale-[1.02] cursor-pointer block"
            >
              <div className="neon-icon mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--neon-primary)]/10 overflow-hidden">
                  {integration.customLogo ? (
                    <Image
                      src={integration.customLogo || "/placeholder.svg"}
                      alt={integration.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    integration.icon && <integration.icon className="h-6 w-6" />
                  )}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{integration.name}</h3>
              <p className="text-xs text-muted-foreground">{integration.description}</p>
            </a>
          ))}
        </div>

        {/* Partner CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border neon-border px-5 py-2 text-sm">
            <span className="text-muted-foreground">More integrations coming soon —</span>
            <a href="#" className="neon-text font-medium hover:underline">
              Become an integration partner →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
