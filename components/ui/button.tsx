import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive active:scale-[0.98] duration-200",
  {
    variants: {
      variant: {
        default:
          "cta-gradient text-[#3c1989] shadow-[0_10px_20px_-5px_rgba(167,139,250,0.35)] hover:opacity-95",
        destructive:
          "bg-[#93000a] text-[#ffdad6] hover:bg-[#93000a]/90 focus-visible:ring-destructive/30",
        outline:
          "border border-[#494552]/35 bg-[#131b2e]/50 text-[#dae2fd] shadow-xs hover:bg-[#222a3d]",
        secondary:
          "bg-secondary/15 text-secondary border border-secondary/25 hover:bg-secondary/25",
        ghost:
          "hover:bg-[#222a3d]/80 hover:text-[#dae2fd] text-muted-foreground",
        link: "text-[#cebdff] underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
