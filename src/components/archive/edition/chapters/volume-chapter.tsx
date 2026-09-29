import Image from "next/image"

import { formatKm, formatMonth, formatNumber } from "@/lib/archive/format"
import type { ArchiveData, ArchiveYear } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { Chapter } from "../chapter"
import { stripRangeLabel } from "../copy"
import type { EditionPhoto } from "../photos"
import { MonoLabel } from "../section"
import { YearsTable } from "./years-table"
import { WeeklyStripChart } from "../weekly-strip-chart"
import { volumeText, volumeTitle } from "./story-copy"

type VolumeChapterProps = Pick<ArchiveData, "weeks" | "years" | "streaks" | "highlights"> & {
  peakYear: ArchiveYear
  photo?: EditionPhoto
}

export function VolumeChapter({ weeks, years, streaks, highlights, peakYear, photo }: VolumeChapterProps) {
  const rangeLabel = stripRangeLabel(weeks)
  const metrics = [
    { label: `Corridas em ${peakYear.year}`, value: formatNumber(peakYear.runs), highlight: false },
    streaks.longestWeeks >= 2
      ? { label: "Semanas seguidas", value: formatNumber(streaks.longestWeeks), highlight: true }
      : null,
    highlights.peakWeek
      ? { label: `Pico semanal · ${formatMonth(highlights.peakWeek.weekStart.slice(0, 7))}`, value: `${formatKm(highlights.peakWeek.km)} km`, highlight: false }
      : null,
  ].filter((metric) => metric !== null)

  return (
    <Chapter
      id="volume"
      km="21"
      name="O volume"
      date={String(peakYear.year)}
      title={volumeTitle(peakYear)}
      text={volumeText(peakYear, streaks, highlights.peakWeek)}
    >
      {photo ? (
        <figure className="relative left-1/2 mb-14 h-[clamp(280px,33vw,480px)] w-screen -translate-x-1/2 overflow-hidden bg-ink md:mb-20">
          <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
        </figure>
      ) : null}

      {weeks.length > 0 ? (
        <div>
          <MonoLabel>{rangeLabel}</MonoLabel>
          <div className="mt-3">
            <WeeklyStripChart weeks={weeks} label={`Quilômetros por semana. ${rangeLabel}`} />
          </div>
        </div>
      ) : null}

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-span-7">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-t border-foreground pt-4">
              <dt className="type-label text-muted-foreground">{metric.label}</dt>
              <dd className={cn("type-title mt-2", metric.highlight && "text-signal")}>{metric.value}</dd>
            </div>
          ))}
        </dl>
        <div className="lg:col-span-5">
          <YearsTable years={years} />
        </div>
      </div>
    </Chapter>
  )
}
