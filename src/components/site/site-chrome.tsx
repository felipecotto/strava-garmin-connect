import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function SiteChrome({
  isOwner = false,
  showConnect = true,
  trailing,
  className,
}: {
  isOwner?: boolean
  showConnect?: boolean
  trailing?: React.ReactNode
  className?: string
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

      <div className="flex items-center gap-3 sm:gap-5">
        {isOwner ? (
          <Link
            href="/perfil"
            className="font-mono text-[13px] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
          >
            Perfil
          </Link>
        ) : showConnect ? (
          <Link
            href={siteConfig.connectStravaPath}
            className="rounded-full border border-[color-mix(in_srgb,var(--ink)_18%,transparent)] bg-[color-mix(in_srgb,white_45%,transparent)] px-3.5 py-1.5 font-mono text-[12px] text-[var(--ink)] shadow-soft backdrop-blur-sm transition-all hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]"
          >
            Conectar →
          </Link>
        ) : null}
        {trailing}
      </div>
    </header>
  )
}
