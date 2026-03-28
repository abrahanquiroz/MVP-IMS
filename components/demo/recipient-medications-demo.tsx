"use client"

import Link from "next/link"
import { ChevronLeft, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react"
import { AuraCard } from "@/components/dashboard/aura-card"
import { Button } from "@/components/ui/button"
import { useDemoStore } from "@/components/demo/demo-store"

export function RecipientMedicationsDemo() {
  const d = useDemoStore()
  const meds = d.recipientMedsForUser
  const logs = d.medicationLogs

  function getStatus(medId: string) {
    const t0 = new Date()
    t0.setHours(0, 0, 0, 0)
    const todayLog = logs
      .filter((l) => l.medication_id === medId && new Date(l.taken_at) >= t0)
      .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())[0]
    return todayLog?.status ?? "upcoming"
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-8 pt-6 sm:px-6 md:max-w-xl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/recipient"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-[#6750a4]" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Mis Medicamentos</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={d.addMedication}
          className="rounded-full border-neutral-200 bg-white/90 text-sm shadow-sm"
        >
          + Demo
        </Button>
      </div>

      {meds.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-neutral-600">No hay medicamentos en la demo.</p>
          <Button type="button" className="mt-4 rounded-full" onClick={d.addMedication}>
            Agregar uno
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {meds.map((med) => {
            const status = getStatus(med.id)
            const time = med.schedule_times[0] ? `${med.schedule_times[0]} hs` : "Sin horario"
            return (
              <div key={med.id} className="flex items-stretch gap-2">
                <Link href={`/dashboard/recipient/medications/${med.id}/confirm`} className="min-w-0 flex-1">
                  <AuraCard padding="p-4 sm:p-5" className="h-full transition-all active:scale-[0.99]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <StatusIcon status={status} />
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-neutral-900 sm:text-lg">
                            {med.name} {med.dosage}
                          </p>
                          <p className="text-xs text-neutral-600 sm:text-sm">
                            {med.frequency} · {time}
                          </p>
                        </div>
                      </div>
                      <StatusLabel status={status} />
                    </div>
                  </AuraCard>
                </Link>
                <button
                  type="button"
                  onClick={() => d.removeMedication(med.id)}
                  className="flex w-11 shrink-0 items-center justify-center self-stretch rounded-2xl border border-red-200/80 bg-white/80 text-destructive shadow-sm transition hover:bg-red-50"
                  aria-label="Quitar demo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  if (status === "taken")
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006a60]/15">
        <CheckCircle className="h-5 w-5 text-[#006a60]" />
      </div>
    )
  if (status === "skipped" || status === "missed")
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8d5e00]/15">
        <AlertCircle className="h-5 w-5 text-[#8d5e00]" />
      </div>
    )
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/80">
      <Clock className="h-5 w-5 text-neutral-500" />
    </div>
  )
}

function StatusLabel({ status }: { status: string }) {
  if (status === "taken")
    return (
      <span className="shrink-0 rounded-full bg-[#006a60] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
        Tomado
      </span>
    )
  if (status === "skipped" || status === "missed")
    return (
      <span className="shrink-0 rounded-full bg-[#8d5e00] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
        Pendiente
      </span>
    )
  return (
    <span className="shrink-0 rounded-full bg-neutral-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
      Próximo
    </span>
  )
}
