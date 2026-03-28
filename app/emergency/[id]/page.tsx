import { createAdminClient } from "@/lib/supabase/admin"
import { AlertTriangle, Activity, Pill, Phone, Heart } from "lucide-react"

export default async function PublicEmergencyPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  let admin
  try {
    admin = createAdminClient()
  } catch {
    return <p className="p-8 text-center text-sm text-muted-foreground">Datos no disponibles.</p>
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, age, blood_type, allergies, medical_conditions")
    .eq("id", id)
    .single()

  if (!profile) {
    return <p className="p-8 text-center text-sm text-muted-foreground">Paciente no encontrado.</p>
  }

  const { data: medications } = await admin
    .from("medications")
    .select("name, dosage, frequency")
    .eq("user_id", id)
    .eq("is_active", true)

  const { data: assignment } = await admin
    .from("caregiver_assignments")
    .select("caregiver:profiles!caregiver_assignments_caregiver_id_fkey(full_name)")
    .eq("care_recipient_id", id)
    .eq("status", "active")
    .limit(1)
    .single()

  const caregiverName = (assignment?.caregiver as { full_name?: string })?.full_name ?? null
  const meds = (medications ?? []) as { name: string; dosage: string; frequency: string }[]
  const conditions = (profile.medical_conditions ?? []) as string[]

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white">
      {/* Red header */}
      <div className="flex items-center justify-center gap-2 bg-[#ba1a1a] py-3 text-sm font-bold uppercase tracking-widest text-white">
        <Heart className="h-4 w-4" />
        Datos de Emergencia
      </div>

      <div className="px-6 pb-10 pt-6">
        <h1 className="mb-1 text-2xl font-bold text-[#1c1b1f]">{profile.full_name}</h1>
        <p className="mb-6 text-base text-[#49454f]">
          {profile.age ? `${profile.age} años` : ""}
          {profile.age && profile.blood_type ? " · " : ""}
          {profile.blood_type ? `Tipo ${profile.blood_type}` : ""}
        </p>

        {/* Allergies */}
        {profile.allergies && (
          <div className="mb-3 flex items-center gap-3 rounded-xl border-l-4 border-[#ba1a1a] bg-[#ba1a1a]/5 px-4 py-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#ba1a1a]" />
            <span className="text-base font-semibold text-[#ba1a1a]">
              Alérgico: {profile.allergies}
            </span>
          </div>
        )}

        {/* Conditions */}
        {conditions.map((c) => (
          <div key={c} className="mb-3 flex items-center gap-3 rounded-xl border-l-4 border-[#8d5e00] bg-[#8d5e00]/5 px-4 py-3">
            <Activity className="h-5 w-5 shrink-0 text-[#8d5e00]" />
            <span className="text-base font-semibold text-[#2a1700]">{c}</span>
          </div>
        ))}

        {/* Medications */}
        {meds.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#49454f]">
              Medicamentos actuales
            </h2>
            <div className="space-y-2">
              {meds.map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-xl bg-[#f3edf7] px-4 py-3">
                  <Pill className="h-4 w-4 shrink-0 text-[#6750a4]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1c1b1f]">{m.name} {m.dosage}</p>
                    <p className="text-xs text-[#49454f]">{m.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Caregiver contact */}
        {caregiverName && (
          <div className="mt-6 rounded-xl bg-[#f7f2fa] p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#49454f]">
              Contacto de emergencia
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006a60]/15">
                <Phone className="h-4 w-4 text-[#006a60]" />
              </div>
              <p className="text-lg font-bold text-[#1c1b1f]">{caregiverName}</p>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-[#79747e]">
          Mostrá esta pantalla a quien te ayude
        </p>
      </div>
    </div>
  )
}
