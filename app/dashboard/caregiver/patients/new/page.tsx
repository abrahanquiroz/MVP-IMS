import { AddPatientForm } from "./add-patient-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function AddPatientPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-[var(--surface-variant)]/30 bg-white px-6">
        <Link
          href="/dashboard/caregiver"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-container-high)] active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Datos del Familiar</h1>
      </header>
      <main className="mx-auto max-w-2xl px-6 pb-32 pt-8">
        <AddPatientForm />
      </main>
    </div>
  )
}
