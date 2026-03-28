"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Activity,
  Pill,
  Send,
  Bell,
} from "lucide-react"

const navItems = [
  { href: "/dashboard/caregiver", label: "Inicio", icon: Home },
  { href: "/dashboard/caregiver/vitals", label: "Salud", icon: Activity },
  { href: "/dashboard/caregiver/medications", label: "Medicación", icon: Pill },
  { href: "/dashboard/caregiver/notify", label: "Notificar", icon: Send },
  { href: "/dashboard/caregiver/alerts", label: "Alertas", icon: Bell },
]

export function CaregiverBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex min-h-18 w-full items-center justify-around border-t border-[var(--outline)]/10 bg-white/80 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard/caregiver"
            ? pathname === "/dashboard/caregiver"
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-xl px-3 py-1.5 transition-all active:scale-90",
              isActive
                ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="mb-0.5 h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
            <span className={cn(
              "max-w-16 truncate text-[10px] uppercase tracking-wide",
              isActive ? "font-bold" : "font-medium"
            )}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
