import { eachDayOfMonth, monthKey } from "@/lib/archive/dates"
import {
  formatDay,
  formatDayMonth,
  formatHoursMinutes,
  formatKm,
  formatMonth,
  formatMonthLong,
  formatNumber,
  formatPace,
  formatRaceTime,
  formatTimeDelta,
} from "@/lib/archive/format"
import { BUILD_UP_WEEKS, HALF_MARATHON_LABEL, MARATHON_LABEL } from "@/lib/archive/races"
import type { ArchiveData, ArchiveMonth, ArchiveRace } from "@/lib/archive/types"

import type { StoryKind } from "./options"

export type StoryBar = { value: number; highlight: boolean }

export type StoryCardContent = {
  heading: string
  kicker: string
  value: string
  unit: string | null
  summary: string
  highlight: string | null
  bars: StoryBar[]
  /** Rótulos sob o gráfico, distribuídos de ponta a ponta. */
  axis: string[]
}

export type StoryCards = Partial<Record<StoryKind, StoryCardContent>>

const RACE_NAMES: Record<string, string> = {
  [MARATHON_LABEL]: "Maratona",
  [HALF_MARATHON_LABEL]: "Meia maratona",
}

function plural(count: number, singular: string, pluralForm: string): string {
  return `${formatNumber(count)} ${count === 1 ? singular : pluralForm}`
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function barsWithHighlight(values: number[], highlightIndex: number): StoryBar[] {
  return values.map((value, index) => ({ value, highlight: index === highlightIndex }))
}

function indexOfMax(values: number[]): number {
  return values.reduce((best, value, index) => (value > values[best] ? index : best), 0)
}

/** Melhor tempo nas provas anteriores da mesma distância. */
function previousBest(race: ArchiveRace, races: ArchiveRace[]): ArchiveRace | null {
  return races
    .filter((other) => other.label === race.label && other.date < race.date)
    .reduce<ArchiveRace | null>(
      (best, other) => (!best || other.movingSec < best.movingSec ? other : best),
      null
    )
}

function raceCard(archive: ArchiveData): StoryCardContent | null {
  const race = archive.races.at(-1)
  if (!race) return null

  const best = previousBest(race, archive.races)
  const weeklyKm = race.buildUp.weeks.map((week) => week.km)

  return {
    heading: `${RACE_NAMES[race.label] ?? race.label} · ${formatDay(race.date)}`,
    kicker: "Tempo em movimento",
    value: formatRaceTime(race.movingSec),
    unit: null,
    summary: `${formatKm(race.km)} km · ${formatPace(race.paceSecPerKm)}`,
    highlight: best
      ? `${formatTimeDelta(race.movingSec - best.movingSec)} vs. ${formatMonth(monthKey(best.date))}`
      : null,
    bars: barsWithHighlight(weeklyKm, weeklyKm.length - 1),
    axis: [
      `${BUILD_UP_WEEKS} semanas · ${formatKm(race.buildUp.km, 0)} km`,
      `maior: ${formatKm(race.buildUp.longestRunKm, 0)} km`,
    ],
  }
}

/** Último mês fechado com corrida e com todos os dias dentro da janela diária. */
function latestCompleteMonth(archive: ArchiveData): ArchiveMonth | null {
  const currentMonth = monthKey(archive.today)
  for (let index = archive.months.length - 1; index >= 0; index -= 1) {
    const month = archive.months[index]
    if (month.month >= currentMonth || month.runs === 0) continue
    if (!(`${month.month}-01` in archive.daily)) return null
    return month
  }
  return null
}

function monthCard(archive: ArchiveData): StoryCardContent | null {
  const month = latestCompleteMonth(archive)
  if (!month) return null

  const days = eachDayOfMonth(month.month)
  const dailyKm = days.map((day) => archive.daily[day] ?? 0)
  const biggestDay = indexOfMax(dailyKm)
  const paceSecPerKm = month.km > 0 ? month.movingSec / month.km : 0

  return {
    heading: capitalize(formatMonthLong(month.month)),
    kicker: "Volume do mês",
    value: formatKm(month.km, 0),
    unit: "km",
    summary: [
      plural(month.runs, "corrida", "corridas"),
      formatPace(paceSecPerKm),
      formatHoursMinutes(month.movingSec),
    ].join(" · "),
    highlight: `Maior dia: ${formatKm(dailyKm[biggestDay])} km · ${formatDayMonth(days[biggestDay])}`,
    bars: barsWithHighlight(dailyKm, biggestDay),
    axis: [formatDayMonth(days[0]), formatDayMonth(days[days.length - 1])],
  }
}

function seasonCard(archive: ArchiveData): StoryCardContent | null {
  const { years, totals } = archive
  const first = years[0]
  const last = years.at(-1)
  if (!first || !last) return null

  const yearlyKm = years.map((year) => year.km)
  const peakIndex = indexOfMax(yearlyKm)
  const marathons = archive.races.filter((race) => race.label === MARATHON_LABEL).length

  return {
    heading: first.year === last.year ? String(first.year) : `${first.year} — ${last.year}`,
    kicker: "Tudo que já corri",
    value: formatKm(totals.km, 0),
    unit: "km",
    summary: [
      plural(totals.runs, "corrida", "corridas"),
      plural(Math.round(totals.hours), "hora", "horas"),
      marathons > 0 ? plural(marathons, "maratona", "maratonas") : null,
    ]
      .filter(Boolean)
      .join(" · "),
    highlight:
      years.length > 1
        ? `Pico: ${formatKm(years[peakIndex].km, 0)} km em ${years[peakIndex].year}`
        : null,
    bars: barsWithHighlight(yearlyKm, peakIndex),
    axis: years.map((year) => String(year.year).slice(2)),
  }
}

/** Conteúdo dos três cards; tipos sem dados suficientes ficam de fora. */
export function buildStoryCards(archive: ArchiveData): StoryCards {
  const cards: StoryCards = {}
  const race = raceCard(archive)
  const month = monthCard(archive)
  const season = seasonCard(archive)
  if (race) cards.prova = race
  if (month) cards.mes = month
  if (season) cards.temporada = season
  return cards
}

export function hasStoryCards(cards: StoryCards): boolean {
  return Object.keys(cards).length > 0
}
