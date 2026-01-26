"use client"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </a>
          <span className="text-border">•</span>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            API Reference
          </a>
          <span className="text-border">•</span>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Community
          </a>
          <span className="text-border">•</span>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Support
          </a>
        </div>

        {/* Branding */}
        <div className="text-center mb-6">
          <p className="text-sm neon-text font-medium">A Spell Weaver Studios Application</p>
        </div>

        {/* Copyright and Contact */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            © 2025-2026 Harold Hocum | Founder |{" "}
            <a href="#" className="neon-text hover:underline">
              Systems Architect & Software Engineer
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Harald1.Hocum@Gmail.com | Founder@spell-weaver-studio.com •{" "}
            <a href="#" className="neon-text hover:underline">
              Portfolio
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
