import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { tab } = await searchParams
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
    <DashboardClient
      user={user}
      profile={profile}
      integrations={integrations || []}
      repositories={repositories || []}
      models={models || []}
      initialTab={tab}
    />
  )
}
