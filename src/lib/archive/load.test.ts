import { describe, expect, it } from "vitest"

import {
  DEFAULT_HR_MAX,
  computeLoad,
  computePauses,
  estimateHrMax,
  trimp,
} from "@/lib/archive/load"
import { makeRun } from "@/lib/archive/test-fixtures"

describe("trimp", () => {
  it("estima pela duração quando não há frequência cardíaca", () => {
    expect(trimp(50 * 60, null, DEFAULT_HR_MAX)).toBe(40)
  })

  it("usa a fórmula de Banister com FC média", () => {
    // hrr = (120 − 50) / (190 − 50) = 0,5
    const expected = 60 * 0.5 * 0.64 * Math.exp(1.92 * 0.5)
    expect(trimp(60 * 60, 120, 190)).toBeCloseTo(expected, 6)
  })
})

describe("estimateHrMax", () => {
  it("usa 190 quando não há dados de FC", () => {
    expect(estimateHrMax([makeRun("2026-09-14T06:00")])).toBe(DEFAULT_HR_MAX)
  })
})

describe("computeLoad", () => {
  it("atualiza forma (42 dias) e fadiga (7 dias) e guarda um ponto por semana", () => {
    // segunda-feira, 50 min sem FC → carga 40
    const activities = [makeRun("2026-09-14T06:00", { moving_time_s: 3000 })]

    const load = computeLoad(activities, { since: "2026-09-14", today: "2026-09-14" })

    expect(load).toEqual([
      { weekStart: "2026-09-14", fitness: 1, fatigue: 5.7 },
    ])
  })

  it("inclui atividades que não são corrida", () => {
    const ride = makeRun("2026-09-14T06:00", {
      sport_type: "Ride",
      moving_time_s: 3000,
    })

    const [point] = computeLoad([ride], { since: "2026-09-14", today: "2026-09-14" })

    expect(point.fitness).toBeGreaterThan(0)
  })
})

describe("computePauses", () => {
  it("detecta semanas seguidas sem nenhuma atividade", () => {
    const activities = [
      makeRun("2026-08-03T06:00"),
      makeRun("2026-08-31T06:00"),
    ]
    const weeks = ["2026-08-03", "2026-08-10", "2026-08-17", "2026-08-24", "2026-08-31"]

    expect(computePauses(activities, weeks)).toEqual([
      { from: "2026-08-10", to: "2026-08-24", weeks: 3 },
    ])
  })
})
