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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CareLink</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Comenzar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" />
              Seguimiento de salud
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Seguimiento de salud que conecta{" "}
              <span className="text-primary">cuidadores</span> y{" "}
              <span className="text-primary">pacientes</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Monitorea signos vitales, controla medicamentos, gestiona citas y
              recibe alertas de salud en tiempo real, todo en una sola plataforma.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/60 bg-secondary/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Todo lo que necesitas para un mejor cuidado
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Dos experiencias adaptadas: una para cuidadores que necesitan datos
                detallados, otra para personas cuidadas que necesitan simplicidad.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Activity className="h-6 w-6" />}
                title="Monitoreo de signos vitales"
                description="Registra frecuencia cardíaca, presión arterial, temperatura, glucosa y más con tendencias visuales."
              />
              <FeatureCard
                icon={<Pill className="h-6 w-6" />}
                title="Gestión de medicamentos"
                description="Nunca pierdas una dosis. Programa medicamentos con recordatorios y haz seguimiento de la adherencia."
              />
              <FeatureCard
                icon={<CalendarDays className="h-6 w-6" />}
                title="Agenda de citas"
                description="Gestiona visitas médicas y sesiones de cuidado con un calendario compartido para todo el equipo."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Alertas inteligentes"
                description="Recibe notificaciones instantáneas por signos vitales anormales, medicamentos omitidos y citas próximas."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Enlace del equipo"
                description="Conecta de forma segura a cuidadores con personas cuidadas mediante asignaciones por invitación."
              />
              <FeatureCard
                icon={<Heart className="h-6 w-6" />}
                title="Paneles duales"
                description="Vista profesional con datos detallados para cuidadores. Interfaz cálida y accesible para personas cuidadas."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
              ¿Listo para mejorar la coordinación del cuidado?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Únete a CareLink hoy y experimenta la diferencia que hace un
              seguimiento de salud conectado.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Crea tu cuenta gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>CareLink</span>
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
    <div className="rounded-xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
