import type {
  ArchiveData,
  ArchiveLoadPoint,
  ArchiveRace,
  ArchiveWeek,
  ArchiveYear,
} from "@/lib/archive/types"

/**
 * Seleciona os fatos que viram capítulos da edição (KM 5 → KM 42).
 * Tudo aqui é puro: recebe o arquivo pronto e decide o que contar.
 */

/** Ano em que a corrida virou hábito: o primeiro com pelo menos esse número de corridas. */
export const HABIT_MIN_RUNS = 100
/** Janela, em semanas, para procurar a maior queda de forma a partir de um pico. */
export const WALL_WINDOW_WEEKS = 12
/** Queda mínima de forma (em pontos) para o capítulo do muro existir. */
export const WALL_MIN_DROP = 15
/** Fração da forma de antes do muro que conta como "voltou". */
export const RECOVERY_SHARE = 0.9

export function selectHabitYear(years: ArchiveYear[]): ArchiveYear | null {
  if (years.length === 0) return null
  const habit = years.find((year) => year.runs >= HABIT_MIN_RUNS)
  if (habit) return habit
  return years.reduce((top, year) => (year.runs > top.runs ? year : top))
}

export function selectPeakYear(years: ArchiveYear[]): ArchiveYear | null {
  if (years.length === 0) return null
  return years.reduce((top, year) => (year.km > top.km ? year : top))
}

export type WallChapter = {
  /** Semana do pico de forma antes da queda. */
  peak: ArchiveLoadPoint
  /** Semana do vale. */
  low: ArchiveLoadPoint
  weeksDown: number
  /** Semanas entre o vale e a volta a 90% da forma de antes; null se ainda não voltou. */
  weeksToRecover: number | null
  recoveredTo: number | null
  /** Semanas seguidas sem corrida dentro da queda. */
  runlessWeeks: number
  /** Primeira semana sem corrida dentro da queda, se houver. */
  stopFrom: string | null
}

function runlessStreak(weeks: ArchiveWeek[], from: string, to: string) {
  let best = { length: 0, from: null as string | null }
  let current = { length: 0, from: null as string | null }
  for (const week of weeks) {
    if (week.weekStart < from || week.weekStart > to) continue
    if (week.km > 0) {
      current = { length: 0, from: null }
      continue
    }
    current = { length: current.length + 1, from: current.from ?? week.weekStart }
    if (current.length > best.length) best = current
  }
  return best
}

/** A maior queda de forma em até 12 semanas: o muro da história. */
export function selectWall(load: ArchiveLoadPoint[], weeks: ArchiveWeek[]): WallChapter | null {
  let best: { peakIndex: number; lowIndex: number; drop: number } | null = null

  for (let i = 0; i < load.length; i += 1) {
    const end = Math.min(load.length - 1, i + WALL_WINDOW_WEEKS)
    for (let j = i + 1; j <= end; j += 1) {
      const drop = load[i].fitness - load[j].fitness
      if (drop >= WALL_MIN_DROP && (!best || drop > best.drop)) {
        best = { peakIndex: i, lowIndex: j, drop }
      }
    }
  }
  if (!best) return null

  const peak = load[best.peakIndex]
  const low = load[best.lowIndex]
  const target = peak.fitness * RECOVERY_SHARE
  const recoverIndex = load.findIndex(
    (point, index) => index > best.lowIndex && point.fitness >= target
  )
  const streak = runlessStreak(weeks, peak.weekStart, low.weekStart)

  return {
    peak,
    low,
    weeksDown: best.lowIndex - best.peakIndex,
    weeksToRecover: recoverIndex === -1 ? null : recoverIndex - best.lowIndex,
    recoveredTo: recoverIndex === -1 ? null : load[recoverIndex].fitness,
    runlessWeeks: streak.length,
    stopFrom: streak.from,
  }
}

export type FinishChapter = {
  race: ArchiveRace
  /** Prova anterior da mesma distância, para comparar. */
  previous: ArchiveRace | null
  deltaSec: number | null
}

/** A chegada é a prova mais recente; o foco é a maratona quando existe. */
export function selectFinish(races: ArchiveRace[]): FinishChapter | null {
  if (races.length === 0) return null
  const sorted = [...races].sort((a, b) => a.date.localeCompare(b.date))
  const marathons = sorted.filter((race) => race.label === "42K")
  const pool = marathons.length > 0 ? marathons : sorted
  const race = pool[pool.length - 1]
  const previous = pool.length > 1 ? pool[pool.length - 2] : null
  return {
    race,
    previous,
    deltaSec: previous ? race.movingSec - previous.movingSec : null,
  }
}

export type EditionStory = {
  habitYear: ArchiveYear | null
  peakYear: ArchiveYear | null
  wall: WallChapter | null
  finish: FinishChapter | null
}

export function selectStory(archive: ArchiveData): EditionStory {
  return {
    habitYear: selectHabitYear(archive.years),
    peakYear: selectPeakYear(archive.years),
    wall: selectWall(archive.load, archive.weeks),
    finish: selectFinish(archive.races),
  }
}
