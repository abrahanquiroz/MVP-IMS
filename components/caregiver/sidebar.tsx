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
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  user: { id: string; email: string; fullName: string }
}

const navItems = [
  { href: "/dashboard/caregiver", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/caregiver/vitals", label: "Signos vitales", icon: Activity },
  { href: "/dashboard/caregiver/medications", label: "Medicamentos", icon: Pill },
  { href: "/dashboard/caregiver/appointments", label: "Citas", icon: CalendarDays },
  { href: "/dashboard/caregiver/alerts", label: "Alertas", icon: Bell },
  { href: "/dashboard/caregiver/patients", label: "Pacientes", icon: Users },
]

export function CaregiverSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden bg-sidebar text-sidebar-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Alternar navegación"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Heart className="h-4.5 w-4.5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">CareLink</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1" role="list">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard/caregiver"
                  ? pathname === "/dashboard/caregiver"
                  : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.fullName}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {user.email}
              </p>
            </div>
          </div>
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
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
    </>
  )
}
