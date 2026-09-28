"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatDay, formatKm } from "@/lib/archive/format"
import type { ArchiveWeek } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { BarTopLabel } from "./chart-labels"
import {
  BAR_CURSOR,
  BAR_RADIUS,
  BASELINE_AXIS,
  CHART_FRAME_CLASS,
  EDGE_LABEL_ROOM,
  GRID_STROKE,
} from "./chart-theme"

const chartConfig = {
  km: { label: "km", color: "var(--chart-2)" },
  race: { label: "Prova", color: "var(--signal)" },
} satisfies ChartConfig

function yearStartTicks(weeks: ArchiveWeek[]): string[] {
  const ticks = weeks
    .filter((week, index) => index > 0 && week.weekStart.slice(0, 4) !== weeks[index - 1].weekStart.slice(0, 4))
    .map((week) => week.weekStart)
  return ticks.length > 0 || weeks.length === 0 ? ticks : [weeks[0].weekStart]
}

export function WeeklyStripChart({
  weeks,
  label,
}: {
  weeks: ArchiveWeek[]
  label: string
}) {
  const ticks = useMemo(() => yearStartTicks(weeks), [weeks])

  return (
    <ChartContainer
      config={chartConfig}
      aria-label={label}
      className={cn(CHART_FRAME_CLASS, "h-36 md:h-44")}
    >
      <BarChart
        data={weeks}
        margin={{ top: 18, right: EDGE_LABEL_ROOM, bottom: 0, left: EDGE_LABEL_ROOM }}
        barCategoryGap="30%"
      >
        <CartesianGrid vertical={false} stroke={GRID_STROKE} />
        <XAxis
          dataKey="weekStart"
          ticks={ticks}
          interval={0}
          tickFormatter={(weekStart: string) => weekStart.slice(0, 4)}
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
                const week = payload[0]?.payload as ArchiveWeek | undefined
                return week ? `semana de ${formatDay(week.weekStart)}` : null
              }}
              formatter={(value, _name, item) => {
                const week = item.payload as ArchiveWeek
                return (
                  <span className="grid gap-1">
                    <span className="font-medium tabular-nums">{formatKm(Number(value))} km</span>
                    {week.race ? <span className="text-popover-foreground/70">Prova · {week.race}</span> : null}
                  </span>
                )
              }}
            />
          }
        />
        <Bar dataKey="km" radius={BAR_RADIUS} isAnimationActive={false}>
          {weeks.map((week) => (
            <Cell
              key={week.weekStart}
              fill={week.race ? "var(--color-race)" : "var(--color-km)"}
            />
          ))}
          <LabelList dataKey="race" fill="var(--color-race)" content={BarTopLabel} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
