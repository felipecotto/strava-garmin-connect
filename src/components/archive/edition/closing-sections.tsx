/* eslint-disable @next/next/no-img-element -- SVG oficial do Strava, sem otimização de imagem */
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { DEFAULT_LOOKBACK_DAYS } from "@/lib/sync/initial-sync"
import { cn } from "@/lib/utils"

import { EditionContainer, EditionSection, MonoLabel } from "./section"

const DAYS_PER_YEAR = 365

export function ConnectStravaLink({ size = "default" }: { size?: "default" | "sm" | "lg" }) {
  return (
    <a href={siteConfig.connectStravaPath} className={cn(buttonVariants({ size }))}>
      Conectar Strava
      <ArrowRight aria-hidden />
    </a>
  )
}

export function HowItWorksSection() {
  const importYears = Math.round(DEFAULT_LOOKBACK_DAYS / DAYS_PER_YEAR)
  const steps = [
    {
      label: "Conectar",
      title: "Um clique no Strava",
      text: `Acesso só de leitura. Na primeira vez, o CTT importa os últimos ${importYears} anos de treinos.`,
    },
    {
      label: "Ler",
      title: "Uma página por atleta",
      text: `Volume, forma, recordes e rotina num endereço seu, como ${siteConfig.domain}/${siteConfig.exampleProfileSlug}. Público ou privado, você escolhe.`,
    },
    {
      label: "Compartilhar",
      title: "Cards prontos",
      text: "Depois de uma prova ou no fim do mês, o card já está montado com os seus números.",
    },
  ]

  return (
    <EditionSection
      label="Como funciona"
      title="Sem feed. Sem ranking."
      description="O CTT não substitui o Strava. Ele só lê o que já está lá e organiza."
    >
      <div className="grid gap-8 min-[860px]:grid-cols-3 lg:gap-10">
        {steps.map((step) => (
          <div key={step.label} className="border-t border-foreground pt-3.5">
            <MonoLabel>{step.label}</MonoLabel>
            <h3 className="mt-2 mb-1.5 text-2xl leading-[1.1] font-bold [font-stretch:80%]">{step.title}</h3>
            <p className="text-[15px] text-ink-2">{step.text}</p>
          </div>
        ))}
      </div>
    </EditionSection>
  )
}

export function FinalCta() {
  return (
    <section id="conectar" className="border-t border-foreground py-16 md:py-36">
      <EditionContainer>
        <h2 className="mb-7 text-[clamp(56px,11vw,160px)] leading-[0.85] font-black tracking-[-0.03em] text-balance [font-stretch:66%]">
          Quanto você já correu?
        </h2>
        <ConnectStravaLink size="lg" />
      </EditionContainer>
    </section>
  )
}

export function EditionFooter() {
  return (
    <footer className="border-t border-border py-7">
      <EditionContainer className="flex flex-wrap items-center justify-between gap-4">
        <MonoLabel>CTT · {siteConfig.domain}</MonoLabel>
        <div className="flex items-center gap-4">
          <MonoLabel>Dados via Strava</MonoLabel>
          <img
            src="/brand/powered-by-strava-black.svg"
            alt="Powered by Strava"
            width={146}
            height={15}
            className="h-[15px] w-auto dark:hidden"
          />
          <img
            src="/brand/powered-by-strava-white.svg"
            alt="Powered by Strava"
            width={146}
            height={15}
            className="hidden h-[15px] w-auto dark:block"
          />
        </div>
      </EditionContainer>
    </footer>
  )
}
