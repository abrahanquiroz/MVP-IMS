"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { createCareRecipientAccount } from "../actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AlertTriangle, Stethoscope } from "lucide-react"

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
const CONDITIONS = ["Diabetes", "Hipertensión", "Asma", "Arritmia"]

export function AddPatientForm() {
  const [isPending, startTransition] = useTransition()
  const [selectedBlood, setSelectedBlood] = useState<string | null>(null)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const router = useRouter()

  function toggleCondition(c: string) {
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedBlood) formData.set("blood_type", selectedBlood)
    formData.set("conditions", selectedConditions.join(","))

    startTransition(async () => {
      const result = await createCareRecipientAccount(formData)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      router.push(
        `/dashboard/caregiver/patients/success?name=${encodeURIComponent(result.recipientName)}`
      )
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step indicator */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Paso 1 de 2
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Perfil Clínico</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Complete la información médica esencial para garantizar un seguimiento preciso y alertas
          personalizadas.
        </p>
      </div>

      {/* Basic info */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
              Nombre completo
            </Label>
            <input
              name="full_name"
              type="text"
              required
              placeholder="Ej. Roberto García"
              className="border-0 border-b border-[var(--outline-variant)]/30 bg-transparent pb-2 text-lg text-foreground placeholder:text-[var(--outline-variant)] outline-none transition-all focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
              Edad
            </Label>
            <input
              name="age"
              type="number"
              placeholder="00"
              className="border-0 border-b border-[var(--outline-variant)]/30 bg-transparent pb-2 text-lg text-foreground placeholder:text-[var(--outline-variant)] outline-none transition-all focus:border-primary"
            />
          </div>
        </div>

        {/* Blood type */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
            Grupo Sanguíneo
          </Label>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {BLOOD_TYPES.map((bt) => (
              <button
                key={bt}
                type="button"
                onClick={() => setSelectedBlood(bt === selectedBlood ? null : bt)}
                className={cn(
                  "rounded py-2 text-sm font-medium transition-all",
                  bt === selectedBlood
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(103,80,164,0.3)]"
                    : "border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] text-muted-foreground hover:border-primary"
                )}
              >
                {bt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Allergies */}
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--outline-variant)]/10 bg-[var(--surface-container-low)] p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--tertiary)]" />
            <Label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Alergias conocidas
            </Label>
          </div>
          <textarea
            name="allergies"
            rows={4}
            placeholder="Describa alergias a medicamentos o alimentos..."
            className="w-full resize-none rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container)] p-3 text-sm text-foreground placeholder:text-[var(--on-surface-variant)]/50 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Conditions */}
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--outline-variant)]/10 bg-[var(--surface-container-low)] p-6">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-5 w-5 text-secondary" />
            <Label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Condiciones médicas
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCondition(c)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  selectedConditions.includes(c)
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)]/30 text-muted-foreground"
                )}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-dashed border-[var(--outline-variant)]/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              + Otra
            </button>
          </div>
        </div>
      </div>

      {/* Account credentials */}
      <section className="space-y-4 rounded-xl border border-[var(--outline-variant)]/10 bg-[var(--surface-container-low)] p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
          Credenciales de acceso
        </h3>
        <p className="text-sm text-muted-foreground">
          Se creará una cuenta para que la persona cuidada pueda iniciar sesión.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pc-email" className="text-xs text-muted-foreground">
              Correo electrónico
            </Label>
            <Input id="pc-email" name="email" type="email" placeholder="paciente@ejemplo.com" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pc-password" className="text-xs text-muted-foreground">
              Contraseña inicial
            </Label>
            <Input id="pc-password" name="password" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 w-full border-t border-[var(--outline-variant)]/10 bg-white/80 p-6 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl">
          <Button type="submit" disabled={isPending} className="flex h-14 w-full items-center justify-center gap-2 text-base">
            {isPending ? <Spinner className="mr-2" /> : null}
            Continuar a vinculación
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Button>
          <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Sus datos están cifrados de extremo a extremo
          </p>
        </div>
      </div>
    </form>
  )
}
