import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { siteConfig } from "@/config/site"

const footerSocial = [{ label: "GitHub", href: siteConfig.author.links.github }] as const

export function LandingFooter() {
  return (
    <footer className="border-t border-border/80 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              Ferramenta para corredores em produção real.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Desenvolvido por Felipe Oliveira — grátis, open source.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-[#E8450A]"
            >
              Dashboard
            </Link>
            <a
              href="#projeto"
              className="transition-colors hover:text-[#E8450A]"
            >
              O produto
            </a>
            <a
              href="#desenvolvedor"
              className="transition-colors hover:text-[#E8450A]"
            >
              Sobre
            </a>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border/80 pt-6 text-sm">
          <span className="text-slate-500">Redes:</span>
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.author.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 opacity-60 transition-[color,opacity] hover:opacity-100 hover:text-[#E8450A]"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5ZM.5 8.5h3.98V24H.5V8.5Zm7.2 0h3.82v2.12h.05c.53-1.01 1.84-2.07 3.79-2.07 4.06 0 4.81 2.68 4.81 6.16V24h-3.98v-7.72c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24H7.7V8.5Z" />
              </svg>
            </a>
            <a
              href={siteConfig.author.links.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 opacity-60 transition-[color,opacity] hover:opacity-100 hover:text-[#E8450A]"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5A3.85 3.85 0 0 0 7.75 20.1h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85h-8.5Zm8.92 1.43a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-2">
          {footerSocial.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-700 opacity-60 underline-offset-4 transition-opacity hover:opacity-100 hover:text-[#E8450A] hover:underline"
            >
              {item.label}
              <ExternalLink className="size-3.5 opacity-60" aria-hidden />
            </a>
          ))}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground/80">
          Seus dados ficam no Strava. O CTT só lê, nunca escreve.
        </p>
      </div>
    </footer>
  )
}
