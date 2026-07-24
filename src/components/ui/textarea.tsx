import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent)] bg-[color-mix(in_srgb,white_55%,var(--bg))] px-3.5 py-2.5 text-base text-[var(--ink)] shadow-soft transition-colors outline-none placeholder:text-[var(--label)] focus-visible:border-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
