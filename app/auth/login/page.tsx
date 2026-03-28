import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "./login-form"
import { ArrowLeft } from "lucide-react"

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-[var(--surface-variant)]/30 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Link
            href="/auth"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-[var(--surface-container-high)]"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Iniciar sesión</span>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-8 sm:py-10">
        {/* Brand */}
        <header className="mb-8 flex flex-col items-center sm:mb-10">
          <Image src="/logo-icon.png" alt="WellTracker" width={48} height={48} className="mb-3 rounded-xl shadow-lg shadow-primary/20" priority />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-[#00b4a0]">Well</span><span className="text-[#6750a4]">Tracker</span>
          </h1>
        </header>

        <div className="mb-8 text-center">
          <h2 className="text-[22px] font-semibold leading-tight text-foreground">
            Bienvenido de vuelta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Ingresá para ver a tu familiar</p>
        </div>

        {searchParams.error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-[var(--error-container)] p-3 text-sm text-[var(--on-error-container)]">
            {searchParams.error}
          </div>
        )}

        {/* Form card */}
        <div className="relative overflow-hidden rounded-[14px] border border-[var(--outline-variant)]/15 bg-[var(--surface-container-high)] p-6 shadow-2xl">
          <LoginForm />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-[13px] text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">
              Crear cuenta
            </Link>
          </p>
          <p className="text-[13px] text-muted-foreground">
            ¿Sos la persona monitoreada? Ingresá con el correo y contraseña que te dio tu cuidador.
          </p>
        </div>
      </div>
    </div>
  )
}
