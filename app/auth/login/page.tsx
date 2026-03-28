import Link from "next/link"
import { LoginForm } from "./login-form"

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 py-10">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <header className="mb-10 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold text-white">W</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">WellTracker</h1>
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
