import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ConfirmMedication } from "./confirm-form"

export default async function ConfirmMedPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth/login")

  const { data: med } = await supabase
    .from("medications")
    .select("*")
    .eq("id", id)
    .single()

  if (!med) return redirect("/dashboard/recipient")

  const { data: assignment } = await supabase
    .from("caregiver_assignments")
    .select("*, caregiver:profiles!caregiver_assignments_caregiver_id_fkey(full_name)")
    .eq("care_recipient_id", user.id)
    .eq("status", "active")
    .limit(1)
    .single()

  const caregiverName = (assignment?.caregiver as { full_name?: string })?.full_name ?? null

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data: todayLog } = await supabase
    .from("medication_logs")
    .select("id, status")
    .eq("medication_id", id)
    .eq("user_id", user.id)
    .gte("taken_at", todayStart.toISOString())
    .order("taken_at", { ascending: false })
    .limit(1)
    .single()

  return (
    <ConfirmMedication
      medication={{
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        schedule_times: med.schedule_times as string[],
      }}
      userId={user.id}
      caregiverName={caregiverName}
      alreadyTaken={todayLog?.status === "taken"}
    />
  )
}
