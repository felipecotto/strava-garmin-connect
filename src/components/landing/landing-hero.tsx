import Link from "next/link"
import { Activity, ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(oklch(0.7_0.15_29)_1px,transparent_1px)] [background-size:20px_20px]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Activity className="size-3.5 text-primary" aria-hidden />
          Design system + Storybook + Next.js
        </div>
        <div className="max-w-3xl space-y-6">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={siteConfig.connectStravaPath}
            className={cn(buttonVariants({ size: "lg" }), "gap-2 px-4 text-base")}
          >
            Conectar com a API do Strava
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href="#projeto"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "text-base"
            )}
          >
            Ver o produto
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          OAuth real do Strava: após autorizar, o dashboard carrega suas corridas
          (tipo Run) e métricas dos últimos 7 dias.
        </p>
      </div>
    </section>
  )
}
