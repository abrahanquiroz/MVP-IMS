"use client"

import { CaregiverMedicationsPage } from "@/components/caregiver/medications-page"
import { useDemoStore } from "@/components/demo/demo-store"

export function CaregiverMedicationsDemo() {
  const d = useDemoStore()
  return (
    <CaregiverMedicationsPage
      assignments={d.assignments as unknown as Record<string, unknown>[]}
      medications={d.medications as unknown as Record<string, unknown>[]}
      logs={d.medicationLogs as unknown as Record<string, unknown>[]}
      demoOnRemoveMed={d.removeMedication}
      demoOnAddMed={d.addMedication}
    />
  )
}
