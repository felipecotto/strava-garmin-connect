import Link from "next/link"

import { siteConfig } from "@/config/site"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--line)_55%,transparent)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="font-mono text-[15px] font-bold tracking-tight text-[var(--ink)]"
        >
          <span className="mr-2 inline-block size-[7px] rounded-[2px] bg-[var(--brand)] align-middle shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_55%,transparent)]" />
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "#foreword", label: "FOREWORD" },
            { href: "#recordes", label: "RECORDES" },
            { href: "#dados", label: "DADOS" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[13px] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href={siteConfig.connectStravaPath}
          className="rounded-full border border-[color-mix(in_srgb,var(--ink)_18%,transparent)] bg-[color-mix(in_srgb,white_45%,transparent)] px-4 py-2 font-mono text-[13px] text-[var(--ink)] shadow-soft backdrop-blur-sm transition-all hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]"
        >
          CONECTAR STRAVA →
        </Link>
      </div>
    </header>
  )
}
