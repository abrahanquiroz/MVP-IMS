import { createClient } from "@/lib/supabase/server"
import { CaregiverVitalsPage } from "@/components/caregiver/vitals-page"

export default async function VitalsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from("caregiver_assignments")
    .select("*, care_recipient:profiles!caregiver_assignments_care_recipient_id_fkey(*)")
    .eq("caregiver_id", user!.id)
    .eq("status", "active")

  const patientIds = (assignments ?? []).map((a) => a.care_recipient_id)

  let vitals: Record<string, unknown>[] = []
  if (patientIds.length > 0) {
    const { data } = await supabase
      .from("health_vitals")
      .select("*, profiles!health_vitals_user_id_fkey(full_name)")
      .in("user_id", patientIds)
      .order("recorded_at", { ascending: false })
      .limit(50)
    vitals = (data ?? []) as Record<string, unknown>[]
  }

  return (
    <CaregiverVitalsPage
      assignments={assignments ?? []}
      vitals={vitals}
    />
  )
}
