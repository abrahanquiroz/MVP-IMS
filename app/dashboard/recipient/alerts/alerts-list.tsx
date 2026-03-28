"use client"

import { useState, useTransition, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { ChevronLeft, Bell, AlertTriangle, Info, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

type Alert = {
  id: string; title: string; message?: string; severity: string;
  alert_type: string; is_resolved: boolean; created_at: string
}

export function RecipientAlertsList({
  initialAlerts,
  demoDismiss,
  topExtra,
}: {
  initialAlerts: Alert[]
  /** Si se pasa, no llama al API (demo) */
  demoDismiss?: (alertId: string) => void
  topExtra?: ReactNode
}) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setAlerts(initialAlerts)
  }, [initialAlerts])

  function dismiss(alertId: string) {
    if (demoDismiss) {
      demoDismiss(alertId)
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
      toast.success("Listo (demo)")
      return
    }
    startTransition(async () => {
      const res = await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: alertId, is_resolved: true }),
      })
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId))
        toast.success("Alerta marcada como vista")
      } else {
        toast.error("No se pudo actualizar")
      }
    })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-8 pt-6 sm:px-6 md:max-w-xl">
      {topExtra}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-container-high)]">
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Mis Alertas</h1>
      </div>

      {alerts.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No tenés alertas pendientes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
                a.severity === "critical"
                  ? "border-destructive/20 bg-destructive/5"
                  : a.severity === "warning"
                    ? "border-[var(--tertiary)]/20 bg-[var(--tertiary)]/5"
                    : "border-[var(--outline-variant)]/10 bg-white"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {a.severity === "critical" ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : a.severity === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-[var(--tertiary)]" />
                  ) : (
                    <Info className="h-4 w-4 text-primary" />
                  )}
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    a.severity === "critical" ? "text-destructive"
                    : a.severity === "warning" ? "text-[var(--tertiary)]"
                    : "text-primary"
                  }`}>
                    {a.alert_type === "notification" ? "Mensaje" : a.severity === "critical" ? "Urgente" : "Aviso"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: es })}
                </span>
              </div>
              <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
              {a.message && <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>}

              <button
                onClick={() => dismiss(a.id)}
                disabled={isPending}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--outline-variant)]/20 bg-white py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-[var(--surface-container-high)] active:scale-[0.98] disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                Ya lo vi
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
