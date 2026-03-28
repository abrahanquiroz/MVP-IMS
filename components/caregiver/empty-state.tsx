"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Shield, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface EmptyStateProps {
  caregiverName: string
}

export function CaregiverEmptyState({ caregiverName }: EmptyStateProps) {
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-32 pt-24 text-center">
      {/* Welcome */}
      <div className="mb-12 w-full max-w-lg text-left">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Hola, {caregiverName}
        </h2>
        <p className="mt-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {today}
        </p>
      </div>

      {/* Heart illustration */}
      <div className="relative mb-10 flex h-64 w-64 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center">
          <Heart
            className="mb-4 h-[72px] w-[72px] scale-125 text-[var(--primary-container)]"
            strokeWidth={1.5}
            fill="var(--primary-container)"
          />
          <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-[var(--surface-container-high)]">
            <div className="h-full w-1/3 rounded-full bg-[var(--primary-container)] opacity-40" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="max-w-md space-y-4">
        <h3 className="px-4 text-xl font-semibold text-foreground">
          Aún no tienes a nadie a quien cuidar.
        </h3>
        <p className="leading-relaxed text-muted-foreground">
          Para comenzar a monitorear la salud de tus seres queridos, primero debes agregarlos.
        </p>
        <div className="pt-4">
          <Button className="h-14 w-full gap-2 rounded-xl text-lg" asChild>
            <Link href="/dashboard/caregiver/patients/new">
              <UserPlus className="h-5 w-5" />
              Agregar primer familiar
            </Link>
          </Button>
        </div>
      </div>

      {/* Privacy note */}
      <div className="mt-16 w-full max-w-md">
        <div className="flex items-start gap-4 rounded-xl border border-[var(--outline-variant)]/10 bg-[var(--surface-container-low)] p-4 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-container-high)] text-[var(--tertiary)]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Privacidad de datos</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Toda la información médica está encriptada y solo tú tienes acceso.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
