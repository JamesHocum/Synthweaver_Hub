"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface DemoStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for the element to highlight
  page: string // Route path
  tab?: string // Dashboard tab (if applicable)
  action?: "click" | "type" | "wait" | "navigate" | "highlight"
  autoAdvance?: number // ms to auto-advance (for non-interactive steps)
  samplePrompt?: string // Text to type for simulated input
}

export const DEMO_STEPS: DemoStep[] = [
  // Landing Page Introduction
  {
    id: "welcome",
    title: "Welcome to Synthweaver Hub",
    description: "A next-generation repository platform combining GitHub, Hugging Face, and AI-powered tools. Let's take a tour!",
    target: "[data-demo='hero-title']",
    page: "/",
    action: "highlight",
    autoAdvance: 4000,
  },
  {
    id: "theme-system",
    title: "Customizable Neon Themes",
    description: "Switch between Cyber, Synth, and Hybrid themes. Adjust the glow intensity to your preference.",
    target: "[data-demo='theme-controls']",
    page: "/",
    action: "highlight",
  },
  {
    id: "features-overview",
    title: "Powerful Features",
    description: "Git integration, AI assistant, code browser, team collaboration, and an extension marketplace - all in one platform.",
    target: "#features",
    page: "/",
    action: "highlight",
  },
  {
    id: "integrations-preview",
    title: "Multi-Platform Sync",
    description: "Connect your GitHub and Hugging Face accounts to sync repositories and AI models seamlessly.",
    target: "#integrations",
    page: "/",
    action: "highlight",
  },
  // Dashboard Tour
  {
    id: "dashboard-intro",
    title: "Your Dashboard",
    description: "This is your command center. Manage integrations, browse repositories, and configure extensions.",
    target: "[data-demo='dashboard-header']",
    page: "/dashboard",
    tab: "integrations",
    action: "highlight",
    autoAdvance: 3000,
  },
  {
    id: "integrations-tab",
    title: "Connect Your Accounts",
    description: "Link your GitHub and Hugging Face accounts with one click. Your data syncs automatically.",
    target: "[data-demo='integrations-grid']",
    page: "/dashboard",
    tab: "integrations",
    action: "highlight",
  },
  {
    id: "github-connect",
    title: "GitHub Integration",
    description: "Connect GitHub to import all your repositories, stars, forks, and language stats.",
    target: "[data-demo='github-card']",
    page: "/dashboard",
    tab: "integrations",
    action: "highlight",
  },
  {
    id: "huggingface-connect",
    title: "Hugging Face Integration",
    description: "Sync your AI models, datasets, and spaces from Hugging Face Hub.",
    target: "[data-demo='huggingface-card']",
    page: "/dashboard",
    tab: "integrations",
    action: "highlight",
  },
  {
    id: "repositories-tab",
    title: "Repository Management",
    description: "View all your synced repositories in one place. Filter by language, stars, or privacy.",
    target: "[data-demo='repositories-tab']",
    page: "/dashboard",
    tab: "repositories",
    action: "highlight",
  },
  {
    id: "sample-repos",
    title: "Sample Repositories",
    description: "Here's what synced repositories look like - complete with stats, descriptions, and quick actions.",
    target: "[data-demo='repo-grid']",
    page: "/dashboard",
    tab: "repositories",
    action: "highlight",
  },
  {
    id: "models-tab",
    title: "AI Models Hub",
    description: "Browse your Hugging Face models with download counts, likes, and pipeline tags.",
    target: "[data-demo='models-tab']",
    page: "/dashboard",
    tab: "models",
    action: "highlight",
  },
  {
    id: "sample-models",
    title: "Sample AI Models",
    description: "View model details including downloads, likes, and direct links to Hugging Face.",
    target: "[data-demo='models-grid']",
    page: "/dashboard",
    tab: "models",
    action: "highlight",
  },
  {
    id: "extensions-tab",
    title: "Extension Marketplace",
    description: "Coming soon: Install plugins and tools to extend Synthweaver Hub's capabilities.",
    target: "[data-demo='extensions-tab']",
    page: "/dashboard",
    tab: "extensions",
    action: "highlight",
  },
  {
    id: "settings-tab",
    title: "Your Settings",
    description: "Manage your profile, preferences, and account settings.",
    target: "[data-demo='settings-tab']",
    page: "/dashboard",
    tab: "settings",
    action: "highlight",
  },
  // Completion
  {
    id: "demo-complete",
    title: "Tour Complete!",
    description: "You've seen the key features of Synthweaver Hub. Sign up to start syncing your repositories and models!",
    target: "[data-demo='dashboard-header']",
    page: "/dashboard",
    tab: "integrations",
    action: "highlight",
  },
]

