"use client"

import { CaregiverOverview } from "@/components/caregiver/overview"
import { useDemoStore } from "@/components/demo/demo-store"

export function CaregiverHomeDemo({ caregiverName }: { caregiverName: string }) {
  const d = useDemoStore()

  return (
    <CaregiverOverview
      caregiverName={caregiverName}
      assignments={d.assignments as unknown as Record<string, unknown>[]}
      recentAlerts={d.recentAlertsUnresolved as unknown as Record<string, unknown>[]}
      recentVitals={d.vitals as unknown as Record<string, unknown>[]}
      medicationRows={d.overviewMedicationRows}
    />
  )
}
