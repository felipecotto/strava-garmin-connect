import { describe, expect, it } from "vitest"

import { selectFinish, selectHabitYear, selectPeakYear, selectWall } from "@/lib/archive/story"
import type { ArchiveLoadPoint, ArchiveRace, ArchiveWeek, ArchiveYear } from "@/lib/archive/types"

const year = (y: number, km: number, runs: number): ArchiveYear => ({
  year: y,
  km,
  runs,
  paceSecPerKm: 330,
  longestKm: 21,
})

function weekKey(index: number): string {
  const date = new Date(Date.UTC(2025, 0, 6) + index * 7 * 86_400_000)
  return date.toISOString().slice(0, 10)
}

const loadFrom = (values: number[]): ArchiveLoadPoint[] =>
  values.map((fitness, index) => ({ weekStart: weekKey(index), fitness, fatigue: fitness }))

const weeksFrom = (km: number[]): ArchiveWeek[] =>
  km.map((value, index) => ({ weekStart: weekKey(index), km: value }))

const race = (date: string, movingSec: number, label = "42K"): ArchiveRace => ({
  activityId: Number(date.replaceAll("-", "")),
  name: "Maratona",
  date,
  label,
  km: 42.2,
  movingSec,
  paceSecPerKm: movingSec / 42.2,
  buildUp: { weeks: [], km: 0, longestRunKm: 0 },
})

describe("selectHabitYear", () => {
  it("pega o primeiro ano com 100 corridas ou mais", () => {
    expect(selectHabitYear([year(2022, 300, 40), year(2023, 1400, 170), year(2024, 2300, 232)])?.year).toBe(2023)
  })

  it("sem ano de hábito, usa o ano com mais corridas", () => {
    expect(selectHabitYear([year(2021, 40, 5), year(2022, 300, 40)])?.year).toBe(2022)
  })

  it("sem anos, não há capítulo", () => {
    expect(selectHabitYear([])).toBeNull()
  })
})

describe("selectPeakYear", () => {
  it("é o ano de maior volume", () => {
    expect(selectPeakYear([year(2023, 1400, 170), year(2024, 2349, 232), year(2025, 1885, 195)])?.year).toBe(2024)
  })
})

describe("selectWall", () => {
  it("acha a maior queda em até 12 semanas e o tempo de volta", () => {
    const load = loadFrom([60, 80, 95, 90, 70, 50, 40, 38, 45, 60, 75, 86, 90])
    const weeks = weeksFrom([40, 50, 60, 30, 0, 0, 0, 5, 20, 30, 40, 40, 40])
    const wall = selectWall(load, weeks)
    expect(wall?.peak.fitness).toBe(95)
    expect(wall?.low.fitness).toBe(38)
    expect(wall?.weeksDown).toBe(5)
    expect(wall?.weeksToRecover).toBe(4)
    expect(wall?.recoveredTo).toBe(86)
    expect(wall?.runlessWeeks).toBe(3)
    expect(wall?.stopFrom).toBe(weekKey(4))
  })

  it("quedas pequenas não viram muro", () => {
    expect(selectWall(loadFrom([50, 45, 42, 48, 50]), weeksFrom([10, 10, 10, 10, 10]))).toBeNull()
  })

  it("sem recuperação, weeksToRecover é null", () => {
    const wall = selectWall(loadFrom([90, 70, 40, 42, 45]), weeksFrom([30, 10, 0, 5, 5]))
    expect(wall?.weeksToRecover).toBeNull()
  })
})

describe("selectFinish", () => {
  it("usa a maratona mais recente e compara com a anterior", () => {
    const finish = selectFinish([race("2024-09-29", 12_765), race("2025-04-06", 5_690, "21K"), race("2026-06-07", 12_407)])
    expect(finish?.race.date).toBe("2026-06-07")
    expect(finish?.previous?.date).toBe("2024-09-29")
    expect(finish?.deltaSec).toBe(-358)
  })

  it("sem maratona, usa a prova mais recente", () => {
    const finish = selectFinish([race("2025-04-06", 5_690, "21K")])
    expect(finish?.race.label).toBe("21K")
    expect(finish?.deltaSec).toBeNull()
  })

  it("sem provas, não há chegada", () => {
    expect(selectFinish([])).toBeNull()
  })
})
