import { createClient } from "@/lib/supabase/server"
import { VitalsView } from "@/components/shared/vitals-view"

export default async function RecipientVitalsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: vitals } = await supabase
    .from("health_vitals")
    .select("*")
    .eq("user_id", user!.id)
    .order("recorded_at", { ascending: false })
    .limit(50)

  return (
    <VitalsView
      vitals={vitals ?? []}
      userId={user!.id}
      canRecord
    />
  )
}
