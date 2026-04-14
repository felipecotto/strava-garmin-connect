import type { StravaActivity } from "@/lib/strava/types"

const RUN = "Run"

export type PeriodStats = {
  distanceM: number
  movingTimeSec: number
  elevationM: number
  runCount: number
}

export type WeeklyBlock = {
  label: string
  afterSec: number
  beforeSec: number
  stats: PeriodStats
  runs: StravaActivity[]
}

export type DashboardInsight = {
  id: string
  title: string
  body: string
  tone: "positive" | "neutral" | "tip"
}

/** Janelas de 7 dias (atual = últimos 7 dias; anterior = 7 dias antes). */
export function getRollingWindows(): {
  current: { afterSec: number; beforeSec: number }
  previous: { afterSec: number; beforeSec: number }
} {
  const beforeSec = Math.floor(Date.now() / 1000)
  const weekSec = 7 * 24 * 60 * 60
  const currentAfter = beforeSec - weekSec
  const previousBefore = currentAfter
  const previousAfter = previousBefore - weekSec
  return {
    current: { afterSec: currentAfter, beforeSec },
    previous: { afterSec: previousAfter, beforeSec: previousBefore },
  }
}

function activityTimestamp(a: StravaActivity): number {
  return Math.floor(new Date(a.start_date).getTime() / 1000)
}

function inRange(
  t: number,
  afterSec: number,
  beforeSec: number
): boolean {
  return t >= afterSec && t <= beforeSec
}

export function filterRunsInWindow(
  activities: StravaActivity[],
  afterSec: number,
  beforeSec: number
): StravaActivity[] {
  return activities.filter((a) => {
    if (a.type !== RUN) {
      return false
    }
    const t = activityTimestamp(a)
    return inRange(t, afterSec, beforeSec)
  })
}

export function summarizeRuns(runs: StravaActivity[]): PeriodStats {
  let distanceM = 0
  let movingTimeSec = 0
  let elevationM = 0
  for (const r of runs) {
    distanceM += r.distance ?? 0
    movingTimeSec += r.moving_time ?? 0
    elevationM += r.total_elevation_gain ?? 0
  }
  return {
    distanceM,
    movingTimeSec,
    elevationM,
    runCount: runs.length,
  }
}

export function buildInsights(
  current: PeriodStats,
  previous: PeriodStats
): DashboardInsight[] {
  const insights: DashboardInsight[] = []

  const curKm = current.distanceM / 1000
  const prevKm = previous.distanceM / 1000

  if (current.runCount === 0) {
    insights.push({
      id: "no-runs",
      title: "Nenhuma corrida no período",
      body: "Não há atividades classificadas como corrida nos últimos 7 dias. Caminhadas e outros esportes não entram neste resumo.",
      tone: "neutral",
    })
    return insights
  }

  if (prevKm > 0) {
    const delta = ((curKm - prevKm) / prevKm) * 100
    const rounded = Math.round(delta * 10) / 10
    if (Math.abs(rounded) < 3) {
      insights.push({
        id: "volume-stable",
        title: "Volume semelhante à semana anterior",
        body: `Distância de corrida está estável em relação aos 7 dias anteriores (~${Math.abs(rounded)}% de variação).`,
        tone: "positive",
      })
    } else if (rounded > 0) {
      insights.push({
        id: "volume-up",
        title: "Volume de corrida aumentou",
        body: `Subiu cerca de ${rounded}% vs. os 7 dias anteriores. Acompanhe fadiga e sono ao aumentar carga.`,
        tone: "neutral",
      })
    } else {
      insights.push({
        id: "volume-down",
        title: "Volume de corrida reduziu",
        body: `Recuou cerca de ${Math.abs(rounded)}% vs. os 7 dias anteriores — pode ser descarga, viagem ou necessidade de recuperação.`,
        tone: "tip",
      })
    }
  } else {
    insights.push({
      id: "no-baseline",
      title: "Primeira base no período comparado",
      body: "Não havia corridas registradas na janela anterior; use este número como referência nas próximas semanas.",
      tone: "neutral",
    })
  }

  const paceCurrent =
    current.distanceM > 0 && current.movingTimeSec > 0
      ? current.movingTimeSec / 60 / (current.distanceM / 1000)
      : null
  const pacePrev =
    previous.distanceM > 0 && previous.movingTimeSec > 0
      ? previous.movingTimeSec / 60 / (previous.distanceM / 1000)
      : null

  if (paceCurrent !== null && pacePrev !== null && current.runCount >= 2) {
    const diff = paceCurrent - pacePrev
    if (Math.abs(diff) >= 0.15) {
      insights.push({
        id: "pace",
        title: diff < 0 ? "Ritmo médio mais rápido" : "Ritmo médio mais conservador",
        body:
          diff < 0
            ? `Pace médio ponderado ~${Math.abs(diff).toFixed(1)} min/km mais rápido que na janela anterior (agregado de todas as corridas).`
            : `Pace médio ponderado ~${diff.toFixed(1)} min/km mais lento — pode indicar cansaço, calor ou terreno.`,
        tone: diff < 0 ? "positive" : "tip",
      })
    }
  }

  insights.push({
    id: "sessions",
    title: `${current.runCount} sessões de corrida`,
    body: "Contagem considera apenas tipo “Run” no Strava. Ajuste se usar relógio com outro tipo de atividade.",
    tone: "neutral",
  })

  return insights.slice(0, 3)
}
