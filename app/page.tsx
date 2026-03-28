import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Activity,
  Pill,
  CalendarDays,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              CareLink
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" className="min-h-11" asChild>
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
            <Button size="sm" className="min-h-11 shadow-sm" asChild>
              <Link href="/auth/sign-up">Comenzar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="stitch-gradient-hero absolute inset-0 opacity-[0.08]" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-sm font-medium text-[var(--stitch-primary-deep)]">
                <ShieldCheck className="h-4 w-4" />
                Seguimiento de salud
              </div>
              <h1 className="font-heading text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Coordinación clínica que conecta{" "}
                <span className="text-primary">cuidadores</span> y{" "}
                <span className="text-primary">personas cuidadas</span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Monitorea signos vitales, medicamentos y citas en un entorno claro y
                tranquilo, pensado para el día a día del cuidado.
              </p>
              <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  size="lg"
                  className="min-h-12 rounded-xl px-8 shadow-[0_12px_32px_rgba(25,28,30,0.08)]"
                  asChild
                >
                  <Link href="/auth/sign-up">
                    Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-12 rounded-xl border-border/80 bg-card"
                  asChild
                >
                  <Link href="/auth/login">Iniciar sesión</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-[var(--stitch-surface-low)] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center sm:mb-14">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Todo lo que necesitas para un mejor cuidado
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Experiencias distintas para quien coordina y para quien recibe apoyo, con la
                misma claridad visual.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              <FeatureCard
                icon={<Activity className="h-6 w-6" />}
                title="Signos vitales"
                description="Registra y visualiza tendencias con un panel legible y espacios generosos."
              />
              <FeatureCard
                icon={<Pill className="h-6 w-6" />}
                title="Medicamentos"
                description="Horarios y recordatorios para reducir olvidos sin saturar la pantalla."
              />
              <FeatureCard
                icon={<CalendarDays className="h-6 w-6" />}
                title="Citas"
                description="Agenda compartida para visitas y seguimiento del equipo de cuidado."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Alertas"
                description="Avisos claros: lo urgente se distingue de lo informativo."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Equipo de cuidado"
                description="Vincula cuidadores y personas cuidadas de forma ordenada."
              />
              <FeatureCard
                icon={<Heart className="h-6 w-6" />}
                title="Dos vistas"
                description="Panel detallado para profesionales; vista simple para el día a día."
              />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="font-heading text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ¿Listo para coordinar mejor el cuidado?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Crea tu espacio en CareLink y prueba el flujo completo en móvil o escritorio.
            </p>
            <Button
              size="lg"
              className="mt-8 min-h-12 rounded-xl px-8"
              asChild
            >
              <Link href="/auth/sign-up">
                Crear cuenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="safe-bottom border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">CareLink</span>
          </div>
          <p>Hecho con cuidado, para quienes cuidan.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-transparent bg-card p-6 shadow-[0_12px_32px_rgba(25,28,30,0.06)] transition-shadow hover:shadow-[0_16px_40px_rgba(25,28,30,0.08)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-semibold tracking-tight text-card-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
