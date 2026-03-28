import { createClient } from "@/lib/supabase/server"
import { CaregiverMedicationsPage } from "@/components/caregiver/medications-page"

export default async function MedicationsPage() {
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

  let medications: Record<string, unknown>[] = []
  let logs: Record<string, unknown>[] = []

  if (patientIds.length > 0) {
    const [medsRes, logsRes] = await Promise.all([
      supabase
        .from("medications")
        .select("*, profiles!medications_user_id_fkey(full_name)")
        .in("user_id", patientIds)
        .order("is_active", { ascending: false })
        .order("name"),
      supabase
        .from("medication_logs")
        .select("*")
        .in("user_id", patientIds)
        .order("taken_at", { ascending: false })
        .limit(20),
    ])
    medications = (medsRes.data ?? []) as Record<string, unknown>[]
    logs = (logsRes.data ?? []) as Record<string, unknown>[]
  }

  return (
    <CaregiverMedicationsPage
      assignments={assignments ?? []}
      medications={medications}
      logs={logs}
    />
  )
}
