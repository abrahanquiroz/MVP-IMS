"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Pill, Car, Phone, Heart, Utensils, Clock, Send } from "lucide-react"

interface Props {
  patients: { id: string; name: string }[]
}

const presets = [
  { icon: Pill, label: "Recordar medicina", message: "No olvides tomar tu medicamento.", color: "text-primary", bg: "bg-primary/10" },
  { icon: Car, label: "Voy para allá", message: "Estoy saliendo, ya llego.", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: Phone, label: "Llamame", message: "Cuando puedas llamame, por favor.", color: "text-[var(--tertiary)]", bg: "bg-[var(--tertiary)]/10" },
  { icon: Heart, label: "¿Estás bien?", message: "¿Cómo te sentís? Avisame.", color: "text-destructive", bg: "bg-destructive/10" },
  { icon: Utensils, label: "¿Comiste algo?", message: "Acordate de comer algo hoy.", color: "text-primary", bg: "bg-primary/10" },
  { icon: Clock, label: "Te llamo en un rato", message: "En un rato te llamo, esperame.", color: "text-muted-foreground", bg: "bg-[var(--surface-container-high)]" },
]

export function NotifyView({ patients }: Props) {
  const [custom, setCustom] = useState("")
  const [sending, setSending] = useState(false)

  async function sendNotification(message: string) {
    if (!message.trim()) return
    setSending(true)

    try {
      for (const patient of patients) {
        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: patient.id,
            alert_type: "notification",
            severity: "info",
            title: `Mensaje de tu cuidador`,
            message,
          }),
        })
      }
      toast.success(`Notificación enviada a ${patients.map((p) => p.name).join(", ")}`)
      setCustom("")
    } catch {
      toast.error("Error al enviar")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-1 text-xl font-bold text-foreground">Enviar Notificación</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enviá un mensaje a {patients.map((p) => p.name).join(", ")}
      </p>

      {/* Custom message */}
      <div className="mb-8">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-primary/80">
          Mensaje personalizado
        </label>
        <div className="relative">
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            rows={3}
            maxLength={160}
            placeholder="Escribe lo que quieras decirle..."
            className="w-full resize-none rounded-xl border border-[var(--outline-variant)]/15 bg-[var(--surface-container-low)] p-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          <span className="absolute bottom-3 right-4 text-[10px] text-muted-foreground/50">
            {custom.length}/160
          </span>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <label className="text-xs font-bold uppercase tracking-wider text-primary/80">
            Mensajes rápidos
          </label>
          <div className="h-px flex-1 bg-[var(--outline-variant)]/15" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => sendNotification(p.message)}
              disabled={sending}
              className="flex flex-col items-start gap-3 rounded-xl border border-transparent bg-[var(--surface-container-high)] p-4 text-left transition-all hover:border-[var(--primary-container)]/30 active:scale-[0.97]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${p.bg}`}>
                <p.icon className={`h-5 w-5 ${p.color}`} />
              </div>
              <span className="text-sm font-medium leading-tight text-foreground">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Send custom */}
      <button
        onClick={() => sendNotification(custom)}
        disabled={sending || !custom.trim()}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
      >
        <Send className="h-5 w-5" />
        Enviar Notificación Push
      </button>
    </div>
  )
}
