/** Campos de `activities` que o arquivo usa. */
export type ArchiveActivity = {
  id: number
  name: string
  sport_type: string
  distance_m: number
  moving_time_s: number
  total_elevation_gain_m: number | null
  average_heartrate: number | null
  max_heartrate: number | null
  start_date_local: string
  timezone: string | null
  workout_type: number | null
}

export type RecordKey = "5k" | "10k" | "half" | "marathon"

export type Weekday = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom"

export type ArchiveTotals = {
  runs: number
  km: number
  hours: number
  elevationM: number
  firstRunYear: number | null
}

export type ArchiveWeek = { weekStart: string; km: number; race?: string }

export type ArchiveMonth = { month: string; km: number; runs: number; movingSec: number }

export type ArchiveYear = {
  year: number
  km: number
  runs: number
  paceSecPerKm: number
  longestKm: number
}

export type ArchiveLoadPoint = {
  weekStart: string
  fitness: number
  fatigue: number
}

/** Semanas seguidas sem carga nenhuma (nem corrida, nem outro esporte). */
export type ArchivePause = { from: string; to: string; weeks: number }

export type ArchiveRecord = {
  key: RecordKey
  bestSec: number
  bestPace: number
  date: string
  activityId: number
  activityName: string
  firstPace: number
  firstDate: string
  /** Melhor tempo antes do recorde atual; null se o recorde é a primeira marca. */
  previousBestSec: number | null
  previousDate: string | null
  /** false quando o tempo foi normalizado a partir de uma distância maior. */
  exact: boolean
}

export type DetectedRace = {
  activityId: number
  name: string
  date: string
  label: string
  km: number
  movingSec: number
  paceSecPerKm: number
}

/** Semanas que antecederam a prova, terminando na semana dela. */
export type RaceBuildUp = {
  weeks: { weekStart: string; km: number }[]
  km: number
  /** Maior corrida do ciclo, sem contar a própria prova. */
  longestRunKm: number
}

export type ArchiveRace = DetectedRace & { buildUp: RaceBuildUp }

export type ArchiveStreaks = {
  longestWeeks: number
  longestFrom: string | null
  longestTo: string | null
  currentWeeks: number
}

export type ArchiveHighlights = {
  peakWeek: { weekStart: string; km: number } | null
  peakMonth: { month: string; km: number } | null
  /** Fração (0–1) das corridas que começam entre 6h00 e 7h59. */
  earlyShare: number
  /** Fração (0–1) do volume corrido no sábado. */
  saturdayShare: number
}

export type ArchiveData = {
  /** Dia de referência (YYYY-MM-DD, fuso do atleta) usado nos cálculos. */
  today: string
  totals: ArchiveTotals
  weeks: ArchiveWeek[]
  months: ArchiveMonth[]
  years: ArchiveYear[]
  load: ArchiveLoadPoint[]
  pauses: ArchivePause[]
  records: ArchiveRecord[]
  races: ArchiveRace[]
  hours: number[]
  weekdays: { day: Weekday; km: number; runs: number }[]
  daily: Record<string, number>
  streaks: ArchiveStreaks
  highlights: ArchiveHighlights
}
