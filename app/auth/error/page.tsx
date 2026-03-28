import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default async function AuthErrorPage(props: {
  searchParams: Promise<{ reason?: string }>
}) {
  const searchParams = await props.searchParams
  const reason = searchParams.reason

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Error de autenticación
        </h1>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Algo salió mal durante el inicio de sesión con Google o el enlace de
          retorno.
        </p>
        {reason && (
          <p className="text-sm text-left rounded-lg border border-border bg-muted/50 p-3 mb-8 break-words">
            {reason}
          </p>
        )}
        {!reason && (
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Comprueba en Supabase que la URL del sitio y las redirecciones
            incluyan esta app (incluido <code className="text-xs">/auth/callback</code>).
          </p>
        )}
        <Button asChild>
          <Link href="/auth/login">Volver a iniciar sesión</Link>
        </Button>
      </div>
    </div>
  )
}
