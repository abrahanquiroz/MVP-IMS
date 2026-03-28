"use client"

import { useState } from "react"
import { VitalsView } from "@/components/shared/vitals-view"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CaregiverVitalsPageProps {
  assignments: Record<string, unknown>[]
  vitals: Record<string, unknown>[]
}

export function CaregiverVitalsPage({
  assignments,
  vitals,
}: CaregiverVitalsPageProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>("all")

  const filteredVitals =
    selectedPatient === "all"
      ? vitals
      : vitals.filter(
          (v) => (v as { user_id: string }).user_id === selectedPatient
        )

  const selectedAssignment = assignments.find(
    (a) =>
      (a as { care_recipient_id: string }).care_recipient_id === selectedPatient
  )
  const patientName =
    selectedAssignment && selectedPatient !== "all"
      ? ((selectedAssignment as { care_recipient?: { full_name?: string } })
          .care_recipient?.full_name ?? "Paciente")
      : undefined

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex flex-col gap-2">
          <Label>Filtrar por paciente</Label>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Todos los pacientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pacientes</SelectItem>
              {assignments.map((a) => {
                const assignment = a as {
                  care_recipient_id: string
                  care_recipient?: { full_name?: string }
                }
                return (
                  <SelectItem
                    key={assignment.care_recipient_id}
                    value={assignment.care_recipient_id}
                  >
                    {assignment.care_recipient?.full_name ?? "Paciente"}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <VitalsView
        vitals={filteredVitals}
        userId={selectedPatient === "all" ? "" : selectedPatient}
        canRecord={selectedPatient !== "all"}
        patientName={patientName}
      />
    </div>
  )
}
