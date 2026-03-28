import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RecipientAlertsList } from "./alerts-list"

export default async function RecipientAlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth/login")

  const { data: alerts } = await supabase
    .from("health_alerts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_resolved", false)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <RecipientAlertsList
      initialAlerts={(alerts ?? []) as {
        id: string; title: string; message?: string; severity: string;
        alert_type: string; is_resolved: boolean; created_at: string
      }[]}
    />
  )
}
