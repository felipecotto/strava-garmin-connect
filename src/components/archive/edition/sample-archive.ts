import { buildArchive } from "@/lib/archive/build-archive"
import { addDays, weekdayIndex } from "@/lib/archive/dates"
import { STRAVA_RACE_WORKOUT_TYPE } from "@/lib/archive/races"
import { makeRun } from "@/lib/archive/test-fixtures"
import type { ArchiveActivity, ArchiveData } from "@/lib/archive/types"

/**
 * Arquivo fictício e determinístico para o Storybook: dois anos de treino com
 * três provas e uma pausa no fim de 2025.
 */
const FIRST_DAY = "2024-07-01"
const TODAY = "2026-08-20"

/** km planejados por dia da semana (seg → dom); null é descanso. */
const WEEKLY_PLAN_KM = [null, 8, 10, 8, null, null, 6] as const
const LONG_RUN_WEEKDAY = 5
const LONG_RUN_BASE_KM = 14
const LONG_RUN_STEP_KM = 3
const LONG_RUN_CYCLE_WEEKS = 6

const BASE_PACE_SEC_PER_KM = 330
const PACE_SPREAD_SEC = 24
const LONG_RUN_PACE_PENALTY_SEC = 20

const PAUSE = { from: "2025-12-15", to: "2026-01-04" }

const RACES = [
  { date: "2024-09-29", name: "Maratona de Buenos Aires", distanceM: 42_200, movingSec: 12_765 },
  { date: "2025-04-06", name: "Meia de São Paulo", distanceM: 21_100, movingSec: 5_690 },
  { date: "2026-06-07", name: "Maratona do Rio", distanceM: 42_500, movingSec: 12_407 },
]

function trainingRun(day: string, dayNumber: number): ArchiveActivity | null {
  const weekday = weekdayIndex(day)
  const isLongRun = weekday === LONG_RUN_WEEKDAY
  const km = isLongRun
    ? LONG_RUN_BASE_KM + (Math.floor(dayNumber / 7) % LONG_RUN_CYCLE_WEEKS) * LONG_RUN_STEP_KM
    : WEEKLY_PLAN_KM[weekday]
  if (km === null) return null

  const pace =
    BASE_PACE_SEC_PER_KM +
    ((dayNumber * 7) % PACE_SPREAD_SEC) -
    PACE_SPREAD_SEC / 2 +
    (isLongRun ? LONG_RUN_PACE_PENALTY_SEC : 0)

  return makeRun(`${day}T06:15`, {
    name: isLongRun ? "Longão" : "Rodagem",
    distance_m: km * 1000,
    moving_time_s: Math.round(km * pace),
  })
}

function sampleRuns(): ArchiveActivity[] {
  const runs: ArchiveActivity[] = []
  for (let day = FIRST_DAY, dayNumber = 0; day <= TODAY; day = addDays(day, 1), dayNumber += 1) {
    if (day >= PAUSE.from && day <= PAUSE.to) continue
    const race = RACES.find((entry) => entry.date === day)
    if (race) {
      runs.push(
        makeRun(`${day}T07:00`, {
          name: race.name,
          distance_m: race.distanceM,
          moving_time_s: race.movingSec,
          workout_type: STRAVA_RACE_WORKOUT_TYPE,
        })
      )
      continue
    }
    const run = trainingRun(day, dayNumber)
    if (run) runs.push(run)
  }
  return runs
}

export const SAMPLE_ARCHIVE: ArchiveData = buildArchive(sampleRuns(), new Date(`${TODAY}T15:00:00Z`))
