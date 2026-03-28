"use client"

import Link from "next/link"
import { LogoIcon, LogoText } from "@/components/brand/logo"
import { LocaleToggle } from "@/components/landing/locale-toggle"
import { useLandingLocale } from "@/hooks/use-landing-locale"
import { landingDictionary } from "@/lib/i18n/landing-dictionary"
import { ArrowLeft } from "lucide-react"

interface AuthEntryAuraProps {
  fontClassName: string
}

export function AuthEntryAura({ fontClassName }: AuthEntryAuraProps) {
  const { locale, setLocale } = useLandingLocale()
  const t = landingDictionary[locale]

  return (
    <div
      className={`landing-aura ${fontClassName} min-h-screen bg-[#f6f6f8] text-neutral-800 antialiased`}
      style={{ fontFamily: "var(--font-wt-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[40%] w-[50%] rounded-full bg-[#00b4a0]/[0.06] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[45%] w-[55%] rounded-full bg-[#6750a4]/[0.07] blur-[100px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-neutral-200/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3 sm:max-w-xl sm:px-6 md:max-w-2xl">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
            aria-label={t.authEntry.backAria}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-sm font-medium text-neutral-500">{t.authEntry.headerLabel}</span>
          <LocaleToggle
            locale={locale}
            onChange={setLocale}
            labels={{
              es: t.localeToggle.es,
              en: t.localeToggle.en,
              aria: t.localeToggle.label,
            }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-col px-5 pb-16 pt-10 sm:max-w-xl sm:px-8 sm:pb-20 sm:pt-14 md:max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <LogoIcon size={64} className="mb-4 rounded-2xl shadow-lg shadow-neutral-900/10" />
          <LogoText className="text-2xl sm:text-3xl" />
          <p className="mt-4 max-w-sm text-pretty text-[15px] leading-relaxed text-neutral-600 sm:max-w-md sm:text-base">
            {t.authEntry.sub}
          </p>
        </div>

        <div className="mx-auto w-full space-y-3 sm:space-y-4">
          <Link
            href="/auth/sign-up"
            className="flex h-12 min-h-12 w-full items-center justify-center rounded-full bg-neutral-900 text-base font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:bg-neutral-800 active:scale-[0.98] sm:h-14"
          >
            {t.authEntry.create}
          </Link>
          <Link
            href="/auth/login"
            className="flex h-12 min-h-12 w-full items-center justify-center rounded-full border border-neutral-200 bg-white text-base font-semibold text-neutral-900 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] sm:h-14"
          >
            {t.authEntry.login}
          </Link>
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-sm leading-relaxed text-neutral-600 sm:mt-12">
          {t.authEntry.monitoredIntro}
          <Link href="/auth/login" className="font-semibold text-[#006a60] underline-offset-4 hover:underline">
            {t.authEntry.monitoredLink}
          </Link>
          {t.authEntry.monitoredOutro}
        </p>
      </main>
    </div>
  )
}
