"use client"

import { CheckCircle, Clock, AlertCircle, Plus, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface CaregiverMedicationsPageProps {
  assignments: Record<string, unknown>[]
  medications: Record<string, unknown>[]
  logs: Record<string, unknown>[]
  demoOnRemoveMed?: (id: string) => void
  demoOnAddMed?: () => void
}

type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  schedule_times: string[]
  is_active: boolean
  user_id: string
  profiles?: { full_name?: string }
}

type MedLog = {
  id: string
  medication_id: string
  status: "taken" | "skipped" | "missed"
  taken_at: string
}

export function CaregiverMedicationsPage({
  medications,
  logs,
  demoOnRemoveMed,
  demoOnAddMed,
}: CaregiverMedicationsPageProps) {
  const meds = medications as unknown as Medication[]
  const medLogs = logs as unknown as MedLog[]
  const activeMeds = meds.filter((m) => m.is_active)

  function getLatestLog(medId: string): MedLog | undefined {
    return medLogs
      .filter((l) => l.medication_id === medId)
      .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())[0]
  }

  return (
    <div className="px-4 pt-4">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Medicación</h1>
        {demoOnAddMed ? (
          <button
            type="button"
            onClick={demoOnAddMed}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--surface-container-high)]"
            aria-label="Agregar medicamento demo"
          >
            <Plus className="h-5 w-5" />
          </button>
        ) : (
          <Link
            href="/dashboard/caregiver/patients"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--surface-container-high)]"
          >
            <Plus className="h-5 w-5" />
          </Link>
        )}
      </div>
      <p className="mb-6 text-sm text-muted-foreground">Estado de los medicamentos del paciente</p>

      {activeMeds.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm text-muted-foreground">No hay medicamentos registrados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeMeds.map((med) => {
            const log = getLatestLog(med.id)
            const status = log?.status
            const time = Array.isArray(med.schedule_times) && med.schedule_times[0]
              ? med.schedule_times[0]
              : ""

            return (
              <div
                key={med.id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--outline-variant)]/10 bg-[var(--surface-container-high)] px-4 py-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <StatusIcon status={status} />
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-foreground">
                      {med.name} {med.dosage}
                    </p>
                    <StatusBadge status={status} logTime={log?.taken_at} />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {time && (
                    <p className="text-sm text-muted-foreground">{time} hs</p>
                  )}
                  {demoOnRemoveMed && (
                    <button
                      type="button"
                      onClick={() => demoOnRemoveMed(med.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10"
                      aria-label="Quitar demo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stock warning placeholder */}
      {activeMeds.length > 0 && (
        <div className="mt-6 rounded-xl border-l-4 border-[var(--tertiary)] bg-[var(--tertiary)]/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[var(--tertiary)]" />
              <p className="text-sm font-medium text-[var(--tertiary)]">
                {activeMeds[0].name} — verificar stock
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--tertiary)]">Gestionar →</span>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status?: string }) {
  if (status === "taken") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15">
        <CheckCircle className="h-5 w-5 text-secondary" />
      </div>
    )
  }
  if (status === "skipped" || status === "missed") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tertiary)]/15">
        <AlertCircle className="h-5 w-5 text-[var(--tertiary)]" />
      </div>
    )
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--outline-variant)]/20">
      <Clock className="h-5 w-5 text-muted-foreground" />
    </div>
  )
}

function StatusBadge({ status, logTime }: { status?: string; logTime?: string }) {
  if (status === "taken") {
    return (
      <span className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
        Tomado {logTime ? formatDistanceToNow(new Date(logTime), { addSuffix: true, locale: es }) : ""}
      </span>
    )
  }
  if (status === "skipped" || status === "missed") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex rounded-full border border-[var(--tertiary)]/20 bg-[var(--tertiary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--tertiary)]">
          Pendiente
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Recordar</span>
      </div>
    )
  }
  return (
    <span className="inline-flex rounded-full border border-[var(--outline-variant)]/20 bg-[var(--outline-variant)]/10 px-2 py-0.5 text-xs font-medium text-muted-foreground">
      Próximo
    </span>
  )
}
