"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export type CreateRecipientResult =
  | { ok: true }
  | { ok: false; error: string }

export async function createCareRecipientAccount(
  formData: FormData,
): Promise<CreateRecipientResult> {
  const fullName = (formData.get("full_name") as string)?.trim() ?? ""
  const email = (formData.get("email") as string)?.trim().toLowerCase() ?? ""
  const password = formData.get("password") as string

  if (!fullName || !email || !password) {
    return { ok: false, error: "Completa nombre, correo y contraseña." }
  }
  if (password.length < 6) {
    return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." }
  }

  const supabase = await createClient()
  const {
    data: { user: caregiver },
  } = await supabase.auth.getUser()
  if (!caregiver) {
    return { ok: false, error: "Sesión no válida. Vuelve a iniciar sesión." }
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", caregiver.id)
    .single()

  if (profileErr || profile?.role !== "caregiver") {
    return { ok: false, error: "Solo los cuidadores pueden crear cuentas de personas cuidadas." }
  }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? e.message
          : "Configura SUPABASE_SERVICE_ROLE_KEY en Vercel (Variables de entorno).",
    }
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: "care_recipient",
    },
  })

  if (createErr || !created.user) {
    const msg = createErr?.message ?? "No se pudo crear el usuario."
    if (msg.includes("already been registered") || msg.includes("already registered")) {
      return { ok: false, error: "Ese correo ya tiene una cuenta. Usa otro correo o inicia sesión." }
    }
    return { ok: false, error: msg }
  }

  const recipientId = created.user.id

  const { error: assignErr } = await supabase.from("caregiver_assignments").insert({
    caregiver_id: caregiver.id,
    care_recipient_id: recipientId,
    status: "active",
  })

  if (assignErr) {
    await admin.auth.admin.deleteUser(recipientId)
    return {
      ok: false,
      error: `No se pudo vincular al paciente: ${assignErr.message}`,
    }
  }

  revalidatePath("/dashboard/caregiver/patients")
  return { ok: true }
}
