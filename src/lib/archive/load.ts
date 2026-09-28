import { roundTo } from "@/lib/archive/activity"
import {
  addDays,
  localDayKey,
  weekStartOf,
} from "@/lib/archive/dates"
import type {
  ArchiveActivity,
  ArchiveLoadPoint,
  ArchivePause,
} from "@/lib/archive/types"

export const HR_REST = 50
export const DEFAULT_HR_MAX = 190
const HR_MAX_PERCENTILE = 0.98
/** Carga por minuto estimada quando a atividade não tem frequência cardíaca. */
const LOAD_PER_MINUTE_WITHOUT_HR = 0.8
const FITNESS_DAYS = 42
const FATIGUE_DAYS = 7
/** Semanas seguidas sem carga que caracterizam uma pausa. */
const MIN_PAUSE_WEEKS = 2

/** FC máxima do atleta: percentil 98 de `max_heartrate`. */
export function estimateHrMax(activities: ArchiveActivity[]): number {
  const values = activities
    .map((activity) => Number(activity.max_heartrate ?? 0))
    .filter((value) => value > HR_REST)
    .sort((a, b) => a - b)

  if (values.length === 0) return DEFAULT_HR_MAX

  const index = Math.min(
    values.length - 1,
    Math.ceil(HR_MAX_PERCENTILE * values.length) - 1
  )
  return values[index]
}

/** TRIMP de Banister; sem FC, estima pela duração. */
export function trimp(
  movingSec: number,
  averageHeartrate: number | null,
  hrMax: number
): number {
  const minutes = movingSec / 60
  const hasHeartrate = averageHeartrate !== null && averageHeartrate > 0
  if (!hasHeartrate || hrMax <= HR_REST) {
    return minutes * LOAD_PER_MINUTE_WITHOUT_HR
  }

  const hrr = Math.min(
    1,
    Math.max(0, (averageHeartrate - HR_REST) / (hrMax - HR_REST))
  )
  return minutes * hrr * 0.64 * Math.exp(1.92 * hrr)
}

/** Carga diária somando todas as atividades (corrida, pedal, musculação…). */
export function dailyLoad(activities: ArchiveActivity[]): Map<string, number> {
  const hrMax = estimateHrMax(activities)
  const byDay = new Map<string, number>()
  for (const activity of activities) {
    const day = localDayKey(activity.start_date_local)
    const load = trimp(
      activity.moving_time_s,
      activity.average_heartrate === null
        ? null
        : Number(activity.average_heartrate),
      hrMax
    )
    byDay.set(day, (byDay.get(day) ?? 0) + load)
  }
  return byDay
}

/**
 * Forma (média exponencial de 42 dias) e fadiga (7 dias), calculadas dia a dia
 * desde a primeira atividade. Guarda o valor do último dia de cada semana a partir de `since`.
 */
export function computeLoad(
  activities: ArchiveActivity[],
  options: { since: string; today: string }
): ArchiveLoadPoint[] {
  const loadByDay = dailyLoad(activities)
  if (loadByDay.size === 0) return []

  const firstDay = [...loadByDay.keys()].sort()[0]
  const firstWeek = weekStartOf(options.since > firstDay ? options.since : firstDay)

  let fitness = 0
  let fatigue = 0
  const pointByWeek = new Map<string, ArchiveLoadPoint>()

  for (let day = firstDay; day <= options.today; day = addDays(day, 1)) {
    const load = loadByDay.get(day) ?? 0
    fitness += (load - fitness) / FITNESS_DAYS
    fatigue += (load - fatigue) / FATIGUE_DAYS

    const weekStart = weekStartOf(day)
    if (weekStart >= firstWeek) {
      pointByWeek.set(weekStart, {
        weekStart,
        fitness: roundTo(fitness, 1),
        fatigue: roundTo(fatigue, 1),
      })
    }
  }

  return [...pointByWeek.values()]
}

/** Blocos de semanas seguidas com carga zero dentro do intervalo das semanas informadas. */
export function computePauses(
  activities: ArchiveActivity[],
  weekStarts: string[]
): ArchivePause[] {
  const activeWeeks = new Set(
    activities.map((activity) =>
      weekStartOf(localDayKey(activity.start_date_local))
    )
  )

  const pauses: ArchivePause[] = []
  let runStart: string | null = null
  let runLength = 0

  const closeRun = (lastWeek: string) => {
    if (runStart && runLength >= MIN_PAUSE_WEEKS) {
      pauses.push({ from: runStart, to: lastWeek, weeks: runLength })
    }
    runStart = null
    runLength = 0
  }

  weekStarts.forEach((week, index) => {
    if (activeWeeks.has(week)) {
      if (index > 0) closeRun(weekStarts[index - 1])
      return
    }
    runStart ??= week
    runLength += 1
  })
  if (weekStarts.length > 0) closeRun(weekStarts[weekStarts.length - 1])

  return pauses
}
