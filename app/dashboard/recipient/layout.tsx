import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RecipientHeader } from "@/components/recipient/header"

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
    return redirect("/auth/login")
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Auto-create profile if trigger didn't fire or query failed
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

  return (
    <div className="min-h-screen bg-white">
      <RecipientHeader
        user={{
          id: user.id,
          email: user.email ?? "",
          fullName: profile?.full_name ?? "Usuario",
        }}
      />
      <main className="mx-auto max-w-4xl px-4 pb-28 pt-20 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
