import { describe, expect, it } from "vitest"

import { computeRecords } from "@/lib/archive/records"
import { makeRun } from "@/lib/archive/test-fixtures"

describe("computeRecords", () => {
  it("normaliza o tempo para a distância exata e guarda a primeira marca", () => {
    const runs = [
      makeRun("2024-03-10T07:00", { distance_m: 10_000, moving_time_s: 3000 }),
      makeRun("2026-05-02T07:00", { distance_m: 10_300, moving_time_s: 2575 }),
      // mais de 5% acima do alvo: não conta para o 10K
      makeRun("2026-06-01T07:00", { distance_m: 10_600, moving_time_s: 2400 }),
    ]

    const tenK = computeRecords(runs).find((record) => record.key === "10k")

    expect(tenK).toMatchObject({
      bestSec: 2500,
      bestPace: 250,
      date: "2026-05-02",
      firstPace: 300,
      firstDate: "2024-03-10",
      previousBestSec: 3000,
      previousDate: "2024-03-10",
      exact: false,
    })
  })

  it("usa o tempo real na maratona", () => {
    const runs = [
      makeRun("2026-06-07T07:00", { distance_m: 42_500, moving_time_s: 12_600 }),
    ]

    const marathon = computeRecords(runs).find(
      (record) => record.key === "marathon"
    )

    expect(marathon).toMatchObject({
      bestSec: 12_600,
      exact: true,
      previousBestSec: null,
    })
  })

  it("não cria recorde sem atividade na faixa de distância", () => {
    const runs = [makeRun("2026-06-07T07:00", { distance_m: 4900 })]

    expect(computeRecords(runs)).toEqual([])
  })
})
