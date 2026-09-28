import { describe, expect, it } from "vitest"

import { weekStartOf } from "@/lib/archive/dates"
import { makeRun } from "@/lib/archive/test-fixtures"
import { computeMonths, computeWeeks } from "@/lib/archive/volume"

describe("weekStartOf", () => {
  it("começa a semana na segunda-feira", () => {
    expect(weekStartOf("2026-09-20")).toBe("2026-09-14") // domingo
    expect(weekStartOf("2026-09-14")).toBe("2026-09-14") // segunda
  })
})

describe("computeWeeks", () => {
  it("preenche com zero as semanas sem corrida", () => {
    const runs = [
      makeRun("2026-09-01T06:30", { distance_m: 8000 }),
      makeRun("2026-09-15T06:30", { distance_m: 12_000 }),
    ]

    const weeks = computeWeeks(runs, { since: "2023-01-01", today: "2026-09-20" })

    expect(weeks).toEqual([
      { weekStart: "2026-08-31", km: 8 },
      { weekStart: "2026-09-07", km: 0 },
      { weekStart: "2026-09-14", km: 12 },
    ])
  })

  it("começa em `since` quando a primeira corrida é anterior", () => {
    const runs = [makeRun("2022-06-01T06:30"), makeRun("2023-01-10T06:30")]

    const weeks = computeWeeks(runs, { since: "2023-01-01", today: "2023-01-15" })

    expect(weeks[0].weekStart).toBe("2022-12-26")
    expect(weeks.at(-1)?.weekStart).toBe("2023-01-09")
  })

  it("marca a semana da prova com o rótulo", () => {
    const runs = [makeRun("2026-06-07T07:00", { distance_m: 42_500 })]

    const weeks = computeWeeks(runs, {
      since: "2023-01-01",
      today: "2026-06-07",
      raceLabelByWeek: new Map([["2026-06-01", "42K"]]),
    })

    expect(weeks).toEqual([{ weekStart: "2026-06-01", km: 42.5, race: "42K" }])
  })
})

describe("computeMonths", () => {
  it("inclui meses sem corrida até o mês de hoje", () => {
    const runs = [makeRun("2026-06-10T06:30", { distance_m: 5000 })]

    expect(computeMonths(runs, "2026-08-02")).toEqual([
      { month: "2026-06", km: 5, runs: 1 },
      { month: "2026-07", km: 0, runs: 0 },
      { month: "2026-08", km: 0, runs: 0 },
    ])
  })
})
