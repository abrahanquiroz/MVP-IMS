"use client"

import Link from "next/link"
import { AlertTriangle, Smile, Footprints } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { AuraCard } from "@/components/dashboard/aura-card"

export type MedicationRowStatus = "taken" | "pending" | "upcoming"

interface CaregiverOverviewProps {
  caregiverName: string
  assignments: Record<string, unknown>[]
  recentAlerts: Record<string, unknown>[]
  upcomingAppointments?: Record<string, unknown>[]
  recentVitals: Record<string, unknown>[]
  /** Si se pasa, sustituye la tabla fija de medicación del home */
  medicationRows?: { name: string; time: string; status: MedicationRowStatus }[]
}

const DEFAULT_MED_ROWS: { name: string; time: string; status: MedicationRowStatus }[] = [
  { name: "Metformina 500mg", time: "8:00 hs", status: "taken" },
  { name: "Atenolol 25mg", time: "14:00 hs", status: "pending" },
  { name: "Losartán 50mg", time: "20:00 hs", status: "upcoming" },
]

export function CaregiverOverview({
  assignments,
  recentAlerts,
  recentVitals,
  medicationRows,
}: CaregiverOverviewProps) {
  const firstAssignment = assignments[0] as
    | {
        care_recipient?: {
          id: string
          full_name: string
          age?: number
        }
      }
    | undefined

  const patient = firstAssignment?.care_recipient
  const latestHR = (recentVitals as { vital_type: string; value: number }[]).find(
    (v) => v.vital_type === "heart_rate",
  )
  const latestSteps = (recentVitals as { vital_type: string; value: number }[]).find(
    (v) => v.vital_type === "steps",
  )
  const topAlert = (
    recentAlerts as { severity: string; title: string; message?: string; created_at: string }[]
  )[0]

  const medRows = medicationRows ?? DEFAULT_MED_ROWS

  return (
    <div className="space-y-4 px-4 pt-2 sm:px-6">
      {topAlert && (
        <AuraCard padding="p-4" className="border-l-4 border-l-[#8d5e00]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#8d5e00]" />
              <p className="text-sm font-medium text-neutral-900">
                {topAlert.title} —{" "}
                <span className="font-normal text-neutral-600">
                  {formatDistanceToNow(new Date(topAlert.created_at), { addSuffix: false, locale: es })}
                </span>
              </p>
            </div>
            <Link href="/dashboard/caregiver/alerts" className="shrink-0 text-sm font-bold text-[#006a60]">
              Ver →
            </Link>
          </div>
        </AuraCard>
      )}

      {patient && (
        <AuraCard padding="p-5">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-[#6750a4] shadow-sm">
                  {patient.full_name?.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow">
                  <span className="h-2 w-2 rounded-full bg-[#006a60]" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{patient.full_name}</h2>
                <p className="text-sm text-neutral-600">
                  Paciente · {patient.age ?? "?"} años
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-[#00b4a0]/15 px-3 py-1 text-xs font-bold text-[#006a60]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#006a60]" />
              En casa
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-white/50 pt-3 text-xs text-neutral-600">
            <span className="flex items-center gap-1.5">🔋 Reloj 82%</span>
            <span className="flex items-center gap-1.5">🔄 hace 2 min</span>
          </div>
        </AuraCard>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        <AuraCard padding="p-4" className="border-l-4 border-l-[#006a60]">
          <p className="text-[12px] text-neutral-600">Pulso</p>
          <p className="text-[22px] font-bold leading-tight text-[#006a60]">
            {latestHR?.value ?? "--"} <span className="text-sm font-medium">bpm</span>
          </p>
        </AuraCard>
        <AuraCard padding="p-4">
          <p className="text-[12px] text-neutral-600">Estrés</p>
          <p className="text-[22px] font-bold leading-tight text-[#006a60]">Bajo</p>
          <Smile className="mt-1 h-5 w-5 text-[#00b4a0]/80" />
        </AuraCard>
        <AuraCard padding="p-4">
          <p className="text-[12px] text-neutral-600">Pasos</p>
          <p className="text-[22px] font-bold leading-tight text-[#6750a4]">
            {latestSteps?.value ? Number(latestSteps.value).toLocaleString("es-AR") : "--"}
          </p>
          <Footprints className="mt-1 h-5 w-5 text-[#6750a4]/70" />
        </AuraCard>
      </div>

      <MedicationsSection rows={medRows} />
    </div>
  )
}

function MedicationsSection({ rows }: { rows: { name: string; time: string; status: MedicationRowStatus }[] }) {
  const statusStyles = {
    taken: "bg-[#006a60] text-white",
    pending: "bg-[#8d5e00] text-white",
    upcoming: "bg-neutral-200 text-neutral-600",
  }
  const statusLabels = { taken: "Tomado", pending: "Pendiente", upcoming: "Próximo" }

  return (
    <AuraCard padding="p-5">
      <h3 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-neutral-600">
        Medicación hoy
      </h3>
      <div className="space-y-4">
        {rows.map((med) => (
          <div key={`${med.name}-${med.time}`} className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  med.status === "taken"
                    ? "bg-[#006a60]/15"
                    : med.status === "pending"
                      ? "bg-[#8d5e00]/15"
                      : "bg-neutral-200/80"
                }`}
              >
                <span
                  className={`text-lg ${
                    med.status === "taken"
                      ? "text-[#006a60]"
                      : med.status === "pending"
                        ? "text-[#8d5e00]"
                        : "text-neutral-500"
                  }`}
                >
                  💊
                </span>
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${med.status === "upcoming" ? "opacity-70" : ""}`}>
                  {med.name}
                </p>
                <p className="text-xs text-neutral-600">{med.time}</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusStyles[med.status]}`}
            >
              {statusLabels[med.status]}
            </span>
          </div>
        ))}
      </div>
    </AuraCard>
  )
}
