import Link from "next/link"
import { Heart } from "lucide-react"
import { LoginForm } from "./login-form"

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CareLink</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-balance">
            Un mejor cuidado comienza con una mejor conexión
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Controla signos vitales, gestiona medicamentos y mantente conectado
            con tu equipo de cuidado, todo en un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CareLink</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-muted-foreground">
              Inicia sesión en tu cuenta para continuar
            </p>
          </div>

          {searchParams.error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {searchParams.error}
            </div>
          )}

          <LoginForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"¿No tienes cuenta? "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
