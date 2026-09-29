import Image from "next/image"

import { formatPercent } from "@/lib/archive/format"
import { EARLY_END_HOUR, EARLY_START_HOUR } from "@/lib/archive/routine"
import type { ArchiveData, ArchiveYear } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { Annotation } from "../annotation"
import { Chapter } from "../chapter"
import type { EditionPhoto } from "../photos"
import { HoursChart, WeekdaysChart } from "../routine-charts"
import { MonoLabel } from "../section"
import { habitText, habitTitle, topWeekday } from "./story-copy"

type HabitChapterProps = Pick<ArchiveData, "hours" | "weekdays" | "highlights"> & {
  habitYear: ArchiveYear | null
  photo?: EditionPhoto
}

export function HabitChapter({ hours, weekdays, highlights, habitYear, photo }: HabitChapterProps) {
  const top = topWeekday(weekdays)
  const isWeekend = top?.day === "sab" || top?.day === "dom"

  return (
    <Chapter
      id="habito"
      km="10"
      name="O hábito"
      date={habitYear ? String(habitYear.year) : undefined}
      title={habitTitle(hours)}
      text={habitText(habitYear, weekdays, highlights.earlyShare)}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {photo ? (
          <figure className="relative aspect-[14/19] overflow-hidden bg-ink lg:col-span-5">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            {habitYear ? (
              <figcaption className="type-label absolute bottom-5 left-5 text-white">{habitYear.year}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className={cn("flex flex-col gap-12", photo ? "lg:col-span-7" : "lg:col-span-12")}>
          <div>
            <p className="flex flex-wrap items-end gap-4">
              <b className="type-display text-signal">{formatPercent(highlights.earlyShare)}</b>
              <span className="mb-2 max-w-[26ch] text-ink-2">
                das corridas começam entre {EARLY_START_HOUR}h e {EARLY_END_HOUR + 1}h.
              </span>
            </p>
            <div className="mt-6">
              <HoursChart hours={hours} />
            </div>
          </div>

          <div className="relative">
            <MonoLabel>Km por dia da semana</MonoLabel>
            <div className="mt-3">
              <WeekdaysChart weekdays={weekdays} />
            </div>
            {top && isWeekend ? (
              <Annotation className="absolute right-0 -bottom-8 hidden md:inline-flex">
                dia de longão
              </Annotation>
            ) : null}
          </div>
        </div>
      </div>
    </Chapter>
  )
}
