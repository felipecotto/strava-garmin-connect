import type { Database } from "@/lib/supabase/types"

export type ActivityRow = Database["public"]["Tables"]["activities"]["Row"]

export const RUN_SPORT_TYPES = new Set([
  "Run",
  "TrailRun",
  "VirtualRun",
])

export function isRunActivity(sportType: string): boolean {
  return RUN_SPORT_TYPES.has(sportType)
}

export type ProfileStats = {
  totalRuns: number
  totalDistanceM: number
  totalMovingTimeS: number
  totalElevationM: number
  ytdDistanceM: number
  ytdRuns: number
  last30dDistanceM: number
  last30dRuns: number
  currentStreakDays: number
  longestStreakDays: number
  lastActivityAt: string | null
}

export type PersonalRecord = {
  key: string
  label: string
  distanceM: number
  movingTimeS: number
  activityId: number
  achievedAt: string
  name: string
}

export const PR_TARGETS = [
  { key: "5k", label: "5K", meters: 5000, tolerance: 0.02 },
  { key: "10k", label: "10K", meters: 10_000, tolerance: 0.02 },
  { key: "half", label: "Meia", meters: 21_097.5, tolerance: 0.02 },
  { key: "marathon", label: "Maratona", meters: 42_195, tolerance: 0.02 },
] as const

export const PR_LABEL_BY_KEY: Record<string, string> = Object.fromEntries(
  PR_TARGETS.map((t) => [t.key, t.label])
)

export type MonthlyVolumePoint = {
  month: string
  label: string
  distanceKm: number
  runs: number
}

function localDayKey(iso: string): string {
  // start_date_local arrives as timestamptz string; take calendar date portion
  return iso.slice(0, 10)
}

function computeStreaks(runDayKeys: string[]): {
  current: number
  longest: number
} {
  const unique = [...new Set(runDayKeys)].sort()
  if (unique.length === 0) {
    return { current: 0, longest: 0 }
  }

  let longest = 1
  let streak = 1
  for (let i = 1; i < unique.length; i += 1) {
    const prev = new Date(`${unique[i - 1]}T12:00:00Z`)
    const curr = new Date(`${unique[i]}T12:00:00Z`)
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000)
    )
    if (diffDays === 1) {
      streak += 1
      longest = Math.max(longest, streak)
    } else {
      streak = 1
    }
  }

  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)
  const yesterday = new Date(today)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yesterdayKey = yesterday.toISOString().slice(0, 10)

  const lastDay = unique[unique.length - 1]
  if (lastDay !== todayKey && lastDay !== yesterdayKey) {
    return { current: 0, longest: longest }
  }

  let current = 1
  for (let i = unique.length - 1; i > 0; i -= 1) {
    const prev = new Date(`${unique[i - 1]}T12:00:00Z`)
    const curr = new Date(`${unique[i]}T12:00:00Z`)
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000)
    )
    if (diffDays === 1) {
      current += 1
    } else {
      break
    }
  }

  return { current, longest }
}

export function computeProfileStats(activities: ActivityRow[]): ProfileStats {
  const runs = activities.filter((a) => isRunActivity(a.sport_type))
  const now = new Date()
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  let totalDistanceM = 0
  let totalMovingTimeS = 0
  let totalElevationM = 0
  let ytdDistanceM = 0
  let ytdRuns = 0
  let last30dDistanceM = 0
  let last30dRuns = 0
  let lastActivityAt: string | null = null

  for (const run of runs) {
    const start = new Date(run.start_date)
    totalDistanceM += Number(run.distance_m)
    totalMovingTimeS += run.moving_time_s
    totalElevationM += Number(run.total_elevation_gain_m ?? 0)

    if (start >= yearStart) {
      ytdDistanceM += Number(run.distance_m)
      ytdRuns += 1
    }
    if (start >= thirtyDaysAgo) {
      last30dDistanceM += Number(run.distance_m)
      last30dRuns += 1
    }
    if (!lastActivityAt || run.start_date > lastActivityAt) {
      lastActivityAt = run.start_date
    }
  }

  const { current, longest } = computeStreaks(
    runs.map((r) => localDayKey(r.start_date_local))
  )

  return {
    totalRuns: runs.length,
    totalDistanceM,
    totalMovingTimeS,
    totalElevationM,
    ytdDistanceM,
    ytdRuns,
    last30dDistanceM,
    last30dRuns,
    currentStreakDays: current,
    longestStreakDays: longest,
    lastActivityAt,
  }
}

/** Volume mensal das corridas — últimos `months` meses (inclui mês atual). */
export function computeMonthlyVolume(
  activities: ActivityRow[],
  months = 12
): MonthlyVolumePoint[] {
  const runs = activities.filter((a) => isRunActivity(a.sport_type))
  const now = new Date()
  const buckets = new Map<string, { distanceM: number; runs: number }>()

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
    buckets.set(key, { distanceM: 0, runs: 0 })
  }

  for (const run of runs) {
    const start = new Date(run.start_date)
    const key = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}`
    const bucket = buckets.get(key)
    if (!bucket) continue
    bucket.distanceM += Number(run.distance_m)
    bucket.runs += 1
  }

  return [...buckets.entries()].map(([month, bucket]) => {
    const [year, mon] = month.split("-")
    const labelDate = new Date(Date.UTC(Number(year), Number(mon) - 1, 1))
    return {
      month,
      label: labelDate.toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      distanceKm: Math.round((bucket.distanceM / 1000) * 10) / 10,
      runs: bucket.runs,
    }
  })
}

export function computePersonalRecords(
  activities: ActivityRow[]
): PersonalRecord[] {
  const runs = activities.filter((a) => isRunActivity(a.sport_type))
  const records: PersonalRecord[] = []

  for (const target of PR_TARGETS) {
    const min = target.meters * (1 - target.tolerance)
    const max = target.meters * (1 + target.tolerance)
    let best: ActivityRow | null = null

    for (const run of runs) {
      const distance = Number(run.distance_m)
      if (distance < min || distance > max) continue
      if (!best || run.moving_time_s < best.moving_time_s) {
        best = run
      }
    }

    if (best) {
      records.push({
        key: target.key,
        label: target.label,
        distanceM: Number(best.distance_m),
        movingTimeS: best.moving_time_s,
        activityId: best.id,
        achievedAt: best.start_date_local,
        name: best.name,
      })
    }
  }

  return records
}

export function formatKm(meters: number, digits = 1): string {
  return (meters / 1000).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatDuration(totalSec: number): string {
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = Math.floor(totalSec % 60)
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`
  }
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`
}

export function formatRaceTime(totalSec: number): string {
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = Math.floor(totalSec % 60)
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

export function formatPace(distanceM: number, movingTimeS: number): string {
  if (distanceM <= 0 || movingTimeS <= 0) return "—"
  const paceSec = movingTimeS / (distanceM / 1000)
  const minutes = Math.floor(paceSec / 60)
  const seconds = Math.round(paceSec % 60)
  return `${minutes}:${String(seconds).padStart(2, "0")}/km`
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
