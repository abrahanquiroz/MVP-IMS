import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmergencyView } from "./emergency-view"

export default async function EmergencyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth")

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

  const caregiverName = (assignment?.caregiver as { full_name?: string })?.full_name ?? "Cuidador"

  return (
    <EmergencyView
      caregiverName={caregiverName}
      allergies={profile?.allergies ?? null}
      bloodType={profile?.blood_type ?? null}
    />
  )
}
