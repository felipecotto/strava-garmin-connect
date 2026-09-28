import { Fragment } from "react"

import { Separator } from "@/components/ui/separator"
import { formatKm, formatNumber } from "@/lib/archive/format"
import type { ArchiveData } from "@/lib/archive/types"

import { peakWeekLabel, stripRangeLabel } from "./copy"
import { MonoLabel } from "./section"
import { WeeklyStripChart } from "./weekly-strip-chart"

type OdometerProps = Pick<ArchiveData, "totals" | "weeks" | "highlights">

export function Odometer({ totals, weeks, highlights }: OdometerProps) {
  const km = formatKm(totals.km, 0)
  const metrics = [
    { label: "Corridas", value: formatNumber(totals.runs) },
    { label: "Horas", value: formatNumber(Math.round(totals.hours)) },
    { label: "Subida · m", value: formatNumber(totals.elevationM) },
    { label: "Desde", value: totals.firstRunYear ? String(totals.firstRunYear) : "—" },
  ]
  const rangeLabel = stripRangeLabel(weeks)
  const peakLabel = peakWeekLabel(highlights)

  return (
    <>
      <div className="mt-10 grid gap-4 border-t border-foreground pt-4 md:mt-18 min-[860px]:grid-cols-[auto_minmax(0,1fr)] min-[860px]:items-end lg:gap-10">
        <p className="type-odometer" aria-label={`${km} quilômetros`}>
          {km}
          <sup className="relative top-[0.5em] ml-[0.1em] align-top text-[0.22em] font-semibold tracking-normal [font-stretch:100%]">
            km
          </sup>
        </p>
        <dl className="grid grid-cols-2 min-[860px]:flex min-[860px]:items-stretch">
          {metrics.map((metric) => (
            <Fragment key={metric.label}>
              <Separator orientation="vertical" className="hidden min-[860px]:block" />
              <div className="border-t border-border py-2.5 min-[860px]:flex-1 min-[860px]:border-t-0 min-[860px]:px-3.5 min-[860px]:py-1">
                <dt className="type-label text-muted-foreground">{metric.label}</dt>
                <dd className="text-[clamp(20px,2.2vw,30px)] leading-[1.05] font-bold whitespace-nowrap tabular-nums [font-stretch:75%]">
                  {metric.value}
                </dd>
              </div>
            </Fragment>
          ))}
        </dl>
      </div>

      {weeks.length > 0 ? (
        <div className="mt-7">
          <div className="mb-2.5 flex flex-wrap justify-between gap-3">
            <MonoLabel>{rangeLabel}</MonoLabel>
            {peakLabel ? <MonoLabel>{peakLabel}</MonoLabel> : null}
          </div>
          <WeeklyStripChart weeks={weeks} label={`Quilômetros por semana. ${rangeLabel}`} />
        </div>
      ) : null}
    </>
  )
}
