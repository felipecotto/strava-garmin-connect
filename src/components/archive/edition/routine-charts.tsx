"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatKm, formatNumber } from "@/lib/archive/format"
import { EARLY_END_HOUR, EARLY_START_HOUR } from "@/lib/archive/routine"
import type { ArchiveData } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { BarEndLabel } from "./chart-labels"
import {
  BAR_CURSOR,
  BAR_RADIUS,
  BASELINE_AXIS,
  CHART_FRAME_CLASS,
  GRID_STROKE,
} from "./chart-theme"
import { WEEKDAY_NAME, WEEKDAY_SHORT } from "./copy"

const MUTED_BAR_OPACITY = 0.6
const HOUR_TICK_STEP = 3
const HORIZONTAL_BAR_RADIUS: [number, number, number, number] = [0, 3, 3, 0]

const chartConfig = {
  highlight: { label: "Destaque", color: "var(--signal)" },
  other: { label: "Demais", color: "var(--chart-3)" },
} satisfies ChartConfig

type HourRow = { hour: number; runs: number }

const HOUR_TICKS = Array.from({ length: 24 / HOUR_TICK_STEP }, (_, index) => index * HOUR_TICK_STEP)

function isEarlyHour(hour: number): boolean {
  return hour >= EARLY_START_HOUR && hour <= EARLY_END_HOUR
}

export function HoursChart({ hours }: { hours: number[] }) {
  const rows = useMemo<HourRow[]>(() => hours.map((runs, hour) => ({ hour, runs })), [hours])

  return (
    <ChartContainer
      config={chartConfig}
      aria-label="Corridas por hora de início"
      className={cn(CHART_FRAME_CLASS, "h-50")}
    >
      <BarChart data={rows} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke={GRID_STROKE} />
        <XAxis
          dataKey="hour"
          ticks={HOUR_TICKS}
          interval={0}
          tickFormatter={(hour: number) => `${hour}h`}
          tickLine={false}
          axisLine={BASELINE_AXIS}
          tickMargin={6}
        />
        <ChartTooltip
          cursor={BAR_CURSOR}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(_, payload) => {
                const row = payload[0]?.payload as HourRow | undefined
                return row ? `começando às ${row.hour}h` : null
              }}
              formatter={(value) => (
                <span className="font-medium tabular-nums">{formatNumber(Number(value))} corridas</span>
              )}
            />
          }
        />
        <Bar dataKey="runs" radius={BAR_RADIUS} isAnimationActive={false}>
          {rows.map((row) => {
            const highlighted = isEarlyHour(row.hour)
            return (
              <Cell
                key={row.hour}
                fill={highlighted ? "var(--color-highlight)" : "var(--color-other)"}
                fillOpacity={highlighted ? 1 : MUTED_BAR_OPACITY}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

type WeekdayRow = ArchiveData["weekdays"][number] & { shortLabel: string; kmLabel: string }

export function WeekdaysChart({ weekdays }: { weekdays: ArchiveData["weekdays"] }) {
  const rows = useMemo<WeekdayRow[]>(
    () =>
      weekdays.map((day) => ({
        ...day,
        shortLabel: WEEKDAY_SHORT[day.day],
        kmLabel: `${formatKm(day.km, 0)} km`,
      })),
    [weekdays]
  )
  const topDay = useMemo(() => {
    const top = weekdays.reduce<ArchiveData["weekdays"][number] | null>(
      (best, day) => (day.km > (best?.km ?? 0) ? day : best),
      null
    )
    return top?.day ?? null
  }, [weekdays])

  return (
    <ChartContainer
      config={chartConfig}
      aria-label="Quilômetros por dia da semana"
      className={cn(CHART_FRAME_CLASS, "h-48")}
    >
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }} barCategoryGap="30%">
        <XAxis type="number" dataKey="km" hide />
        <YAxis type="category" dataKey="shortLabel" width={40} tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={BAR_CURSOR}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(_, payload) => {
                const row = payload[0]?.payload as WeekdayRow | undefined
                return row ? WEEKDAY_NAME[row.day] : null
              }}
              formatter={(_value, _name, item) => {
                const row = item.payload as WeekdayRow
                return (
                  <span className="font-medium tabular-nums">
                    {formatKm(row.km, 0)} km · {formatNumber(row.runs)} corridas
                  </span>
                )
              }}
            />
          }
        />
        <Bar dataKey="km" radius={HORIZONTAL_BAR_RADIUS} isAnimationActive={false}>
          {rows.map((row) => {
            const highlighted = row.day === topDay
            return (
              <Cell
                key={row.day}
                fill={highlighted ? "var(--color-highlight)" : "var(--color-other)"}
                fillOpacity={highlighted ? 1 : MUTED_BAR_OPACITY}
              />
            )
          })}
          <LabelList dataKey="kmLabel" fill="var(--ink-2)" content={BarEndLabel} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
