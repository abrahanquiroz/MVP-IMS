import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { RecipientMedicationsDemo } from "@/components/demo/recipient-medications-demo"
import { isWelltrackerDemo } from "@/lib/welltracker-demo"

export default async function RecipientMedicationsPage() {
  if (isWelltrackerDemo()) {
    return <RecipientMedicationsDemo />
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth")

  const [{ data: medications }, { data: logs }] = await Promise.all([
    supabase
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("medication_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("taken_at", { ascending: false })
      .limit(20),
  ])

  const meds = (medications ?? []) as {
    id: string; name: string; dosage: string; frequency: string; schedule_times: string[]
  }[]
  const medLogs = (logs ?? []) as {
    medication_id: string; status: string; taken_at: string
  }[]

  function getStatus(medId: string) {
    const log = medLogs.find((l) => l.medication_id === medId)
    return log?.status ?? "upcoming"
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-8 pt-6 sm:px-6 md:max-w-xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-container-high)]">
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Mis Medicamentos</h1>
      </div>

      {meds.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-muted-foreground">No tenés medicamentos asignados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meds.map((med) => {
            const status = getStatus(med.id)
            const time = Array.isArray(med.schedule_times) && med.schedule_times[0] ? med.schedule_times[0] : ""
            return (
              <Link
                key={med.id}
                href={`/dashboard/recipient/medications/${med.id}/confirm`}
                className="flex items-center justify-between rounded-2xl border border-[var(--outline-variant)]/10 bg-white p-4 shadow-sm transition-all active:scale-[0.98] sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <StatusIcon status={status} />
                  <div>
                    <p className="text-base font-semibold text-foreground sm:text-lg">
                      {med.name} {med.dosage}
                    </p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {med.frequency} · {time ? `${time} hs` : "Sin horario"}
                    </p>
                  </div>
                </div>
                <StatusLabel status={status} />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  if (status === "taken") return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15"><CheckCircle className="h-5 w-5 text-secondary" /></div>
  if (status === "skipped" || status === "missed") return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tertiary)]/15"><AlertCircle className="h-5 w-5 text-[var(--tertiary)]" /></div>
  return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-high)]"><Clock className="h-5 w-5 text-muted-foreground" /></div>
}

function StatusLabel({ status }: { status: string }) {
  if (status === "taken") return <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Tomado</span>
  if (status === "skipped" || status === "missed") return <span className="rounded-full bg-[var(--tertiary)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Pendiente</span>
  return <span className="rounded-full bg-[var(--surface-variant)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Próximo</span>
}
