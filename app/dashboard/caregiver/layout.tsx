import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CaregiverSidebar } from "@/components/caregiver/sidebar"

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CaregiverSidebar
        user={{ id: user.id, email: user.email ?? "", fullName: profile.full_name ?? "Cuidador" }}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
