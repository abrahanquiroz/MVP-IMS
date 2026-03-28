import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-between overflow-hidden bg-light-gradient">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      {/* Branding ~40% */}
      <header className="flex h-[40%] w-full flex-col items-center justify-center space-y-4 pt-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary monogram-glow">
          <span className="text-3xl font-extrabold tracking-tighter text-primary-foreground">W</span>
        </div>
        <div className="text-center">
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-foreground">
            WellTracker
          </h1>
          <p className="mt-1 text-[15px] font-medium text-muted-foreground">
            Cuidá a quienes querés
          </p>
        </div>
      </header>

      {/* Illustration ~25% */}
      <main className="relative flex h-[25%] w-full items-center justify-center px-12">
        <div className="relative flex h-full w-full max-w-[280px] items-end justify-center">
          <div className="absolute bottom-0 right-1/4 h-40 w-16 rounded-t-full bg-[var(--surface-container-high)] opacity-40" />
          <div className="absolute bottom-0 left-1/4 h-28 w-12 rounded-t-full bg-[var(--surface-variant)] opacity-50" />
          <svg
            className="absolute bottom-16 h-24 w-32 text-primary opacity-30"
            fill="none"
            viewBox="0 0 100 60"
            aria-hidden
          >
            <path d="M10 50C10 20 90 20 90 50" stroke="currentColor" strokeDasharray="4 4" strokeWidth="2" />
          </svg>
          <div className="pointer-events-none absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-white to-transparent" />
        </div>
      </main>

      {/* CTAs ~35% */}
      <footer className="flex h-[35%] w-full flex-col items-center justify-start px-8 pb-12 pt-8">
        <div className="w-full max-w-md space-y-4">
          <Button className="h-14 w-full text-base tracking-wide" asChild>
            <Link href="/auth/sign-up">Crear cuenta</Link>
          </Button>
          <Button variant="outline" className="h-14 w-full tracking-wide" asChild>
            <Link href="/auth/login">Ya tengo cuenta — Iniciar sesión</Link>
          </Button>
          <div className="pt-4 text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground underline decoration-[var(--outline-variant)] underline-offset-4 transition-colors hover:text-foreground"
            >
              ¿Sos la persona monitoreada?
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
