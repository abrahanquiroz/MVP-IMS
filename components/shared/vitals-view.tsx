"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Activity, Plus, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

const VITAL_TYPES = [
  { value: "heart_rate", label: "Frecuencia cardíaca", unit: "bpm", hasSecondary: false },
  { value: "blood_pressure", label: "Presión arterial", unit: "mmHg", hasSecondary: true },
  { value: "temperature", label: "Temperatura", unit: "\u00B0F", hasSecondary: false },
  { value: "blood_sugar", label: "Glucosa en sangre", unit: "mg/dL", hasSecondary: false },
  { value: "oxygen_saturation", label: "Saturación de oxígeno", unit: "%", hasSecondary: false },
  { value: "weight", label: "Peso", unit: "lbs", hasSecondary: false },
  { value: "respiratory_rate", label: "Frecuencia respiratoria", unit: "breaths/min", hasSecondary: false },
]

interface VitalsViewProps {
  vitals: Record<string, unknown>[]
  userId: string
  canRecord?: boolean
  patientName?: string
}

export function VitalsView({
  vitals: initialVitals,
  userId,
  canRecord = false,
  patientName,
}: VitalsViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selectedType, setSelectedType] = useState("heart_rate")
  const [value, setValue] = useState("")
  const [secondaryValue, setSecondaryValue] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()

  const selectedConfig = VITAL_TYPES.find((t) => t.value === selectedType)!

  // Prepare chart data for selected vital type
  const chartData = initialVitals
    .filter((v) => (v as { vital_type: string }).vital_type === selectedType)
    .reverse()
    .map((v) => {
      const vital = v as {
        recorded_at: string
        value: number
        secondary_value?: number
      }
      return {
        time: format(new Date(vital.recorded_at), "MMM d, h:mm a"),
        value: vital.value,
        secondary: vital.secondary_value ?? undefined,
      }
    })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const res = await fetch("/api/vitals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vital_type: selectedType,
            value,
            secondary_value: selectedConfig.hasSecondary
              ? secondaryValue
              : null,
            unit: selectedConfig.unit,
            notes,
            user_id: userId,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error)
        }
        toast.success("Signo vital registrado")
        setValue("")
        setSecondaryValue("")
        setNotes("")
        setShowForm(false)
        router.refresh()
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al registrar signo vital"
        )
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {patientName ? `Signos vitales de ${patientName}` : "Mis signos vitales"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Registra y visualiza mediciones de salud
          </p>
        </div>
        {canRecord && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Registrar signo
              </>
            )}
          </Button>
        )}
      </div>

      {/* Record Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Registrar nuevo signo vital</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Tipo de signo</Label>
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VITAL_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>
                    Value ({selectedConfig.unit})
                    {selectedConfig.hasSecondary && " - Sistólica"}
                  </Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`ej. ${selectedType === "heart_rate" ? "72" : "120"}`}
                    required
                    step="any"
                  />
                </div>
              </div>
              {selectedConfig.hasSecondary && (
                <div className="flex flex-col gap-2 sm:max-w-[calc(50%-0.5rem)]">
                  <Label>Diastólica ({selectedConfig.unit})</Label>
                  <Input
                    type="number"
                    value={secondaryValue}
                    onChange={(e) => setSecondaryValue(e.target.value)}
                    placeholder="ej. 80"
                    required
                    step="any"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label>Notas (opcional)</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales..."
                />
              </div>
              <Button type="submit" disabled={isPending} className="sm:self-start">
                {isPending ? <Spinner className="mr-2" /> : null}
                Guardar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {VITAL_TYPES.map((t) => (
          <Button
            key={t.value}
            variant={selectedType === t.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(t.value)}
            className="shrink-0"
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4.5 w-4.5 text-primary" />
              {selectedConfig.label} Tendencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "var(--color-primary)" }}
                    name={selectedConfig.hasSecondary ? "Sistólica" : selectedConfig.label}
                  />
                  {selectedConfig.hasSecondary && (
                    <Line
                      type="monotone"
                      dataKey="secondary"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-chart-2)" }}
                      name="Diastólica"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {selectedConfig.label} Historial
          </CardTitle>
        </CardHeader>
        <CardContent>
          {initialVitals.filter(
            (v) => (v as { vital_type: string }).vital_type === selectedType
          ).length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Aún no hay lecturas de {selectedConfig.label.toLowerCase()} registradas.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {initialVitals
                .filter(
                  (v) =>
                    (v as { vital_type: string }).vital_type === selectedType
                )
                .map((v) => {
                  const vital = v as {
                    id: string
                    value: number
                    secondary_value?: number
                    unit: string
                    notes?: string
                    recorded_at: string
                  }
                  return (
                    <div
                      key={vital.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                    >
                      <div>
                        <span className="font-mono text-lg font-bold text-card-foreground">
                          {vital.value}
                          {vital.secondary_value
                            ? `/${vital.secondary_value}`
                            : ""}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            {vital.unit}
                          </span>
                        </span>
                        {vital.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {vital.notes}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(vital.recorded_at), {
                          addSuffix: true, locale: es,
                        })}
                      </span>
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
