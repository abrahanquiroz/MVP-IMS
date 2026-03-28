import Link from "next/link"
import { SignUpForm } from "./sign-up-form"

export default async function SignUpPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b1326] text-[#dae2fd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#cebdff]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[#44e2cd]/5 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#494552]/20 bg-[#131b2e]/95 px-6 py-4 backdrop-blur-md">
        <div className="w-16" />
        <h1 className="text-xl font-semibold tracking-tight text-[#dae2fd]">Crear cuenta</h1>
        <span className="w-16 text-right text-xs font-medium uppercase tracking-wide text-[#cac4d4]">
          1 de 2
        </span>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#dae2fd]">Comienza tu viaje</h2>
          <p className="text-sm text-[#cac4d4]">
            Registrate para cuidar de tus seres queridos con precisión.
          </p>
        </div>

        {searchParams.error && (
          <div className="mb-6 rounded-lg border border-[#ffb4ab]/30 bg-[#93000a]/20 p-3 text-sm text-[#ffdad6]">
            {searchParams.error}
          </div>
        )}

        <SignUpForm />

        <p className="mt-6 px-2 text-center text-[12px] leading-relaxed text-[#cac4d4]">
          Al registrarte aceptás los{" "}
          <Link href="#" className="text-[#cebdff] underline hover:text-[#a78bfa]">
            Términos
          </Link>{" "}
          y la{" "}
          <Link href="#" className="text-[#cebdff] underline hover:text-[#a78bfa]">
            Política de privacidad
          </Link>
          .
        </p>

        <p className="mt-8 text-center text-sm text-[#cac4d4]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/auth/login" className="font-semibold text-[#cebdff] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
