import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// POST - Install an extension
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get extension details
  const { data: extension, error: extError } = await supabase
    .from("extensions")
    .select("*")
    .eq("id", id)
    .single()

  if (extError || !extension) {
    return NextResponse.json({ error: "Extension not found" }, { status: 404 })
  }

  // Check if already installed
  const { data: existing } = await supabase
    .from("user_extensions")
    .select("id")
    .eq("user_id", user.id)
    .eq("extension_id", id)
    .single()

  if (existing) {
    return NextResponse.json({ error: "Extension already installed" }, { status: 400 })
  }

  // Install extension
  const { error: installError } = await supabase
    .from("user_extensions")
    .insert({
      user_id: user.id,
      extension_id: id,
      installed_version: extension.version,
      is_enabled: true,
    })

  if (installError) {
    return NextResponse.json({ error: installError.message }, { status: 500 })
  }

  // Increment download count
  await supabase.rpc("increment_download_count", { extension_id: id })

  return NextResponse.json({ success: true })
}

// DELETE - Uninstall an extension
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase
    .from("user_extensions")
    .delete()
    .eq("user_id", user.id)
    .eq("extension_id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
