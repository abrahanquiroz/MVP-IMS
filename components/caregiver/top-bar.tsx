"use client"

import Link from "next/link"
import { signOut } from "@/app/auth/actions"
import { Bell, LogOut } from "lucide-react"
import { useTransition, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TopBarProps {
  user: { fullName: string }
  alertCount?: number
}

export function CaregiverTopBar({ user, alertCount = 0 }: TopBarProps) {
  const [isPending, startTransition] = useTransition()
  const [showLogout, setShowLogout] = useState(false)
  const today = format(new Date(), "EEEE d 'de' MMMM", { locale: es })
  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-white px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-container)] text-sm font-bold text-[var(--on-primary-container)]">
            {initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold leading-tight text-foreground">
              Hola, {user.fullName.split(" ")[0]}
            </p>
            <p className="text-[12px] capitalize text-muted-foreground">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/dashboard/caregiver/alerts" className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-[var(--surface-container-high)] hover:text-foreground">
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--tertiary)]" />
            )}
          </Link>
          <button
            onClick={() => setShowLogout(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--surface-container-high)] hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Logout confirmation */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/30 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-foreground">¿Cerrar sesión?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Vas a salir de tu cuenta de cuidador. Podés volver a entrar en cualquier momento.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 rounded-xl border border-[var(--outline-variant)] py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-container-low)]"
              >
                Cancelar
              </button>
              <button
                onClick={() => startTransition(() => signOut())}
                disabled={isPending}
                className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
              >
                {isPending ? "Saliendo..." : "Sí, cerrar sesión"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
