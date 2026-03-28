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
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-white/50 bg-white/80 px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl shadow-[0_-8px_32px_rgba(103,80,164,0.08)] sm:h-18 sm:px-4 sm:pt-2">
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
              "flex min-h-[40px] min-w-[40px] flex-col items-center justify-center rounded-xl px-2 py-1 transition-all active:scale-90 sm:min-h-[44px] sm:min-w-[44px] sm:px-3 sm:py-1.5",
              isActive
                ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="mb-0.5 h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={isActive ? 2.25 : 1.75} />
            <span className={cn(
              "max-w-16 truncate text-[9px] uppercase tracking-wide sm:text-[10px]",
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
