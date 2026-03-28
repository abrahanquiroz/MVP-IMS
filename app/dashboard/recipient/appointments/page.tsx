import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CalendarDays, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function RecipientAppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/auth/login")

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
    .order("appointment_date", { ascending: true })
    .limit(10)

  const all = (appointments ?? []) as {
    id: string; title: string; doctor_name?: string; location?: string;
    appointment_date: string; status: string
  }[]

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-8 pt-6 sm:px-6 md:max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/recipient" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-container-high)]">
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Mis Citas</h1>
      </div>

      {all.length === 0 ? (
        <div className="mt-12 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No tenés citas programadas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {all.map((appt) => {
            const d = new Date(appt.appointment_date)
            return (
              <div key={appt.id} className="flex gap-4 rounded-2xl border border-[var(--outline-variant)]/10 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-[11px] font-medium uppercase">{format(d, "MMM", { locale: es })}</span>
                  <span className="text-lg font-bold leading-none">{format(d, "dd")}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{appt.title}</h3>
                  {appt.doctor_name && <p className="text-sm text-muted-foreground">Dr. {appt.doctor_name}</p>}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(d, "HH:mm")} hs</span>
                    {appt.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {appt.location}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
