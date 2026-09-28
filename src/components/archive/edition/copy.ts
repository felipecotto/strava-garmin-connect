import {
  formatDay,
  formatKm,
  formatMonth,
  formatNumber,
  formatPercent,
  formatTimeDelta,
} from "@/lib/archive/format"
import { FATIGUE_DAYS, FITNESS_DAYS, MIN_PAUSE_WEEKS } from "@/lib/archive/load"
import { MAX_DISTANCE_RATIO } from "@/lib/archive/records"
import { EARLY_END_HOUR, EARLY_START_HOUR } from "@/lib/archive/routine"
import type {
  ArchiveData,
  ArchiveHighlights,
  ArchivePause,
  ArchiveRecord,
  ArchiveStreaks,
  ArchiveWeek,
  ArchiveYear,
  RecordKey,
  Weekday,
} from "@/lib/archive/types"

export const RECORD_LABEL: Record<RecordKey, string> = {
  "5k": "5K",
  "10k": "10K",
  half: "21K",
  marathon: "42K",
}

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sáb",
  dom: "Dom",
}

export const WEEKDAY_NAME: Record<Weekday, string> = {
  seg: "segunda",
  ter: "terça",
  qua: "quarta",
  qui: "quinta",
  sex: "sexta",
  sab: "sábado",
  dom: "domingo",
}

const NUMBER_WORDS = [
  "zero",
  "uma",
  "duas",
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
  "dez",
]

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function countWord(count: number): string {
  return NUMBER_WORDS[count] ?? formatNumber(count)
}

export function volumeTitle(years: ArchiveYear[]): string {
  if (years.length === 0) return "Nenhuma corrida ainda."
  if (years.length === 1) return "Uma temporada de corrida."
  return `${capitalize(countWord(years.length))} temporadas de corrida.`
}

export function volumeDescription(
  years: ArchiveYear[],
  highlights: ArchiveHighlights
): string {
  const biggest = years.reduce<ArchiveYear | null>(
    (top, year) => (!top || year.km > top.km ? year : top),
    null
  )
  if (!biggest) return ""

  const sentences = [
    `${biggest.year} foi o maior ano: ${formatKm(biggest.km, 0)} km em ${formatNumber(biggest.runs)} corridas.`,
  ]
  if (highlights.peakMonth) {
    sentences.push(
      `O mês mais forte foi ${formatMonth(highlights.peakMonth.month)}, com ${formatKm(highlights.peakMonth.km, 0)} km.`
    )
  }
  sentences.push(
    "O gráfico mostra o mês a mês, e a tabela resume cada temporada com o ritmo médio."
  )
  return sentences.join(" ")
}

export function stripRangeLabel(weeks: ArchiveWeek[]): string {
  const first = weeks[0]
  const last = weeks.at(-1)
  if (!first || !last) return "Cada barra é uma semana"
  return `Cada barra é uma semana · ${formatMonth(first.weekStart.slice(0, 7))} → ${formatMonth(last.weekStart.slice(0, 7))}`
}

export function peakWeekLabel(highlights: ArchiveHighlights): string | null {
  const peak = highlights.peakWeek
  if (!peak) return null
  return `Pico: ${formatKm(peak.km)} km · ${formatMonth(peak.weekStart.slice(0, 7))}`
}

export function yearsFootnote(today: string, years: ArchiveYear[]): string {
  const currentYear = Number(today.slice(0, 4))
  const base = "Ritmo médio de todas as corridas do ano, em min/km."
  return years.some((year) => year.year === currentYear)
    ? `${base} ${currentYear} vai até ${formatDay(today)}.`
    : base
}

export function formDescription(pauses: ArchivePause[], racesCount: number): string {
  const sentences = [
    `Forma é a média da carga dos últimos ${FITNESS_DAYS} dias. Fadiga é a mesma conta em ${FATIGUE_DAYS} dias.`,
    "Quando a fadiga passa muito da forma, é bloco pesado. Quando cai, é descanso.",
  ]
  if (racesCount > 0) {
    sentences.push("As linhas tracejadas marcam as provas.")
  }
  if (pauses.length === 1) {
    sentences.push(
      `A faixa cinza é uma pausa de ${pauses[0].weeks} semanas sem treino.`
    )
  } else if (pauses.length > 1) {
    sentences.push(
      `As faixas cinza são ${countWord(pauses.length)} pausas de ${countWord(MIN_PAUSE_WEEKS)} semanas ou mais.`
    )
  }
  return sentences.join(" ")
}

