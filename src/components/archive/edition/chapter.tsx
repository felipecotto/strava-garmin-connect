import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { EditionContainer } from "./section"

/**
 * A edição é contada como uma maratona: cada capítulo abre com a marcação de KM.
 * Tom claro na maioria; tinta só no Muro (KM 30); ultramar só na Chegada (KM 42).
 */
export type ChapterTone = "claro" | "tinta" | "ultramar"

const TONE_CLASS: Record<ChapterTone, string> = {
  claro: "bg-background text-foreground",
  tinta: "bg-ink text-paper",
  ultramar: "bg-signal text-white",
}

const LINE_CLASS: Record<ChapterTone, string> = {
  claro: "border-foreground",
  tinta: "border-paper/25",
  ultramar: "border-white/35",
}

const META_CLASS: Record<ChapterTone, string> = {
  claro: "text-muted-foreground",
  tinta: "text-paper/80",
  ultramar: "text-white/80",
}

const TEXT_CLASS: Record<ChapterTone, string> = {
  claro: "text-ink-2",
  tinta: "text-paper/85",
  ultramar: "text-white/90",
}

type ChapterProps = {
  id: string
  /** "5", "21,1", "42" — vira "KM 5" e alimenta o contador da nav. */
  km: string
  name: string
  date?: string
  title?: ReactNode
  text?: ReactNode
  tone?: ChapterTone
  className?: string
  children?: ReactNode
}

export function Chapter({
  id,
  km,
  name,
  date,
  title,
  text,
  tone = "claro",
  className,
  children,
}: ChapterProps) {
  return (
    <section
      id={id}
      data-km={km}
      aria-labelledby={`${id}-titulo`}
      className={cn("scroll-mt-16 py-16 md:py-28", TONE_CLASS[tone], className)}
    >
      <EditionContainer>
        <header className={cn("border-t pt-6 md:pt-8", LINE_CLASS[tone])}>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <p className="type-km" aria-hidden>
              KM {km}
            </p>
            <div className="pb-2 md:pb-3">
              <p className="type-label">{name}</p>
              {date ? <p className={cn("type-label mt-1", META_CLASS[tone])}>{date}</p> : null}
            </div>
          </div>
          {title || text ? (
            <div className="mt-8 grid gap-5 md:mt-10 min-[860px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] min-[860px]:items-end lg:gap-16">
              {title ? (
                <h2 id={`${id}-titulo`} className="type-headline text-balance">
                  <span className="sr-only">KM {km} · {name}. </span>
                  {title}
                </h2>
              ) : (
                <h2 id={`${id}-titulo`} className="sr-only">
                  KM {km} · {name}
                </h2>
              )}
              {text ? <p className={cn("max-w-[52ch] text-[17px]", TEXT_CLASS[tone])}>{text}</p> : null}
            </div>
          ) : (
            <h2 id={`${id}-titulo`} className="sr-only">
              KM {km} · {name}
            </h2>
          )}
        </header>
        {children ? <div className="mt-10 md:mt-14">{children}</div> : null}
      </EditionContainer>
    </section>
  )
}
