import { metersToKm, paceSecPerKm, roundTo } from "@/lib/archive/activity"
import {
  eachMonth,
  eachWeekStart,
  localDayKey,
  monthKey,
  weekStartOf,
} from "@/lib/archive/dates"
import type {
  ArchiveActivity,
  ArchiveMonth,
  ArchiveTotals,
  ArchiveWeek,
  ArchiveYear,
} from "@/lib/archive/types"

function firstRunDay(runs: ArchiveActivity[]): string | null {
  let first: string | null = null
  for (const run of runs) {
    const day = localDayKey(run.start_date_local)
    if (!first || day < first) first = day
  }
  return first
}

export function computeTotals(runs: ArchiveActivity[]): ArchiveTotals {
  let distanceM = 0
  let movingSec = 0
  let elevationM = 0
  for (const run of runs) {
    distanceM += Number(run.distance_m)
    movingSec += run.moving_time_s
    elevationM += Number(run.total_elevation_gain_m ?? 0)
  }
  const first = firstRunDay(runs)
  return {
    runs: runs.length,
    km: metersToKm(distanceM),
    hours: roundTo(movingSec / 3600, 1),
    elevationM: Math.round(elevationM),
    firstRunYear: first ? Number(first.slice(0, 4)) : null,
  }
}

/** Soma de metros por semana (segunda-feira ISO), sem preencher buracos. */
export function sumMetersByWeek(runs: ArchiveActivity[]): Map<string, number> {
  const byWeek = new Map<string, number>()
  for (const run of runs) {
    const week = weekStartOf(localDayKey(run.start_date_local))
    byWeek.set(week, (byWeek.get(week) ?? 0) + Number(run.distance_m))
  }
  return byWeek
}

/**
 * Uma entrada por semana, de `since` (ou da 1ª corrida, se for depois) até hoje.
 * Semanas sem corrida entram com 0 km.
 */
export function computeWeeks(
  runs: ArchiveActivity[],
  options: {
    since: string
    today: string
    raceLabelByWeek?: Map<string, string>
  }
): ArchiveWeek[] {
  const first = firstRunDay(runs)
  if (!first) return []

  const start = first > options.since ? first : options.since
  const metersByWeek = sumMetersByWeek(runs)

  return eachWeekStart(start, options.today).map((weekStart) => {
    const race = options.raceLabelByWeek?.get(weekStart)
    const week: ArchiveWeek = {
      weekStart,
      km: metersToKm(metersByWeek.get(weekStart) ?? 0),
    }
    if (race) week.race = race
    return week
  })
}

/** Uma entrada por mês, da 1ª corrida até o mês de hoje. */
export function computeMonths(
  runs: ArchiveActivity[],
  today: string
): ArchiveMonth[] {
  const first = firstRunDay(runs)
  if (!first) return []

  const byMonth = new Map<string, { meters: number; runs: number; movingSec: number }>()
  for (const run of runs) {
    const month = monthKey(localDayKey(run.start_date_local))
    const bucket = byMonth.get(month) ?? { meters: 0, runs: 0, movingSec: 0 }
    bucket.meters += Number(run.distance_m)
    bucket.runs += 1
    bucket.movingSec += run.moving_time_s
    byMonth.set(month, bucket)
  }

  return eachMonth(monthKey(first), monthKey(today)).map((month) => {
    const bucket = byMonth.get(month)
    return {
      month,
      km: metersToKm(bucket?.meters ?? 0),
      runs: bucket?.runs ?? 0,
      movingSec: bucket?.movingSec ?? 0,
    }
  })
}

export function computeYears(runs: ArchiveActivity[]): ArchiveYear[] {
  const byYear = new Map<
    number,
    { meters: number; movingSec: number; runs: number; longestM: number }
  >()
  for (const run of runs) {
    const year = Number(localDayKey(run.start_date_local).slice(0, 4))
    const bucket = byYear.get(year) ?? {
      meters: 0,
      movingSec: 0,
      runs: 0,
      longestM: 0,
    }
    const distance = Number(run.distance_m)
    bucket.meters += distance
    bucket.movingSec += run.moving_time_s
    bucket.runs += 1
    bucket.longestM = Math.max(bucket.longestM, distance)
    byYear.set(year, bucket)
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, bucket]) => ({
      year,
      km: metersToKm(bucket.meters),
      runs: bucket.runs,
      paceSecPerKm: Math.round(paceSecPerKm(bucket.meters, bucket.movingSec)),
      longestKm: metersToKm(bucket.longestM),
    }))
}
