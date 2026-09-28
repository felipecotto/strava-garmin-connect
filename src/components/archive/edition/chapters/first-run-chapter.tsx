import { formatDay, formatKm } from "@/lib/archive/format"
import type { ArchiveFirstRun, ArchiveYear } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { Chapter } from "../chapter"
import { MonoLabel } from "../section"
import { firstRunText } from "./story-copy"

/** Anos com menos que isso do maior ano viram uma fatia só na régua ("2020–22"). */
const SMALL_YEAR_SHARE = 0.08

type FirstRunChapterProps = {
  firstRun: ArchiveFirstRun
  years: ArchiveYear[]
  habitYear: number | null
  place?: string
}

export function FirstRunChapter({ firstRun, years, habitYear, place }: FirstRunChapterProps) {
  const [whole, decimal] = formatKm(firstRun.km).split(",")
  return (
    <Chapter
      id="primeira"
      km="5"
      name="A primeira"
      date={formatDay(firstRun.date)}
      title="Começou devagar."
      text={firstRunText(firstRun, years, habitYear)}
    >
      <div className="flex flex-wrap items-start gap-x-4">
        <p className="type-giant" aria-label={`${formatKm(firstRun.km)} quilômetros`}>
          {whole}
          {decimal ? `,${decimal}` : null}
        </p>
        <div className="flex flex-col gap-3 pt-2 md:pt-6">
          <span className="type-title text-ink-2">km</span>
          <MonoLabel>
            {formatDay(firstRun.date)}
            {place ? ` · ${place}` : null}
          </MonoLabel>
        </div>
      </div>
      <YearRuler years={years} />
    </Chapter>
  )
}

function YearRuler({ years }: { years: ArchiveYear[] }) {
  if (years.length === 0) return null
  const total = years.reduce((sum, year) => sum + year.km, 0)
  const max = Math.max(...years.map((year) => year.km))
  const peak = years.find((year) => year.km === max)?.year

  // Anos pequenos do começo se juntam numa fatia para os rótulos não colidirem.
  const small = years.filter((year, index) => year.km < max * SMALL_YEAR_SHARE && years.slice(0, index).every((y) => y.km < max * SMALL_YEAR_SHARE))
  const rest = years.slice(small.length)
  const slices = [
    ...(small.length > 0
      ? [{
          key: "inicio",
          label: small.length > 1 ? `${small[0].year}–${String(small.at(-1)!.year).slice(2)}` : String(small[0].year),
          km: small.reduce((sum, year) => sum + year.km, 0),
          muted: true,
          peak: false,
        }]
      : []),
    ...rest.map((year) => ({ key: String(year.year), label: String(year.year), km: year.km, muted: false, peak: year.year === peak })),
  ]

  return (
    <figure className="mt-14 md:mt-20" aria-label="Quilômetros por ano, com a largura proporcional ao volume">
      <MonoLabel>Km por ano · a largura é o volume</MonoLabel>
      <div className="mt-3 flex gap-1">
        {slices.map((slice) => (
          <div key={slice.key} className="min-w-0" style={{ flex: `${Math.max(slice.km / total, 0.035)} 1 0%` }}>
            <div className={cn("h-6", slice.peak ? "bg-signal" : slice.muted ? "bg-chart-4" : "bg-chart-3")} />
            <p className={cn("type-label mt-2.5 truncate", slice.peak ? "text-signal" : "text-ink-2")}>
              {slice.label}
              <span className="block text-muted-foreground">{formatKm(slice.km, 0)} km</span>
            </p>
          </div>
        ))}
      </div>
    </figure>
  )
}
