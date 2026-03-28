"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pill, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Props {
  medication: { id: string; name: string; dosage: string; schedule_times: string[] }
  userId: string
  caregiverName: string | null
}

export function ConfirmMedication({ medication, userId, caregiverName }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function logMedication(status: "taken" | "skipped") {
    startTransition(async () => {
      const res = await fetch("/api/medications/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication_id: medication.id,
          user_id: userId,
          status,
        }),
      })
      if (res.ok) {
        toast.success(status === "taken" ? "Registrado como tomado" : "Registrado como omitido")
        router.push("/dashboard/recipient")
      } else {
        toast.error("Error al registrar")
      }
    })
  }

  const time = medication.schedule_times?.[0] ?? ""

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-6">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg text-primary">✦</span>
          <span className="text-lg font-bold tracking-tight text-primary">WellTracker</span>
        </div>
        <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-high)]">
          <span className="text-sm text-muted-foreground">←</span>
        </Link>
      </div>

      {/* Pill icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Pill className="h-8 w-8 text-primary" />
        </div>
      </div>

      <h1 className="mb-8 text-center text-2xl font-bold text-foreground">
        ¿Tomaste este medicamento?
      </h1>

      {/* Medication card */}
      <div className="mb-10 rounded-xl border-l-4 border-primary bg-[var(--surface-container-low)] p-5">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">
          {medication.name} {medication.dosage}
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {time} hs
        </div>
      </div>

      <div className="mt-auto space-y-3">
        {/* Confirm */}
        <button
          onClick={() => logMedication("taken")}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-secondary py-4 text-base font-bold uppercase tracking-wider text-secondary-foreground transition-all active:scale-[0.98]"
        >
          <CheckCircle className="h-5 w-5" />
          Sí, lo tomé
        </button>

        {/* Skip */}
        <button
          onClick={() => logMedication("skipped")}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] py-4 text-base font-semibold text-muted-foreground transition-all active:scale-[0.98]"
        >
          <XCircle className="h-5 w-5" />
          No lo tomé
        </button>

        {/* Remind */}
        <button
          onClick={() => {
            toast.info("Te recordaremos en 15 minutos")
            router.push("/dashboard/recipient")
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--outline-variant)]/30 py-4 text-sm font-medium text-muted-foreground"
        >
          <Clock className="h-4 w-4" />
          Recordarme en 15 min
        </button>

        {caregiverName && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />
            WellTracker le avisará a {caregiverName}
          </p>
        )}
      </div>
    </div>
  )
}
