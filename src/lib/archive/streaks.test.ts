import { describe, expect, it } from "vitest"

import { computeStreaks } from "@/lib/archive/streaks"
import { makeRun } from "@/lib/archive/test-fixtures"

describe("computeStreaks", () => {
  const runs = [
    // 3 semanas seguidas
    makeRun("2026-07-06T06:00"),
    makeRun("2026-07-15T06:00"),
    makeRun("2026-07-21T06:00"),
    // buraco em 27/07
    makeRun("2026-08-05T06:00"),
    makeRun("2026-08-10T06:00"),
  ]

  it("conta a maior sequência de semanas com corrida", () => {
    expect(computeStreaks(runs, "2026-08-12")).toMatchObject({
      longestWeeks: 3,
      longestFrom: "2026-07-06",
      longestTo: "2026-07-20",
    })
  })

  it("não quebra a sequência atual numa semana ainda sem corrida", () => {
    // hoje é segunda, 17/08: a semana corrente ainda não tem corrida
    expect(computeStreaks(runs, "2026-08-17").currentWeeks).toBe(2)
  })

  it("zera a sequência atual depois de uma semana inteira sem corrida", () => {
    expect(computeStreaks(runs, "2026-08-24").currentWeeks).toBe(0)
  })

  it("devolve zeros sem corridas", () => {
    expect(computeStreaks([], "2026-08-24")).toEqual({
      longestWeeks: 0,
      longestFrom: null,
      longestTo: null,
      currentWeeks: 0,
    })
  })
})
