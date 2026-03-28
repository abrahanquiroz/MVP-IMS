import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Error de autenticación
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Algo salió mal durante la autenticación. Por favor, inténtalo de nuevo.
        </p>
        <Button asChild>
          <Link href="/auth/login">Volver a iniciar sesión</Link>
        </Button>
      </div>
    </div>
  )
}
