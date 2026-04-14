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
  const initials = siteConfig.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <section
      id="desenvolvedor"
      className="scroll-mt-20 border-t border-border/60 bg-muted/15 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Portfólio
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Quem está desenvolvendo
          </h2>
          <p className="text-lg text-muted-foreground">
            Product design, design system e front-end em um único fluxo — da
            narrativa da landing às telas do dashboard.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-foreground/5">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,280px)_1fr]">
            <div className="flex flex-col gap-6 border-b border-border/60 bg-muted/30 p-8 lg:border-r lg:border-b-0">
              <Avatar className="size-20 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-lg font-semibold leading-tight">
                  {siteConfig.author.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{siteConfig.author.handle}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {siteConfig.author.role}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {siteConfig.author.location}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-8 p-8 sm:p-10">
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
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
                      buttonVariants({ variant: "secondary", size: "sm" }),
                      "gap-1.5"
                    )}
                  >
                    <ExternalLink className="size-4" aria-hidden />
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
