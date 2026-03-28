"use client"

import Link from "next/link"
import { LogoIcon, LogoText } from "@/components/brand/logo"
import { LocaleToggle } from "@/components/landing/locale-toggle"
import { useLandingLocale } from "@/hooks/use-landing-locale"
import { landingDictionary } from "@/lib/i18n/landing-dictionary"
import {
  Activity,
  ArrowRight,
  Bell,
  HeartPulse,
  Pill,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"

interface WelltrackerLandingProps {
  fontClassName: string
}

export function WelltrackerLanding({ fontClassName }: WelltrackerLandingProps) {
  const { locale, setLocale } = useLandingLocale()
  const t = landingDictionary[locale]

  return (
    <div
      className={`landing-aura ${fontClassName} min-h-screen bg-[#f6f6f8] text-neutral-800 antialiased`}
      style={{ fontFamily: "var(--font-wt-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[20%] top-[-10%] h-[45vh] w-[70vw] rounded-full bg-[#00b4a0]/[0.07] blur-[100px]" />
        <div className="absolute -right-[15%] top-[30%] h-[50vh] w-[60vw] rounded-full bg-[#6750a4]/[0.08] blur-[110px]" />
      </div>

      {/* Nav — Aura-style: airy, pill CTA */}
      <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[52px] max-w-7xl items-center gap-2 px-3 sm:h-14 sm:gap-3 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoIcon size={34} className="rounded-lg shadow-sm shadow-neutral-900/5 sm:h-10 sm:w-10" />
            <LogoText className="hidden text-base sm:block sm:text-lg" />
          </Link>

          <nav
            className="scrollbar-thin flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap py-1 text-[11px] font-semibold text-neutral-600 sm:justify-center sm:gap-6 sm:text-sm sm:font-medium"
            aria-label="Primary"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <a href="#features" className="shrink-0 transition-colors hover:text-neutral-900">
              {t.nav.features}
            </a>
            <a href="#how" className="shrink-0 transition-colors hover:text-neutral-900">
              {t.nav.how}
            </a>
            <a href="#audience" className="shrink-0 transition-colors hover:text-neutral-900">
              {t.nav.audience}
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LocaleToggle
              locale={locale}
              onChange={setLocale}
              labels={{
                es: t.localeToggle.es,
                en: t.localeToggle.en,
                aria: t.localeToggle.label,
              }}
              className="scale-[0.92] sm:scale-100"
            />
            <Link
              href="/auth"
              className="inline-flex h-9 min-h-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 px-3.5 text-xs font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:bg-neutral-800 active:scale-[0.98] sm:h-10 sm:px-5 sm:text-sm"
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#00b4a0]" aria-hidden />
              {t.hero.badge}
            </p>
            <h1
              className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-wt-serif), Georgia, serif" }}
            >
              {t.hero.title}{" "}
              <span className="bg-gradient-to-r from-[#00b4a0] to-[#6750a4] bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/auth"
                className="inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-sm font-semibold text-white shadow-xl shadow-neutral-900/20 transition hover:bg-neutral-800 active:scale-[0.98]"
              >
                {t.hero.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="#how"
                className="inline-flex h-12 min-h-12 items-center justify-center rounded-full border border-neutral-200 bg-white px-8 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>

          {/* Decorative panel — clinic-template vibe: soft card stack */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] max-h-[420px] overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-white via-[#f0faf8] to-[#f3edff] p-6 shadow-2xl shadow-neutral-900/[0.06] sm:aspect-[5/4] sm:max-h-[440px] lg:aspect-auto lg:min-h-[380px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,180,160,0.12),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(103,80,164,0.14),transparent_45%)]" />
              <div className="relative flex h-full flex-col justify-between gap-4">
                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00b4a0]/15 text-[#006a60]">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        WellTracker
                      </p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {locale === "es" ? "Medicación al día" : "Meds on track"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-neutral-100" />
                    <div className="h-2 w-4/5 rounded-full bg-[#00b4a0]/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-md backdrop-blur-sm">
                    <Activity className="mb-2 h-5 w-5 text-[#6750a4]" />
                    <p className="text-2xl font-semibold tracking-tight text-neutral-900">98</p>
                    <p className="text-xs text-neutral-500">{locale === "es" ? "Pulsaciones" : "Bpm"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-md backdrop-blur-sm">
                    <Bell className="mb-2 h-5 w-5 text-[#00b4a0]" />
                    <p className="text-sm font-semibold text-neutral-900">
                      {locale === "es" ? "1 aviso" : "1 alert"}
                    </p>
                    <p className="text-xs text-neutral-500">{locale === "es" ? "Cuidador" : "Caregiver"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-neutral-200/80 bg-white/70">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:gap-6 sm:px-6 sm:py-14">
            {[
              { Icon: Users, title: t.stats.families, sub: t.stats.familiesLabel },
              { Icon: HeartPulse, title: t.stats.realtime, sub: t.stats.realtimeLabel },
              { Icon: Shield, title: t.stats.secure, sub: t.stats.secureLabel },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center sm:items-center">
                <Icon className="mb-3 h-6 w-6 text-[#00b4a0]" strokeWidth={1.5} aria-hidden />
                <p
                  className="text-2xl font-medium text-neutral-900 sm:text-3xl"
                  style={{ fontFamily: "var(--font-wt-serif), Georgia, serif" }}
                >
                  {title}
                </p>
                <p className="mt-1 max-w-[220px] text-sm text-neutral-500">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Purpose */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2
            className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-wt-serif), Georgia, serif" }}
          >
            {t.purpose.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">{t.purpose.body}</p>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
          <h2
            className="mb-10 text-center text-3xl font-medium tracking-tight text-neutral-900 sm:mb-14 sm:text-4xl"
            style={{ fontFamily: "var(--font-wt-serif), Georgia, serif" }}
          >
            {t.features.title}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {t.features.items.map(([title, body], i) => {
              const icons = [Pill, Activity, Bell] as const
              const Icon = icons[i] ?? Pill
              return (
                <article
                  key={title}
                  className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">{body}</p>
                </article>
              )
            })}
          </div>
        </section>

        {/* Audience */}
        <section id="audience" className="bg-white/80 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2
              className="mb-10 text-center text-3xl font-medium tracking-tight text-neutral-900 sm:mb-14 sm:text-4xl"
              style={{ fontFamily: "var(--font-wt-serif), Georgia, serif" }}
            >
              {t.audience.title}
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
              <article className="rounded-3xl border border-neutral-200/60 bg-[#f6f6f8] p-8 sm:p-10">
                <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#00b4a0] to-[#6750a4]" />
                <h3 className="text-xl font-semibold text-neutral-900">{t.audience.caregiverTitle}</h3>
                <p className="mt-3 leading-relaxed text-neutral-600">{t.audience.caregiverBody}</p>
              </article>
              <article className="rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-sm sm:p-10">
                <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#6750a4] to-[#00b4a0]" />
                <h3 className="text-xl font-semibold text-neutral-900">{t.audience.recipientTitle}</h3>
                <p className="mt-3 leading-relaxed text-neutral-600">{t.audience.recipientBody}</p>
              </article>
            </div>
          </div>
        </section>

        {/* How */}
        <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <h2
            className="mb-12 text-center text-3xl font-medium tracking-tight text-neutral-900 sm:mb-16 sm:text-4xl"
            style={{ fontFamily: "var(--font-wt-serif), Georgia, serif" }}
          >
            {t.how.title}
          </h2>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {t.how.steps.map((step, i) => (
              <div key={step.title} className="relative text-center md:text-left">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-xl font-semibold text-neutral-900 shadow-sm md:mx-0">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-neutral-900 px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16">
            <h2
              className="text-balance text-3xl font-medium text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-wt-serif), Georgia, serif" }}
            >
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-neutral-300 sm:text-lg">{t.cta.body}</p>
            <Link
              href="/auth"
              className="mt-8 inline-flex h-12 min-h-12 items-center justify-center rounded-full bg-white px-10 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 active:scale-[0.98]"
            >
              {t.cta.button}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-14">
          <div>
            <div className="flex items-center gap-2">
              <LogoIcon size={32} className="rounded-lg" />
              <LogoText />
            </div>
            <p className="mt-3 text-sm text-neutral-500">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-10 text-sm">
            <div>
              <p className="font-semibold text-neutral-900">{t.footer.product}</p>
              <ul className="mt-3 space-y-2 text-neutral-600">
                <li>
                  <a href="#features" className="hover:text-neutral-900">
                    {t.nav.features}
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-neutral-900">
                    {t.nav.how}
                  </a>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-neutral-900">
                    {t.nav.cta}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{t.footer.legal}</p>
              <ul className="mt-3 space-y-2 text-neutral-600">
                <li>
                  <span className="cursor-not-allowed opacity-60">{t.footer.terms}</span>
                </li>
                <li>
                  <span className="cursor-not-allowed opacity-60">{t.footer.privacy}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-100 py-4 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} WellTracker. {t.footer.rights}
        </div>
      </footer>
    </div>
  )
}
