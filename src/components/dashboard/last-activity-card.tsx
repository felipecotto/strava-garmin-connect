import { ChevronRight, Footprints, Zap } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { StravaActivity } from "@/lib/strava/types"

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`
  return `${m}m`
}

function formatPace(movingTimeSec: number, distanceM: number): string {
  if (distanceM <= 0 || movingTimeSec <= 0) return "—"
  const paceSecKm = movingTimeSec / (distanceM / 1000)
  const min = Math.floor(paceSecKm / 60)
  const sec = Math.round(paceSecKm % 60)
  return `${min}:${String(sec).padStart(2, "0")}`
}

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 60) return `há ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `há ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return "ontem"
  if (diffD < 7) return `há ${diffD} dias`
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

export function LastActivityCard({
  activity,
  className,
}: {
  activity: StravaActivity
  className?: string
}) {
  const distKm = (activity.distance / 1000).toFixed(1)
  const movingTime = formatDuration(activity.moving_time)
  const elevation = Math.round(activity.total_elevation_gain)
  const pace = formatPace(activity.moving_time, activity.distance)
  const efficiencyPct = Math.round(
    (activity.moving_time / Math.max(activity.elapsed_time, 1)) * 100
  )
  const relDate = timeAgo(activity.start_date_local ?? activity.start_date)

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-slate-100/60 bg-white shadow-none",
        "transition-shadow hover:shadow-sm cursor-pointer",
        className
      )}
    >
      {/* Subtle radial glow behind the header area */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "radial-gradient(ellipse 90% 120% at 50% 0%, rgba(232,69,10,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative p-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Footprints className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-sm font-semibold">
              Última Corrida Registrada
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500">{relDate}</span>
            <ChevronRight
              className="size-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          </div>
        </div>

        <p className="mt-1.5 truncate text-xs text-muted-foreground">
          {activity.name}
        </p>

        {/* KPI grid */}
        <div className="mt-7 grid grid-cols-3 gap-4 sm:gap-6">
          {/* Distance — hero metric, largest font */}
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[2.5rem] font-bold leading-none tracking-tight tabular-nums">
                {distKm}
              </span>
              <span className="font-mono text-sm font-semibold text-slate-400">
                km
              </span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Distância Total
            </p>
          </div>

          {/* Moving time */}
          <div className="space-y-1.5">
            <span className="block font-mono text-3xl font-bold leading-none tracking-tight tabular-nums">
              {movingTime}
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Tempo em Movimento
            </p>
          </div>

          {/* Elevation */}
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-bold leading-none tracking-tight tabular-nums">
                {elevation}
              </span>
              <span className="font-mono text-sm font-semibold text-slate-400">
                m
              </span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Elevação
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-slate-100" />

        {/* Performance Spark */}
        <div className="mb-2.5 flex items-center gap-1.5">
          <Zap className="size-3 text-primary" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Performance Spark
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="space-y-0.5">
            <p className="font-mono text-sm font-semibold tabular-nums">
              {pace}{" "}
              <span className="text-xs font-normal text-slate-400">/km</span>
            </p>
            <p className="text-[11px] text-slate-500">Pace Médio</p>
          </div>
          <div className="h-6 w-px bg-slate-100" aria-hidden />
          <div className="space-y-0.5">
            <p className="font-mono text-sm font-semibold tabular-nums">
              {efficiencyPct}%
            </p>
            <p className="text-[11px] text-slate-500">Em Movimento</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
