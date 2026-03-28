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
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#494552]/20 bg-[#131b2e] px-4 shadow-[0_40px_40px_10px_rgba(0,0,0,0.35)] sm:px-6">
        <Link href="/dashboard/recipient" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a78bfa] monogram-glow">
            <span className="text-sm font-extrabold text-[#3c1989]">C</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#cebdff]">CareLink</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden max-w-[120px] truncate text-xs text-[#cac4d4] sm:inline">
            {user.fullName.split(" ")[0]}
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
              className="h-9 text-[#cac4d4] hover:bg-[#222a3d] hover:text-[#dae2fd]"
            >
              <LogOut className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </form>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 z-50 flex min-h-[4.5rem] w-full items-center justify-around border-t border-[#494552]/15 bg-[#0b1326]/60 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)] sm:px-4">
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
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg px-2 py-1 transition-all active:scale-90",
                isActive
                  ? "bg-[#a78bfa]/15 text-[#cebdff]"
                  : "text-[#cac4d4]/70 hover:text-[#cebdff]"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-[#cebdff]")}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span className="mt-0.5 max-w-[4.5rem] truncate text-[10px] font-medium uppercase tracking-wide">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
