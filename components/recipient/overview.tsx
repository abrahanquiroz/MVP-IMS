"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Pill,
  AlertTriangle,
  CalendarDays,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"

interface RecipientOverviewProps {
  profile: Record<string, unknown> | null
  medications: Record<string, unknown>[]
  alerts: Record<string, unknown>[]
  appointments: Record<string, unknown>[]
  vitals: Record<string, unknown>[]
}

export function RecipientOverview({
  profile,
  medications,
  alerts,
  appointments,
  vitals,
}: RecipientOverviewProps) {
  const fullName =
    (profile as { full_name?: string })?.full_name ?? "usuario"
  const firstName = fullName.split(" ")[0]

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {"Aquí tienes tu resumen de salud de hoy."}
        </p>
      </div>

      {/* Quick Actions - large touch targets */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction
          href="/dashboard/recipient/vitals"
          icon={<Activity className="h-6 w-6" />}
          label="Registrar signos"
          color="bg-primary/10 text-primary"
        />
        <QuickAction
          href="/dashboard/recipient/medications"
          icon={<Pill className="h-6 w-6" />}
          label="Medicamentos"
          color="bg-success/10 text-success"
        />
        <QuickAction
          href="/dashboard/recipient/appointments"
          icon={<CalendarDays className="h-6 w-6" />}
          label="Citas"
          color="bg-chart-3/10 text-chart-3"
        />
        <QuickAction
          href="/dashboard/recipient/alerts"
          icon={<AlertTriangle className="h-6 w-6" />}
          label="Alertas"
          count={alerts.length}
          color="bg-critical/10 text-critical"
        />
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="border-critical/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-critical">
              <AlertTriangle className="h-5 w-5" />
              Alertas activas ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2.5" role="list">
              {alerts.map((alert) => {
                const a = alert as {
                  id: string
                  severity: string
                  title: string
                  message?: string
                  created_at: string
                }
                return (
                  <li
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl bg-critical/5 p-4"
                  >
                    <div
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                        a.severity === "critical"
                          ? "bg-critical"
                          : a.severity === "warning"
                            ? "bg-warning"
                            : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">
                        {a.title}
                      </p>
                      {a.message && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {a.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(a.created_at), {
                          addSuffix: true, locale: es,
                        })}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Today's Medications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Pill className="h-4.5 w-4.5 text-success" />
                Mis medicamentos
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/recipient/medications">
                  Ver todo <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">
                Sin medicamentos activos.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5" role="list">
                {medications.slice(0, 4).map((med) => {
                  const m = med as {
                    id: string
                    name: string
                    dosage: string
                    frequency: string
                  }
                  return (
                    <li
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-border/60 p-3.5 min-h-[52px]"
                    >
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-card-foreground">
                          {m.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {m.dosage} -- {m.frequency}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4.5 w-4.5 text-primary" />
                Próximas
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/recipient/appointments">
                  Ver todo <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">
                Sin citas próximas.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5" role="list">
                {appointments.map((appt) => {
                  const a = appt as {
                    id: string
                    title: string
                    appointment_date: string
                    doctor_name?: string
                  }
                  return (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 rounded-xl border border-border/60 p-3.5 min-h-[52px]"
                    >
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-[10px] font-medium leading-none">
                          {format(new Date(a.appointment_date), "MMM")}
                        </span>
                        <span className="text-sm font-bold leading-tight">
                          {format(new Date(a.appointment_date), "dd")}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-card-foreground truncate">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(a.appointment_date), "h:mm a")}
                          {a.doctor_name ? ` -- Dr. ${a.doctor_name}` : ""}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Vitals */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4.5 w-4.5 text-primary" />
              Últimos signos vitales
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/recipient/vitals">
                Ver todo <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {vitals.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                Aún no se han registrado signos vitales.
              </p>
              <Button asChild>
                <Link href="/dashboard/recipient/vitals">
                  Registra tus primeros signos vitales
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vitals.map((v) => {
                const vital = v as {
                  id: string
                  vital_type: string
                  value: number
                  secondary_value?: number
                  unit: string
                  recorded_at: string
                }
                return (
                  <div
                    key={vital.id}
                    className="rounded-xl bg-secondary/50 p-4"
                  >
                    <p className="text-xs text-muted-foreground capitalize mb-1">
                      {vital.vital_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xl font-bold text-card-foreground font-mono">
                      {vital.value}
                      {vital.secondary_value
                        ? `/${vital.secondary_value}`
                        : ""}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {vital.unit}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(vital.recorded_at), {
                        addSuffix: true, locale: es,
                      })}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function QuickAction({
  href,
  icon,
  label,
  color,
  count,
}: {
  href: string
  icon: React.ReactNode
  label: string
  color: string
  count?: number
}) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md min-h-[96px] justify-center"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-card-foreground">{label}</span>
      {count !== undefined && count > 0 && (
        <Badge
          variant="destructive"
          className="absolute top-2 right-2 h-5 min-w-5 text-xs"
        >
          {count}
        </Badge>
      )}
    </Link>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Buenos días"
  if (h < 18) return "Buenas tardes"
  return "Buenas noches"
}
