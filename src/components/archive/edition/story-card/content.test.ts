import { describe, expect, it } from "vitest"

import { buildArchive } from "@/lib/archive/build-archive"
import { makeRun } from "@/lib/archive/test-fixtures"

import { buildStoryCards } from "./content"

const NOW = new Date("2026-08-10T15:00:00Z")

const runs = [
  makeRun("2024-09-29T07:00", { distance_m: 42_500, moving_time_s: 12_765 }),
  makeRun("2026-06-07T07:00", { distance_m: 42_500, moving_time_s: 12_407 }),
  makeRun("2026-07-05T06:30", { distance_m: 10_000, moving_time_s: 3000 }),
  makeRun("2026-07-15T06:30", { distance_m: 13_900, moving_time_s: 4500 }),
  makeRun("2026-08-02T06:30", { distance_m: 10_000, moving_time_s: 3000 }),
]

describe("buildStoryCards", () => {
  const cards = buildStoryCards(buildArchive(runs, NOW))

  it("monta o card da última prova com a diferença para o melhor tempo anterior", () => {
    expect(cards.prova).toMatchObject({
      heading: "Maratona · 07 jun 2026",
      value: "3:26:47",
      summary: "42,5 km · 4:52/km",
      highlight: "−5:58 vs. set 2024",
    })
    expect(cards.prova?.bars).toHaveLength(16)
    expect(cards.prova?.bars.at(-1)).toEqual({ value: 42.5, highlight: true })
  })

  it("usa o último mês fechado, com barras por dia", () => {
    expect(cards.mes).toMatchObject({
      heading: "Julho 2026",
      value: "24",
      unit: "km",
      summary: "2 corridas · 5:14/km · 2h05",
      highlight: "Maior dia: 13,9 km · 15 jul",
      axis: ["1 jul", "31 jul"],
    })
    expect(cards.mes?.bars).toHaveLength(31)
    expect(cards.mes?.bars[14]).toEqual({ value: 13.9, highlight: true })
  })

  it("resume a temporada inteira com uma barra por ano", () => {
    expect(cards.temporada).toMatchObject({
      heading: "2024 — 2026",
      value: "119",
      summary: "5 corridas · 10 horas · 2 maratonas",
      highlight: "Pico: 76 km em 2026",
      axis: ["24", "26"],
    })
  })

  it("deixa de fora o card da prova quando não há provas", () => {
    const withoutRaces = buildStoryCards(buildArchive(runs.slice(2), NOW))

    expect(withoutRaces.prova).toBeUndefined()
    expect(withoutRaces.temporada?.summary).toBe("3 corridas · 3 horas")
  })
})
