import { describe, expect, it } from "vitest"

import { athleteCapacity, betaPhase, normalizeEmail } from "@/lib/beta/state"

describe("betaPhase", () => {
  it("aberto com folga, últimas com 2 ou menos, lotado sem vaga", () => {
    expect(betaPhase(1, 10)).toBe("aberto")
    expect(betaPhase(7, 10)).toBe("aberto")
    expect(betaPhase(8, 10)).toBe("ultimas")
    expect(betaPhase(9, 10)).toBe("ultimas")
    expect(betaPhase(10, 10)).toBe("lotado")
    expect(betaPhase(12, 10)).toBe("lotado")
  })
})

describe("athleteCapacity", () => {
  it("usa a variável de ambiente quando é um inteiro positivo", () => {
    expect(athleteCapacity("25")).toBe(25)
    expect(athleteCapacity("0")).toBe(10)
    expect(athleteCapacity("abc")).toBe(10)
    expect(athleteCapacity(undefined)).toBe(10)
  })
})

describe("normalizeEmail", () => {
  it("aceita e-mails válidos em minúsculas", () => {
    expect(normalizeEmail("  Felipe@Email.com ")).toBe("felipe@email.com")
  })
  it("recusa entradas inválidas", () => {
    expect(normalizeEmail("felipe@")).toBeNull()
    expect(normalizeEmail("sem arroba")).toBeNull()
    expect(normalizeEmail(42)).toBeNull()
  })
})
