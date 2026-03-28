/**
 * Activa datos y UI de demostración (estado en memoria; se reinicia al recargar).
 * En `.env.local`: NEXT_PUBLIC_WELLTRACKER_DEMO=true
 */
export function isWelltrackerDemo(): boolean {
  return process.env.NEXT_PUBLIC_WELLTRACKER_DEMO === "true"
}
