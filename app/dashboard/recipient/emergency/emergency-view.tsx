"use client"

import Link from "next/link"
import { Phone, CheckCircle, X, Shield } from "lucide-react"

interface Props {
  caregiverName: string
  allergies: string | null
  bloodType: string | null
}

export function EmergencyView({ caregiverName, allergies, bloodType }: Props) {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-6">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg text-destructive">✦</span>
          <span className="text-lg font-bold tracking-tight text-primary">WellTracker</span>
        </div>
        <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-high)]">
          <span className="text-sm text-muted-foreground">←</span>
        </Link>
      </div>

      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-foreground">
        Llamando a {caregiverName}...
      </h1>

      {/* Phone icon */}
      <div className="mb-10 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive shadow-lg shadow-destructive/30">
          <Phone className="h-9 w-9 text-white" />
        </div>
      </div>

      {/* Status checks */}
      <div className="mb-8 space-y-3">
        <StatusRow label="Ubicación enviada" />
        <StatusRow label="Alerta enviada" />
        <StatusRow label="Datos médicos visibles" />
      </div>

      {/* Critical note */}
      {(allergies || bloodType) && (
        <div className="mb-8 flex items-center gap-3 rounded-xl bg-[var(--surface-container-low)] p-4">
          <Shield className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-destructive">
              Nota crítica
            </p>
            <p className="text-sm text-foreground">
              {allergies ? `Alergia a ${allergies}` : ""}
              {allergies && bloodType ? " • " : ""}
              {bloodType ? `Tipo ${bloodType}` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Cancel */}
      <div className="mt-auto">
        <Link
          href="/dashboard/recipient"
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-destructive py-4 text-base font-bold uppercase tracking-wider text-destructive transition-all active:scale-[0.98]"
        >
          <X className="h-5 w-5" />
          Falsa alarma — Cancelar
        </Link>
      </div>
    </div>
  )
}

function StatusRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--surface-container-low)] px-5 py-4">
      <CheckCircle className="h-5 w-5 shrink-0 text-destructive" />
      <span className="text-base font-medium text-foreground">{label}</span>
    </div>
  )
}
