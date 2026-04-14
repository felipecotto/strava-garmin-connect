import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const nav = [
  { href: "#projeto", label: "Projeto" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#desenvolvedor", label: "Quem faz" },
] as const

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href={siteConfig.connectStravaPath}
          className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
        >
          Conectar Strava
        </Link>
      </div>
    </header>
  )
}
