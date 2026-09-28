import { metersToKm, onlyRuns } from "@/lib/archive/activity"
import { ianaTimeZone, todayKey } from "@/lib/archive/dates"
import { computeLoad, computePauses } from "@/lib/archive/load"
import {
  computeBuildUp,
  detectRaces,
  raceLabelByWeek,
} from "@/lib/archive/races"
import { computeRecords } from "@/lib/archive/records"
import {
  computeDaily,
  computeEarlyShare,
  computeHours,
  computeSaturdayShare,
  computeWeekdays,
} from "@/lib/archive/routine"
import { computeStreaks } from "@/lib/archive/streaks"
import type {
  ArchiveActivity,
  ArchiveData,
  ArchiveHighlights,
  ArchiveMonth,
} from "@/lib/archive/types"
import {
  computeMonths,
  computeTotals,
  computeWeeks,
  computeYears,
  sumMetersByWeek,
} from "@/lib/archive/volume"

/** Início da faixa semanal e da curva de forma (ou a 1ª corrida, se for depois). */
export const WEEKS_SINCE = "2023-01-01"

function latestTimeZone(activities: ArchiveActivity[]): string | null {
  let latest: ArchiveActivity | null = null
  for (const activity of activities) {
    if (!activity.timezone) continue
    if (!latest || activity.start_date_local > latest.start_date_local) {
      latest = activity
    }
  }
  return ianaTimeZone(latest?.timezone ?? null)
}

function computePeaks(
  runs: ArchiveActivity[],
  months: ArchiveMonth[]
): Pick<ArchiveHighlights, "peakWeek" | "peakMonth"> {
  let peakWeek: ArchiveHighlights["peakWeek"] = null
  for (const [weekStart, meters] of sumMetersByWeek(runs)) {
    const km = metersToKm(meters)
    if (!peakWeek || km > peakWeek.km) peakWeek = { weekStart, km }
  }

  const peakMonth = months.reduce<ArchiveHighlights["peakMonth"]>(
    (peak, month) =>
      month.km > 0 && (!peak || month.km > peak.km)
        ? { month: month.month, km: month.km }
        : peak,
    null
  )

  return { peakWeek, peakMonth }
}

/** Monta a edição completa a partir de todas as atividades do atleta. */
export function buildArchive(
  activities: ArchiveActivity[],
  now: Date
): ArchiveData {
  const today = todayKey(now, latestTimeZone(activities))
  const runs = onlyRuns(activities)

  const metersByWeek = sumMetersByWeek(runs)
  const races = detectRaces(runs).map((race) => ({
    ...race,
    buildUp: computeBuildUp(race, runs, metersByWeek),
  }))
  const weeks = computeWeeks(runs, {
    since: WEEKS_SINCE,
    today,
    raceLabelByWeek: raceLabelByWeek(races),
  })
  const months = computeMonths(runs, today)
  const hours = computeHours(runs)
  const weekdays = computeWeekdays(runs)
  const loadSince = weeks[0]?.weekStart ?? WEEKS_SINCE

  return {
    today,
    totals: computeTotals(runs),
    weeks,
    months,
    years: computeYears(runs),
    load: computeLoad(activities, { since: loadSince, today }),
    pauses: computePauses(
      activities,
      weeks.map((week) => week.weekStart)
    ),
    records: computeRecords(runs),
    races,
    hours,
    weekdays,
    daily: computeDaily(runs, today),
    streaks: computeStreaks(runs, today),
    highlights: {
      ...computePeaks(runs, months),
      earlyShare: computeEarlyShare(hours),
      saturdayShare: computeSaturdayShare(weekdays),
    },
  }
}
