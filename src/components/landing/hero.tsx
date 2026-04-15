import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/** Foto do hero: corredor em trilha / parque (asset local). */
const RUNNER_IMAGE = "/images/hero-runner.png"

const avatarStack = ["bg-[#E8450A]", "bg-[#C73D09]", "bg-neutral-400", "bg-neutral-500"]

export function Hero() {
  return (
    <section className="border-b border-black/[0.08] bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-10">
          <div className="space-y-8 lg:col-span-3">
            <div className="inline-flex w-fit items-center rounded-full border border-[#E8450A]/15 bg-[#FFF0EB] px-3 py-1.5 font-mono text-[11px] font-medium tracking-tighter text-[#C73D09]">
              CTT · Cotto Training Tracker
            </div>

            <div className="space-y-5">
              <h1 className="max-w-[22ch] text-[clamp(3.5rem,5vw,4rem)] font-semibold leading-[1.1] tracking-tight text-slate-950">
                A inteligência de dados que sua corrida precisa.
              </h1>
              <p className="max-w-md text-base text-muted-foreground">
                {siteConfig.description}
              </p>
            </div>

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
                Conectar com a API do Strava
              </Button>
              <a
                href="#projeto"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 w-full justify-center gap-2 rounded-lg border-slate-200 bg-white text-slate-800 transition-colors duration-150 hover:bg-slate-50 sm:w-auto"
                )}
              >
                Ver produto
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {avatarStack.map((bg, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-flex size-9 rounded-full border-2 border-white ring-1 ring-black/5",
                      bg
                    )}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="font-mono tabular-nums tracking-tighter text-slate-900">
                  847
                </span>{" "}
                atletas conectados
              </p>
            </div>
          </div>

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
              <p className="text-xs font-medium text-muted-foreground">Melhor pace</p>
              <p className="mt-1 font-mono text-sm font-semibold tracking-tighter text-slate-900">
                4:52 /km · 5km
              </p>
              <p className="mt-2 text-xs font-medium text-[#0F6E56]">↑ 8s mais rápido</p>
            </div>

            <div className="absolute bottom-8 right-4 z-10 flex w-[min(100%,200px)] items-start gap-2 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <Star className="mt-0.5 size-4 shrink-0 text-[#E8450A]" aria-hidden />
              <div>
                <p className="text-xs font-medium text-muted-foreground">PR</p>
                <p className="font-mono text-sm font-semibold tracking-tighter text-slate-900">
                  10 km · 51:20
                </p>
              </div>
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
