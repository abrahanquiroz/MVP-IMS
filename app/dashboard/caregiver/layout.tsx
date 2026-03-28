import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CaregiverTopBar } from "@/components/caregiver/top-bar"
import { CaregiverBottomNav } from "@/components/caregiver/bottom-nav"
import { DashboardAuraShell } from "@/components/dashboard/dashboard-aura-shell"
import { DemoGate } from "@/components/demo/demo-gate"
import { DemoBanner } from "@/components/demo/demo-banner"
import { isWelltrackerDemo } from "@/lib/welltracker-demo"

export default async function CaregiverLayout({
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

  if (!profile || profile.role !== "caregiver") {
    return redirect("/dashboard/recipient")
  }

  const { count } = await supabase
    .from("health_alerts")
    .select("*", { count: "exact", head: true })
    .eq("is_resolved", false)

  const demo = isWelltrackerDemo()

  return (
    <DashboardAuraShell>
      <DemoGate enabled={demo}>
        {demo && <DemoBanner />}
        <CaregiverTopBar
          user={{ fullName: profile.full_name ?? "Cuidador" }}
          alertCount={count ?? 0}
        />
        <main className="mx-auto max-w-lg pb-24 sm:max-w-xl md:max-w-2xl">{children}</main>
        <CaregiverBottomNav />
      </DemoGate>
    </DashboardAuraShell>
  )
}
