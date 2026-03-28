import { createClient } from "@/lib/supabase/server"
import { AlertsView } from "@/components/shared/alerts-view"

export default async function RecipientAlertsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: alerts } = await supabase
    .from("health_alerts")
    .select("*")
    .eq("user_id", user!.id)
    .order("is_resolved", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(30)

  return <AlertsView alerts={alerts ?? []} />
}