// Sample data for demo mode
export const DEMO_SAMPLE_DATA = {
  repositories: [
    {
      id: "demo-1",
      repo_name: "synthweaver-core",
      repo_full_name: "demo-user/synthweaver-core",
      description: "Core engine for the Synthweaver platform with plugin architecture",
      is_private: false,
      language: "TypeScript",
      stars_count: 1247,
      forks_count: 89,
      url: "https://github.com/demo-user/synthweaver-core",
    },
    {
      id: "demo-2",
      repo_name: "neon-ui-kit",
      repo_full_name: "demo-user/neon-ui-kit",
      description: "Cyberpunk-inspired React component library with customizable themes",
      is_private: false,
      language: "TypeScript",
      stars_count: 892,
      forks_count: 156,
      url: "https://github.com/demo-user/neon-ui-kit",
    },
    {
      id: "demo-3",
      repo_name: "ai-code-assistant",
      repo_full_name: "demo-user/ai-code-assistant",
      description: "AI-powered code completion and review tool",
      is_private: true,
      language: "Python",
      stars_count: 0,
      forks_count: 0,
      url: "https://github.com/demo-user/ai-code-assistant",
    },
    {
      id: "demo-4",
      repo_name: "flux-state-manager",
      repo_full_name: "demo-user/flux-state-manager",
      description: "Lightweight state management for React applications",
      is_private: false,
      language: "JavaScript",
      stars_count: 423,
      forks_count: 31,
      url: "https://github.com/demo-user/flux-state-manager",
    },
  ],
  models: [
    {
      id: "demo-m1",
      model_name: "synthweaver-code-llm",
      author: "demo-user",
      description: "Fine-tuned code generation model for multiple programming languages",
      pipeline_tag: "text-generation",
      downloads: 15420,
      likes: 234,
      url: "https://huggingface.co/demo-user/synthweaver-code-llm",
    },
    {
      id: "demo-m2",
      model_name: "neon-image-gen",
      author: "demo-user",
      description: "Cyberpunk and synthwave style image generation model",
      pipeline_tag: "text-to-image",
      downloads: 8932,
      likes: 567,
      url: "https://huggingface.co/demo-user/neon-image-gen",
    },
    {
      id: "demo-m3",
      model_name: "code-review-bert",
      author: "demo-user",
      description: "BERT model fine-tuned for automated code review suggestions",
      pipeline_tag: "text-classification",
      downloads: 3201,
      likes: 89,
      url: "https://huggingface.co/demo-user/code-review-bert",
    },
  ],
  integrations: [
    {
      id: "demo-int-1",
      provider: "github",
      provider_username: "demo-user",
      connected_at: new Date().toISOString(),
      last_sync_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: "demo-int-2",
      provider: "huggingface",
      provider_username: "demo-user",
      connected_at: new Date().toISOString(),
      last_sync_at: new Date().toISOString(),
      is_active: true,
    },
  ],
  profile: {
    id: "demo-profile",
    username: "demo-user",
    display_name: "Demo User",
    avatar_url: null,
    bio: "Exploring Synthweaver Hub features",
  },
}

interface DemoModeContextType {
  isDemoMode: boolean
  currentStep: number
  currentStepData: DemoStep | null
  totalSteps: number
  startDemo: () => void
  endDemo: () => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (index: number) => void
  sampleData: typeof DEMO_SAMPLE_DATA
}

const DemoModeContext = createContext<DemoModeContextType | null>(null)

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const currentStepData = isDemoMode ? DEMO_STEPS[currentStep] : null

  const navigateToStep = useCallback((step: DemoStep) => {
    const targetPath = step.tab ? `${step.page}?tab=${step.tab}&demo=true` : `${step.page}?demo=true`
    if (pathname !== step.page) {
      router.push(targetPath)
    } else if (step.tab) {
      router.push(targetPath)
    }
  }, [pathname, router])

  const startDemo = useCallback(() => {
    setIsDemoMode(true)
    setCurrentStep(0)
    navigateToStep(DEMO_STEPS[0])
  }, [navigateToStep])

  const endDemo = useCallback(() => {
    setIsDemoMode(false)
    setCurrentStep(0)
    // Clear demo params from URL
    router.push(pathname || "/")
  }, [pathname, router])

  const nextStep = useCallback(() => {
    if (currentStep < DEMO_STEPS.length - 1) {
      const nextStepIndex = currentStep + 1
      setCurrentStep(nextStepIndex)
      navigateToStep(DEMO_STEPS[nextStepIndex])
    } else {
      endDemo()
    }
  }, [currentStep, navigateToStep, endDemo])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1
      setCurrentStep(prevStepIndex)
      navigateToStep(DEMO_STEPS[prevStepIndex])
    }
  }, [currentStep, navigateToStep])

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < DEMO_STEPS.length) {
      setCurrentStep(index)
      navigateToStep(DEMO_STEPS[index])
    }
  }, [navigateToStep])

  // Auto-advance for steps with autoAdvance timer
  useEffect(() => {
    if (!isDemoMode || !currentStepData?.autoAdvance) return

    const timer = setTimeout(() => {
      nextStep()
    }, currentStepData.autoAdvance)

    return () => clearTimeout(timer)
  }, [isDemoMode, currentStepData, nextStep])

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        currentStep,
        currentStepData,
        totalSteps: DEMO_STEPS.length,
        startDemo,
        endDemo,
        nextStep,
        prevStep,
        goToStep,
        sampleData: DEMO_SAMPLE_DATA,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (!context) {
    throw new Error("useDemoMode must be used within a DemoModeProvider")
  }
  return context
}
