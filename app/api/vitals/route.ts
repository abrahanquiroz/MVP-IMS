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
  const { vital_type, value, secondary_value, unit, notes, user_id } = body

  const targetUserId = user_id || user.id

  const { data, error } = await supabase
    .from("health_vitals")
    .insert({
      user_id: targetUserId,
      recorded_by: user.id,
      vital_type,
      value: Number(value),
      secondary_value: secondary_value ? Number(secondary_value) : null,
      unit,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
