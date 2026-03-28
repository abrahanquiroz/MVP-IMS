import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QRView } from "./qr-view"

export default async function QRPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: assignment } = await supabase
    .from("caregiver_assignments")
    .select("*, caregiver:profiles!caregiver_assignments_caregiver_id_fkey(full_name)")
    .eq("care_recipient_id", user.id)
    .eq("status", "active")
    .limit(1)
    .single()

  const caregiverName = (assignment?.caregiver as { full_name?: string })?.full_name ?? null

  const { data: medications } = await supabase
    .from("medications")
    .select("name, dosage, frequency")
    .eq("user_id", user.id)
    .eq("is_active", true)

  return (
    <QRView
      userId={user.id}
      profile={{
        fullName: profile?.full_name ?? "Paciente",
        age: profile?.age ?? null,
        bloodType: profile?.blood_type ?? null,
        allergies: profile?.allergies ?? null,
        conditions: profile?.medical_conditions ?? [],
      }}
      caregiverName={caregiverName}
      medications={medications ?? []}
    />
  )
}
