import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET - List all extensions (public)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  let query = supabase
    .from("extensions")
    .select("*")
    .order("download_count", { ascending: false })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,display_name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data: extensions, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ extensions })
}

// POST - Create a new extension (authenticated)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, display_name, description, category, tags, icon_url, manifest } = body

    if (!name || !display_name) {
      return NextResponse.json({ error: "Name and display name are required" }, { status: 400 })
    }

    // Get user profile for author name
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .single()

    const { data: extension, error } = await supabase
      .from("extensions")
      .insert({
        name: name.toLowerCase().replace(/\s+/g, "-"),
        display_name,
        description,
        author_id: user.id,
        author_name: profile?.display_name || profile?.username || user.email,
        category,
        tags: tags || [],
        icon_url,
        manifest: manifest || {},
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ extension })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
