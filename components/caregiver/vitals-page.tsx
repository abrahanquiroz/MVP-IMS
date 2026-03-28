"use client"

import { useState } from "react"
import { Heart, Thermometer, Droplets, Wind, Activity } from "lucide-react"

interface CaregiverVitalsPageProps {
  assignments: Record<string, unknown>[]
  vitals: Record<string, unknown>[]
  demoAddReading?: () => void
}

type Vital = {
  id: string
  vital_type: string
  value: number
  secondary_value?: number
  unit: string
  recorded_at: string
  profiles?: { full_name?: string }
}

const CATEGORIES = [
  { key: "heart_rate", label: "Pulso", icon: Heart, color: "text-secondary" },
  { key: "blood_pressure", label: "Presión", icon: Activity, color: "text-primary" },
  { key: "temperature", label: "Temp.", icon: Thermometer, color: "text-[var(--tertiary)]" },
  { key: "blood_oxygen", label: "O₂", icon: Wind, color: "text-secondary" },
  { key: "steps", label: "Pasos", icon: Activity, color: "text-primary" },
]

export function CaregiverVitalsPage({ vitals, demoAddReading }: CaregiverVitalsPageProps) {
  const [selected, setSelected] = useState("heart_rate")
  const allVitals = vitals as unknown as Vital[]

  const filtered = allVitals.filter((v) => v.vital_type === selected)
  const latest = filtered[0]

  const values = filtered.map((v) => v.value)
  const min = values.length > 0 ? Math.min(...values) : 0
  const max = values.length > 0 ? Math.max(...values) : 0
  const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0

  const categoryMeta = CATEGORIES.find((c) => c.key === selected)

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-1 text-xl font-bold text-foreground">Salud del paciente</h1>
      <p className="mb-4 text-sm text-muted-foreground">Signos vitales registrados</p>

      {/* Period pills */}
      <div className="mb-6 flex gap-2">
        <span className="rounded-full bg-primary px-5 py-1.5 text-sm font-medium text-primary-foreground">Hoy</span>
        <span className="rounded-full bg-[var(--surface-container-high)] px-5 py-1.5 text-sm font-medium text-muted-foreground">7d</span>
        <span className="rounded-full bg-[var(--surface-container-high)] px-5 py-1.5 text-sm font-medium text-muted-foreground">30d</span>
      </div>

      {/* Category grid - no scroll */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelected(cat.key)}
            className={`flex flex-col items-center gap-1 rounded-xl py-3 text-center transition-all ${
              selected === cat.key
                ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                : "bg-[var(--surface-container-high)] text-muted-foreground"
            }`}
          >
            <cat.icon className="h-4 w-4" />
            <span className="text-[10px] font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main vital card */}
      {latest ? (
        <div className="mb-4 rounded-2xl bg-[var(--surface-container-high)] p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {categoryMeta?.label}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${categoryMeta?.color ?? "text-foreground"}`}>
                  {latest.value}
                  {latest.secondary_value ? `/${latest.secondary_value}` : ""}
                </span>
                <span className="text-sm text-muted-foreground">{latest.unit}</span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,106,96,0.6)]" />
              Normal
            </span>
          </div>

          {/* Min/Max/Avg */}
          <div className="grid grid-cols-3 border-t border-[var(--outline-variant)]/15 pt-4 text-center">
            <div>
              <p className="text-[13px] text-muted-foreground">Mín</p>
              <p className="text-lg font-semibold text-foreground">{min}</p>
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">Máx</p>
              <p className="text-lg font-semibold text-foreground">{max}</p>
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">Prom</p>
              <p className="text-lg font-semibold text-foreground">{avg}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex flex-col items-center rounded-2xl bg-[var(--surface-container-high)] py-12 text-center">
          <p className="text-sm text-muted-foreground">Sin datos para esta categoría</p>
        </div>
      )}

      {/* History list */}
      {filtered.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Historial
          </h3>
          {filtered.slice(0, 8).map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-container-low)] px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                {v.value}{v.secondary_value ? `/${v.secondary_value}` : ""} {v.unit}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(v.recorded_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}

      {demoAddReading && (
        <button
          type="button"
          onClick={demoAddReading}
          className="mt-6 w-full rounded-full border border-neutral-200 bg-white/90 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-white"
        >
          + Registrar lectura demo (pulso)
        </button>
      )}
    </div>
  )
}
