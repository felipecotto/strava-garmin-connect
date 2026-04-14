import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { siteConfig } from "@/config/site"

const footerSocial = [
  { label: "GitHub", href: siteConfig.author.links.github },
  { label: "LinkedIn", href: siteConfig.author.links.linkedin },
  { label: "Instagram", href: siteConfig.author.links.instagram },
] as const

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Case de portfólio — sem backend de produção neste repositório.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <a href="#desenvolvedor" className="hover:text-foreground">
              Sobre mim
            </a>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-6 text-sm">
          <span className="text-muted-foreground">Redes:</span>
          {footerSocial.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
            >
              {item.label}
              <ExternalLink className="size-3.5 opacity-60" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
