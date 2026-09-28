import { metersToKm, paceSecPerKm, roundTo } from "@/lib/archive/activity"
import {
  addDays,
  daysBetween,
  eachWeekStart,
  localDayKey,
  weekStartOf,
} from "@/lib/archive/dates"
import type {
  ArchiveActivity,
  DetectedRace,
  RaceBuildUp,
} from "@/lib/archive/types"

/** `workout_type` do Strava para corrida marcada como prova. */
export const STRAVA_RACE_WORKOUT_TYPE = 1

export const MARATHON_LABEL = "42K"
export const HALF_MARATHON_LABEL = "21K"

/** Dias após a maratona em que provas detectadas só pela distância são descartadas. */
export const MARATHON_RECOVERY_DAYS = 14

/** Semanas do ciclo mostradas no card da prova, contando a semana dela. */
export const BUILD_UP_WEEKS = 16

/**
 * Faixas de distância que contam como prova sem `workout_type`.
 * A meia exige ser a corrida mais rápida da semana (separa prova de longão);
 * a maratona dispensa, porque quase nunca supera o ritmo dos treinos curtos da semana.
 */
const RACE_DISTANCE_WINDOWS_M = [
  { min: 21_100, max: 22_200, requiresFastestOfWeek: true },
  { min: 42_200, max: 43_500, requiresFastestOfWeek: false },
] as const

const RACE_LABELS = [
  { minM: 40_000, label: MARATHON_LABEL },
  { minM: 20_000, label: HALF_MARATHON_LABEL },
  { minM: 9_500, label: "10K" },
  { minM: 4_800, label: "5K" },
] as const

export function raceLabel(distanceM: number): string {
  const match = RACE_LABELS.find((entry) => distanceM >= entry.minM)
  return match ? match.label : `${Math.round(distanceM / 1000)}K`
}

function isRaceByDistance(distanceM: number, isFastestOfWeek: boolean): boolean {
  return RACE_DISTANCE_WINDOWS_M.some(
    (window) =>
      distanceM >= window.min &&
      distanceM <= window.max &&
      (isFastestOfWeek || !window.requiresFastestOfWeek)
  )
}

function fastestRunIdByWeek(runs: ArchiveActivity[]): Map<string, number> {
  const fastest = new Map<string, { id: number; pace: number }>()
  for (const run of runs) {
    const pace = paceSecPerKm(Number(run.distance_m), run.moving_time_s)
    if (pace <= 0) continue
    const week = weekStartOf(localDayKey(run.start_date_local))
    const current = fastest.get(week)
    if (!current || pace < current.pace) {
      fastest.set(week, { id: run.id, pace })
    }
  }
  return new Map([...fastest].map(([week, entry]) => [week, entry.id]))
}

function toDetectedRace(run: ArchiveActivity): DetectedRace {
  const distanceM = Number(run.distance_m)
  return {
    activityId: run.id,
    name: run.name,
    date: localDayKey(run.start_date_local),
    label: raceLabel(distanceM),
    km: metersToKm(distanceM),
    movingSec: run.moving_time_s,
    paceSecPerKm: Math.round(paceSecPerKm(distanceM, run.moving_time_s)),
  }
}

/** Uma meia rápida logo depois da maratona costuma ser recuperação solta, não prova. */
function isInMarathonRecovery(
  race: DetectedRace,
  marathonDates: string[]
): boolean {
  return marathonDates.some((marathonDate) => {
    const days = daysBetween(marathonDate, race.date)
    return days > 0 && days <= MARATHON_RECOVERY_DAYS
  })
}

/** Provas em ordem cronológica. */
export function detectRaces(runs: ArchiveActivity[]): DetectedRace[] {
  const fastestByWeek = fastestRunIdByWeek(runs)
  const flaggedIds = new Set<number>()

  const candidates = runs
    .filter((run) => {
      if (run.workout_type === STRAVA_RACE_WORKOUT_TYPE) {
        flaggedIds.add(run.id)
        return true
      }
      const week = weekStartOf(localDayKey(run.start_date_local))
      return isRaceByDistance(
        Number(run.distance_m),
        fastestByWeek.get(week) === run.id
      )
    })
    .map(toDetectedRace)
    .sort((a, b) => a.date.localeCompare(b.date))

  const marathonDates = candidates
    .filter((race) => race.label === MARATHON_LABEL)
    .map((race) => race.date)

  return candidates.filter(
    (race) =>
      flaggedIds.has(race.activityId) ||
      !isInMarathonRecovery(race, marathonDates)
  )
}

/** Volume das semanas antes da prova e a maior corrida do ciclo. */
export function computeBuildUp(
  race: DetectedRace,
  runs: ArchiveActivity[],
  metersByWeek: Map<string, number>
): RaceBuildUp {
  const raceWeek = weekStartOf(race.date)
  const firstWeek = addDays(raceWeek, -7 * (BUILD_UP_WEEKS - 1))

  const weeks = eachWeekStart(firstWeek, raceWeek).map((weekStart) => ({
    weekStart,
    km: metersToKm(metersByWeek.get(weekStart) ?? 0),
  }))

  let longestM = 0
  for (const run of runs) {
    if (run.id === race.activityId) continue
    const day = localDayKey(run.start_date_local)
    if (day < firstWeek || day > race.date) continue
    longestM = Math.max(longestM, Number(run.distance_m))
  }

  return {
    weeks,
    km: roundTo(
      weeks.reduce((sum, week) => sum + week.km, 0),
      1
    ),
    longestRunKm: metersToKm(longestM),
  }
}

/** Rótulo da prova mais longa de cada semana, para a faixa semanal. */
export function raceLabelByWeek(races: DetectedRace[]): Map<string, string> {
  const longestByWeek = new Map<string, DetectedRace>()
  for (const race of races) {
    const week = weekStartOf(race.date)
    const current = longestByWeek.get(week)
    if (!current || race.km > current.km) longestByWeek.set(week, race)
  }
  return new Map([...longestByWeek].map(([week, race]) => [week, race.label]))
}
