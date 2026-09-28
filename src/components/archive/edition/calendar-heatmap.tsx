"use client"

import { cva } from "class-variance-authority"
import { useEffect, useMemo, useRef } from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addDays, weekStartOf } from "@/lib/archive/dates"
import { formatDay, formatKm } from "@/lib/archive/format"

import { WEEKDAY_SHORT } from "./copy"

const WEEKS_SHOWN = 53
const DAYS_PER_WEEK = 7
/** Limites (km) entre os níveis 1→2, 2→3, 3→4 e 4→5 do calendário. */
export const HEAT_THRESHOLDS_KM = [5, 10, 15, 21] as const

const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
const WEEKDAY_LABEL_ROWS = [0, 2, 4, 6]
const WEEKDAY_KEYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const

export const heatCell = cva("block aspect-square w-full rounded-[2px]", {
  variants: {
    level: {
      0: "bg-muted",
      1: "bg-[color-mix(in_oklab,var(--signal)_22%,var(--muted))]",
      2: "bg-[color-mix(in_oklab,var(--signal)_42%,var(--muted))]",
      3: "bg-[color-mix(in_oklab,var(--signal)_62%,var(--muted))]",
      4: "bg-[color-mix(in_oklab,var(--signal)_82%,var(--muted))]",
      5: "bg-signal",
    },
  },
  defaultVariants: { level: 0 },
})

export type HeatLevel = 0 | 1 | 2 | 3 | 4 | 5

export function heatLevel(km: number): HeatLevel {
  if (km <= 0) return 0
  const index = HEAT_THRESHOLDS_KM.findIndex((limit) => km < limit)
  return (index === -1 ? HEAT_THRESHOLDS_KM.length + 1 : index + 1) as HeatLevel
}

type CalendarDay = { day: string; km: number; isFuture: boolean }

function buildColumns(daily: Record<string, number>, today: string): CalendarDay[][] {
  const firstDay = addDays(weekStartOf(today), -(WEEKS_SHOWN - 1) * DAYS_PER_WEEK)
  return Array.from({ length: WEEKS_SHOWN }, (_, column) =>
    Array.from({ length: DAYS_PER_WEEK }, (_, row) => {
      const day = addDays(firstDay, column * DAYS_PER_WEEK + row)
      return { day, km: daily[day] ?? 0, isFuture: day > today }
    })
  )
}

/** Rótulo do mês na primeira coluna em que ele aparece; some se o mês ocupa uma coluna só no início. */
function monthLabel(columns: CalendarDay[][], index: number): string | null {
  const month = columns[index][0].day.slice(0, 7)
  const previous = columns[index - 1]?.[0].day.slice(0, 7)
  const next = columns[index + 1]?.[0].day.slice(0, 7)
  if (previous === month) return null
  if (index === 0 && next !== month) return null
  return MONTH_FORMATTER.format(new Date(`${month}-01T12:00:00Z`)).replace(".", "")
}

export function CalendarHeatmap({
  daily,
  today,
}: {
  daily: Record<string, number>
  today: string
}) {
  const columns = useMemo(() => buildColumns(daily, today), [daily, today])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (container) container.scrollLeft = container.scrollWidth
  }, [])

  return (
    <div ref={scrollRef} className="overflow-x-auto pb-1.5">
      <div
        className="grid min-w-[680px] grid-cols-[28px_minmax(0,1fr)] gap-x-1"
        role="group"
        aria-label="Calendário de corridas dos últimos 12 meses"
      >
        <span />
        <div className="mb-1.5 grid grid-cols-[repeat(53,minmax(0,1fr))] gap-[3px]">
          {columns.map((column, index) => (
            <span key={column[0].day} className="type-axis overflow-visible whitespace-nowrap text-muted-foreground">
              {monthLabel(columns, index)}
            </span>
          ))}
        </div>

        <div className="grid grid-rows-7 gap-[3px]">
          {WEEKDAY_KEYS.map((key, row) => (
            <span key={key} className="type-axis flex items-center text-muted-foreground">
              {WEEKDAY_LABEL_ROWS.includes(row) ? WEEKDAY_SHORT[key] : null}
            </span>
          ))}
        </div>

        <TooltipProvider>
          <div className="grid grid-flow-col grid-cols-[repeat(53,minmax(0,1fr))] grid-rows-7 gap-[3px]">
            {columns.flat().map((cell) =>
              cell.isFuture ? (
                <span key={cell.day} className="aspect-square w-full" />
              ) : (
                <CalendarCell key={cell.day} cell={cell} />
              )
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}

function CalendarCell({ cell }: { cell: CalendarDay }) {
  const text = cell.km > 0 ? `${formatKm(cell.km)} km · ${formatDay(cell.day)}` : `Descanso · ${formatDay(cell.day)}`
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span role="img" aria-label={text} />}
        className={heatCell({ level: heatLevel(cell.km) })}
      />
      <TooltipContent className="font-mono text-[11px]">{text}</TooltipContent>
    </Tooltip>
  )
}

export function HeatLegend() {
  const levels: HeatLevel[] = [0, 1, 2, 3, 4, 5]
  return (
    <div className="mt-3 flex items-center gap-1.5">
      <span className="type-label text-muted-foreground">Menos</span>
      <span className="flex gap-1" aria-hidden>
        {levels.map((level) => (
          <span key={level} className={heatCell({ level, className: "size-3" })} />
        ))}
      </span>
      <span className="type-label text-muted-foreground">
        Mais · {HEAT_THRESHOLDS_KM.at(-1)} km+
      </span>
    </div>
  )
}
