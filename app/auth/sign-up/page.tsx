import Link from "next/link"
import { SignUpForm } from "./sign-up-form"

export default async function SignUpPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-foreground">
      {/* Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[var(--surface-variant)]/30 bg-white/95 px-6 py-4 backdrop-blur-md">
        <Link href="/auth" className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-container-high)] transition-colors" aria-label="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Crear cuenta</h1>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">1 de 2</span>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Comienza tu viaje</h2>
          <p className="text-sm text-muted-foreground">
            Registrate para cuidar de tus seres queridos con precisión.
          </p>
        </div>

        {searchParams.error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-[var(--error-container)] p-3 text-sm text-[var(--on-error-container)]">
            {searchParams.error}
          </div>
        )}

        <SignUpForm />

        <p className="mt-6 px-2 text-center text-[12px] leading-relaxed text-muted-foreground">
          Al registrarte aceptás los{" "}
          <Link href="#" className="text-primary underline hover:text-primary/80">Términos</Link>{" "}
          y la{" "}
          <Link href="#" className="text-primary underline hover:text-primary/80">Política de privacidad</Link>.
        </p>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
