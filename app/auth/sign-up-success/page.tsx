import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Revisa tu correo
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Te hemos enviado un enlace de confirmación a tu correo electrónico. Haz
          clic en el enlace para verificar tu cuenta y comenzar a usar CareLink.
        </p>
        <Button asChild variant="outline">
          <Link href="/auth/login">Volver a iniciar sesión</Link>
        </Button>
      </div>
    </div>
  )
}
