"use client"

import { useCallback, useEffect, useState } from "react"
import {
  LANDING_LOCALE_STORAGE,
  type LandingLocale,
} from "@/lib/i18n/landing-dictionary"

export function useLandingLocale() {
  const [locale, setLocaleState] = useState<LandingLocale>("es")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LANDING_LOCALE_STORAGE)
      if (raw === "en" || raw === "es") setLocaleState(raw)
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    document.documentElement.lang = locale === "en" ? "en" : "es"
    try {
      localStorage.setItem(LANDING_LOCALE_STORAGE, locale)
    } catch {
      /* ignore */
    }
  }, [locale, ready])

  const setLocale = useCallback((l: LandingLocale) => {
    setLocaleState(l)
  }, [])

  return { locale, setLocale }
}
