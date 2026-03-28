import { createClient } from "@/lib/supabase/server"
import { NotifyView } from "./notify-view"

export default async function NotifyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from("caregiver_assignments")
    .select("*, care_recipient:profiles!caregiver_assignments_care_recipient_id_fkey(id, full_name)")
    .eq("caregiver_id", user!.id)
    .eq("status", "active")

  const patients = (assignments ?? []).map((a) => {
    const cr = a.care_recipient as { id: string; full_name: string }
    return { id: cr.id, name: cr.full_name }
  })

  return <NotifyView patients={patients} />
}
