import { createClient } from "@/lib/supabase/server"
import { CaregiverOverview } from "@/components/caregiver/overview"

export default async function CaregiverDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get assigned patients
  const { data: assignments } = await supabase
    .from("caregiver_assignments")
    .select("*, care_recipient:profiles!caregiver_assignments_care_recipient_id_fkey(*)")
    .eq("caregiver_id", user!.id)
    .eq("status", "active")

  // Get recent alerts across all patients
  const patientIds = (assignments ?? []).map((a) => a.care_recipient_id)
  let recentAlerts: Record<string, unknown>[] = []
  let upcomingAppointments: Record<string, unknown>[] = []
  let recentVitals: Record<string, unknown>[] = []

  if (patientIds.length > 0) {
    const [alertsRes, appointmentsRes, vitalsRes] = await Promise.all([
      supabase
        .from("health_alerts")
        .select("*, profiles!health_alerts_user_id_fkey(full_name)")
        .in("user_id", patientIds)
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("appointments")
        .select("*, profiles!appointments_user_id_fkey(full_name)")
        .in("user_id", patientIds)
        .gte("appointment_date", new Date().toISOString())
        .order("appointment_date", { ascending: true })
        .limit(5),
      supabase
        .from("health_vitals")
        .select("*, profiles!health_vitals_user_id_fkey(full_name)")
        .in("user_id", patientIds)
        .order("recorded_at", { ascending: false })
        .limit(10),
    ])
    recentAlerts = (alertsRes.data ?? []) as Record<string, unknown>[]
    upcomingAppointments = (appointmentsRes.data ?? []) as Record<string, unknown>[]
    recentVitals = (vitalsRes.data ?? []) as Record<string, unknown>[]
  }

  return (
    <CaregiverOverview
      assignments={assignments ?? []}
      recentAlerts={recentAlerts}
      upcomingAppointments={upcomingAppointments}
      recentVitals={recentVitals}
    />
  )
}
