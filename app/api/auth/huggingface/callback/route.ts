import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?error=${error}`, request.url))
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=missing_params", request.url))
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : ""}/api/auth/huggingface/callback`

    // Exchange code for access token
    const tokenResponse = await fetch("https://huggingface.co/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.HUGGINGFACE_CLIENT_ID!,
        client_secret: process.env.HUGGINGFACE_CLIENT_SECRET!,
        code,
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(new URL(`/dashboard?error=${tokenData.error}`, request.url))
    }

    const accessToken = tokenData.access_token
    const refreshToken = tokenData.refresh_token
    const expiresIn = tokenData.expires_in

    // Get Hugging Face user info
    const userResponse = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const hfUser = await userResponse.json()

    // Save to database
    const supabase = await createClient()

    // Save integration
    await supabase.from("user_integrations").upsert({
      user_id: state,
      provider: "huggingface",
      provider_user_id: hfUser.id || hfUser.name,
      provider_username: hfUser.name,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null,
      scopes: tokenData.scope?.split(" ") || [],
      metadata: {
        name: hfUser.fullname || hfUser.name,
        email: hfUser.email,
        avatar_url: hfUser.avatarUrl,
        orgs: hfUser.orgs,
      },
      connected_at: new Date().toISOString(),
      is_active: true,
    }, { onConflict: "user_id,provider" })

    return NextResponse.redirect(new URL("/dashboard?tab=huggingface&connected=true", request.url))
  } catch (err) {
    console.error("Hugging Face OAuth error:", err)
    return NextResponse.redirect(new URL("/dashboard?error=oauth_failed", request.url))
  }
}
