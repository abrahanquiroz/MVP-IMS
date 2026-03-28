import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 40, className }: LogoIconProps) {
  return (
    <Image
      src="/logo-icon.png"
      alt="WellTracker"
      width={size}
      height={size}
      className={cn("rounded-lg", className)}
      priority
    />
  )
}

interface LogoTextProps {
  className?: string
}

export function LogoText({ className }: LogoTextProps) {
  return (
    <span className={cn("text-lg font-bold tracking-tight", className)}>
      <span className="text-[#00b4a0]">Well</span>
      <span className="text-[#6750a4]">Tracker</span>
    </span>
  )
}

interface LogoFullProps {
  iconSize?: number
  className?: string
}

export function LogoFull({ iconSize = 32, className }: LogoFullProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon size={iconSize} />
      <LogoText />
    </div>
  )
}
