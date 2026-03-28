"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Pill, Plus, X, CheckCircle2, XCircle, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface MedicationsViewProps {
  medications: Record<string, unknown>[]
  logs: Record<string, unknown>[]
  userId: string
  canManage?: boolean
  patientName?: string
}

export function MedicationsView({
  medications,
  logs,
  userId,
  canManage = false,
  patientName,
}: MedicationsViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [instructions, setInstructions] = useState("")
  const [doctor, setDoctor] = useState("")
  const router = useRouter()

  async function handleAddMedication(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const res = await fetch("/api/medications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            dosage,
            frequency,
            instructions,
            prescribing_doctor: doctor,
            user_id: userId,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error)
        }
        toast.success("Medicamento agregado")
        setName("")
        setDosage("")
        setFrequency("")
        setInstructions("")
        setDoctor("")
        setShowForm(false)
        router.refresh()
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al agregar medicamento"
        )
      }
    })
  }

  async function handleLogMedication(
    medicationId: string,
    status: "taken" | "skipped"
  ) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/medications/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medication_id: medicationId,
            status,
            user_id: userId,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error)
        }
        toast.success(
          status === "taken" ? "Medicamento marcado como tomado" : "Medicamento omitido"
        )
        router.refresh()
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al registrar medicamento"
        )
      }
    })
  }

  const activeMeds = medications.filter(
    (m) => (m as { is_active: boolean }).is_active
  )
  const inactiveMeds = medications.filter(
    (m) => !(m as { is_active: boolean }).is_active
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {patientName ? `Medicamentos de ${patientName}` : "Mis medicamentos"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona recetas y haz seguimiento de la adherencia
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
                <Plus className="mr-2 h-4 w-4" /> Agregar medicamento
              </>
            )}
          </Button>
        )}
      </div>

      {/* Add Medication Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nuevo medicamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMedication} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Nombre del medicamento</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej. Lisinopril"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Dosis</Label>
                  <Input
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="ej. 10mg"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Frecuencia</Label>
                  <Input
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="ej. Una vez al día"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Médico que prescribe</Label>
                  <Input
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="ej. Dr. García"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Instrucciones (opcional)</Label>
                <Input
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="ej. Tomar con comida"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="sm:self-start"
              >
                {isPending ? <Spinner className="mr-2" /> : null}
                Agregar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active Medications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Pill className="h-4.5 w-4.5 text-success" />
            Medicamentos activos ({activeMeds.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeMeds.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Sin medicamentos activos.{" "}
              {canManage && "Agrega uno para comenzar."}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {activeMeds.map((med) => {
                const m = med as {
                  id: string
                  name: string
                  dosage: string
                  frequency: string
                  instructions?: string
                  prescribing_doctor?: string
                }
                return (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border/60 p-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                        <Pill className="h-5 w-5 text-success" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-card-foreground">
                          {m.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {m.dosage} -- {m.frequency}
                        </p>
                        {m.instructions && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {m.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleLogMedication(m.id, "taken")}
                        disabled={isPending}
                        className="bg-success text-success-foreground hover:bg-success/90"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Tomado
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLogMedication(m.id, "skipped")}
                        disabled={isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Omitir
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Logs */}
      {logs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4.5 w-4.5 text-primary" />
              Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {logs.map((log) => {
                const l = log as {
                  id: string
                  status: string
                  taken_at: string
                  medication_id: string
                }
                const med = medications.find(
                  (m) =>
                    (m as { id: string }).id === l.medication_id
                ) as { name: string } | undefined
                return (
                  <div
                    key={l.id}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-3"
                  >
                    {l.status === "taken" ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : l.status === "skipped" ? (
                      <XCircle className="h-4 w-4 text-warning shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-critical shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-card-foreground font-medium">
                        {med?.name ?? "Desconocido"}
                      </span>
                      <Badge
                        variant={
                          l.status === "taken" ? "secondary" : "outline"
                        }
                        className="ml-2 text-xs"
                      >
                        {l.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(l.taken_at), {
                        addSuffix: true, locale: es,
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inactive Medications */}
      {inactiveMeds.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground">
              Medicamentos inactivos ({inactiveMeds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {inactiveMeds.map((med) => {
                const m = med as {
                  id: string
                  name: string
                  dosage: string
                }
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-3 opacity-60"
                  >
                    <Pill className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {m.name} -- {m.dosage}
                    </span>
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
