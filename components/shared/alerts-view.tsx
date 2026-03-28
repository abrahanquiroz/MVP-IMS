"use client"

import { useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AlertsViewProps {
  alerts: Record<string, unknown>[]
  title?: string
}

export function AlertsView({
  alerts,
  title = "Mis alertas",
}: AlertsViewProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleResolve(alertId: string) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/alerts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alert_id: alertId, action: "resolve" }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error)
        }
        toast.success("Alerta resuelta")
        router.refresh()
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al resolver la alerta"
        )
      }
    })
  }

  const activeAlerts = alerts.filter(
    (a) => !(a as { is_resolved: boolean }).is_resolved
  )
  const resolvedAlerts = alerts.filter(
    (a) => (a as { is_resolved: boolean }).is_resolved
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">
          Mantente informado sobre eventos de salud y recordatorios
        </p>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4.5 w-4.5 text-critical" />
            Alertas activas ({activeAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 mb-3">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <p className="text-sm font-medium text-card-foreground mb-1">
                Todo despejado
              </p>
              <p className="text-sm text-muted-foreground">
                Sin alertas activas por el momento.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activeAlerts.map((alert) => {
                const a = alert as {
                  id: string
                  alert_type: string
                  severity: string
                  title: string
                  message?: string
                  is_read: boolean
                  created_at: string
                  profiles?: { full_name: string }
                }
                return (
                  <div
                    key={a.id}
                    className={`flex flex-col sm:flex-row gap-3 rounded-xl border p-4 ${
                      a.severity === "critical"
                        ? "border-critical/30 bg-critical/5"
                        : a.severity === "warning"
                          ? "border-warning/30 bg-warning/5"
                          : "border-border/60"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${
                          a.severity === "critical"
                            ? "bg-critical"
                            : a.severity === "warning"
                              ? "bg-warning"
                              : "bg-primary"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-card-foreground">
                            {a.title}
                          </p>
                          <Badge
                            variant={
                              a.severity === "critical"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {a.severity}
                          </Badge>
                          {a.profiles && (
                            <Badge variant="outline" className="text-xs">
                              {a.profiles.full_name}
                            </Badge>
                          )}
                          {!a.is_read && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              nueva
                            </Badge>
                          )}
                        </div>
                        {a.message && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {a.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {formatDistanceToNow(new Date(a.created_at), {
                          addSuffix: true, locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(a.id)}
                      disabled={isPending}
                      className="shrink-0 self-start"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Resolver
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
              <Bell className="h-4.5 w-4.5" />
              Resueltas ({resolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {resolvedAlerts.map((alert) => {
                const a = alert as {
                  id: string
                  title: string
                  severity: string
                  resolved_at?: string
                }
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-3 opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="text-sm text-muted-foreground flex-1 truncate">
                      {a.title}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {a.severity}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
