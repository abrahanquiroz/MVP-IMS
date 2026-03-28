/** Mensajes claros para errores de OAuth / proveedores en Supabase. */
export function mapOAuthProviderError(raw: string): string {
  const m = raw.toLowerCase()
  if (
    m.includes("provider is not enabled") ||
    m.includes("unsupported provider") ||
    m.includes("validation_failed")
  ) {
    return "Google no está activado en tu proyecto Supabase. Ve a Authentication → Providers → Google, actívalo y configura Client ID y Secret."
  }
  return raw
}
