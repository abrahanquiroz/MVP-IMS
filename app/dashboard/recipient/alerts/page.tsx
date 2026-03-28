import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Bell, AlertTriangle, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default async function RecipientAlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth/login")

  const { data: alerts } = await supabase
    .from("health_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const allAlerts = (alerts ?? []) as {
    id: string; title: string; message?: string; severity: string;
    alert_type: string; is_resolved: boolean; created_at: string
  }[]

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-8 pt-6 sm:px-6 md:max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-container-high)]">
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Mis Alertas</h1>
      </div>

      {allAlerts.length === 0 ? (
        <div className="mt-12 text-center">
          <Bell className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No tenés alertas ni mensajes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allAlerts.map((a) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
