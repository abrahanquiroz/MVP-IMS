"use client"

import Link from "next/link"
import { signOut } from "@/app/auth/actions"
import { Pill, QrCode, Heart, AlertTriangle, LogOut, CheckCircle } from "lucide-react"
import { useTransition, useState } from "react"

interface RecipientHomeProps {
  profile: {
    full_name: string
    age?: number
    blood_type?: string
    allergies?: string
    medical_conditions?: string[]
  } | null
  medications: {
    id: string
    name: string
    dosage: string
    schedule_times: string[]
  }[]
  pendingMedications: {
    id: string
    name: string
    dosage: string
    schedule_times: string[]
  }[]
  allTakenToday: boolean
  caregiverName: string | null
}

export function RecipientHome({ profile, pendingMedications, allTakenToday }: RecipientHomeProps) {
  const [isPending, startTransition] = useTransition()
  const [showLogout, setShowLogout] = useState(false)
  const firstName = profile?.full_name?.split(" ")[0] ?? "Usuario"
  const nextMed = pendingMedications[0]

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-8 pt-6 sm:px-6 md:max-w-xl">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 sm:h-12 sm:w-12">
            <span className="text-lg text-primary sm:text-xl">✦</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground sm:text-sm">Hola,</p>
            <p className="text-xl font-bold text-foreground sm:text-2xl">{firstName}</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogout(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-high)] sm:h-11 sm:w-11"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Next medication or "all taken" */}
      {allTakenToday ? (
        <div className="mb-5 flex flex-col items-center rounded-2xl border border-secondary/20 bg-secondary/5 p-6 text-center shadow-sm">
          <CheckCircle className="mb-3 h-12 w-12 text-secondary" />
          <h2 className="text-lg font-bold text-foreground sm:text-xl">¡Estás al día!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ya tomaste todos tus medicamentos de hoy.
          </p>
        </div>
      ) : nextMed ? (
        <Link
          href={`/dashboard/recipient/medications/${nextMed.id}/confirm`}
          className="mb-5 block rounded-2xl border border-[var(--outline-variant)]/15 bg-[var(--surface-container-low)] p-5 shadow-sm transition-all active:scale-[0.98] sm:p-6"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Próximo medicamento
            </span>
            <span className="text-sm font-semibold text-primary">
              {Array.isArray(nextMed.schedule_times) && nextMed.schedule_times.length > 0
                ? nextMed.schedule_times[0]
                : ""} hs
            </span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
            {nextMed.name} {nextMed.dosage}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">1 Comprimido con agua</p>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground sm:py-3.5">
            <span className="text-base">✓</span>
            Confirmar que lo tomé
          </div>
        </Link>
      ) : null}

      {/* 4 action tiles */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <ActionTile
          href="/dashboard/recipient/medications"
          icon={<Pill className="h-6 w-6 sm:h-7 sm:w-7" />}
          label="Medicamentos"
          color="text-[var(--tertiary)]"
          bg="bg-[var(--tertiary)]/10"
        />
        <ActionTile
          href="/dashboard/recipient/vitals"
          icon={<Heart className="h-6 w-6 sm:h-7 sm:w-7" />}
          label="Mi Salud"
          color="text-primary"
          bg="bg-primary/10"
        />
        <ActionTile
          href="/dashboard/recipient/qr"
          icon={<QrCode className="h-6 w-6 sm:h-7 sm:w-7" />}
          label="Mi QR Médico"
          color="text-muted-foreground"
          bg="bg-[var(--surface-container-high)]"
        />
        <ActionTile
          href="/dashboard/recipient/alerts"
          icon={<AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7" />}
          label="Alertas"
          color="text-destructive"
          bg="bg-destructive/5"
        />
      </div>

      {/* Emergency button */}
      <div className="mt-auto">
        <Link
          href="/dashboard/recipient/emergency"
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-destructive bg-destructive/5 py-4 text-sm font-bold uppercase tracking-wider text-destructive transition-all active:scale-[0.98] active:bg-destructive/10 sm:py-5 sm:text-base"
        >
          <AlertTriangle className="h-5 w-5" />
          Pedir Ayuda — Emergencia
        </Link>
      </div>

      {/* Logout confirmation */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/30 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-foreground">¿Cerrar sesión?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Vas a salir de tu cuenta. Podés volver a entrar cuando quieras.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 rounded-xl border border-[var(--outline-variant)] py-3 text-sm font-semibold text-foreground">
                Cancelar
              </button>
              <button onClick={() => startTransition(() => signOut())} disabled={isPending} className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-white">
                {isPending ? "Saliendo..." : "Sí, salir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionTile({ href, icon, label, color, bg }: {
  href: string; icon: React.ReactNode; label: string; color: string; bg: string
}) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[var(--outline-variant)]/10 bg-white p-5 shadow-sm transition-all active:scale-[0.97] sm:gap-3 sm:p-6">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 ${bg} ${color}`}>{icon}</div>
      <span className="text-center text-xs font-semibold text-foreground sm:text-sm">{label}</span>
    </Link>
  )
}
