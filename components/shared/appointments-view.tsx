"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { CalendarDays, Plus, X, Clock, MapPin } from "lucide-react"
import { format, isPast } from "date-fns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AppointmentsViewProps {
  appointments: Record<string, unknown>[]
  userId: string
  canManage?: boolean
  patientName?: string
}

export function AppointmentsView({
  appointments,
  userId,
  canManage = false,
  patientName,
}: AppointmentsViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const appointmentDate = new Date(`${date}T${time}`).toISOString()
        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            doctor_name: doctorName,
            location,
            appointment_date: appointmentDate,
            notes,
            user_id: userId,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error)
        }
        toast.success("Cita programada")
        setTitle("")
        setDoctorName("")
        setLocation("")
        setDate("")
        setTime("")
        setNotes("")
        setShowForm(false)
        router.refresh()
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al programar cita"
        )
      }
    })
  }

  const upcoming = appointments.filter(
    (a) =>
      !isPast(new Date((a as { appointment_date: string }).appointment_date)) &&
      (a as { status: string }).status === "scheduled"
  )
  const past = appointments.filter(
    (a) =>
      isPast(new Date((a as { appointment_date: string }).appointment_date)) ||
      (a as { status: string }).status !== "scheduled"
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {patientName
              ? `Citas de ${patientName}`
              : "Mis citas"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Programa y gestiona citas
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Nueva cita
              </>
            )}
          </Button>
        )}
      </div>

      {/* Add Appointment Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Programar cita</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Título</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ej. Revisión anual"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Doctor</Label>
                  <Input
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="ej. Dr. López"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Ubicación (opcional)</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej. Centro Médico"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Notas (opcional)</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales..."
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="sm:self-start"
              >
                {isPending ? <Spinner className="mr-2" /> : null}
                Programar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Upcoming */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4.5 w-4.5 text-primary" />
            Próximas ({upcoming.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Sin citas próximas.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((appt) => {
                const a = appt as {
                  id: string
                  title: string
                  appointment_date: string
                  doctor_name?: string
                  location?: string
                  notes?: string
                  status: string
                  profiles?: { full_name: string }
                }
                return (
                  <div
                    key={a.id}
                    className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border/60 p-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="text-xs font-medium leading-none">
                        {format(new Date(a.appointment_date), "MMM")}
                      </span>
                      <span className="text-lg font-bold leading-tight">
                        {format(new Date(a.appointment_date), "dd")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-card-foreground">
                          {a.title}
                        </p>
                        {a.profiles && (
                          <Badge variant="secondary" className="text-xs">
                            {a.profiles.full_name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {format(new Date(a.appointment_date), "h:mm a")}
                        </span>
                        {a.doctor_name && (
                          <span>Dr. {a.doctor_name}</span>
                        )}
                        {a.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {a.location}
                          </span>
                        )}
                      </div>
                      {a.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {a.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past */}
      {past.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground">
              Citas pasadas ({past.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {past.map((appt) => {
                const a = appt as {
                  id: string
                  title: string
                  appointment_date: string
                  status: string
                }
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-3 opacity-60"
                  >
                    <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground flex-1 truncate">
                      {a.title}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(a.appointment_date), "MMM d, yyyy")}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {a.status}
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
