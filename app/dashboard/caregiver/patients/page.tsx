import { createClient } from "@/lib/supabase/server"
import { PatientsView } from "@/components/caregiver/patients-view"

export default async function PatientsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from("caregiver_assignments")
    .select("*, care_recipient:profiles!caregiver_assignments_care_recipient_id_fkey(*)")
    .eq("caregiver_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <PatientsView assignments={assignments ?? []} />
    </div>
  )
}
