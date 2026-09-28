import { describe, expect, it } from "vitest"

import type { ArchiveRecord } from "@/lib/archive/types"

import { recordDelta, recordsFootnote } from "./copy"

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

