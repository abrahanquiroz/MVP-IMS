"use client"

import Link from "next/link"
import { signOut } from "@/app/auth/actions"
import { MessageSquare, Pill, QrCode, Heart, AlertTriangle, LogOut } from "lucide-react"
import { useTransition } from "react"

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
  caregiverName: string | null
}

export function RecipientHome({ profile, medications, caregiverName }: RecipientHomeProps) {
  const [isPending, startTransition] = useTransition()
  const firstName = profile?.full_name?.split(" ")[0] ?? "Usuario"
  const nextMed = medications[0]

  return (
    <div className="flex min-h-screen flex-col px-5 pb-8 pt-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <span className="text-lg text-primary">✦</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hola,</p>
            <p className="text-xl font-bold text-foreground">{firstName}</p>
          </div>
        </div>
        <button
          onClick={() => startTransition(() => signOut())}
          disabled={isPending}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-high)]"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Next medication card */}
      {nextMed && (
        <Link
          href={`/dashboard/recipient/medications/${nextMed.id}/confirm`}
          className="mb-6 block rounded-2xl border border-[var(--outline-variant)]/15 bg-[var(--surface-container-low)] p-5 shadow-sm transition-all active:scale-[0.98]"
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
          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">
            {nextMed.name} {nextMed.dosage}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">1 Comprimido con agua</p>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground">
            <span className="text-lg">✓</span>
            Confirmar que lo tomé
          </div>
        </Link>
      )}

      {/* 4 action tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <ActionTile
          href="/dashboard/recipient/alerts"
          icon={<MessageSquare className="h-7 w-7" />}
          label="Ver Mensajes"
          color="text-primary"
          bg="bg-primary/10"
        />
        <ActionTile
          href="/dashboard/recipient/medications"
          icon={<Pill className="h-7 w-7" />}
          label="Pedir Medicamento"
          color="text-[var(--tertiary)]"
          bg="bg-[var(--tertiary)]/10"
        />
        <ActionTile
          href="/dashboard/recipient/qr"
          icon={<QrCode className="h-7 w-7" />}
          label="Mi QR Médico"
          color="text-muted-foreground"
          bg="bg-[var(--surface-container-high)]"
        />
        <ActionTile
          href="/dashboard/recipient/vitals"
          icon={<Heart className="h-7 w-7" />}
          label="Mi Salud"
          color="text-primary/70"
          bg="bg-primary/5"
        />
      </div>

      {/* Emergency button */}
      <div className="mt-auto">
        <Link
          href="/dashboard/recipient/emergency"
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-destructive bg-destructive/5 py-5 text-base font-bold uppercase tracking-wider text-destructive transition-all active:scale-[0.98] active:bg-destructive/10"
        >
          <AlertTriangle className="h-5 w-5" />
          Pedir Ayuda — Emergencia
        </Link>
      </div>
    </div>
  )
}

function ActionTile({
  href,
  icon,
  label,
  color,
  bg,
}: {
  href: string
  icon: React.ReactNode
  label: string
  color: string
  bg: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--outline-variant)]/10 bg-white p-6 shadow-sm transition-all active:scale-[0.97]"
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${bg} ${color}`}>
        {icon}
      </div>
      <span className="text-center text-sm font-semibold text-foreground">{label}</span>
    </Link>
  )
}
