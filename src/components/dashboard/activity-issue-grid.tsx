import { BarChart3, Clock3, Gauge, Route } from "lucide-react"

import type { StravaActivity } from "@/lib/strava/types"

function formatDate(iso: string) {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) {
    return "Data indisponível"
  }
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

function formatDuration(seconds: number) {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, "0")}m`
  }
  return `${m}m`
}

function formatPace(distanceM: number, movingTimeSec: number) {
  if (distanceM <= 0 || movingTimeSec <= 0) {
    return "—"
  }
  const paceSecKm = movingTimeSec / (distanceM / 1000)
  const min = Math.floor(paceSecKm / 60)
  const sec = Math.round(paceSecKm % 60)
  return `${min}:${String(sec).padStart(2, "0")} /km`
}

function distanceKm(distanceM: number) {
  return (distanceM / 1000).toFixed(1)
}

export function ActivityIssueGrid({ runs }: { runs: StravaActivity[] }) {
  const maxDistance = Math.max(...runs.map((run) => run.distance), 1)

  return (
    <section className="mt-14" aria-labelledby="activities-heading">
      <div className="mb-6 max-w-2xl space-y-2">
        <h2 id="activities-heading" className="text-xl font-semibold tracking-tight">
          Atividades
        </h2>
        <p className="text-sm text-muted-foreground">
          Grid compacta estilo issue list para leitura rápida de ritmo, distância
          e duração.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border/70 bg-card/50 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="size-3.5 text-primary" aria-hidden />
            Distância por atividade (recorte atual)
          </div>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
            {runs.map((run) => {
              const normalized = Math.max((run.distance / maxDistance) * 100, 8)
              return (
                <div key={`bar-${run.id}`} className="space-y-1">
                  <div className="h-24 rounded-md bg-muted/70 p-1">
                    <div
                      className="h-full rounded-sm bg-primary/20"
                      style={{ paddingTop: `${100 - normalized}%` }}
                    >
                      <div className="h-full rounded-sm bg-primary" />
                    </div>
                  </div>
                  <p className="truncate text-center text-[11px] text-muted-foreground">
                    {formatDate(run.start_date_local ?? run.start_date)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/70">
          <div className="grid grid-cols-[minmax(0,1.2fr)_auto_auto_auto] items-center gap-3 border-b border-border/70 bg-card/60 px-3 py-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
            <span>Atividade</span>
            <span className="text-right">Pace</span>
            <span className="text-right">Distância</span>
            <span className="text-right">Tempo</span>
          </div>

          <div className="divide-y divide-border/60 bg-card/40">
            {runs.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                Sem corridas no período atual.
              </div>
            ) : (
              runs.map((run) => (
                <div
                  key={run.id}
                  className="grid grid-cols-[minmax(0,1.2fr)_auto_auto_auto] items-center gap-3 px-3 py-3 text-sm sm:px-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{run.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(run.start_date_local ?? run.start_date)}
                    </p>
                  </div>

                  <p className="inline-flex items-center justify-end gap-1.5 text-xs font-medium text-foreground">
                    <Gauge className="size-3.5 text-primary" aria-hidden />
                    <span className="tabular-nums">{formatPace(run.distance, run.moving_time)}</span>
                  </p>

                  <p className="inline-flex items-center justify-end gap-1.5 text-sm font-semibold text-primary">
                    <Route className="size-3.5" aria-hidden />
                    <span className="tabular-nums">{distanceKm(run.distance)} km</span>
                  </p>

                  <p className="inline-flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" aria-hidden />
                    <span className="tabular-nums">{formatDuration(run.moving_time)}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
