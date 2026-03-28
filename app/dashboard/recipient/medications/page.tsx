import { createClient } from "@/lib/supabase/server"
import { MedicationsView } from "@/components/shared/medications-view"

export default async function RecipientMedicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: medications }, { data: logs }] = await Promise.all([
    supabase
      .from("medications")
      .select("*")
      .eq("user_id", user!.id)
      .order("is_active", { ascending: false })
      .order("name"),
    supabase
      .from("medication_logs")
      .select("*")
      .eq("user_id", user!.id)
      .order("taken_at", { ascending: false })
      .limit(20),
  ])

  return (
    <MedicationsView
      medications={medications ?? []}
      logs={logs ?? []}
      userId={user!.id}
      canManage
    />
  )
}
