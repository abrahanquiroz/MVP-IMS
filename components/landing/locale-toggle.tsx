"use client"

import { cn } from "@/lib/utils"
import type { LandingLocale } from "@/lib/i18n/landing-dictionary"

interface LocaleToggleProps {
  locale: LandingLocale
  onChange: (l: LandingLocale) => void
  labels: { es: string; en: string; aria: string }
  className?: string
}

export function LocaleToggle({ locale, onChange, labels, className }: LocaleToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-neutral-200/90 bg-white/90 p-1 shadow-sm backdrop-blur-sm",
        className,
      )}
      role="group"
      aria-label={labels.aria}
    >
      {(["es", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={cn(
            "min-h-8 min-w-[2.5rem] rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 sm:min-h-9 sm:min-w-[2.75rem] sm:px-3 sm:text-xs",
            locale === code
              ? "bg-neutral-900 text-white shadow-md"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          )}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  )
}
