/* eslint-disable @next/next/no-img-element -- SVG oficial do Strava, sem otimização de imagem */
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { DEFAULT_LOOKBACK_DAYS } from "@/lib/sync/initial-sync"
import { cn } from "@/lib/utils"

import { BetaSlots, BetaSlotsSkeleton } from "./beta/beta-slots"
import type { EditionPhoto } from "./photos"
import { EditionContainer, MonoLabel } from "./section"

const DAYS_PER_YEAR = 365

export function ConnectStravaLink({
  size = "default",
  className,
}: {
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  return (
    <a href={siteConfig.connectStravaPath} className={cn(buttonVariants({ size }), className)}>
      Conectar Strava
      <ArrowRight aria-hidden />
    </a>
  )
}

function steps() {
  const importYears = Math.round(DEFAULT_LOOKBACK_DAYS / DAYS_PER_YEAR)
  return [
    {
      number: "01",
      title: "Conectar",
      text: `Acesso só de leitura. Na primeira vez, o CTT importa os últimos ${importYears} anos de treinos; os novos entram sozinhos.`,
    },
    {
      number: "02",
      title: "Ler",
      text: `Volume, forma, recordes e rotina num endereço seu, como ${siteConfig.domain}/${siteConfig.exampleProfileSlug}. Público ou privado, você escolhe.`,
    },
    {
      number: "03",
      title: "Compartilhar",
      text: "Depois de uma prova ou no fim do mês, o card já está montado com os seus números.",
    },
  ]
}

/** Convite final para visitantes, com o contador de vagas do beta. */
export function SuaVezSection({ photo }: { photo?: EditionPhoto }) {
  return (
    <section id="conectar" data-km="42,2" aria-labelledby="conectar-titulo" className="scroll-mt-16 py-16 md:py-28">
      <EditionContainer>
        <div className="grid gap-12 border-t border-foreground pt-10 lg:grid-cols-12 lg:gap-12 md:pt-14">
          <div className={cn(photo ? "lg:col-span-6" : "lg:col-span-8")}>
            <h2 id="conectar-titulo" className="type-hero text-balance">
              Qual é a sua <span className="text-signal">história?</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-[17px] text-ink-2 md:text-[19px]">
              Conecte o Strava. O CTT lê todo o seu histórico, só para leitura, e monta a sua edição em alguns minutos.
            </p>

            <div className="mt-10">
              <Suspense fallback={<BetaSlotsSkeleton />}>
                <BetaSlots />
              </Suspense>
            </div>

            <ol className="mt-14 grid gap-0">
              {steps().map((step) => (
                <li key={step.number} className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 border-t border-border py-5">
                  <span className="type-label pt-1.5 text-muted-foreground">{step.number}</span>
                  <div>
                    <h3 className="type-subtitle text-2xl">{step.title}</h3>
                    <p className="mt-1.5 max-w-[48ch] text-[15px] text-ink-2">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {photo ? (
            <figure className="relative hidden aspect-[25/36] overflow-hidden bg-ink lg:col-span-6 lg:block">
              <Image src={photo.src} alt={photo.alt} fill sizes="45vw" className="object-cover" />
            </figure>
          ) : null}
        </div>
      </EditionContainer>
    </section>
  )
}

export function EditionFooter() {
  return (
    <footer className="overflow-hidden bg-ink text-paper">
      <EditionContainer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-10">
        <MonoLabel className="text-paper/70">CTT · {siteConfig.domain}</MonoLabel>
        <MonoLabel className="text-paper/70">−23,5505 / −46,6333 · São Paulo, BR</MonoLabel>
        <div className="flex items-center gap-4">
          <MonoLabel className="text-paper/70">Dados via Strava</MonoLabel>
          <img
            src="/brand/powered-by-strava-white.svg"
            alt="Powered by Strava"
            width={146}
            height={15}
            className="h-[15px] w-auto"
          />
        </div>
      </EditionContainer>
      <p
        aria-hidden
        className="mt-6 -mb-[0.2em] text-center font-[family-name:var(--font-display)] text-[34vw] leading-[0.8] font-black tracking-[-0.02em] select-none"
      >
        CTT
      </p>
    </footer>
  )
}
