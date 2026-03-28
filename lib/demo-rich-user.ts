/** Cuentas que reciben el dataset demo ampliado (más alertas, citas, vitales). */
const RICH_DEMO_EMAILS = new Set(["abrahan@gmail.com"])

export function isRichDemoUser(email: string | null | undefined): boolean {
  if (!email) return false
  return RICH_DEMO_EMAILS.has(email.trim().toLowerCase())
}
