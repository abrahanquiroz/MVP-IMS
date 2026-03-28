import { createClient } from "@/lib/supabase/server"
import { AppointmentsView } from "@/components/shared/appointments-view"

export default async function RecipientAppointmentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user!.id)
    .order("appointment_date", { ascending: false })
    .limit(20)

  return (
    <AppointmentsView
      appointments={appointments ?? []}
      userId={user!.id}
      canManage
    />
  )
}
