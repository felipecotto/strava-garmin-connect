import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function ProfileChrome({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--line)_60%,transparent)] py-4",
        className
      )}
    >
      <Link
        href="/"
        className="font-mono text-[15px] font-bold tracking-tight text-[var(--ink)]"
      >
        <span className="mr-2 inline-block size-[7px] rounded-[2px] bg-[var(--brand)] align-middle shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_55%,transparent)]" />
        {siteConfig.name}
      </Link>
      {children}
    </header>
  )
}
