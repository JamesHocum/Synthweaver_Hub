import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state") // This is the user_id
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?error=${error}`, request.url))
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=missing_params", request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(new URL(`/dashboard?error=${tokenData.error}`, request.url))
    }

    const accessToken = tokenData.access_token
    const scope = tokenData.scope

    // Get GitHub user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    const githubUser = await userResponse.json()

    // Save to database
    const supabase = await createClient()
    
    // Ensure profile exists
    await supabase.from("profiles").upsert({
      id: state,
      username: githubUser.login,
      display_name: githubUser.name || githubUser.login,
      avatar_url: githubUser.avatar_url,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" })

    // Save integration
    await supabase.from("user_integrations").upsert({
      user_id: state,
      provider: "github",
      provider_user_id: String(githubUser.id),
      provider_username: githubUser.login,
      access_token: accessToken,
      scopes: scope?.split(",") || [],
      metadata: {
        name: githubUser.name,
        email: githubUser.email,
        avatar_url: githubUser.avatar_url,
        bio: githubUser.bio,
        public_repos: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
      },
      connected_at: new Date().toISOString(),
      is_active: true,
    }, { onConflict: "user_id,provider" })

    return NextResponse.redirect(new URL("/dashboard?tab=github&connected=true", request.url))
  } catch (err) {
    console.error("GitHub OAuth error:", err)
    return NextResponse.redirect(new URL("/dashboard?error=oauth_failed", request.url))
  }
}
