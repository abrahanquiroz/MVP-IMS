import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-[var(--outline-variant)] bg-white px-3 py-2.5 text-sm text-foreground transition-[color,box-shadow] outline-none",
        "placeholder:text-[var(--on-surface-variant)]/50 selection:bg-primary/20",
        "focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30",
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
