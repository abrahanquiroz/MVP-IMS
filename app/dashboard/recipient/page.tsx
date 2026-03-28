import { createClient } from "@/lib/supabase/server"
import { RecipientOverview } from "@/components/recipient/overview"

export default async function RecipientDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [
    { data: medications },
    { data: alerts },
    { data: appointments },
    { data: vitals },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from("medications")
      .select("*")
      .eq("user_id", user!.id)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("health_alerts")
      .select("*")
      .eq("user_id", user!.id)
      .eq("is_resolved", false)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user!.id)
      .eq("status", "scheduled")
      .gte("appointment_date", new Date().toISOString())
      .order("appointment_date", { ascending: true })
      .limit(3),
    supabase
      .from("health_vitals")
      .select("*")
      .eq("user_id", user!.id)
      .order("recorded_at", { ascending: false })
      .limit(6),
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
  ])

  return (
    <RecipientOverview
      profile={profile}
      medications={medications ?? []}
      alerts={alerts ?? []}
      appointments={appointments ?? []}
      vitals={vitals ?? []}
    />
  )
}
