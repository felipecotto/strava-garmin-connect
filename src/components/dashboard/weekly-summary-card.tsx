import { TrendingUp } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { StravaActivity } from "@/lib/strava/types"

// ─── helpers ─────────────────────────────────────────────────────────────────

type DayBucket = {
  label: string
  shortLabel: string
  km: number
  isToday: boolean
}

function getLast7DaysBuckets(runs: StravaActivity[]): DayBucket[] {
  const now = new Date()
  const buckets: DayBucket[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    const dateStr = d.toISOString().slice(0, 10) // "2026-04-29"

    const fullLabel = d.toLocaleDateString("pt-BR", { weekday: "long" })
    const shortLabel = d
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "")
      .slice(0, 3)

    const km = runs
      .filter((r) => r.start_date.slice(0, 10) === dateStr)
      .reduce((sum, r) => sum + r.distance / 1000, 0)

    buckets.push({
      label: fullLabel,
      shortLabel,
      km: Math.round(km * 10) / 10,
      isToday: i === 0,
    })
  }

  return buckets
}

// ─── component ───────────────────────────────────────────────────────────────

export function WeeklySummaryCard({
  runs,
  goalKm = 60,
  className,
}: {
  runs: StravaActivity[]
  goalKm?: number
  className?: string
}) {
  const buckets = getLast7DaysBuckets(runs)
  const totalKm = Math.round(buckets.reduce((s, b) => s + b.km, 0) * 10) / 10
  const maxDayKm = Math.max(...buckets.map((b) => b.km), 1)
  const progressPct = Math.min(Math.round((totalKm / goalKm) * 100), 100)
  const remaining = Math.max(goalKm - totalKm, 0)

  return (
    <Card
      className={cn("border-border/80 bg-white shadow-none", className)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-sky-500" aria-hidden />
            <span className="text-sm font-semibold">Carga Semanal</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              <span className="font-mono text-base font-bold text-foreground tabular-nums">
                {totalKm}
              </span>
              {" "}
              <span className="font-mono text-muted-foreground">
                / {goalKm} km
              </span>
            </p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5" style={{ height: "88px" }}>
          {buckets.map((b, i) => {
            const heightPct =
              b.km > 0 ? Math.max((b.km / maxDayKm) * 100, 10) : 4
            return (
              <div
                key={i}
                className="group/bar relative flex flex-1 flex-col items-center"
                style={{ height: "88px" }}
                title={`${b.label}: ${b.km > 0 ? b.km + " km" : "Descanso"}`}
              >
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all",
                      b.km > 0
                        ? b.isToday
                          ? "bg-sky-500"
                          : "bg-sky-400/70"
                        : "bg-slate-100"
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                {/* Tooltip on hover */}
                {b.km > 0 ? (
                  <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover/bar:opacity-100">
                    {b.km} km
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>

        {/* Day labels */}
        <div className="mt-2 flex gap-1.5">
          {buckets.map((b, i) => (
            <div key={i} className="flex flex-1 justify-center">
              <span
                className={cn(
                  "text-[11px] capitalize",
                  b.isToday
                    ? "font-semibold text-sky-600"
                    : "text-muted-foreground"
                )}
              >
                {b.shortLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Progress toward weekly goal */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Meta Semanal
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-500">
              {progressPct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            {remaining > 0
              ? `Faltam ${remaining.toFixed(1)} km para ${goalKm} km — meta de maratona.`
              : "Meta semanal atingida!"}
          </p>
        </div>
      </div>
    </Card>
  )
}
