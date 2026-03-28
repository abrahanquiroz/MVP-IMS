/**
 * URL pública de la app (Vercel, local o NEXT_PUBLIC_SITE_URL).
 * Úsala en servidor para redirects; en cliente OAuth usa window.location.origin.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, "")
    return `https://${host}`
  }
  return "http://localhost:3000"
}

/**
 * Origen para redirects OAuth: primero headers de Vercel (previews y prod),
 * luego NEXT_PUBLIC_SITE_URL, para no mandar previews a la URL de producción.
 */
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = forwardedHost ?? request.headers.get("host")
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (process.env.VERCEL ? "https" : "http")
  if (host) {
    return `${proto}://${host.split(",")[0].trim()}`
  }
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  return new URL(request.url).origin
}
