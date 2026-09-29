import { paceSecPerKm } from "@/lib/archive/activity"
import { localDayKey } from "@/lib/archive/dates"
import type {
  ArchiveActivity,
  ArchiveRecord,
  RecordKey,
} from "@/lib/archive/types"

export type RecordTarget = {
  key: RecordKey
  meters: number
  /** true: usa o tempo real da atividade; false: normaliza para a distância exata. */
  useActualTime: boolean
}

export const RECORD_TARGETS: RecordTarget[] = [
  { key: "5k", meters: 5000, useActualTime: false },
  { key: "10k", meters: 10_000, useActualTime: false },
  { key: "half", meters: 21_097.5, useActualTime: false },
  { key: "marathon", meters: 42_195, useActualTime: true },
]

/** Atividades com até 5% a mais que o alvo contam para o recorde. */
export const MAX_DISTANCE_RATIO = 1.05

/** Um esforço candidato a recorde numa distância-alvo. */
export type Effort = {
  activityId: number
  activityName: string
  date: string
  timeSec: number
  paceSecPerKm: number
  exact: boolean
}

/**
 * Fonte de esforços por alvo. Hoje vem do resumo da atividade;
 * quando `best_efforts` da atividade detalhada for sincronizado, basta outra fonte.
 */
export type EffortSource = (
  runs: ArchiveActivity[],
  target: RecordTarget
) => Effort[]

export const summaryEffortSource: EffortSource = (runs, target) => {
  const maxDistance = target.meters * MAX_DISTANCE_RATIO
  const efforts: Effort[] = []

  for (const run of runs) {
    const distanceM = Number(run.distance_m)
    if (distanceM < target.meters || distanceM > maxDistance) continue

    const pace = paceSecPerKm(distanceM, run.moving_time_s)
    if (pace <= 0) continue

    efforts.push({
      activityId: run.id,
      activityName: run.name,
      date: localDayKey(run.start_date_local),
      timeSec: target.useActualTime
        ? run.moving_time_s
        : Math.round((run.moving_time_s * target.meters) / distanceM),
      paceSecPerKm: pace,
      exact: target.useActualTime,
    })
  }

  return efforts
}

function recordFromEfforts(
  target: RecordTarget,
  efforts: Effort[]
): ArchiveRecord | null {
  if (efforts.length === 0) return null

  const chronological = [...efforts].sort((a, b) =>
    a.date.localeCompare(b.date)
  )
  const first = chronological[0]
  const best = chronological.reduce((winner, effort) =>
    effort.timeSec < winner.timeSec ? effort : winner
  )
  const previous = chronological
    .filter((effort) => effort.date < best.date)
    .reduce<Effort | null>(
      (winner, effort) =>
        !winner || effort.timeSec < winner.timeSec ? effort : winner,
      null
    )

  return {
    key: target.key,
    bestSec: best.timeSec,
    bestPace: Math.round(best.paceSecPerKm),
    date: best.date,
    activityId: best.activityId,
    activityName: best.activityName,
    firstPace: Math.round(first.paceSecPerKm),
    firstDate: first.date,
    previousBestSec: previous?.timeSec ?? null,
    previousDate: previous?.date ?? null,
    exact: best.exact,
  }
}

export function computeRecords(
  runs: ArchiveActivity[],
  effortSource: EffortSource = summaryEffortSource
): ArchiveRecord[] {
  return RECORD_TARGETS.map((target) =>
    recordFromEfforts(target, effortSource(runs, target))
  ).filter((record): record is ArchiveRecord => record !== null)
}
