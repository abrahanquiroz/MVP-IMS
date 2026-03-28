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
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-obsidian-gradient text-[#dae2fd]">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#cebdff]/5 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] h-[50%] w-[50%] rounded-full bg-[#44e2cd]/5 blur-[120px]" />
      </div>

      {/* Splash: branding ~40% */}
      <header className="flex w-full flex-col items-center justify-center space-y-4 px-6 pt-14 pb-8 text-center sm:pt-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a78bfa] monogram-glow">
          <span className="text-3xl font-extrabold tracking-tighter text-[#3c1989]">C</span>
        </div>
        <div>
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-[#dae2fd]">
            CareLink
          </h1>
          <p className="mt-1 text-[15px] font-medium text-[#cac4d4]">
            Cuidá a quienes querés
          </p>
        </div>
      </header>

      {/* Illustration zone ~25% — siluetas abstractas */}
      <main className="relative flex min-h-[22vh] w-full items-end justify-center px-12 sm:min-h-[20vh]">
        <div className="relative flex h-full w-full max-w-[280px] items-end justify-center">
          <div className="absolute bottom-0 right-1/4 h-40 w-16 rounded-t-full bg-[#222a3d] opacity-80" />
          <div className="absolute bottom-0 left-1/4 h-28 w-12 rounded-t-full bg-[#2d3449] opacity-60" />
          <svg
            className="absolute bottom-16 h-24 w-32 text-[#cebdff]/40"
            fill="none"
            viewBox="0 0 100 60"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M10 50C10 20 90 20 90 50"
              stroke="currentColor"
              strokeDasharray="4 4"
              strokeWidth="2"
            />
          </svg>
          <div className="pointer-events-none absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-[#0b1326] to-transparent" />
        </div>
      </main>

      {/* CTAs ~35% */}
      <footer className="mt-auto flex w-full flex-col items-center px-8 pb-12 pt-6">
        <div className="w-full max-w-md space-y-4">
          <Button className="h-14 w-full rounded-lg text-base tracking-wide" asChild>
            <Link href="/auth/sign-up">Crear cuenta</Link>
          </Button>
          <Button variant="outline" className="h-14 w-full rounded-lg tracking-wide" asChild>
            <Link href="/auth/login">Ya tengo cuenta — Iniciar sesión</Link>
          </Button>
          <p className="pt-4 text-center text-sm font-medium text-[#cac4d4]">
            <Link
              href="/auth/login"
              className="underline decoration-[#494552]/50 underline-offset-4 transition-colors hover:text-[#dae2fd]"
            >
              ¿Sos la persona cuidada? Ingresá con el correo que te dio tu cuidador
            </Link>
          </p>
        </div>
      </footer>

      {/* Sección informativa (scroll) */}
      <section className="border-t border-[#494552]/20 bg-[#0b1326]/80 py-14 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#a78bfa]/25 bg-[#a78bfa]/10 px-4 py-1.5 text-sm font-medium text-[#cebdff]">
              <ShieldCheck className="h-4 w-4" />
              Seguimiento de salud
            </div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-[#dae2fd] sm:text-3xl">
              Coordinación clínica para cuidadores y personas cuidadas
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[#cac4d4]">
              Signos vitales, medicamentos y citas en un solo lugar, con el mismo estilo
              oscuro y claro que pedís para el día a día.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <FeatureCard
              icon={<Activity className="h-6 w-6" />}
              title="Signos vitales"
              description="Tendencias legibles y alertas cuando importa."
            />
            <FeatureCard
              icon={<Pill className="h-6 w-6" />}
              title="Medicamentos"
              description="Horarios y recordatorios sin saturar la pantalla."
            />
            <FeatureCard
              icon={<CalendarDays className="h-6 w-6" />}
              title="Citas"
              description="Agenda compartida para visitas y seguimiento."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Alertas"
              description="Lo urgente se distingue de lo informativo."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Equipo de cuidado"
              description="Vinculá cuidadores y personas cuidadas con orden."
            />
            <FeatureCard
              icon={<Heart className="h-6 w-6" />}
              title="Dos vistas"
              description="Panel para quien coordina; vista simple para quien recibe apoyo."
            />
          </div>
          <div className="mt-12 text-center">
            <Button className="h-12 rounded-xl px-8" asChild>
              <Link href="/auth/sign-up">
                Comenzar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="safe-bottom border-t border-[#494552]/20 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-[#948e9d] sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#cebdff]" />
            <span className="font-medium text-[#dae2fd]">CareLink</span>
          </div>
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#948e9d]/60">
            Vigilant Obsidian Care Interface
          </p>
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
    <div className="rounded-2xl border border-[#494552]/15 bg-[#222a3d]/80 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#a78bfa]/15 text-[#cebdff]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-[#dae2fd]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#cac4d4]">{description}</p>
    </div>
  )
}
