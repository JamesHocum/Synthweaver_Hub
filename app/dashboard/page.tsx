import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
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
    />
  )
}
