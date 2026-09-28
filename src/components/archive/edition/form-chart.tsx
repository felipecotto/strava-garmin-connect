"use client"

import { useMemo } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { weekStartOf } from "@/lib/archive/dates"
import { formatDay } from "@/lib/archive/format"
import { FATIGUE_DAYS, FITNESS_DAYS } from "@/lib/archive/load"
import type { ArchiveLoadPoint, ArchivePause, ArchiveRace } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { LABEL_ROW_HEIGHT, MarkerLabel } from "./chart-labels"
import { BASELINE_AXIS, CHART_FRAME_CLASS, GRID_STROKE, LINE_CURSOR } from "./chart-theme"
import { raceMarkerLabel } from "./copy"

/** Provas mais próximas que isso (em semanas) sobem o rótulo uma linha para não sobrepor texto. */
const MARKER_STACK_WEEKS = 20
const MAX_LABEL_ROWS = 2
/** Marcadores nas pontas do gráfico alinham o rótulo para dentro. */
const EDGE_SHARE = 0.12
const LABEL_TOP_ROOM = 18

const lightConfig = {
  fitness: { label: `Forma · ${FITNESS_DAYS} dias`, color: "var(--signal)" },
  fatigue: { label: `Fadiga · ${FATIGUE_DAYS} dias`, color: "var(--chart-4)" },
} satisfies ChartConfig

/** Sobre o bloco em tinta (capítulo do Muro). */
const darkConfig = {
  fitness: { label: `Forma · ${FITNESS_DAYS} dias`, color: "var(--signal-on-ink)" },
  fatigue: { label: `Fadiga · ${FATIGUE_DAYS} dias`, color: "rgb(242 242 238 / 0.55)" },
} satisfies ChartConfig

const TONE = {
  light: {
    config: lightConfig,
    grid: GRID_STROKE,
    axis: BASELINE_AXIS,
    areaFill: "var(--signal-soft)",
    areaOpacity: 0.7,
    pauseFill: "var(--muted)",
    pauseOpacity: 1,
    pauseLabel: "var(--muted-foreground)",
    marker: "var(--ink-2)",
    tick: undefined as string | undefined,
    cursor: LINE_CURSOR,
  },
  dark: {
    config: darkConfig,
    grid: "rgb(242 242 238 / 0.08)",
    axis: { stroke: "rgb(242 242 238 / 0.4)" },
    areaFill: "var(--signal-on-ink)",
    areaOpacity: 0.25,
    pauseFill: "rgb(242 242 238 / 0.1)",
    pauseOpacity: 1,
    pauseLabel: "var(--paper)",
    marker: "rgb(242 242 238 / 0.6)",
    tick: "rgb(242 242 238 / 0.6)",
    cursor: { stroke: "var(--paper)", strokeOpacity: 0.35 },
  },
} as const

export type FormHighlight = { weekStart: string; fitness: number; label: string }

type RaceMarker = {
  weekStart: string
  label: string
  row: number
  anchor: "start" | "middle" | "end"
}

function raceMarkers(races: ArchiveRace[], load: ArchiveLoadPoint[]): RaceMarker[] {
  const indexByWeek = new Map(load.map((point, index) => [point.weekStart, index]))
  const lastIndex = Math.max(1, load.length - 1)
  let previous: { index: number; row: number } | null = null

  return races.flatMap((race) => {
    const weekStart = weekStartOf(race.date)
    const index = indexByWeek.get(weekStart)
    if (index === undefined) return []

    const row =
      previous && index - previous.index < MARKER_STACK_WEEKS
        ? (previous.row + 1) % MAX_LABEL_ROWS
        : 0
    previous = { index, row }

    const share = index / lastIndex
    const anchor = share < EDGE_SHARE ? "start" : share > 1 - EDGE_SHARE ? "end" : "middle"
    return [{ weekStart, label: raceMarkerLabel(race.label, race.date), row, anchor }]
  })
}

function yearStartTicks(load: ArchiveLoadPoint[]): string[] {
  return load
    .filter((point, index) => index > 0 && point.weekStart.slice(0, 4) !== load[index - 1].weekStart.slice(0, 4))
    .map((point) => point.weekStart)
}

