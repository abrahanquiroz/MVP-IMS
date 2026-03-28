import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function AuraCard({
  className,
  children,
  padding = "p-5",
}: {
  className?: string
  children: ReactNode
  padding?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-[#f0faf8]/90 to-[#f3edff]/70 shadow-lg shadow-neutral-900/[0.05]",
        padding,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(0,180,160,0.1),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(103,80,164,0.12),transparent_48%)]" />
      <div className="relative">{children}</div>
    </div>
  )
}
