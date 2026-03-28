"use client"

import { CaregiverVitalsPage } from "@/components/caregiver/vitals-page"
import { useDemoStore } from "@/components/demo/demo-store"

export function CaregiverVitalsDemo() {
  const d = useDemoStore()
  return (
    <CaregiverVitalsPage
      assignments={d.assignments as unknown as Record<string, unknown>[]}
      vitals={d.vitals as unknown as Record<string, unknown>[]}
      demoAddReading={d.addVitalReading}
    />
  )
}
