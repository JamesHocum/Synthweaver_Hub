import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get GitHub integration
  const { data: integration } = await supabase
    .from("user_integrations")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", "github")
    .eq("is_active", true)
    .single()

  if (!integration) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 })
  }

  try {
    // Fetch all repositories
    const reposResponse = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${integration.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!reposResponse.ok) {
      throw new Error("Failed to fetch repositories")
    }

    const repos = await reposResponse.json()

    // Upsert repositories
    const repoRecords = repos.map((repo: any) => ({
      user_id: user.id,
      integration_id: integration.id,
      provider: "github",
      repo_id: String(repo.id),
      repo_name: repo.name,
      repo_full_name: repo.full_name,
      description: repo.description,
      is_private: repo.private,
      default_branch: repo.default_branch,
      language: repo.language,
      stars_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      last_pushed_at: repo.pushed_at,
      repo_url: repo.html_url,
      clone_url: repo.clone_url,
      metadata: {
        topics: repo.topics,
        has_issues: repo.has_issues,
        has_wiki: repo.has_wiki,
        license: repo.license?.name,
        size: repo.size,
      },
      synced_at: new Date().toISOString(),
    }))

    // Delete old repos and insert new ones
    await supabase
      .from("synced_repositories")
      .delete()
      .eq("user_id", user.id)
      .eq("provider", "github")

    if (repoRecords.length > 0) {
      await supabase.from("synced_repositories").insert(repoRecords)
    }

    // Update last sync time
    await supabase
      .from("user_integrations")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", integration.id)

    return NextResponse.json({ 
      success: true, 
      synced: repoRecords.length,
      message: `Synced ${repoRecords.length} repositories`
    })
  } catch (err) {
    console.error("GitHub sync error:", err)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
