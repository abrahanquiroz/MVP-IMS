import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export default async function SuccessPage(props: {
  searchParams: Promise<{ name?: string }>
}) {
  const searchParams = await props.searchParams
  const name = searchParams.name ?? "el paciente"

  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground selection:bg-primary/20">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <main className="relative flex flex-grow flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-md flex-col items-center space-y-8 text-center">
          {/* Success icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-secondary/10 blur-[40px]" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-secondary/10 bg-[var(--surface-container-high)]" style={{ filter: "drop-shadow(0 0 20px rgba(0,106,96,0.15))" }}>
              <CheckCircle className="h-16 w-16 text-secondary" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 flex items-center gap-2 rounded-full border border-[var(--outline-variant)]/30 bg-white px-3 py-1 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                En tiempo real
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              ¡Vinculación Exitosa!
            </h1>
            <p className="mx-auto max-w-[320px] text-base leading-relaxed text-muted-foreground md:text-lg">
              Ahora puedes comenzar a monitorear la salud de{" "}
              <span className="font-bold text-primary">{name}</span> en tiempo real.
            </p>
          </div>
        </div>
      </main>

      {/* Actions */}
      <footer className="relative mx-auto w-full max-w-md p-6 md:pb-12">
        <Button className="group h-14 w-full text-lg" asChild>
          <Link href="/dashboard/caregiver">
            Ir al Dashboard
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <button className="mt-4 flex w-full items-center justify-center py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          Configurar notificaciones de urgencia
        </button>
      </footer>
    </div>
  )
}
