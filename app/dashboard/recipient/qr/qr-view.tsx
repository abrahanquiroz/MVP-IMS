"use client"

import Link from "next/link"
import { AlertTriangle, Activity, Phone, QrCode } from "lucide-react"

interface Props {
  profile: {
    fullName: string
    age: number | null
    bloodType: string | null
    allergies: string | null
    conditions: string[]
  }
  caregiverName: string | null
  medications: { name: string; dosage: string; frequency: string }[]
}

export function QRView({ profile, caregiverName, medications }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Red header */}
      <div className="flex items-center justify-center bg-destructive py-3 text-sm font-bold uppercase tracking-widest text-white">
        ✦ Mis datos de emergencia
      </div>

      <div className="flex-1 px-6 pb-8 pt-6">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg text-primary">✦</span>
            <span className="text-lg font-bold tracking-tight text-primary">WellTracker</span>
          </div>
          <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-high)]">
            <span className="text-sm text-muted-foreground">←</span>
          </Link>
        </div>

        {/* Name */}
        <p className="mb-6 text-lg font-semibold text-foreground">
          {profile.fullName}
          {profile.age ? ` · ${profile.age} años` : ""}
          {profile.bloodType ? ` · ${profile.bloodType}` : ""}
        </p>

        {/* QR placeholder */}
        <div className="mx-auto mb-2 flex w-fit flex-col items-center rounded-2xl border border-[var(--outline-variant)]/20 bg-white p-6 shadow-md">
          <div className="flex h-44 w-44 items-center justify-center rounded-xl bg-[var(--surface-container-high)]">
            <QrCode className="h-20 w-20 text-muted-foreground/50" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            ✦ Escaneá para ver todo
          </p>
        </div>

        {/* Allergy card */}
        {profile.allergies && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border-l-4 border-destructive bg-destructive/5 px-4 py-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <span className="text-base font-semibold text-destructive">
              Alérgico: {profile.allergies}
            </span>
          </div>
        )}

        {/* Conditions */}
        {profile.conditions.map((c) => (
          <div key={c} className="mt-3 flex items-center gap-3 rounded-xl border-l-4 border-[var(--tertiary)] bg-[var(--tertiary)]/5 px-4 py-3">
            <Activity className="h-5 w-5 shrink-0 text-[var(--tertiary)]" />
            <span className="text-base font-semibold text-[var(--on-tertiary-container)]">
              {c}
            </span>
          </div>
        ))}

        {/* Caregiver contact */}
        {caregiverName && (
          <div className="mt-6 rounded-xl bg-[var(--surface-container-low)] p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Contacto directo
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15">
                <Phone className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{caregiverName}</p>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Mostrá esta pantalla a quien te ayude
        </p>
      </div>
    </div>
  )
}
