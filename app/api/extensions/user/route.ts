import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - Get user's installed extensions
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: userExtensions, error } = await supabase
    .from("user_extensions")
    .select(`
      *,
      extension:extensions(*)
    `)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ userExtensions })
}
