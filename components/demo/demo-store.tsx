"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export const DEMO_PATIENT_ID = "wt-demo-patient-1"

const now = () => new Date().toISOString()
const todayStart = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export type DemoCaregiverAlert = {
  id: string
  user_id: string
  severity: string
  title: string
  message?: string
  alert_type: string
  is_resolved: boolean
  is_read: boolean
  created_at: string
  profiles?: { full_name: string }
}

export type DemoRecipientAlert = {
  id: string
  title: string
  message?: string
  severity: string
  alert_type: string
  is_resolved: boolean
  created_at: string
}

export type DemoMedication = {
  id: string
  name: string
  dosage: string
  frequency: string
  schedule_times: string[]
  is_active: boolean
  user_id: string
  profiles?: { full_name?: string }
}

export type DemoMedLog = {
  id: string
  medication_id: string
  user_id: string
  status: "taken" | "skipped" | "missed"
  taken_at: string
}

export type DemoVital = {
  id: string
  user_id: string
  vital_type: string
  value: number
  secondary_value?: number
  unit: string
  recorded_at: string
  profiles?: { full_name?: string }
}

export type DemoAppointment = {
  id: string
  user_id: string
  title: string
  doctor_name?: string
  location?: string
  appointment_date: string
  profiles?: { full_name?: string }
}

function initialAssignments() {
  return [
    {
      care_recipient_id: DEMO_PATIENT_ID,
      caregiver_id: "wt-demo",
      status: "active" as const,
      care_recipient: {
        id: DEMO_PATIENT_ID,
        full_name: "Roberto Gómez",
        age: 72,
      },
    },
  ]
}

