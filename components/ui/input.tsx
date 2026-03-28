import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-[#494552]/20 bg-[#131b2e] px-3 py-2.5 pl-3 text-sm text-foreground shadow-inner transition-[color,box-shadow] outline-none",
        "placeholder:text-[#948e9d]/70 selection:bg-primary/40 selection:text-foreground",
        "focus-visible:border-[#a78bfa] focus-visible:ring-1 focus-visible:ring-[#a78bfa]/40",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
