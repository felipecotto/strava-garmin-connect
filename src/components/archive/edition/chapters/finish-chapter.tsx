import Image from "next/image"

import { formatDay, formatKm, formatRaceTime, formatTimeDelta } from "@/lib/archive/format"
import type { FinishChapter as Finish } from "@/lib/archive/story"
import { cn } from "@/lib/utils"

import { Chapter } from "../chapter"
import type { EditionPhoto } from "../photos"
import { countWord, finishDetail, finishText, finishTitle } from "./story-copy"

export function FinishChapter({ finish, photo }: { finish: Finish; photo?: EditionPhoto }) {
  const { race, deltaSec } = finish
  const weeks = race.buildUp.weeks
  const maxKm = Math.max(1, ...weeks.map((week) => week.km))

  return (
    <Chapter
      id="chegada"
      km="42"
      name="A chegada"
      date={formatDay(race.date)}
      title={finishTitle(finish)}
      text={finishText(finish)}
      tone="ultramar"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className={cn("min-w-0", photo ? "lg:col-span-7" : "lg:col-span-12")}>
          <p className="type-giant text-[clamp(96px,17vw,240px)]">{formatRaceTime(race.movingSec)}</p>
          <p className="type-label mt-3 text-white/90">{finishDetail(finish)}</p>

          {weeks.length > 0 ? (
            <figure className="mt-12" aria-label={`Quilômetros por semana nas ${weeks.length} semanas até a prova`}>
              <p className="type-label text-white/80">
                {countWord(weeks.length, true)} semanas de preparação
              </p>
              <div className="mt-4 flex h-32 items-end gap-1.5 border-b border-white/60">
                {weeks.map((week, index) => {
                  const isRace = index === weeks.length - 1
                  return (
                    <div
                      key={week.weekStart}
                      title={`${formatKm(week.km)} km · semana de ${formatDay(week.weekStart)}`}
                      className={cn("flex-1 rounded-t-[2px] bg-white", !isRace && "opacity-45")}
                      style={{ height: `${Math.max(2, (week.km / maxKm) * 100)}%` }}
                    />
                  )
                })}
              </div>
              <figcaption className="type-label mt-2.5 flex justify-between text-white/80">
                <span>
                  {weeks.length} semanas · {formatKm(race.buildUp.km, 0)} km
                </span>
                {race.buildUp.longestRunKm > 0 ? <span>Maior longão: {formatKm(race.buildUp.longestRunKm, 0)} km</span> : null}
              </figcaption>
            </figure>
          ) : null}
        </div>

        {photo ? (
          <figure className="relative aspect-[22/28] overflow-hidden bg-ink lg:col-span-5">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            {deltaSec !== null && deltaSec < 0 ? (
              <span className="type-subtitle absolute bottom-5 left-5 bg-ink px-4 pt-2.5 pb-1.5 text-paper">
                {formatTimeDelta(deltaSec)}
              </span>
            ) : null}
          </figure>
        ) : null}
      </div>
    </Chapter>
  )
}
