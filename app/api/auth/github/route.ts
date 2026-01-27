import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID
  
  if (!clientId) {
    return new Response("GitHub OAuth not configured", { status: 500 })
  }

  const supabase = await createClient()
  
  if (!supabase) {
    return new Response("Database not configured", { status: 500 })
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login?redirect=/dashboard&connect=github")
  }

  // Get the host from headers to build the correct redirect URI
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  
  const redirectUri = `${baseUrl}/api/auth/github/callback`
  const scope = "read:user,user:email,repo"
  const state = user.id // Pass user ID in state for callback

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`

  redirect(authUrl)
}
