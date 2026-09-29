import {
  formatDay,
  formatKm,
  formatMonth,
  formatMonthLong,
  formatNumber,
  formatPace,
  formatPercent,
  formatRaceTime,
  formatTimeDelta,
} from "@/lib/archive/format"
import { EARLY_END_HOUR, EARLY_START_HOUR } from "@/lib/archive/routine"
import type { FinishChapter, WallChapter } from "@/lib/archive/story"
import type {
  ArchiveData,
  ArchiveFirstRun,
  ArchiveRecord,
  ArchiveStreaks,
  ArchiveYear,
} from "@/lib/archive/types"

import { WEEKDAY_NAME } from "../copy"

const NUMBER_WORDS = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"]
const NUMBER_WORDS_F = ["zero", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"]

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function countWord(count: number, feminine = false): string {
  const words = feminine ? NUMBER_WORDS_F : NUMBER_WORDS
  return words[count] ?? formatNumber(count)
}

// ---------- KM 5 · A primeira

export function firstRunText(firstRun: ArchiveFirstRun, years: ArchiveYear[], habitYear: number | null): string {
  const sentences = [
    `A primeira corrida registrada teve ${formatKm(firstRun.km)} km a ${formatPace(firstRun.paceSecPerKm)}.`,
  ]
  const firstYear = Number(firstRun.date.slice(0, 4))
  if (habitYear && habitYear > firstYear) {
    const before = years.filter((year) => year.year < habitYear)
    const runs = before.reduce((sum, year) => sum + year.runs, 0) - 1
    const longest = Math.max(0, ...before.map((year) => year.longestKm))
    if (runs > 0) {
      sentences.push(`Até ${habitYear - 1} vieram só mais ${formatNumber(runs)}.`)
      sentences.push(`Nenhuma passou de ${formatNumber(Math.ceil(longest))} km.`)
    }
  }
  return sentences.join(" ")
}

// ---------- KM 10 · O hábito

export function peakHour(hours: number[]): number | null {
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

export function habitTitle(hours: number[]): string {
  const hour = peakHour(hours)
  if (hour === null) return "Ainda sem rotina."
  return `Corredor das ${hour}h ${dayPeriod(hour)}.`
}

export function habitText(
  habitYear: ArchiveYear | null,
  weekdays: ArchiveData["weekdays"],
  earlyShare: number
): string {
  const sentences: string[] = []
  if (habitYear) {
    sentences.push(`Em ${habitYear.year} foram ${formatNumber(habitYear.runs)} corridas.`)
  }
  if (earlyShare >= 0.3) {
    sentences.push(
      `${formatPercent(earlyShare)} de todas começam entre ${EARLY_START_HOUR}h e ${EARLY_END_HOUR + 1}h.`
    )
  }
  const frequent = [...weekdays]
    .filter((day) => day.runs > 0)
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 2)
    .map((day) => WEEKDAY_NAME[day.day])
  if (frequent.length === 2) {
    sentences.push(`${capitalize(frequent[0])} e ${frequent[1]} viraram dias fixos.`)
  }
  return sentences.join(" ")
}

export function topWeekday(weekdays: ArchiveData["weekdays"]) {
  return weekdays.reduce<ArchiveData["weekdays"][number] | null>(
    (best, day) => (day.km > (best?.km ?? 0) ? day : best),
    null
  )
}

// ---------- KM 21 · O volume

export function volumeTitle(peakYear: ArchiveYear): string {
  return `${formatKm(peakYear.km, 0)} km em um ano.`
}

export function volumeText(
  peakYear: ArchiveYear,
  streaks: ArchiveStreaks,
  peakWeek: ArchiveData["highlights"]["peakWeek"]
): string {
  const parts = [`${peakYear.year} foi o ano do volume: ${formatNumber(peakYear.runs)} corridas`]
  const streakInYear =
    streaks.longestFrom && streaks.longestWeeks >= 10 && streaks.longestFrom.slice(0, 4) === String(peakYear.year)
  if (streakInYear && streaks.longestFrom) {
    parts.push(
      `uma sequência de ${formatNumber(streaks.longestWeeks)} semanas seguidas que começou em ${formatMonthLong(streaks.longestFrom.slice(0, 7)).split(" ")[0]}`
    )
  }
  if (peakWeek && peakWeek.weekStart.slice(0, 4) === String(peakYear.year)) {
    parts.push(`um pico de ${formatKm(peakWeek.km)} km numa semana de ${formatMonthLong(peakWeek.weekStart.slice(0, 7)).split(" ")[0]}`)
  }
  const [first, ...rest] = parts
  if (rest.length === 0) return `${first}.`
  const tail = rest.length === 1 ? rest[0] : `${rest.slice(0, -1).join(", ")} e ${rest.at(-1)}`
  return `${first}, ${tail}.`
}

// ---------- KM 21,1 · Os recordes

export function recordsTitle(records: ArchiveRecord[], peakYear: number | null): string {
  if (peakYear) {
    const inYear = records.filter((record) => record.date.startsWith(String(peakYear))).length
    if (inYear >= 2) return `${capitalize(countWord(inYear, false))} recordes em ${peakYear}.`
  }
  return "Do primeiro ao melhor."
}

export function recordsText(records: ArchiveRecord[], finish: FinishChapter | null): string {
  const sentences = [
    "Cada distância mostra o caminho da primeira vez até o melhor ritmo, na mesma escala para as quatro.",
  ]
  if (finish?.previous && finish.deltaSec !== null && finish.deltaSec < 0) {
    sentences.push(
      `A primeira maratona foi em ${formatMonth(finish.previous.date.slice(0, 7))}: ${formatRaceTime(finish.previous.movingSec)}. A mais recente baixou ${formatRaceTime(Math.abs(finish.deltaSec))}.`
    )
  } else if (records.length === 0) {
    return "Ainda não há corridas nas distâncias de recorde."
  }
  return sentences.join(" ")
}

// ---------- KM 30 · O muro

export function wallText(wall: WallChapter): string {
  const sentences: string[] = []
  if (wall.runlessWeeks >= 2 && wall.stopFrom) {
    sentences.push(
      `Em ${formatMonthLong(wall.stopFrom.slice(0, 7))} os treinos pararam por ${countWord(wall.runlessWeeks, true)} semanas.`
    )
  } else {
    sentences.push(`Em ${formatMonthLong(wall.peak.weekStart.slice(0, 7))} a carga despencou.`)
  }
  sentences.push(
    `A forma caiu de ${Math.round(wall.peak.fitness)} para ${Math.round(wall.low.fitness)} em ${countWord(wall.weeksDown, true)} semanas.`
  )
  if (wall.weeksToRecover !== null && wall.recoveredTo !== null) {
    sentences.push(
      `${capitalize(countWord(wall.weeksToRecover, true))} semanas depois, estava em ${Math.round(wall.recoveredTo)} de novo.`
    )
  }
  return sentences.join(" ")
}

// ---------- KM 42 · A chegada

export function raceName(label: string): string {
  if (label === "42K") return "maratona"
  if (label === "21K") return "meia maratona"
  return `prova de ${label}`
}

export function finishTitle(finish: FinishChapter): string {
  const { deltaSec, previous, race } = finish
  if (!previous || deltaSec === null) return `A primeira ${raceName(race.label)}.`
  if (deltaSec <= -60) {
    const minutes = Math.round(-deltaSec / 60)
    return `${capitalize(countWord(minutes))} ${minutes === 1 ? "minuto" : "minutos"} mais rápido.`
  }
  if (deltaSec < 0) return "Mais rápido que da última vez."
  return "Mais uma chegada."
}

export function finishText(finish: FinishChapter): string {
  const { race, previous, deltaSec } = finish
  const weeks = race.buildUp.weeks.length
  const sentences = [
    weeks > 0
      ? `${capitalize(countWord(weeks, true))} semanas e ${formatKm(race.buildUp.km, 0)} km depois, a ${raceName(race.label)} terminou em ${formatRaceTime(race.movingSec)}, a ${formatPace(race.paceSecPerKm)}.`
      : `A ${raceName(race.label)} terminou em ${formatRaceTime(race.movingSec)}, a ${formatPace(race.paceSecPerKm)}.`,
  ]
  if (previous && deltaSec !== null) {
    sentences.push(
      deltaSec < 0
        ? `${formatRaceTime(Math.abs(deltaSec))} abaixo da de ${formatDay(previous.date).slice(-4)}.`
        : `${formatRaceTime(deltaSec)} acima da de ${formatDay(previous.date).slice(-4)}.`
    )
  }
  return sentences.join(" ")
}

export function finishDetail(finish: FinishChapter): string {
  const { race, previous, deltaSec } = finish
  const parts = [`${formatKm(race.km)} km`, formatPace(race.paceSecPerKm)]
  if (previous && deltaSec !== null) {
    parts.push(`${formatTimeDelta(deltaSec)} vs. ${previous.date.slice(0, 4)}`)
  }
  return parts.join(" · ")
}
