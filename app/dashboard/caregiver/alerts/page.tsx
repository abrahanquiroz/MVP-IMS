import { createClient } from "@/lib/supabase/server"
import { AlertsView } from "@/components/shared/alerts-view"

export default async function CaregiverAlertsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from("caregiver_assignments")
    .select("care_recipient_id")
    .eq("caregiver_id", user!.id)
    .eq("status", "active")

  const patientIds = (assignments ?? []).map((a) => a.care_recipient_id)

  let alerts: Record<string, unknown>[] = []
  if (patientIds.length > 0) {
    const { data } = await supabase
      .from("health_alerts")
      .select("*, profiles!health_alerts_user_id_fkey(full_name)")
      .in("user_id", patientIds)
      .order("is_resolved", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(30)
    alerts = (data ?? []) as Record<string, unknown>[]
  }

  return (
    <div className="p-6 lg:p-8">
      <AlertsView alerts={alerts} title="Patient Alerts" />
    </div>
  )
}
