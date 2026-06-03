"use client"

import { useDemoMode, DEMO_SAMPLE_DATA } from "@/contexts/demo-mode-context"
import { DashboardClient } from "./dashboard-client"
import { useSearchParams } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Create a mock user for demo mode
const DEMO_USER: SupabaseUser = {
  id: "demo-user-id",
  email: "demo@synthweaver.hub",
  created_at: new Date().toISOString(),
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  user_metadata: {},
}

interface DemoDashboardWrapperProps {
  user: SupabaseUser | null
  profile: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
    bio: string | null
  } | null
  integrations: Array<{
    id: string
    provider: string
    provider_username: string | null
    connected_at: string
    last_sync_at: string | null
    is_active: boolean
  }>
  repositories: Array<{
    id: string
    repo_name: string
    repo_full_name: string
    description: string | null
    is_private: boolean
    language: string | null
    stars_count: number
    forks_count: number
    url: string | null
  }>
  models: Array<{
    id: string
    model_name: string
    author: string | null
    description: string | null
    pipeline_tag: string | null
    downloads: number
    likes: number
    url: string | null
  }>
  initialTab?: string
}

export function DemoDashboardWrapper({
  user,
  profile,
  integrations,
  repositories,
  models,
  initialTab,
}: DemoDashboardWrapperProps) {
  const { isDemoMode, sampleData } = useDemoMode()
  const searchParams = useSearchParams()
  const isDemo = isDemoMode || searchParams.get("demo") === "true"

  // Use demo data if in demo mode
  if (isDemo) {
    return (
      <DashboardClient
        user={DEMO_USER}
        profile={sampleData.profile}
        integrations={sampleData.integrations}
        repositories={sampleData.repositories}
        models={sampleData.models}
        initialTab={initialTab}
      />
    )
  }

  // Otherwise use real data (user must be authenticated)
  if (!user) {
    return null
  }

  return (
    <DashboardClient
      user={user}
      profile={profile}
      integrations={integrations}
      repositories={repositories}
      models={models}
      initialTab={initialTab}
    />
  )
}
