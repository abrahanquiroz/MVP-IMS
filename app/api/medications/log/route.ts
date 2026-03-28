import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { medication_id, status, notes, user_id } = body

  const targetUserId = user_id || user.id

  const { data, error } = await supabase
    .from("medication_logs")
    .insert({
      medication_id,
      user_id: targetUserId,
      status: status || "taken",
      logged_by: user.id,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
