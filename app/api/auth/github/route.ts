"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID
  
  if (!clientId) {
    return new Response("GitHub OAuth not configured", { status: 500 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login?redirect=/dashboard&connect=github")
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : ""}/api/auth/github/callback`
  const scope = "read:user,user:email,repo"
  const state = user.id // Pass user ID in state for callback

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`

  redirect(authUrl)
}
