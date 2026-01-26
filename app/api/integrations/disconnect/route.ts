import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { provider } = await request.json()

    if (!provider) {
      return NextResponse.json({ error: "Provider required" }, { status: 400 })
    }

    // Delete integration and associated data
    const { data: integration } = await supabase
      .from("user_integrations")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", provider)
      .single()

    if (integration) {
      // Delete synced data based on provider
      if (provider === "github") {
        await supabase
          .from("synced_repositories")
          .delete()
          .eq("integration_id", integration.id)
      } else if (provider === "huggingface") {
        await supabase
          .from("synced_models")
          .delete()
          .eq("integration_id", integration.id)
      }

      // Delete the integration
      await supabase
        .from("user_integrations")
        .delete()
        .eq("id", integration.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Disconnect error:", err)
    return NextResponse.json({ error: "Disconnect failed" }, { status: 500 })
  }
}
