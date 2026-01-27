import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function GET() {
  const clientId = process.env.HUGGINGFACE_CLIENT_ID
  
  if (!clientId) {
    return new Response("Hugging Face OAuth not configured", { status: 500 })
  }

  const supabase = await createClient()
  
  if (!supabase) {
    return new Response("Database not configured", { status: 500 })
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login?redirect=/dashboard&connect=huggingface")
  }

  // Get the host from headers to build the correct redirect URI
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  
  const redirectUri = `${baseUrl}/api/auth/huggingface/callback`
  const scope = "openid profile email read-repos"
  const state = user.id

  const authUrl = `https://huggingface.co/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&response_type=code`

  redirect(authUrl)
}
