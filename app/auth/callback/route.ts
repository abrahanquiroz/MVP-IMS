import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const roleFromQuery = searchParams.get("role")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      let role = user?.user_metadata?.role

      // For OAuth sign-ups: apply role from query param if user doesn't have one yet
      if (!role && roleFromQuery && user) {
        role = roleFromQuery
        await supabase.auth.updateUser({ data: { role, full_name: user.user_metadata?.full_name || user.user_metadata?.name || "" } })
        await supabase
          .from("profiles")
          .update({ role, full_name: user.user_metadata?.full_name || user.user_metadata?.name || "" })
          .eq("id", user.id)
      }

      role = role || "care_recipient"

      if (role === "caregiver") {
        return NextResponse.redirect(`${origin}/dashboard/caregiver`)
      }
      return NextResponse.redirect(`${origin}/dashboard/recipient`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
