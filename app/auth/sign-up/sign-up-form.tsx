"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setOAuthRoleIntent, signUp } from "../actions"
import { useTransition, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Stethoscope } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { mapOAuthProviderError } from "@/lib/auth-oauth-errors"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => { signUp(formData) })
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true)
    setGoogleError("")
    try {
      await setOAuthRoleIntent("caregiver")
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, queryParams: { prompt: "select_account" } },
      })
      if (error) { setGoogleError(mapOAuthProviderError(error.message)); setGoogleLoading(false) }
    } catch (e) {
      setGoogleError(e instanceof Error ? mapOAuthProviderError(e.message) : "No se pudo abrir el registro con Google.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
        <Stethoscope className="h-9 w-9 shrink-0 text-primary" />
        <div className="text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Registro solo para cuidadores</p>
          <p className="mt-1">
            Las cuentas de <strong className="text-foreground">persona cuidada</strong> las crea tu
            cuidador desde el panel (pacientes), con correo y contraseña.
          </p>
        </div>
      </div>

      {/* Form fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="first_name" className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground ml-1">Nombre</Label>
            <Input id="first_name" name="first_name" placeholder="Tu nombre" required autoComplete="given-name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="last_name" className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground ml-1">Apellido</Label>
            <Input id="last_name" name="last_name" placeholder="Apellido" autoComplete="family-name" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground ml-1">Email</Label>
          <Input id="email" name="email" type="email" placeholder="ejemplo@correo.com" required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground ml-1">Contraseña</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="new-password" minLength={6} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password_confirm" className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground ml-1">Confirmar contraseña</Label>
          <Input id="password_confirm" name="password_confirm" type="password" placeholder="••••••••" required autoComplete="new-password" minLength={6} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="h-px flex-grow bg-[var(--outline-variant)]/30" />
          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-muted-foreground">o registrarse con</span>
          <div className="h-px flex-grow bg-[var(--outline-variant)]/30" />
        </div>

        {/* SSO */}
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" className="h-11 gap-3 bg-white text-sm font-semibold text-foreground hover:bg-gray-50" onClick={handleGoogleSignUp} disabled={googleLoading}>
            {googleLoading ? <Spinner className="h-5 w-5" /> : <GoogleIcon className="h-5 w-5" />}
            Google
          </Button>
          <Button type="button" variant="outline" className="h-11 gap-3 bg-white text-sm font-semibold text-foreground hover:bg-gray-50">
            <AppleIcon className="h-5 w-5" />
            Apple
          </Button>
        </div>

        {googleError && (
          <p className="rounded-lg bg-[var(--error-container)] p-2.5 text-center text-sm text-[var(--on-error-container)]">
            {googleError}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? <Spinner className="mr-2" /> : null}
          Continuar
        </Button>
      </form>
    </div>
  )
}
