"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/auth/actions"
import {
  Heart,
  LayoutDashboard,
  Activity,
  Pill,
  CalendarDays,
  Bell,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"

interface HeaderProps {
  user: { id: string; email: string; fullName: string }
}

const navItems = [
  { href: "/dashboard/recipient", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/recipient/vitals", label: "Mis signos vitales", icon: Activity },
  { href: "/dashboard/recipient/medications", label: "Medicamentos", icon: Pill },
  { href: "/dashboard/recipient/appointments", label: "Citas", icon: CalendarDays },
  { href: "/dashboard/recipient/alerts", label: "Alertas", icon: Bell },
]

export function RecipientHeader({ user }: HeaderProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border/60">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link href="/dashboard/recipient" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-card-foreground">
            CareLink
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            Hola, {user.fullName.split(" ")[0]}
          </span>
          <form
            action={() => {
              startTransition(() => {
                signOut()
              })
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={isPending}
              className="text-muted-foreground"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom nav - large touch targets for accessibility */}
      <nav className="overflow-x-auto border-t border-border/40">
        <div className="flex items-center gap-1 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px]",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
