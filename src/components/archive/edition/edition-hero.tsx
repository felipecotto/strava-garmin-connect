import { Route, Sunrise, Timer } from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"

import { formatKm } from "@/lib/archive/format"
import { cn } from "@/lib/utils"

import { Annotation } from "./annotation"
import { DataChip } from "./data-chip"
import type { EditionPhoto } from "./photos"
import { EditionContainer, MonoLabel } from "./section"

export type HeroFacts = {
  totalKm: number
  /** Hora de início mais comum (0–23). */
  peakHour: number | null
  /** Tempo da prova da chegada, já formatado ("3:26:47"). */
  finishTime: string | null
}

type EditionHeroProps = {
  label: string
  title: ReactNode
  lede: string
  actions?: ReactNode
  badge?: ReactNode
  banner?: ReactNode
  photo?: EditionPhoto
  coordinates?: string
  facts?: HeroFacts
}

/** KM 0 · Largada. Com foto, os dados pousam na cena; sem foto, o total corrido vira a imagem. */
export function EditionHero({
  label,
  title,
  lede,
  actions,
  badge,
  banner,
  photo,
  coordinates,
  facts,
}: EditionHeroProps) {
  return (
    <section id="largada" data-km="0" aria-labelledby="largada-titulo" className="scroll-mt-16">
      <EditionContainer className="pt-8 pb-16 md:pt-14 md:pb-24">
        {banner}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className={cn("lg:col-span-5", !photo && !facts && "lg:col-span-8")}>
            {badge ? <div className="mb-4">{badge}</div> : null}
            <MonoLabel>{label}</MonoLabel>
            <h1 id="largada-titulo" className="type-hero mt-4 text-balance">
              {title}
            </h1>
            <p className="mt-6 max-w-[46ch] text-[17px] text-ink-2 md:text-[19px]">{lede}</p>
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          {photo ? (
            <HeroPhoto photo={photo} coordinates={coordinates} facts={facts} />
          ) : facts ? (
            <HeroOdometer totalKm={facts.totalKm} />
          ) : null}
        </div>
      </EditionContainer>
    </section>
  )
}

function HeroPhoto({
  photo,
  coordinates,
  facts,
}: {
  photo: EditionPhoto
  coordinates?: string
  facts?: HeroFacts
}) {
  const hour = facts?.peakHour ?? null
  return (
    <figure className="relative lg:col-span-7">
      <div className="relative aspect-[31/33] overflow-hidden rounded-[4px] bg-ink">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          preload
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
        {/* Grade de laboratório sobre a foto. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.12)_1px,transparent_1px)] bg-[size:12.5%_12.5%]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />

        {facts ? (
          <>
            {hour !== null ? (
              <div className="absolute top-[14%] right-[10%] flex flex-col items-end gap-3">
                <DataChip icon={Sunrise} label="Horário mais comum" value={`${String(hour).padStart(2, "0")}:00`} />
                <Annotation className="mr-6 text-white">quase todo dia</Annotation>
              </div>
            ) : null}
            <DataChip
              icon={Route}
              label="Total corrido"
              value={`${formatKm(facts.totalKm, 0)} km`}
              className="absolute top-[46%] right-[6%]"
            />
            {facts.finishTime ? (
              <DataChip
                icon={Timer}
                label="Tempo da última maratona"
                value={facts.finishTime}
                className="absolute bottom-[16%] left-[22%]"
              />
            ) : null}
          </>
        ) : null}

        {coordinates ? (
          <figcaption className="type-label absolute bottom-5 left-5 text-white">{coordinates}</figcaption>
        ) : null}
      </div>
    </figure>
  )
}

function HeroOdometer({ totalKm }: { totalKm: number }) {
  const km = formatKm(totalKm, 0)
  return (
    <div className="border-t border-foreground pt-4 lg:col-span-7">
      <MonoLabel>Tudo que já correu</MonoLabel>
      <p className="type-giant mt-3" aria-label={`${km} quilômetros`}>
        {km}
        <sup className="type-subtitle ml-2 align-top text-ink-2">km</sup>
      </p>
    </div>
  )
}
