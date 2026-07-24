import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/35 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "cta-gradient grain-surface rounded-full text-[var(--bg)] shadow-lift hover:brightness-110",
        outline:
          "rounded-full border-[color-mix(in_srgb,var(--ink)_22%,transparent)] bg-[color-mix(in_srgb,white_40%,transparent)] text-[var(--ink)] shadow-soft backdrop-blur-sm hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]",
        secondary:
          "rounded-full bg-[color-mix(in_srgb,white_50%,var(--bg-alt))] text-[var(--ink)] shadow-soft hover:bg-[var(--bg-alt)]",
        ghost:
          "rounded-full text-[var(--ink-soft)] hover:bg-[color-mix(in_srgb,white_45%,transparent)] hover:text-[var(--ink)]",
        destructive:
          "rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "rounded-none text-[var(--ink-soft)] underline-offset-4 hover:underline border-0",
        brand:
          "cta-gradient-brand grain-surface rounded-full text-white shadow-lift hover:brightness-105",
      },
      size: {
        default: "h-10 gap-2 px-5",
        xs: "h-7 gap-1 px-2.5 text-xs",
        sm: "h-8 gap-1.5 px-3.5 text-[0.8rem]",
        lg: "h-12 gap-2 px-7 text-sm font-semibold",
        icon: "size-9 rounded-full",
        "icon-xs": "size-6 rounded-full",
        "icon-sm": "size-7 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
