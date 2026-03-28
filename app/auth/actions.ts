"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { OAUTH_ROLE_COOKIE } from "@/lib/oauth-role-cookie"
import { redirect } from "next/navigation"

/** Guarda el rol elegido antes de redirigir a Google (el query ?role= puede perderse en OAuth). */
export async function setOAuthRoleIntent(role: "caregiver" | "care_recipient") {
  const store = await cookies()
  store.set(OAUTH_ROLE_COOKIE, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  })
}

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string)?.trim()
  const password = formData.get("password") as string

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(
      `/auth/login?error=${encodeURIComponent(error.message)}`,
    )
  }

  const role =
    data.user?.user_metadata?.role ?? "care_recipient"
  if (role === "caregiver") {
    return redirect("/dashboard/caregiver")
  }
  return redirect("/dashboard/recipient")
}

export async function signUp(formData: FormData) {
  const email = (formData.get("email") as string)?.trim()
  const password = formData.get("password") as string
  const firstName = (formData.get("first_name") as string)?.trim() ?? ""
  const lastName = (formData.get("last_name") as string)?.trim() ?? ""
  const fullName = [firstName, lastName].filter(Boolean).join(" ")
  /** Solo registro público como cuidador; las personas cuidadas las da de alta el cuidador. */
  const role = "caregiver" as const

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  })

  if (error) {
    return redirect(
      `/auth/sign-up?error=${encodeURIComponent(error.message)}`,
    )
  }

  if (data.session) {
    return redirect("/dashboard/caregiver")
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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await supabase.from("profiles").update({ role }).eq("id", user.id)
  }
}
