import Link from "next/link"
import { Heart } from "lucide-react"
import { SignUpForm } from "./sign-up-form"

export default async function SignUpPage(props: {
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
            Registro para cuidadores
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Crea tu cuenta para coordinar el cuidado. Las personas cuidadas no se registran
            aquí: su cuidador les dará de alta con correo y contraseña desde el panel.
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
              Cuenta de cuidador
            </h2>
            <p className="text-muted-foreground">
              Correo, contraseña o Google
            </p>
          </div>

          {searchParams.error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {searchParams.error}
            </div>
          )}

          <SignUpForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
