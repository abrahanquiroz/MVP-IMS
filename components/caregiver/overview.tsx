"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  AlertTriangle,
  CalendarDays,
  Activity,
  Clock,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"

interface CaregiverOverviewProps {
  assignments: Record<string, unknown>[]
  recentAlerts: Record<string, unknown>[]
  upcomingAppointments: Record<string, unknown>[]
  recentVitals: Record<string, unknown>[]
}

export function CaregiverOverview({
  assignments,
  recentAlerts,
  upcomingAppointments,
  recentVitals,
}: CaregiverOverviewProps) {
  const criticalAlerts = recentAlerts.filter(
    (a) => (a as { severity?: string }).severity === "critical"
  )
  const warningAlerts = recentAlerts.filter(
    (a) => (a as { severity?: string }).severity === "warning"
  )

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Panel del cuidador
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitorea a tus pacientes y mantente al tanto de las alertas
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Pacientes activos"
          value={assignments.length}
          icon={<Users className="h-5 w-5" />}
          color="primary"
        />
        <StatCard
          label="Alertas críticas"
          value={criticalAlerts.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="critical"
        />
        <StatCard
          label="Advertencias"
          value={warningAlerts.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="warning"
        />
        <StatCard
          label="Próximas visitas"
          value={upcomingAppointments.length}
          icon={<CalendarDays className="h-5 w-5" />}
          color="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4.5 w-4.5 text-critical" />
              Alertas activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Sin alertas activas. Todos los pacientes están bien.
              </p>
            ) : (
              <ul className="flex flex-col gap-3" role="list">
                {recentAlerts.slice(0, 5).map((alert) => {
                  const a = alert as {
                    id: string
                    severity: string
                    title: string
                    created_at: string
                    profiles?: { full_name: string }
                  }
                  return (
                    <li
                      key={a.id}
                      className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
                    >
                      <div
                        className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                          a.severity === "critical"
                            ? "bg-critical"
                            : a.severity === "warning"
                              ? "bg-warning"
                              : "bg-primary"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.profiles?.full_name ?? "Paciente"} --{" "}
                          {formatDistanceToNow(new Date(a.created_at), {
                            addSuffix: true, locale: es,
                          })}
                        </p>
                      </div>
                      <Badge
                        variant={
                          a.severity === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className="shrink-0 text-xs"
                      >
                        {a.severity}
                      </Badge>
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
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4.5 w-4.5 text-primary" />
              Próximas citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No hay citas programadas.
              </p>
            ) : (
              <ul className="flex flex-col gap-3" role="list">
                {upcomingAppointments.map((appt) => {
                  const a = appt as {
                    id: string
                    title: string
                    appointment_date: string
                    doctor_name?: string
                    profiles?: { full_name: string }
                  }
                  return (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-xs font-medium leading-none">
                          {format(new Date(a.appointment_date), "MMM")}
                        </span>
                        <span className="text-sm font-bold leading-tight">
                          {format(new Date(a.appointment_date), "dd")}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.profiles?.full_name ?? "Paciente"}
                          {a.doctor_name ? ` -- Dr. ${a.doctor_name}` : ""}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(a.appointment_date), "h:mm a")}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Vitals */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4.5 w-4.5 text-primary" />
              Lecturas recientes de signos vitales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentVitals.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aún no se han registrado signos vitales.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left">
                      <th className="pb-2 font-medium text-muted-foreground">
                        Paciente
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        Tipo
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        Valor
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVitals.map((v) => {
                      const vital = v as {
                        id: string
                        vital_type: string
                        value: number
                        secondary_value?: number
                        unit: string
                        recorded_at: string
                        profiles?: { full_name: string }
                      }
                      return (
                        <tr
                          key={vital.id}
                          className="border-b border-border/30 last:border-0"
                        >
                          <td className="py-2.5 text-card-foreground">
                            {vital.profiles?.full_name ?? "Paciente"}
                          </td>
                          <td className="py-2.5 capitalize text-card-foreground">
                            {vital.vital_type.replace(/_/g, " ")}
                          </td>
                          <td className="py-2.5 font-mono text-card-foreground">
                            {vital.value}
                            {vital.secondary_value
                              ? `/${vital.secondary_value}`
                              : ""}{" "}
                            {vital.unit}
                          </td>
                          <td className="py-2.5 text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(vital.recorded_at),
                              { addSuffix: true, locale: es }
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: "primary" | "critical" | "warning"
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    critical: "bg-critical/10 text-critical",
    warning: "bg-warning/10 text-warning-foreground",
  }
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${colorMap[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
