"use client"

import Link from "next/link"
import { AlertTriangle, Smile, Footprints } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface CaregiverOverviewProps {
  caregiverName: string
  assignments: Record<string, unknown>[]
  recentAlerts: Record<string, unknown>[]
  upcomingAppointments: Record<string, unknown>[]
  recentVitals: Record<string, unknown>[]
}

export function CaregiverOverview({
  assignments,
  recentAlerts,
  recentVitals,
}: CaregiverOverviewProps) {
  const firstAssignment = assignments[0] as {
    care_recipient?: {
      id: string
      full_name: string
      age?: number
    }
  } | undefined

  const patient = firstAssignment?.care_recipient
  const latestHR = (recentVitals as { vital_type: string; value: number }[]).find(
    (v) => v.vital_type === "heart_rate"
  )
  const latestSteps = (recentVitals as { vital_type: string; value: number }[]).find(
    (v) => v.vital_type === "steps"
  )
  const topAlert = (recentAlerts as { severity: string; title: string; message?: string; created_at: string }[])[0]

  return (
    <div className="space-y-4 px-4 pt-2 sm:px-6">
      {/* Alert banner */}
      {topAlert && (
        <div className="flex items-center justify-between rounded-lg border-l-4 border-[var(--tertiary)] bg-[var(--tertiary)]/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--tertiary)]" />
            <p className="text-sm font-medium text-foreground">
              {topAlert.title} —{" "}
              <span className="font-normal text-muted-foreground">
                {formatDistanceToNow(new Date(topAlert.created_at), { addSuffix: false, locale: es })}
              </span>
            </p>
          </div>
          <Link href="/dashboard/caregiver/alerts" className="shrink-0 text-sm font-bold text-[var(--tertiary)]">
            Ver →
          </Link>
        </div>
      )}

      {/* Patient card */}
      {patient && (
        <div className="rounded-2xl border border-[var(--outline-variant)]/15 bg-[var(--surface-container-high)] p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-variant)] text-lg font-bold text-primary">
                  {patient.full_name?.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{patient.full_name}</h2>
                <p className="text-sm text-muted-foreground">
                  Papá · {patient.age ?? "?"} años
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              En casa
            </span>
          </div>
          <div className="flex items-center gap-5 border-t border-[var(--outline-variant)]/15 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">🔋 Reloj 82%</span>
            <span className="flex items-center gap-1.5">🔄 hace 2 min</span>
          </div>
        </div>
      )}

      {/* Vitals row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border-l-4 border-secondary bg-[var(--surface-container-high)] p-4">
          <p className="text-[12px] text-muted-foreground">Pulso</p>
          <p className="text-[22px] font-bold leading-tight text-secondary">
            {latestHR?.value ?? "--"} <span className="text-sm font-medium">bpm</span>
          </p>
        </div>
        <div className="rounded-xl bg-[var(--surface-container-high)] p-4">
          <p className="text-[12px] text-muted-foreground">Estrés</p>
          <p className="text-[22px] font-bold leading-tight text-secondary">Bajo</p>
          <Smile className="mt-1 h-5 w-5 text-secondary/70" />
        </div>
        <div className="rounded-xl bg-[var(--surface-container-high)] p-4">
          <p className="text-[12px] text-muted-foreground">Pasos</p>
          <p className="text-[22px] font-bold leading-tight text-primary">
            {latestSteps?.value ? Number(latestSteps.value).toLocaleString("es-AR") : "--"}
          </p>
          <Footprints className="mt-1 h-5 w-5 text-primary/70" />
        </div>
      </div>

      {/* Medications today */}
      <MedicationsSection />
    </div>
  )
}

function MedicationsSection() {
  const meds = [
    { name: "Metformina 500mg", time: "8:00 hs", status: "taken" as const },
    { name: "Atenolol 25mg", time: "14:00 hs", status: "pending" as const },
    { name: "Losartán 50mg", time: "20:00 hs", status: "upcoming" as const },
  ]

  const statusStyles = {
    taken: "bg-secondary text-secondary-foreground",
    pending: "bg-[var(--tertiary)] text-white",
    upcoming: "bg-[var(--surface-variant)] text-muted-foreground",
  }
  const statusLabels = { taken: "Tomado", pending: "Pendiente", upcoming: "Próximo" }

  return (
    <div className="rounded-xl bg-[var(--surface-container-high)] p-5">
      <h3 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Medicación Hoy
      </h3>
      <div className="space-y-4">
        {meds.map((med) => (
          <div key={med.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                med.status === "taken" ? "bg-secondary/10" : med.status === "pending" ? "bg-[var(--tertiary)]/10" : "bg-[var(--surface-variant)]"
              }`}>
                <span className={`text-lg ${
                  med.status === "taken" ? "text-secondary" : med.status === "pending" ? "text-[var(--tertiary)]" : "text-muted-foreground"
                }`}>💊</span>
              </div>
              <div>
                <p className={`text-sm font-semibold ${med.status === "upcoming" ? "opacity-70" : ""}`}>
                  {med.name}
                </p>
                <p className="text-xs text-muted-foreground">{med.time}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusStyles[med.status]}`}>
              {statusLabels[med.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
