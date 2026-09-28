"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatKm, formatMonth, formatNumber } from "@/lib/archive/format"
import type { ArchiveMonth } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { BarTopLabel } from "./chart-labels"
import {
  BAR_CURSOR,
  BAR_RADIUS,
  BASELINE_AXIS,
  CHART_FRAME_CLASS,
  GRID_STROKE,
} from "./chart-theme"

type Metric = "km" | "runs"

const METRIC_OPTIONS: { value: Metric; label: string }[] = [
  { value: "km", label: "km" },
  { value: "runs", label: "Corridas" },
]

const PREVIOUS_YEARS_OPACITY = 0.55

const chartConfig = {
  current: { label: "Ano atual", color: "var(--chart-2)" },
  previous: { label: "Anos anteriores", color: "var(--chart-3)" },
  peak: { label: "Pico", color: "var(--signal)" },
} satisfies ChartConfig

type MonthRow = ArchiveMonth & { peakLabel?: string }

function formatMetric(metric: Metric, value: number): string {
  return metric === "km" ? `${formatKm(value, 0)} km` : `${formatNumber(value)} corridas`
}

function withPeakLabel(months: ArchiveMonth[], metric: Metric): { rows: MonthRow[]; peakMonth: string | null } {
  const peak = months.reduce<ArchiveMonth | null>(
    (top, month) => (month[metric] > 0 && (!top || month[metric] > top[metric]) ? month : top),
    null
  )
  const rows = months.map((month) =>
    month === peak
      ? { ...month, peakLabel: `${formatMetric(metric, month[metric])} · ${formatMonth(month.month)}` }
      : month
  )
  return { rows, peakMonth: peak?.month ?? null }
}

export function MonthlyVolumeChart({
  months,
  currentYear,
}: {
  months: ArchiveMonth[]
  currentYear: string
}) {
  const [metric, setMetric] = useState<Metric>("km")
  const { rows, peakMonth } = useMemo(() => withPeakLabel(months, metric), [months, metric])
  const yearTicks = useMemo(
    () => months.filter((month) => month.month.endsWith("-01")).map((month) => month.month),
    [months]
  )

  return (
    <div>
      <ToggleGroup
        aria-label="Métrica do gráfico mensal"
        value={[metric]}
        onValueChange={(value) => {
          const next = value[0] as Metric | undefined
          if (next) setMetric(next)
        }}
        className="mb-4"
      >
        {METRIC_OPTIONS.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} variant="chip" className="h-8 px-3.5">
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ChartContainer
        config={chartConfig}
        aria-label={metric === "km" ? "Quilômetros por mês" : "Corridas por mês"}
        className={cn(CHART_FRAME_CLASS, "h-60 md:h-80")}
      >
        <BarChart data={rows} margin={{ top: 26, right: 0, bottom: 0, left: 0 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="month"
            ticks={yearTicks}
            interval={0}
            tickFormatter={(month: string) => month.slice(0, 4)}
            tickLine={false}
            axisLine={BASELINE_AXIS}
            tickMargin={6}
          />
          <YAxis width={34} tickCount={4} tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip
            cursor={BAR_CURSOR}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(_, payload) => {
                  const row = payload[0]?.payload as MonthRow | undefined
                  return row ? formatMonth(row.month) : null
                }}
                formatter={(_value, _name, item) => {
                  const row = item.payload as MonthRow
                  return (
                    <span className="font-medium tabular-nums">
                      {formatKm(row.km, 0)} km · {formatNumber(row.runs)} corridas
                    </span>
                  )
                }}
              />
            }
          />
          <Bar dataKey={metric} radius={BAR_RADIUS} isAnimationActive={false}>
            {rows.map((row) => {
              const isPeak = row.month === peakMonth
              const isCurrentYear = row.month.startsWith(currentYear)
              return (
                <Cell
                  key={row.month}
                  fill={
                    isPeak
                      ? "var(--color-peak)"
                      : isCurrentYear
                        ? "var(--color-current)"
                        : "var(--color-previous)"
                  }
                  fillOpacity={isPeak || isCurrentYear ? 1 : PREVIOUS_YEARS_OPACITY}
                />
              )
            })}
            <LabelList dataKey="peakLabel" fill="var(--color-peak)" content={BarTopLabel} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
