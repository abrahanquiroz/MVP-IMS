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
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      {/* Top bar */}
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/dashboard/recipient" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
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

      {/* Bottom nav — móvil: 48px mínimo (Stitch) */}
      <nav className="overflow-x-auto bg-[var(--stitch-surface-low)]/80">
        <div className="mx-auto flex max-w-4xl items-center gap-1 px-2 sm:px-6 lg:px-8">
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
                  "flex min-h-12 min-w-[44px] items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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
