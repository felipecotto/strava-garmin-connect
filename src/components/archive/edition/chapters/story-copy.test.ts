import { describe, expect, it } from "vitest"

import type { FinishChapter, WallChapter } from "@/lib/archive/story"
import type { ArchiveRace, ArchiveYear } from "@/lib/archive/types"

import {
  finishDetail,
  finishText,
  finishTitle,
  firstRunText,
  habitTitle,
  recordsTitle,
  volumeText,
  wallText,
} from "./story-copy"

const year = (value: number, km: number, runs: number, longestKm = 10): ArchiveYear => ({
  year: value,
  km,
  runs,
  paceSecPerKm: 330,
  longestKm,
})

const race = (date: string, movingSec: number): ArchiveRace => ({
  activityId: 1,
  name: "Maratona",
  date,
  label: "42K",
  km: 42.5,
  movingSec,
  paceSecPerKm: 292,
  buildUp: { weeks: Array.from({ length: 16 }, (_, i) => ({ weekStart: `2026-02-${String(i + 1).padStart(2, "0")}`, km: 50 })), km: 899, longestRunKm: 36 },
})

describe("KM 5 · a primeira", () => {
  it("conta as corridas antes do ano do hábito e a maior delas", () => {
    const text = firstRunText(
      { date: "2020-05-26", km: 5.8, paceSecPerKm: 393, activityId: 1 },
      [year(2020, 50, 8, 8.4), year(2021, 38, 5, 10.6), year(2022, 304, 40, 11.6), year(2023, 1423, 170)],
      2023
    )
    expect(text).toBe(
      "A primeira corrida registrada teve 5,8 km a 6:33/km. Até 2022 vieram só mais 52. Nenhuma passou de 12 km."
    )
  })
})

describe("KM 10 · o hábito", () => {
  it("usa a hora de início mais comum", () => {
    const hours = Array(24).fill(0)
    hours[6] = 243
    hours[7] = 276
    expect(habitTitle(hours)).toBe("Corredor das 7h da manhã.")
    expect(habitTitle(Array(24).fill(0))).toBe("Ainda sem rotina.")
  })
})

describe("KM 21 · o volume", () => {
  it("junta ano, sequência e pico numa frase", () => {
    const text = volumeText(
      year(2024, 2349, 232),
      { longestWeeks: 70, longestFrom: "2024-01-01", longestTo: "2025-04-28", currentWeeks: 0 },
      { weekStart: "2024-08-26", km: 80.5 }
    )
    expect(text).toBe(
      "2024 foi o ano do volume: 232 corridas, uma sequência de 70 semanas seguidas que começou em janeiro e um pico de 80,5 km numa semana de agosto."
    )
  })

  it("três recordes no ano de pico", () => {
    const base = { bestSec: 1, bestPace: 1, activityId: 1, activityName: "", firstPace: 1, firstDate: "2022-01-01", previousBestSec: null, previousDate: null, exact: false }
    const records = [
      { ...base, key: "5k" as const, date: "2024-07-02" },
      { ...base, key: "10k" as const, date: "2024-08-27" },
      { ...base, key: "half" as const, date: "2024-07-28" },
      { ...base, key: "marathon" as const, date: "2026-06-07" },
    ]
    expect(recordsTitle(records, 2024)).toBe("Três recordes em 2024.")
    expect(recordsTitle(records.slice(3), 2024)).toBe("Do primeiro ao melhor.")
  })
})

describe("KM 30 · o muro", () => {
  it("descreve parada, queda e volta", () => {
    const wall: WallChapter = {
      peak: { weekStart: "2025-04-28", fitness: 95, fatigue: 100 },
      low: { weekStart: "2025-06-23", fitness: 38, fatigue: 20 },
      weeksDown: 8,
      weeksToRecover: 12,
      recoveredTo: 85.4,
      runlessWeeks: 5,
      stopFrom: "2025-05-05",
    }
    expect(wallText(wall)).toBe(
      "Em maio 2025 os treinos pararam por cinco semanas. A forma caiu de 95 para 38 em oito semanas. 12 semanas depois, estava em 85 de novo."
    )
  })
})

describe("KM 42 · a chegada", () => {
  it("compara com a maratona anterior", () => {
    const finish: FinishChapter = { race: race("2026-06-07", 12_407), previous: race("2024-09-29", 12_765), deltaSec: -358 }
    expect(finishTitle(finish)).toBe("Seis minutos mais rápido.")
    expect(finishText(finish)).toBe(
      "16 semanas e 899 km depois, a maratona terminou em 3:26:47, a 4:52/km. 5:58 abaixo da de 2024."
    )
    expect(finishDetail(finish)).toBe("42,5 km · 4:52/km · −5:58 vs. 2024")
  })

  it("sem prova anterior, é a primeira", () => {
    expect(finishTitle({ race: race("2024-09-29", 12_765), previous: null, deltaSec: null })).toBe("A primeira maratona.")
  })
})
