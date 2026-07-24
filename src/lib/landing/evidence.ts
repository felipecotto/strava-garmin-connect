import type { ActivityRow } from "@/lib/profile/stats"
import { isRunActivity } from "@/lib/profile/stats"

export type PacePoint = {
  index: number
  label: string
  paceMin: number
  distanceKm: number
  date: string
}

export type HeatmapDay = {
  date: string
  km: number
  level: 0 | 1 | 2 | 3 | 4
}

export type WeeklyVolumePoint = {
  week: string
  label: string
  km: number
}

function paceMinutes(distanceM: number, movingTimeS: number): number | null {
  if (distanceM < 1000 || movingTimeS <= 0) return null
  return movingTimeS / 60 / (distanceM / 1000)
}

/** Últimas N corridas — pace médio (min/km) ao longo do tempo. */
export function computePaceSeries(
  activities: ActivityRow[],
  limit = 24
): PacePoint[] {
  const runs = activities
    .filter((a) => isRunActivity(a.sport_type))
    .slice()
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )

  const recent = runs.slice(-limit)
  const points: PacePoint[] = []

  for (let i = 0; i < recent.length; i += 1) {
    const run = recent[i]
    const pace = paceMinutes(Number(run.distance_m), run.moving_time_s)
    if (pace == null || pace < 2.5 || pace > 12) continue
    points.push({
      index: i + 1,
      label: String(i + 1),
      paceMin: Math.round(pace * 100) / 100,
      distanceKm: Math.round((Number(run.distance_m) / 1000) * 10) / 10,
      date: run.start_date_local.slice(0, 10),
    })
  }

  return points
}

/** Heatmap diário — últimas `weeks` semanas (UTC). */
export function computeActivityHeatmap(
  activities: ActivityRow[],
  weeks = 16
): HeatmapDay[] {
  const runs = activities.filter((a) => isRunActivity(a.sport_type))
  const byDay = new Map<string, number>()

  for (const run of runs) {
    const key = run.start_date_local.slice(0, 10)
    byDay.set(key, (byDay.get(key) ?? 0) + Number(run.distance_m) / 1000)
  }

  const today = new Date()
  today.setUTCHours(12, 0, 0, 0)
  const start = new Date(today)
  start.setUTCDate(start.getUTCDate() - (weeks * 7 - 1))

  const days: HeatmapDay[] = []
  const cursor = new Date(start)

  while (cursor <= today) {
    const key = cursor.toISOString().slice(0, 10)
    const km = byDay.get(key) ?? 0
    let level: HeatmapDay["level"] = 0
    if (km > 0 && km < 5) level = 1
    else if (km >= 5 && km < 10) level = 2
    else if (km >= 10 && km < 16) level = 3
    else if (km >= 16) level = 4

    days.push({ date: key, km: Math.round(km * 10) / 10, level })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return days
}

/** Volume semanal — últimas N semanas. */
export function computeWeeklyVolume(
  activities: ActivityRow[],
  weeks = 12
): WeeklyVolumePoint[] {
  const runs = activities.filter((a) => isRunActivity(a.sport_type))
  const today = new Date()
  const buckets: WeeklyVolumePoint[] = []

  for (let i = weeks - 1; i >= 0; i -= 1) {
    const end = new Date(today)
    end.setUTCDate(end.getUTCDate() - i * 7)
    end.setUTCHours(23, 59, 59, 999)
    const start = new Date(end)
    start.setUTCDate(start.getUTCDate() - 6)
    start.setUTCHours(0, 0, 0, 0)

    let km = 0
    for (const run of runs) {
      const t = new Date(run.start_date).getTime()
      if (t >= start.getTime() && t <= end.getTime()) {
        km += Number(run.distance_m) / 1000
      }
    }

    const label = `${String(start.getUTCDate()).padStart(2, "0")}/${String(start.getUTCMonth() + 1).padStart(2, "0")}`
    buckets.push({
      week: start.toISOString().slice(0, 10),
      label,
      km: Math.round(km * 10) / 10,
    })
  }

  return buckets
}
