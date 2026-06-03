import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DemoDashboardWrapper } from "@/components/dashboard/demo-dashboard-wrapper"

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string; demo?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { tab, demo } = await searchParams
  
  // If demo mode, render with sample data (no auth required)
  if (demo === "true") {
    return (
      <DemoDashboardWrapper
        user={null}
        profile={null}
        integrations={[]}
        repositories={[]}
        models={[]}
        initialTab={tab}
      />
    )
  }
  
  const supabase = await getSupabaseServerClient()
  
  if (!supabase) {
    redirect("/auth/login?error=database_not_configured")
  }
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user integrations
  const { data: integrations } = await supabase.from("user_integrations").select("*").eq("user_id", user.id)

  // Fetch synced repositories
  const { data: repositories } = await supabase
    .from("synced_repositories")
    .select("*")
    .eq("user_id", user.id)
    .order("synced_at", { ascending: false })

  // Fetch synced models
  const { data: models } = await supabase
    .from("synced_models")
    .select("*")
    .eq("user_id", user.id)
    .order("synced_at", { ascending: false })

  return (
    <DemoDashboardWrapper
      user={user}
      profile={profile}
      integrations={integrations || []}
      repositories={repositories || []}
      models={models || []}
      initialTab={tab}
    />
  )
}
