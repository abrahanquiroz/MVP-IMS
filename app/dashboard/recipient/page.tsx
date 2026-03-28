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

  const { data: assignment } = await supabase
    .from("caregiver_assignments")
    .select("*, caregiver:profiles!caregiver_assignments_caregiver_id_fkey(full_name)")
    .eq("care_recipient_id", user!.id)
    .eq("status", "active")
    .limit(1)
    .single()

  return (
    <RecipientHome
      profile={profile}
      medications={medications ?? []}
      caregiverName={
        (assignment?.caregiver as { full_name?: string })?.full_name ?? null
      }
    />
  )
}
