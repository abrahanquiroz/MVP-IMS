import Link from "next/link"
import { LoginForm } from "./login-form"

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0b1326] px-6 py-10 text-[#dae2fd]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#cebdff]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#44e2cd]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <header className="mb-10 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#cebdff] shadow-lg shadow-[#a78bfa]/20">
            <span className="text-2xl font-bold text-[#381385]">C</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#cebdff]">CareLink</h1>
        </header>

        <div className="mb-8 text-center">
          <h2 className="text-[22px] font-semibold leading-tight text-[#dae2fd]">
            Bienvenido de vuelta
          </h2>
          <p className="mt-1 text-sm text-[#cac4d4]">Ingresá para ver a tu familiar</p>
        </div>

        {searchParams.error && (
          <div className="mb-6 rounded-lg border border-[#ffb4ab]/30 bg-[#93000a]/20 p-3 text-sm text-[#ffdad6]">
            {searchParams.error}
          </div>
        )}

        <div className="relative overflow-hidden rounded-[14px] border border-[#494552]/15 bg-[#222a3d] p-6 shadow-2xl">
          <LoginForm />
        </div>

        <p className="mt-8 text-center text-[13px] text-[#cac4d4]">
          ¿No tenés cuenta?{" "}
          <Link href="/auth/sign-up" className="font-semibold text-[#cebdff] hover:underline">
            Crear cuenta
          </Link>
        </p>
        <p className="mt-4 text-center text-[13px] text-[#cac4d4]">
          ¿Sos la persona cuidada? Usá el correo y la contraseña que te dio tu cuidador.
        </p>
      </div>

      <p className="pointer-events-none absolute bottom-8 text-[10px] font-medium uppercase tracking-[0.2em] text-[#948e9d]/40">
        Vigilant Obsidian Care Interface
      </p>
    </div>
  )
}
