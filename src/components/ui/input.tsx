import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent)] bg-[color-mix(in_srgb,white_55%,var(--bg))] px-3.5 py-2 text-base text-[var(--ink)] shadow-soft transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--label)] focus-visible:border-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--ink)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
