import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const RUNNER_IMAGE = "/images/hero-runner.png"

export function Hero() {
  return (
    <section className="border-b border-black/[0.08] bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-10">
          {/* ── Left copy ── */}
          <div className="space-y-8 lg:col-span-3">
            {/* Badge */}
            <div className="inline-flex w-fit items-center rounded-full border border-[#E8450A]/15 bg-[#FFF0EB] px-3 py-1.5 font-mono text-[11px] font-medium tracking-tighter text-[#C73D09]">
              Conecta com Strava · gratuito
            </div>

            {/* Heading + subtitle */}
            <div className="space-y-5">
              <h1 className="max-w-[22ch] text-[clamp(3rem,5vw,4rem)] font-semibold leading-[1.08] tracking-tight text-slate-950">
                Pare de adivinhar seu treino.
              </h1>
              <p className="max-w-lg text-base text-muted-foreground">
                {siteConfig.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                render={<Link href={siteConfig.connectStravaPath} />}
                className="h-11 w-full justify-center gap-2 rounded-lg bg-[#E8450A] px-5 text-base font-medium text-white shadow-sm shadow-[#E8450A]/20 transition-[background-color,transform] duration-150 hover:bg-[#C73D09] active:scale-95 sm:w-auto"
              >
                <span aria-hidden className="inline-flex size-4 items-center justify-center">
                  <svg viewBox="0 0 16 16" className="size-3.5 fill-current">
                    <path d="M8 1.2 5.1 7h1.95L8 5.25 8.95 7h1.95L8 1.2Zm3.25 6.8L8 14.8 4.75 8h1.9L8 10.95 9.35 8h1.9Z" />
                  </svg>
                </span>
                Conectar com Strava — é gratuito
              </Button>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 w-full justify-center gap-2 rounded-lg border-slate-200 bg-white text-slate-800 transition-colors duration-150 hover:bg-slate-50 sm:w-auto"
                )}
              >
                Ver dashboard
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            {/* Privacy proof */}
            <div className="flex items-center gap-2 pt-1">
              <Lock className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden />
              <p className="text-xs text-muted-foreground">
                Seus dados ficam no Strava. O CTT só lê, nunca escreve.
              </p>
            </div>
          </div>

          {/* ── Right visual ── */}
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-[#111] lg:col-span-2 lg:min-h-[560px]">
            <Image
              src={RUNNER_IMAGE}
              alt="Corredor em movimento em trilha arborizada"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-black/40" aria-hidden />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d1f19] to-transparent"
              aria-hidden
            />

            <div className="absolute top-6 right-6 z-10 w-[min(100%,220px)] rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Atividade recente</p>
              <p className="mt-1 font-medium text-slate-900">Corrida matinal</p>
              <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs tracking-tighter text-slate-700">
                <span>10.4 km</span>
                <span>5:38/km</span>
                <span>58 min</span>
                <span>312 m</span>
              </div>
            </div>

            <div className="absolute bottom-28 left-4 z-10 w-[min(100%,200px)] rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Pace da semana</p>
              <p className="mt-1 font-mono text-sm font-semibold tracking-tighter text-slate-900">
                5:28 /km · média
              </p>
              <p className="mt-2 text-xs font-medium text-[#0F6E56]">↑ 8s mais rápido</p>
            </div>

            <div className="absolute bottom-8 right-4 z-10 w-[min(100%,200px)] rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Meta — Maratona do Rio</p>
              <p className="mt-1 font-mono text-sm font-semibold tracking-tighter text-slate-900">
                39 dias restantes
              </p>
            </div>

            <p className="absolute bottom-4 left-4 right-4 z-10 text-center text-sm text-white/40">
              São Paulo · Parque Ibirapuera
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
