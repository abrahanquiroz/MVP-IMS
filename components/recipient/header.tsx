"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/auth/actions"
import {
  LayoutDashboard,
  Activity,
  Pill,
  CalendarDays,
  Bell,
  LogOut,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"

interface HeaderProps {
  user: { id: string; email: string; fullName: string }
}

const navItems = [
  { href: "/dashboard/recipient", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/recipient/vitals", label: "Salud", icon: Activity },
  { href: "/dashboard/recipient/medications", label: "Medicación", icon: Pill },
  { href: "/dashboard/recipient/appointments", label: "Citas", icon: CalendarDays },
  { href: "/dashboard/recipient/alerts", label: "Alertas", icon: Bell },
]

export function RecipientHeader({ user }: HeaderProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[var(--surface-variant)]/30 bg-white px-4 sm:px-6">
        <Link href="/dashboard/recipient" className="flex items-center gap-3">
          <div className="flex h-8 w-8 overflow-hidden rounded-full border border-[var(--outline)]/10 bg-[var(--surface-container-high)]">
            <span className="m-auto text-sm font-bold text-primary">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">WellTracker</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </Button>
          <form action={() => { startTransition(() => { signOut() }) }}>
            <Button type="submit" variant="ghost" size="sm" disabled={isPending} className="text-muted-foreground">
              <LogOut className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </form>
        </div>
      </header>

      {/* Bottom nav — matches Stitch light mode */}
      <nav className="fixed bottom-0 left-0 z-50 flex min-h-18 w-full items-center justify-around border-t border-[var(--outline)]/10 bg-white/80 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:px-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard/recipient"
              ? pathname === "/dashboard/recipient"
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
              <item.icon
                className={cn("mb-0.5 h-5 w-5")}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span className={cn(
                "max-w-[4.5rem] truncate text-[10px] uppercase tracking-wide",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
