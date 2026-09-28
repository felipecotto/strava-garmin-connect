import { describe, expect, it } from "vitest"

import type { ArchiveRecord, ArchiveYear } from "@/lib/archive/types"

import {
  clockDescription,
  clockTitle,
  recordDelta,
  recordsFootnote,
  streakText,
  volumeDescription,
  volumeTitle,
} from "./copy"

const year = (value: number, km: number, runs: number): ArchiveYear => ({
  year: value,
  km,
  runs,
  paceSecPerKm: 330,
  longestKm: 21,
})

const record = (overrides: Partial<ArchiveRecord>): ArchiveRecord => ({
  key: "marathon",
  bestSec: 12407,
  bestPace: 292,
  date: "2026-06-07",
  activityId: 1,
  activityName: "Maratona",
  firstPace: 298,
  firstDate: "2024-09-29",
  previousBestSec: 12765,
  previousDate: "2024-09-29",
  exact: true,
  ...overrides,
})

describe("volume", () => {
  it("escreve o número de temporadas por extenso", () => {
    expect(volumeTitle([])).toBe("Nenhuma corrida ainda.")
    expect(volumeTitle([year(2025, 100, 10)])).toBe("Uma temporada de corrida.")
    expect(volumeTitle([year(2024, 1, 1), year(2025, 2, 2), year(2026, 3, 3)])).toBe(
      "Três temporadas de corrida."
    )
  })

  it("destaca o maior ano e o mês de pico a partir dos dados", () => {
    const text = volumeDescription([year(2024, 1056, 90), year(2025, 1885, 195)], {
      peakWeek: null,
      peakMonth: { month: "2025-04", km: 308 },
      earlyShare: 0,
      saturdayShare: 0,
    })
    expect(text).toContain("2025 foi o maior ano: 1.885 km em 195 corridas.")
    expect(text).toContain("abr 2025, com 308 km")
  })
})

describe("relógio", () => {
  it("usa a hora mais frequente no título", () => {
    const hours = Array.from({ length: 24 }, () => 0)
    hours[6] = 130
    hours[7] = 132
    expect(clockTitle(hours)).toBe("Corredor das 7h da manhã.")
    expect(clockTitle(Array.from({ length: 24 }, () => 0))).toBe("Ainda sem rotina.")
  })

  it("nomeia os dias mais frequentes e o de maior volume", () => {
    const text = clockDescription([
      { day: "seg", km: 10, runs: 2 },
      { day: "ter", km: 800, runs: 100 },
      { day: "qua", km: 300, runs: 40 },
      { day: "qui", km: 820, runs: 90 },
      { day: "sex", km: 400, runs: 50 },
      { day: "sab", km: 1300, runs: 80 },
      { day: "dom", km: 500, runs: 45 },
    ])
    expect(text).toContain("Terça e quinta são os dias mais frequentes.")
    expect(text).toContain("Sábado concentra o maior volume.")
  })
})

describe("recordes", () => {
  it("mostra a diferença para a marca anterior", () => {
    expect(recordDelta(record({}))).toBe("−5:58 vs. 2024")
    expect(recordDelta(record({ previousBestSec: null, previousDate: null }))).toBeNull()
  })

  it("separa tempos aproximados dos exatos na nota", () => {
    const text = recordsFootnote([
      record({ key: "5k", exact: false }),
      record({ key: "half", exact: false }),
      record({ key: "marathon", exact: true }),
    ])
    expect(text).toContain("Tempos de 5K e 21K são aproximados")
    expect(text).toContain("até 5% mais longa")
    expect(text).toContain("42K: tempo real em movimento.")
  })
})

describe("constância", () => {
  it("descreve a maior sequência de semanas", () => {
    const text = streakText({
      longestWeeks: 41,
      longestFrom: "2024-07-22",
      longestTo: "2025-04-28",
      currentWeeks: 0,
    })
    expect(text).toContain("41 semanas seguidas")
    expect(text).toContain("de jul 2024 a abr 2025")
    expect(text).not.toContain("sequência atual")
  })
})
