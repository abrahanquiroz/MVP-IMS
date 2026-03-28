import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Heart, Thermometer, Droplets, Footprints, Activity } from "lucide-react"

export default async function RecipientVitalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth/login")

  const { data: vitals } = await supabase
    .from("health_vitals")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false })
    .limit(20)

  const allVitals = (vitals ?? []) as {
    id: string; vital_type: string; value: number; secondary_value?: number; unit: string; recorded_at: string
  }[]

  const latest = (type: string) => allVitals.find((v) => v.vital_type === type)

  const hr = latest("heart_rate")
  const bp = latest("blood_pressure")
  const ox = latest("blood_oxygen")
  const temp = latest("temperature")
  const steps = latest("steps")

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-8 pt-6 sm:px-6 md:max-w-xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-container-high)]">
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Mi Salud</h1>
      </div>

      <div className="space-y-3">
        <VitalCard icon={Heart} label="Pulso" value={hr ? `${hr.value}` : "--"} unit="bpm" color="text-secondary" bg="bg-secondary/10" />
        <VitalCard icon={Activity} label="Presión" value={bp ? `${bp.value}/${bp.secondary_value}` : "--"} unit="mmHg" color="text-primary" bg="bg-primary/10" />
        <VitalCard icon={Droplets} label="Oxígeno" value={ox ? `${ox.value}` : "--"} unit="%" color="text-secondary" bg="bg-secondary/10" />
        <VitalCard icon={Thermometer} label="Temperatura" value={temp ? `${temp.value}` : "--"} unit="°C" color="text-[var(--tertiary)]" bg="bg-[var(--tertiary)]/10" />
        <VitalCard icon={Footprints} label="Pasos hoy" value={steps ? Number(steps.value).toLocaleString("es-AR") : "--"} unit="pasos" color="text-primary" bg="bg-primary/10" />
      </div>

      {allVitals.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Tu cuidador aún no ha registrado datos de salud.
          </p>
        </div>
      )}
    </div>
  )
}

function VitalCard({ icon: Icon, label, value, unit, color, bg }: {
  icon: React.ComponentType<{ className?: string }>
  label: string; value: string; unit: string; color: string; bg: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--outline-variant)]/10 bg-white p-4 shadow-sm sm:p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
        <p className="text-xl font-bold text-foreground sm:text-2xl">
          {value} <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        </p>
      </div>
    </div>
  )
}
