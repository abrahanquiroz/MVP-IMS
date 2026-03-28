import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CaregiverTopBar } from "@/components/caregiver/top-bar"
import { CaregiverBottomNav } from "@/components/caregiver/bottom-nav"

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
    return redirect("/auth/login")
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

  return (
    <div className="min-h-screen bg-[var(--surface-container-low)] pb-24 sm:bg-white">
      <CaregiverTopBar
        user={{ fullName: profile.full_name ?? "Cuidador" }}
        alertCount={count ?? 0}
      />
      <main className="mx-auto max-w-lg sm:max-w-xl md:max-w-2xl">
        {children}
      </main>
      <CaregiverBottomNav />
    </div>
  )
}
