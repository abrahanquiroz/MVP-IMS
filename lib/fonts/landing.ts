import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-wt-serif",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-wt-sans",
  display: "swap",
})

export const landingFontVariables = `${playfair.variable} ${jakarta.variable}`
