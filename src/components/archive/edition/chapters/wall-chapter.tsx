import Image from "next/image"

import { addDays } from "@/lib/archive/dates"
import { formatMonth } from "@/lib/archive/format"
import type { WallChapter as Wall } from "@/lib/archive/story"
import type { ArchiveData, ArchivePause } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { Chapter } from "../chapter"
import { FormChart } from "../form-chart"
import type { EditionPhoto } from "../photos"
import { countWord, wallText } from "./story-copy"

type WallChapterProps = Pick<ArchiveData, "load" | "pauses" | "races"> & {
  wall: Wall
  photo?: EditionPhoto
}

/** A faixa "pausa" do muro: as pausas detectadas ou, sem elas, as semanas sem corrida da queda. */
function wallPauses(wall: Wall, pauses: ArchivePause[]): ArchivePause[] {
  if (pauses.length > 0) return pauses
  if (!wall.stopFrom || wall.runlessWeeks < 2) return []
  return [{ from: wall.stopFrom, to: addDays(wall.stopFrom, (wall.runlessWeeks - 1) * 7), weeks: wall.runlessWeeks }]
}

export function WallChapter({ load, pauses, races, wall, photo }: WallChapterProps) {
  const from = formatMonth(wall.peak.weekStart.slice(0, 7))
  const to = formatMonth(wall.low.weekStart.slice(0, 7))

  return (
    <Chapter
      id="muro"
      km="30"
      name="O muro"
      date={from === to ? from : `${from} — ${to}`}
      title="Todo ciclo tem um muro."
      text={wallText(wall)}
      tone="tinta"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {photo ? (
          <figure className="relative aspect-[22/29] overflow-hidden lg:col-span-5">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </figure>
        ) : null}
        <div className={cn("flex min-w-0 flex-col", photo ? "lg:col-span-7" : "lg:col-span-12")}>
          <p className="type-display" aria-label={`Forma de ${Math.round(wall.peak.fitness)} para ${Math.round(wall.low.fitness)}`}>
            {Math.round(wall.peak.fitness)} → {Math.round(wall.low.fitness)}
          </p>
          <p className="type-label mt-3 text-paper/80">Forma em {countWord(wall.weeksDown, true)} semanas</p>
          <div className="mt-auto pt-10">
            <FormChart
              load={load}
              pauses={wallPauses(wall, pauses)}
              races={races}
              tone="dark"
              highlight={{ weekStart: wall.low.weekStart, fitness: wall.low.fitness, label: "aqui" }}
            />
          </div>
        </div>
      </div>
    </Chapter>
  )
}
