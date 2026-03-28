import { createClient } from "@/lib/supabase/server"
import { RecipientHome } from "@/components/recipient/home"

export default async function RecipientDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  const { data: medications } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .order("name")

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data: todayLogs } = await supabase
    .from("medication_logs")
    .select("medication_id, status")
    .eq("user_id", user!.id)
    .gte("taken_at", todayStart.toISOString())

  const takenMedIds = new Set(
    (todayLogs ?? [])
      .filter((l) => l.status === "taken")
      .map((l) => l.medication_id)
  )

  const { data: assignment } = await supabase
    .from("caregiver_assignments")
    .select("*, caregiver:profiles!caregiver_assignments_caregiver_id_fkey(full_name)")
    .eq("care_recipient_id", user!.id)
    .eq("status", "active")
    .limit(1)
    .single()

  const meds = (medications ?? []) as { id: string; name: string; dosage: string; schedule_times: string[] }[]
  const pendingMeds = meds.filter((m) => !takenMedIds.has(m.id))

  return (
    <RecipientHome
      profile={profile}
      medications={meds}
      pendingMedications={pendingMeds}
      allTakenToday={meds.length > 0 && pendingMeds.length === 0}
      caregiverName={
        (assignment?.caregiver as { full_name?: string })?.full_name ?? null
      }
    />
  )
}
