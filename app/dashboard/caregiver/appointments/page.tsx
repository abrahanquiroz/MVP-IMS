import { createClient } from "@/lib/supabase/server"
import { CaregiverAppointmentsPage } from "@/components/caregiver/appointments-page"

export default async function AppointmentsPage() {
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

  let appointments: Record<string, unknown>[] = []
  if (patientIds.length > 0) {
    const { data } = await supabase
      .from("appointments")
      .select("*, profiles!appointments_user_id_fkey(full_name)")
      .in("user_id", patientIds)
      .order("appointment_date", { ascending: false })
      .limit(20)
    appointments = (data ?? []) as Record<string, unknown>[]
  }

  return (
    <CaregiverAppointmentsPage
      assignments={assignments ?? []}
      appointments={appointments}
    />
  )
}
