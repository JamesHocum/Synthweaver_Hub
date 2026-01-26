import { ThemeProvider } from "@/contexts/theme-context"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { IntegrationsSection } from "@/components/integrations-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <IntegrationsSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
