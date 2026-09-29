/** Capacidade de atletas do app no Strava. No modo inicial, o Strava libera 10. */
export const DEFAULT_ATHLETE_CAPACITY = 10
/** A partir de quantas vagas restantes o contador vira "últimas vagas". */
export const LAST_SLOTS_THRESHOLD = 2

export type BetaPhase = "aberto" | "ultimas" | "lotado"

export type BetaStatus = {
  capacity: number
  connected: number
  waiting: number
  phase: BetaPhase
}

export function athleteCapacity(value: string | undefined = process.env.STRAVA_ATHLETE_CAPACITY): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_ATHLETE_CAPACITY
}

export function betaPhase(connected: number, capacity: number): BetaPhase {
  const free = capacity - connected
  if (free <= 0) return "lotado"
  if (free <= LAST_SLOTS_THRESHOLD) return "ultimas"
  return "aberto"
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const email = raw.trim().toLowerCase()
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return null
  return email
}

/** Cookie com o id da inscrição na fila, para mostrar a posição e permitir sair. */
export const WAITLIST_COOKIE = "ctt_fila"