type FormChartProps = {
  load: ArchiveLoadPoint[]
  pauses: ArchivePause[]
  races: ArchiveRace[]
  tone?: keyof typeof TONE
  /** Ponto marcado no gráfico (o vale do muro). */
  highlight?: FormHighlight | null
}

export function FormChart({ load, pauses, races, tone = "light", highlight }: FormChartProps) {
  const theme = TONE[tone]
  const markers = useMemo(() => raceMarkers(races, load), [races, load])
  const markerByWeek = useMemo(
    () => new Map(markers.map((marker) => [marker.weekStart, marker.label])),
    [markers]
  )
  const ticks = useMemo(() => yearStartTicks(load), [load])

  return (
    <ChartContainer
      config={theme.config}
      aria-label="Forma e fadiga semanais"
      className={cn(CHART_FRAME_CLASS, "h-64 md:h-90")}
    >
      <ComposedChart
        data={load}
        margin={{ top: LABEL_TOP_ROOM + MAX_LABEL_ROWS * LABEL_ROW_HEIGHT, right: 0, bottom: 0, left: 0 }}
      >
        <CartesianGrid vertical={false} stroke={theme.grid} />
        <XAxis
          dataKey="weekStart"
          ticks={ticks}
          interval={0}
          tickFormatter={(weekStart: string) => weekStart.slice(0, 4)}
          tickLine={false}
          axisLine={theme.axis}
          tickMargin={6}
          tick={theme.tick ? { fill: theme.tick } : undefined}
        />
        <YAxis
          width={30}
          tickCount={4}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tick={theme.tick ? { fill: theme.tick } : undefined}
        />

        {pauses.map((pause) => (
          <ReferenceArea
            key={pause.from}
            x1={pause.from}
            x2={pause.to}
            fill={theme.pauseFill}
            fillOpacity={theme.pauseOpacity}
            ifOverflow="hidden"
            label={{ value: "PAUSA", position: "top", fill: theme.pauseLabel, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
          />
        ))}

        <Area
          dataKey="fitness"
          type="monotone"
          fill={theme.areaFill}
          fillOpacity={theme.areaOpacity}
          stroke="var(--color-fitness)"
          strokeWidth={2}
          isAnimationActive={false}
          activeDot={{ r: 4, fill: "var(--color-fitness)", strokeWidth: 0 }}
        />
        <Line
          dataKey="fatigue"
          type="monotone"
          stroke="var(--color-fatigue)"
          strokeWidth={1.25}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 3, fill: "var(--color-fatigue)", strokeWidth: 0 }}
        />

        {markers.map((marker) => (
          <ReferenceLine
            key={marker.weekStart}
            x={marker.weekStart}
            stroke={theme.marker}
            strokeDasharray="2 3"
            label={
              <MarkerLabel value={marker.label} fill={theme.marker} row={marker.row} anchor={marker.anchor} />
            }
          />
        ))}

        {highlight ? (
          <ReferenceDot
            x={highlight.weekStart}
            y={highlight.fitness}
            r={6}
            fill="var(--color-fitness)"
            stroke={tone === "dark" ? "var(--ink)" : "var(--background)"}
            strokeWidth={2}
            label={{
              value: highlight.label,
              position: "right",
              offset: 12,
              fill: "var(--color-fitness)",
              fontFamily: "var(--font-note)",
              fontSize: 26,
            }}
          />
        ) : null}

        <ChartTooltip
          cursor={theme.cursor}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(_, payload) => {
                const point = payload[0]?.payload as ArchiveLoadPoint | undefined
                if (!point) return null
                const race = markerByWeek.get(point.weekStart)
                return `semana de ${formatDay(point.weekStart)}${race ? ` · ${race}` : ""}`
              }}
              formatter={(value, name) => (
                <span className="flex w-full justify-between gap-4">
                  <span className="text-popover-foreground/70">
                    {name === "fitness" ? "Forma" : "Fadiga"}
                  </span>
                  <span className="font-medium tabular-nums">{Math.round(Number(value))}</span>
                </span>
              )}
            />
          }
        />
        <ChartLegend
          itemSorter={(item) => (item.dataKey === "fitness" ? 0 : 1)}
          content={<ChartLegendContent className={cn("type-label justify-start gap-5 pt-4", tone === "dark" ? "text-paper/70" : "text-muted-foreground")} />}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
