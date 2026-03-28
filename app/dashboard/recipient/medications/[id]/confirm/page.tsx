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
    />
  )
}
