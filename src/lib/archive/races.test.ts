import { describe, expect, it } from "vitest"

import {
  BUILD_UP_WEEKS,
  computeBuildUp,
  detectRaces,
  STRAVA_RACE_WORKOUT_TYPE,
} from "@/lib/archive/races"
import { makeRun } from "@/lib/archive/test-fixtures"
import { sumMetersByWeek } from "@/lib/archive/volume"

const labels = (runs: Parameters<typeof detectRaces>[0]) =>
  detectRaces(runs).map((race) => `${race.date} ${race.label}`)

describe("detectRaces", () => {
  it("marca corrida com workout_type de prova em qualquer distância", () => {
    const runs = [
      makeRun("2026-04-12T07:00", {
        distance_m: 10_050,
        workout_type: STRAVA_RACE_WORKOUT_TYPE,
      }),
    ]

    expect(labels(runs)).toEqual(["2026-04-12 10K"])
  })

  it("marca meia só quando é a corrida mais rápida da semana", () => {
    const raceWeek = [
      makeRun("2025-10-22T06:00", { distance_m: 8000, moving_time_s: 2600 }), // 5:25/km
      makeRun("2025-10-26T07:00", { distance_m: 21_300, moving_time_s: 6050 }), // 4:44/km
    ]
    const longRunWeek = [
      makeRun("2025-03-26T06:00", { distance_m: 8000, moving_time_s: 2100 }), // 4:22/km
      makeRun("2025-03-29T07:00", { distance_m: 21_200, moving_time_s: 7040 }), // 5:32/km
    ]

    expect(labels([...raceWeek, ...longRunWeek])).toEqual(["2025-10-26 21K"])
  })

  it("marca maratona mesmo quando há treino mais rápido na semana", () => {
    const runs = [
      makeRun("2026-06-02T06:00", { distance_m: 6000, moving_time_s: 1700 }), // 4:43/km
      makeRun("2026-06-07T07:00", { distance_m: 42_500, moving_time_s: 12_400 }), // 4:52/km
    ]

    expect(labels(runs)).toEqual(["2026-06-07 42K"])
  })

  it("ignora meia detectada pela distância na recuperação da maratona", () => {
    const runs = [
      makeRun("2026-06-07T07:00", { distance_m: 42_500, moving_time_s: 12_400 }),
      makeRun("2026-06-14T07:00", { distance_m: 21_200, moving_time_s: 6900 }),
      makeRun("2026-06-21T07:00", {
        distance_m: 21_100,
        moving_time_s: 5900,
        workout_type: STRAVA_RACE_WORKOUT_TYPE,
      }),
    ]

    expect(labels(runs)).toEqual(["2026-06-07 42K", "2026-06-21 21K"])
  })
})

describe("computeBuildUp", () => {
  it("soma as semanas do ciclo e acha o maior treino sem contar a prova", () => {
    const race = makeRun("2026-06-07T07:00", { distance_m: 42_500 })
    const runs = [
      makeRun("2026-02-01T07:00", { distance_m: 30_000 }), // antes do ciclo
      makeRun("2026-02-16T07:00", { distance_m: 20_000 }), // 1ª semana do ciclo
      makeRun("2026-05-10T07:00", { distance_m: 36_000 }),
      race,
    ]
    const [detected] = detectRaces([race])

    const buildUp = computeBuildUp(detected, runs, sumMetersByWeek(runs))

    expect(buildUp.weeks).toHaveLength(BUILD_UP_WEEKS)
    expect(buildUp.weeks[0]).toEqual({ weekStart: "2026-02-16", km: 20 })
    expect(buildUp.weeks.at(-1)).toEqual({ weekStart: "2026-06-01", km: 42.5 })
    expect(buildUp.km).toBe(98.5)
    expect(buildUp.longestRunKm).toBe(36)
  })
})
