import Link from "next/link"
import { ExternalLink, MapPin } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const socialLinks = [
  { label: "GitHub", href: siteConfig.author.links.github },
  { label: "LinkedIn", href: siteConfig.author.links.linkedin },
  { label: "Instagram", href: siteConfig.author.links.instagram },
] as const

export function LandingDeveloper() {
  return (
    <section
      id="desenvolvedor"
      className="scroll-mt-20 border-t border-border/80 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Portfólio
          </p>
          <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-medium tracking-tight text-slate-950">
            Quem está desenvolvendo
          </h2>
          <p className="text-lg text-slate-600">
            Product design, design system e front-end em um único fluxo — da
            narrativa da landing às telas do dashboard.
          </p>
        </div>

        <div className="glass-panel luxury-enter mt-12 overflow-hidden rounded-2xl border-slate-200/60 shadow-[0_10px_40px_-30px_rgba(2,6,23,0.28)] transition-all duration-200 hover:border-[#E8450A]/20 hover:bg-slate-50/50">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,280px)_1fr]">
            <div className="flex flex-col gap-6 border-b border-slate-200/80 bg-white/65 p-8 lg:border-r lg:border-b-0">
              <Avatar className="size-20 border border-slate-200 shadow-sm">
                <AvatarFallback className="bg-slate-100 text-2xl font-semibold text-red-600">
                  FO
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-lg leading-tight font-semibold text-slate-900">
                  {siteConfig.author.name}
                </p>
                <p className="text-sm text-slate-500">
                  @{siteConfig.author.handle}
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {siteConfig.author.role}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {siteConfig.author.location}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-8 p-8 sm:p-10">
              <p className="text-pretty text-base leading-relaxed text-slate-600">
                {siteConfig.author.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "gap-2 border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#E8450A]"
                    )}
                  >
                    <ExternalLink className="size-[18px]" aria-hidden />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
