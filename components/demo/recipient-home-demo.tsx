"use client"

import { RecipientHome } from "@/components/recipient/home"
import { useDemoStore } from "@/components/demo/demo-store"

export function RecipientHomeDemo({
  profile,
  caregiverName,
}: {
  profile: {
    full_name: string
    age?: number
    blood_type?: string
    allergies?: string
    medical_conditions?: string[]
  } | null
  caregiverName: string | null
}) {
  const d = useDemoStore()

  return (
    <RecipientHome
      profile={profile}
      medications={d.recipientMedsForUser}
      pendingMedications={d.recipientPendingMeds}
      allTakenToday={d.recipientAllTakenToday}
      caregiverName={caregiverName}
    />
  )
}