export function raceMarkerLabel(label: string, date: string): string {
  const name = label === "42K" ? "Maratona" : label === "21K" ? "Meia" : label
  return `${name} · ${formatMonth(date.slice(0, 7))}`
}

export function recordDelta(record: ArchiveRecord): string | null {
  if (record.previousBestSec === null || !record.previousDate) return null
  return `${formatTimeDelta(record.bestSec - record.previousBestSec)} vs. ${record.previousDate.slice(0, 4)}`
}

export function recordsFootnote(records: ArchiveRecord[]): string {
  const approximated = records.filter((record) => !record.exact)
  const exact = records.filter((record) => record.exact)
  const sentences: string[] = []
  if (approximated.length > 0) {
    const labels = approximated.map((record) => RECORD_LABEL[record.key])
    sentences.push(
      `Tempos de ${joinList(labels)} são aproximados: vêm do ritmo médio de uma atividade até ${formatPercent(MAX_DISTANCE_RATIO - 1)} mais longa que a distância.`
    )
  }
  if (exact.length > 0) {
    const labels = exact.map((record) => RECORD_LABEL[record.key])
    sentences.push(`${joinList(labels)}: tempo real em movimento.`)
  }
  return sentences.join(" ")
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("")
  return `${items.slice(0, -1).join(", ")} e ${items.at(-1)}`
}

function peakHour(hours: number[]): number | null {
  let peak: number | null = null
  hours.forEach((count, hour) => {
    if (count > 0 && (peak === null || count > hours[peak])) peak = hour
  })
  return peak
}

function dayPeriod(hour: number): string {
  if (hour < 5) return "da madrugada"
  if (hour < 12) return "da manhã"
  if (hour < 18) return "da tarde"
  return "da noite"
}

export function clockTitle(hours: number[]): string {
  const hour = peakHour(hours)
  if (hour === null) return "Ainda sem rotina."
  return `Corredor das ${hour}h ${dayPeriod(hour)}.`
}

export function clockDescription(
  weekdays: ArchiveData["weekdays"]
): string {
  const byRuns = [...weekdays].filter((day) => day.runs > 0).sort((a, b) => b.runs - a.runs)
  const byKm = [...weekdays].filter((day) => day.km > 0).sort((a, b) => b.km - a.km)
  if (byRuns.length === 0) return ""

  const sentences = ["O horário e o dia da semana contam a rotina melhor que qualquer legenda."]
  const frequent = byRuns.slice(0, 2).map((day) => WEEKDAY_NAME[day.day])
  sentences.push(
    frequent.length === 2
      ? `${capitalize(frequent[0])} e ${frequent[1]} são os dias mais frequentes.`
      : `${capitalize(frequent[0])} é o dia mais frequente.`
  )
  if (byKm[0]) {
    sentences.push(`${capitalize(WEEKDAY_NAME[byKm[0].day])} concentra o maior volume.`)
  }
  return sentences.join(" ")
}

export function earlyShareText(): string {
  return `das corridas começam entre ${EARLY_START_HOUR}h e ${EARLY_END_HOUR + 1}h.`
}

export function earlyShareValue(highlights: ArchiveHighlights): string {
  return formatPercent(highlights.earlyShare)
}

export function saturdayShareText(): string {
  return "de todo o volume acontece aos sábados."
}

export function streakText(streaks: ArchiveStreaks): string {
  if (!streaks.longestFrom || !streaks.longestTo || streaks.longestWeeks < 2) {
    return "Cada quadrado é um dia, mais escuro quanto mais longe."
  }
  const sentences = [
    "Cada quadrado é um dia, mais escuro quanto mais longe.",
    `O maior recorde de constância é outro: ${formatNumber(streaks.longestWeeks)} semanas seguidas com pelo menos uma corrida, de ${formatMonth(streaks.longestFrom.slice(0, 7))} a ${formatMonth(streaks.longestTo.slice(0, 7))}.`,
  ]
  if (streaks.currentWeeks >= 2) {
    sentences.push(`A sequência atual está em ${formatNumber(streaks.currentWeeks)} semanas.`)
  }
  return sentences.join(" ")
}
