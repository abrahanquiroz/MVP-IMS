import { createClient } from "@/lib/supabase/server"
import { OAUTH_ROLE_COOKIE } from "@/lib/oauth-role-cookie"
import { getRequestOrigin } from "@/lib/site-url"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const origin = getRequestOrigin(request)
  const { searchParams } = new URL(request.url)

  const oauthError = searchParams.get("error")
  const oauthDescription = searchParams.get("error_description")
  if (oauthError) {
    const msg =
      oauthDescription?.replace(/\+/g, " ") ||
      oauthError ||
      "Error de OAuth"
    return NextResponse.redirect(
      `${origin}/auth/error?${new URLSearchParams({ reason: msg })}`,
    )
  }

  const code = searchParams.get("code")
  const roleFromQuery = searchParams.get("role")

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?reason=${encodeURIComponent("Falta el código de sesión")}`)
  }

  const cookieStore = await cookies()
  const roleFromCookie = cookieStore.get(OAUTH_ROLE_COOKIE)?.value as
    | "caregiver"
    | "care_recipient"
    | undefined

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?${new URLSearchParams({ reason: error.message })}`,
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role = user?.user_metadata?.role as string | undefined
  const roleIntent = roleFromCookie || roleFromQuery || undefined

  if (roleIntent && user && (!role || role !== roleIntent)) {
    role = roleIntent
    const fullName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      ""
    await supabase.auth.updateUser({
      data: { role, full_name: fullName },
    })
    await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          role,
          full_name: fullName,
        },
        { onConflict: "id" },
      )
  }

  cookieStore.delete(OAUTH_ROLE_COOKIE)

  role = role || "care_recipient"

  if (role === "caregiver") {
    return NextResponse.redirect(`${origin}/dashboard/caregiver`)
  }
  return NextResponse.redirect(`${origin}/dashboard/recipient`)
}
