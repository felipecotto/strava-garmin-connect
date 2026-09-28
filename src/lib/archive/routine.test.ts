import { describe, expect, it } from "vitest"

import {
  DAILY_WINDOW_DAYS,
  computeDaily,
  computeEarlyShare,
  computeHours,
  computeSaturdayShare,
  computeWeekdays,
} from "@/lib/archive/routine"
import { makeRun } from "@/lib/archive/test-fixtures"

describe("computeDaily", () => {
  it("soma as corridas do mesmo dia", () => {
    const runs = [
      makeRun("2026-09-18T06:10", { distance_m: 5200 }),
      makeRun("2026-09-18T18:30", { distance_m: 5200 }),
    ]

    const daily = computeDaily(runs, "2026-09-20")

    expect(daily["2026-09-18"]).toBe(10.4)
    expect(daily["2026-09-19"]).toBe(0)
  })

  it("cobre 371 dias terminando hoje", () => {
    const daily = computeDaily([], "2026-09-20")
    const days = Object.keys(daily)

    expect(days).toHaveLength(DAILY_WINDOW_DAYS)
    expect(days.at(-1)).toBe("2026-09-20")
  })

  it("ignora corridas fora da janela", () => {
    const daily = computeDaily([makeRun("2024-01-01T06:00")], "2026-09-20")

    expect(daily["2024-01-01"]).toBeUndefined()
  })
})

describe("destaques de rotina", () => {
  it("calcula a fração de corridas entre 6h e 7h59 pelo horário local", () => {
    const runs = [
      makeRun("2026-09-14T06:00"),
      makeRun("2026-09-15T07:59"),
      makeRun("2026-09-16T08:00"),
      makeRun("2026-09-17T18:00"),
    ]

    expect(computeEarlyShare(computeHours(runs))).toBe(0.5)
  })

  it("calcula a fração do volume no sábado", () => {
    const runs = [
      makeRun("2026-09-19T07:00", { distance_m: 30_000 }), // sábado
      makeRun("2026-09-16T06:00", { distance_m: 10_000 }), // quarta
    ]

    expect(computeSaturdayShare(computeWeekdays(runs))).toBe(0.75)
  })
})
