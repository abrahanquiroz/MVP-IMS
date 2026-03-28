import type { Metadata, Viewport } from "next"
import { Lexend, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const fontBody = Lexend({
  subsets: ["latin"],
  variable: "--font-care-body",
  display: "swap",
})

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-care-display",
  display: "swap",
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  title: "CareLink - Seguimiento de salud",
  description:
    "Plataforma integral de seguimiento de salud que conecta cuidadores y personas cuidadas para mejores resultados de salud.",
  generator: "CareLink",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1976d2",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${fontBody.variable} ${fontDisplay.variable} font-sans antialiased app-shell`}
      >
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