function initialCaregiverAlerts(): DemoCaregiverAlert[] {
  return [
    {
      id: "wt-alert-1",
      user_id: DEMO_PATIENT_ID,
      severity: "warning",
      title: "Recordatorio de medicación",
      message: "Aún no se confirmó la toma de la tarde.",
      alert_type: "medication",
      is_resolved: false,
      is_read: false,
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
    {
      id: "wt-alert-2",
      user_id: DEMO_PATIENT_ID,
      severity: "info",
      title: "Cita mañana",
      message: "Cardiología a las 10:00.",
      alert_type: "notification",
      is_resolved: false,
      is_read: true,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
  ]
}

function initialRecipientAlerts(): DemoRecipientAlert[] {
  return [
    {
      id: "wt-ralert-1",
      title: "Tu cuidador te escribió",
      message: "No olvides la caminata suave después del almuerzo.",
      severity: "warning",
      alert_type: "notification",
      is_resolved: false,
      created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    },
  ]
}

function initialMedications(): DemoMedication[] {
  return [
    {
      id: "wt-demo-med-1",
      name: "Metformina",
      dosage: "500mg",
      frequency: "Diaria",
      schedule_times: ["8:00"],
      is_active: true,
      user_id: DEMO_PATIENT_ID,
      profiles: { full_name: "Roberto Gómez" },
    },
    {
      id: "wt-demo-med-2",
      name: "Atenolol",
      dosage: "25mg",
      frequency: "Diaria",
      schedule_times: ["14:00"],
      is_active: true,
      user_id: DEMO_PATIENT_ID,
      profiles: { full_name: "Roberto Gómez" },
    },
    {
      id: "wt-demo-med-3",
      name: "Losartán",
      dosage: "50mg",
      frequency: "Diaria",
      schedule_times: ["20:00"],
      is_active: true,
      user_id: DEMO_PATIENT_ID,
      profiles: { full_name: "Roberto Gómez" },
    },
  ]
}

function initialMedLogs(): DemoMedLog[] {
  const t0 = todayStart()
  return [
    {
      id: "wt-log-1",
      medication_id: "wt-demo-med-1",
      user_id: DEMO_PATIENT_ID,
      status: "taken",
      taken_at: new Date(new Date(t0).getTime() + 60 * 60 * 1000).toISOString(),
    },
  ]
}

function initialVitals(): DemoVital[] {
  const base = Date.now()
  return [
    {
      id: "wt-v1",
      user_id: DEMO_PATIENT_ID,
      vital_type: "heart_rate",
      value: 72,
      unit: "bpm",
      recorded_at: new Date(base - 5 * 60 * 1000).toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
    {
      id: "wt-v2",
      user_id: DEMO_PATIENT_ID,
      vital_type: "steps",
      value: 3240,
      unit: "steps",
      recorded_at: new Date(base - 8 * 60 * 1000).toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
    {
      id: "wt-v3",
      user_id: DEMO_PATIENT_ID,
      vital_type: "blood_pressure",
      value: 128,
      secondary_value: 82,
      unit: "mmHg",
      recorded_at: new Date(base - 60 * 60 * 1000).toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
    {
      id: "wt-v4",
      user_id: DEMO_PATIENT_ID,
      vital_type: "blood_oxygen",
      value: 97,
      unit: "%",
      recorded_at: new Date(base - 20 * 60 * 1000).toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
    {
      id: "wt-v5",
      user_id: DEMO_PATIENT_ID,
      vital_type: "temperature",
      value: 36.6,
      unit: "°C",
      recorded_at: new Date(base - 15 * 60 * 1000).toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
  ]
}

function initialAppointments(): DemoAppointment[] {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  d.setHours(10, 0, 0, 0)
  return [
    {
      id: "wt-appt-1",
      user_id: DEMO_PATIENT_ID,
      title: "Control cardiológico",
      doctor_name: "Dra. Martínez",
      location: "Sanatorio Central",
      appointment_date: d.toISOString(),
      profiles: { full_name: "Roberto Gómez" },
    },
  ]
}

export type DemoStoreSnapshot = {
  assignments: ReturnType<typeof initialAssignments>
  caregiverAlerts: DemoCaregiverAlert[]
  recipientAlerts: DemoRecipientAlert[]
  medications: DemoMedication[]
  medicationLogs: DemoMedLog[]
  vitals: DemoVital[]
  appointments: DemoAppointment[]
}

function cloneInitial(): DemoStoreSnapshot {
  return {
    assignments: initialAssignments(),
    caregiverAlerts: initialCaregiverAlerts(),
    recipientAlerts: initialRecipientAlerts(),
    medications: initialMedications(),
    medicationLogs: initialMedLogs(),
    vitals: initialVitals(),
    appointments: initialAppointments(),
  }
}

type DemoContextValue = DemoStoreSnapshot & {
  resolveCaregiverAlert: (id: string) => void
  addCaregiverAlert: () => void
  dismissRecipientAlert: (id: string) => void
  addRecipientAlert: () => void
  removeMedication: (id: string) => void
  addMedication: () => void
  logMedication: (medicationId: string, status: "taken" | "skipped") => void
  removeTodaysLogForMed: (medicationId: string) => void
  addVitalReading: () => void
  removeAppointment: (id: string) => void
  addAppointment: () => void
  recentAlertsUnresolved: DemoCaregiverAlert[]
  recipientMedsForUser: DemoMedication[]
  recipientPendingMeds: DemoMedication[]
  recipientAllTakenToday: boolean
  overviewMedicationRows: { name: string; time: string; status: "taken" | "pending" | "upcoming" }[]
}

const DemoStoreContext = createContext<DemoContextValue | null>(null)

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<DemoStoreSnapshot>(() => cloneInitial())

  const resolveCaregiverAlert = useCallback((id: string) => {
    setSnap((s) => ({
      ...s,
      caregiverAlerts: s.caregiverAlerts.map((a) =>
        a.id === id ? { ...a, is_resolved: true } : a,
      ),
    }))
  }, [])

  const addCaregiverAlert = useCallback(() => {
    const id = `wt-alert-${Date.now()}`
    setSnap((s) => ({
      ...s,
      caregiverAlerts: [
        {
          id,
          user_id: DEMO_PATIENT_ID,
          severity: "info",
          title: "Nueva alerta (demo)",
          message: "Podés borrarla o dejarla en la lista.",
          alert_type: "notification",
          is_resolved: false,
          is_read: false,
          created_at: now(),
          profiles: { full_name: "Roberto Gómez" },
        },
        ...s.caregiverAlerts,
      ],
    }))
  }, [])

  const dismissRecipientAlert = useCallback((id: string) => {
    setSnap((s) => ({
      ...s,
      recipientAlerts: s.recipientAlerts.filter((a) => a.id !== id),
    }))
  }, [])

  const addRecipientAlert = useCallback(() => {
    const id = `wt-ralert-${Date.now()}`
    setSnap((s) => ({
      ...s,
      recipientAlerts: [
        {
          id,
          title: "Mensaje de demostración",
          message: "Así ves cómo aparecen las alertas en la app.",
          severity: "info",
          alert_type: "notification",
          is_resolved: false,
          created_at: now(),
        },
        ...s.recipientAlerts,
      ],
    }))
  }, [])

  const removeMedication = useCallback((id: string) => {
    setSnap((s) => ({
      ...s,
      medications: s.medications.filter((m) => m.id !== id),
      medicationLogs: s.medicationLogs.filter((l) => l.medication_id !== id),
    }))
  }, [])

  const addMedication = useCallback(() => {
    const id = `wt-demo-med-${Date.now()}`
    setSnap((s) => ({
      ...s,
      medications: [
        ...s.medications,
        {
          id,
          name: "Medicamento demo",
          dosage: "—",
          frequency: "Según indicación",
          schedule_times: ["12:00"],
          is_active: true,
          user_id: DEMO_PATIENT_ID,
          profiles: { full_name: "Roberto Gómez" },
        },
      ],
    }))
  }, [])

  const logMedication = useCallback((medicationId: string, status: "taken" | "skipped") => {
    const t0 = todayStart()
    setSnap((s) => {
      const filtered = s.medicationLogs.filter(
        (l) =>
          !(
            l.medication_id === medicationId &&
            l.user_id === DEMO_PATIENT_ID &&
            new Date(l.taken_at) >= new Date(t0)
          ),
      )
      return {
        ...s,
        medicationLogs: [
          ...filtered,
          {
            id: `wt-log-${Date.now()}`,
            medication_id: medicationId,
            user_id: DEMO_PATIENT_ID,
            status,
            taken_at: now(),
          },
        ],
      }
    })
  }, [])

  const removeTodaysLogForMed = useCallback((medicationId: string) => {
    const t0 = todayStart()
    setSnap((s) => ({
      ...s,
      medicationLogs: s.medicationLogs.filter(
        (l) =>
          !(
            l.medication_id === medicationId &&
            l.user_id === DEMO_PATIENT_ID &&
            new Date(l.taken_at) >= new Date(t0)
          ),
      ),
    }))
  }, [])

  const addVitalReading = useCallback(() => {
    const id = `wt-v-${Date.now()}`
    setSnap((s) => ({
      ...s,
      vitals: [
        {
          id,
          user_id: DEMO_PATIENT_ID,
          vital_type: "heart_rate",
          value: 68 + Math.floor(Math.random() * 15),
          unit: "bpm",
          recorded_at: now(),
          profiles: { full_name: "Roberto Gómez" },
        },
        ...s.vitals,
      ],
    }))
  }, [])

  const removeAppointment = useCallback((id: string) => {
    setSnap((s) => ({
      ...s,
      appointments: s.appointments.filter((a) => a.id !== id),
    }))
  }, [])

  const addAppointment = useCallback(() => {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    d.setHours(9, 30, 0, 0)
    const id = `wt-appt-${Date.now()}`
    setSnap((s) => ({
      ...s,
      appointments: [
        ...s.appointments,
        {
          id,
          user_id: DEMO_PATIENT_ID,
          title: "Cita demo",
          doctor_name: "Dr. Demo",
          location: "Consultorio virtual",
          appointment_date: d.toISOString(),
          profiles: { full_name: "Roberto Gómez" },
        },
      ],
    }))
  }, [])

  const derived = useMemo(() => {
    const t0 = new Date(todayStart()).getTime()
    const meds = snap.medications.filter((m) => m.is_active)
    const todayLogs = snap.medicationLogs.filter(
      (l) => l.user_id === DEMO_PATIENT_ID && new Date(l.taken_at).getTime() >= t0,
    )
    const takenIds = new Set(
      todayLogs.filter((l) => l.status === "taken").map((l) => l.medication_id),
    )
    const pendingMeds = meds.filter((m) => !takenIds.has(m.id))
    const allTaken = meds.length > 0 && pendingMeds.length === 0

    const overviewMedicationRows = meds.map((m) => {
      const time = m.schedule_times[0] ? `${m.schedule_times[0]} hs` : "—"
      const log = todayLogs.find((l) => l.medication_id === m.id)
      let status: "taken" | "pending" | "upcoming" = "upcoming"
      if (log?.status === "taken") status = "taken"
      else if (log?.status === "skipped" || log?.status === "missed") status = "pending"
      else {
        const hour = parseInt(m.schedule_times[0]?.split(":")[0] ?? "12", 10)
        const cur = new Date().getHours()
        if (cur >= hour) status = "pending"
        else status = "upcoming"
      }
      return {
        name: `${m.name} ${m.dosage}`,
        time,
        status,
      }
    })

    const recentAlertsUnresolved = snap.caregiverAlerts.filter((a) => !a.is_resolved)

    return {
      recentAlertsUnresolved,
      recipientMedsForUser: meds,
      recipientPendingMeds: pendingMeds,
      recipientAllTakenToday: allTaken,
      overviewMedicationRows,
    }
  }, [snap])

  const value = useMemo<DemoContextValue>(
    () => ({
      ...snap,
      resolveCaregiverAlert,
      addCaregiverAlert,
      dismissRecipientAlert,
      addRecipientAlert,
      removeMedication,
      addMedication,
      logMedication,
      removeTodaysLogForMed,
      addVitalReading,
      removeAppointment,
      addAppointment,
      ...derived,
    }),
    [
      snap,
      derived,
      resolveCaregiverAlert,
      addCaregiverAlert,
      dismissRecipientAlert,
      addRecipientAlert,
      removeMedication,
      addMedication,
      logMedication,
      removeTodaysLogForMed,
      addVitalReading,
      removeAppointment,
      addAppointment,
    ],
  )

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore(): DemoContextValue {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error("useDemoStore debe usarse dentro de DemoStoreProvider")
  return ctx
}

export function useOptionalDemoStore(): DemoContextValue | null {
  return useContext(DemoStoreContext)
}
