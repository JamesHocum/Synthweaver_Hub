"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function GET() {
  const clientId = process.env.HUGGINGFACE_CLIENT_ID
  
  if (!clientId) {
    return new Response("Hugging Face OAuth not configured", { status: 500 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login?redirect=/dashboard&connect=huggingface")
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : ""}/api/auth/huggingface/callback`
  const scope = "openid profile email read-repos"
  const state = user.id

  const authUrl = `https://huggingface.co/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&response_type=code`

  redirect(authUrl)
}
