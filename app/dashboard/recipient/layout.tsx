import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardAuraShell } from "@/components/dashboard/dashboard-aura-shell"
import { DemoGate } from "@/components/demo/demo-gate"
import { DemoBanner } from "@/components/demo/demo-banner"
import { isWelltrackerDemo } from "@/lib/welltracker-demo"

export default async function RecipientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth")
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    const meta = user.user_metadata ?? {}
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: meta.full_name ?? meta.name ?? "",
      role: meta.role ?? "care_recipient",
    }, { onConflict: "id" })
    const { data: created } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    profile = created
  }

  if (profile?.role === "caregiver") {
    return redirect("/dashboard/caregiver")
  }

  const demo = isWelltrackerDemo()

  return (
    <DashboardAuraShell>
      <DemoGate enabled={demo}>
        {demo && <DemoBanner />}
        {children}
      </DemoGate>
    </DashboardAuraShell>
  )
}
