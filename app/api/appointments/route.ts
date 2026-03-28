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
  const {
    title,
    doctor_name,
    location,
    appointment_date,
    duration_minutes,
    notes,
    user_id,
  } = body

  const targetUserId = user_id || user.id

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      user_id: targetUserId,
      title,
      doctor_name: doctor_name || null,
      location: location || null,
      appointment_date,
      duration_minutes: duration_minutes || 30,
      notes: notes || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
