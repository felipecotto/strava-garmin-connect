import { metersToKm, paceSecPerKm } from "@/lib/archive/activity"
import { localDayKey, weekStartOf } from "@/lib/archive/dates"
import type { ArchiveActivity, ArchiveRace } from "@/lib/archive/types"

/** `workout_type` do Strava para corrida marcada como prova. */
export const STRAVA_RACE_WORKOUT_TYPE = 1

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
  { minM: 40_000, label: "42K" },
  { minM: 20_000, label: "21K" },
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

/** Provas em ordem cronológica. */
export function detectRaces(runs: ArchiveActivity[]): ArchiveRace[] {
  const fastestByWeek = fastestRunIdByWeek(runs)

  return runs
    .filter((run) => {
      if (run.workout_type === STRAVA_RACE_WORKOUT_TYPE) return true
      const week = weekStartOf(localDayKey(run.start_date_local))
      return isRaceByDistance(
        Number(run.distance_m),
        fastestByWeek.get(week) === run.id
      )
    })
    .map((run) => {
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
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** Rótulo da prova mais longa de cada semana, para a faixa semanal. */
export function raceLabelByWeek(races: ArchiveRace[]): Map<string, string> {
  const longestByWeek = new Map<string, ArchiveRace>()
  for (const race of races) {
    const week = weekStartOf(race.date)
    const current = longestByWeek.get(week)
    if (!current || race.km > current.km) longestByWeek.set(week, race)
  }
  return new Map([...longestByWeek].map(([week, race]) => [week, race.label]))
}
