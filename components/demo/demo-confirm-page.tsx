"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ConfirmMedication } from "@/app/dashboard/recipient/medications/[id]/confirm/confirm-form"
import { useDemoStore } from "@/components/demo/demo-store"

export function DemoMedicationConfirmPage({ medicationId }: { medicationId: string }) {
  const { medications, medicationLogs, logMedication } = useDemoStore()
  const router = useRouter()
  const med = medications.find((m) => m.id === medicationId)

  useEffect(() => {
    if (!med) router.replace("/dashboard/recipient")
  }, [med, router])

  if (!med) return null

  const t0 = new Date()
  t0.setHours(0, 0, 0, 0)
  const alreadyTaken = medicationLogs.some(
    (l) =>
      l.medication_id === medicationId &&
      l.status === "taken" &&
      new Date(l.taken_at) >= t0,
  )

  return (
    <ConfirmMedication
      medication={{
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        schedule_times: med.schedule_times,
      }}
      userId="demo"
      caregiverName="María"
      alreadyTaken={alreadyTaken}
      demoLogMedication={(status) => {
        logMedication(medicationId, status)
        if (status === "taken") toast.success("Registrado como tomado (demo)")
        else toast.info("Registrado (demo)")
        router.push("/dashboard/recipient")
      }}
    />
  )
}
