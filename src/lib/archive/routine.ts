import { metersToKm } from "@/lib/archive/activity"
import {
  addDays,
  localDayKey,
  localHour,
  weekdayIndex,
} from "@/lib/archive/dates"
import type { ArchiveActivity, Weekday } from "@/lib/archive/types"

export const WEEKDAYS: Weekday[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"]

/** 53 semanas × 7 dias: o calendário cobre um ano completo alinhado por semana. */
export const DAILY_WINDOW_DAYS = 371

const EARLY_START_HOUR = 6
const EARLY_END_HOUR = 7

export function computeHours(runs: ArchiveActivity[]): number[] {
  const hours = Array.from({ length: 24 }, () => 0)
  for (const run of runs) {
    hours[localHour(run.start_date_local)] += 1
  }
  return hours
}

export function computeWeekdays(
  runs: ArchiveActivity[]
): { day: Weekday; km: number; runs: number }[] {
  const buckets = WEEKDAYS.map(() => ({ meters: 0, runs: 0 }))
  for (const run of runs) {
    const bucket = buckets[weekdayIndex(localDayKey(run.start_date_local))]
    bucket.meters += Number(run.distance_m)
    bucket.runs += 1
  }
  return WEEKDAYS.map((day, index) => ({
    day,
    km: metersToKm(buckets[index].meters),
    runs: buckets[index].runs,
  }))
}

/**
 * Km por dia nos últimos 371 dias (até hoje), com zero nos dias sem corrida.
 * Soma em metros e converte uma vez, para dias com mais de uma corrida.
 */
export function computeDaily(
  runs: ArchiveActivity[],
  today: string
): Record<string, number> {
  const firstDay = addDays(today, -(DAILY_WINDOW_DAYS - 1))
  const metersByDay = new Map<string, number>()
  for (const run of runs) {
    const day = localDayKey(run.start_date_local)
    if (day < firstDay || day > today) continue
    metersByDay.set(day, (metersByDay.get(day) ?? 0) + Number(run.distance_m))
  }

  const daily: Record<string, number> = {}
  for (let day = firstDay; day <= today; day = addDays(day, 1)) {
    daily[day] = metersToKm(metersByDay.get(day) ?? 0)
  }
  return daily
}

/** Fração das corridas que começam entre 6h00 e 7h59. */
export function computeEarlyShare(hours: number[]): number {
  const total = hours.reduce((sum, count) => sum + count, 0)
  if (total === 0) return 0
  let early = 0
  for (let hour = EARLY_START_HOUR; hour <= EARLY_END_HOUR; hour += 1) {
    early += hours[hour]
  }
  return early / total
}

/** Fração do volume corrido no sábado. */
export function computeSaturdayShare(
  weekdays: { day: Weekday; km: number }[]
): number {
  const total = weekdays.reduce((sum, entry) => sum + entry.km, 0)
  if (total === 0) return 0
  const saturday = weekdays.find((entry) => entry.day === "sab")?.km ?? 0
  return saturday / total
}
