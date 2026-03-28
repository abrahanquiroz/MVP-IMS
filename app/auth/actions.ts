"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function gotrueCall(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.msg || "Error de autenticación")
  }
  return data
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  let session: { access_token: string; refresh_token: string; user: { user_metadata?: { role?: string } } }
  try {
    session = await gotrueCall("/token?grant_type=password", { email, password })
  } catch (e) {
    return redirect(`/auth/login?error=${encodeURIComponent(e instanceof Error ? e.message : "Error al iniciar sesión")}`)
  }

  const supabase = await createClient()
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  })

  const role = session.user?.user_metadata?.role || "care_recipient"
  if (role === "caregiver") {
    return redirect("/dashboard/caregiver")
  }
  return redirect("/dashboard/recipient")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string
  const role = formData.get("role") as string

  let data: { access_token?: string; refresh_token?: string; user?: { user_metadata?: { role?: string } } }
  try {
    data = await gotrueCall("/signup", {
      email,
      password,
      data: { full_name: fullName, role: role || "care_recipient" },
    })
  } catch (e) {
    return redirect(`/auth/sign-up?error=${encodeURIComponent(e instanceof Error ? e.message : "Error al registrarse")}`)
  }

  if (data.access_token && data.refresh_token) {
    const supabase = await createClient()
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })
    const userRole = data.user?.user_metadata?.role || "care_recipient"
    if (userRole === "caregiver") {
      return redirect("/dashboard/caregiver")
    }
    return redirect("/dashboard/recipient")
  }

  return redirect("/auth/sign-up-success")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect("/")
}

export async function updateUserRole(role: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ data: { role } })
  if (error) throw error

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from("profiles").update({ role }).eq("id", user.id)
  }
}
