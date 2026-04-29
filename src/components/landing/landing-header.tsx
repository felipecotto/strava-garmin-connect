import Link from "next/link"

import { siteConfig } from "@/config/site"

const nav = [
  { href: "#projeto", label: "O produto" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#desenvolvedor", label: "Sobre" },
] as const

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center px-6">
        <Link
          href="/"
          className="shrink-0 font-semibold tracking-tight text-[#E8450A]"
        >
          CTT.
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-muted-foreground md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors duration-200 hover:text-[#E8450A]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href={siteConfig.connectStravaPath}
          className="ml-auto shrink-0 rounded-lg bg-[#E8450A] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#C73D09]"
        >
          Conectar Strava
        </Link>
      </div>
    </header>
  )
}
