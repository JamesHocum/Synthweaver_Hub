import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get Hugging Face integration
  const { data: integration } = await supabase
    .from("user_integrations")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", "huggingface")
    .eq("is_active", true)
    .single()

  if (!integration) {
    return NextResponse.json({ error: "Hugging Face not connected" }, { status: 400 })
  }

  try {
    // Get user's models
    const username = integration.provider_username
    const modelsResponse = await fetch(`https://huggingface.co/api/models?author=${username}`, {
      headers: {
        Authorization: `Bearer ${integration.access_token}`,
      },
    })

    if (!modelsResponse.ok) {
      throw new Error("Failed to fetch models")
    }

    const models = await modelsResponse.json()

    // Upsert models
    const modelRecords = models.map((model: any) => ({
      user_id: user.id,
      integration_id: integration.id,
      model_id: model.id || model.modelId,
      model_name: model.id?.split("/")[1] || model.modelId,
      author: model.author || username,
      model_type: model.library_name,
      pipeline_tag: model.pipeline_tag,
      description: model.description,
      downloads: model.downloads || 0,
      likes: model.likes || 0,
      is_private: model.private || false,
      tags: model.tags || [],
      model_url: `https://huggingface.co/${model.id || model.modelId}`,
      metadata: {
        lastModified: model.lastModified,
        siblings: model.siblings?.length || 0,
      },
      synced_at: new Date().toISOString(),
    }))

    // Delete old models and insert new ones
    await supabase
      .from("synced_models")
      .delete()
      .eq("user_id", user.id)

    if (modelRecords.length > 0) {
      await supabase.from("synced_models").insert(modelRecords)
    }

    // Update last sync time
    await supabase
      .from("user_integrations")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", integration.id)

    return NextResponse.json({ 
      success: true, 
      synced: modelRecords.length,
      message: `Synced ${modelRecords.length} models`
    })
  } catch (err) {
    console.error("Hugging Face sync error:", err)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
