const LOCALE = "pt-BR"

function splitSeconds(totalSec: number) {
  const rounded = Math.round(totalSec)
  return {
    hours: Math.floor(rounded / 3600),
    minutes: Math.floor((rounded % 3600) / 60),
    seconds: rounded % 60,
  }
}

const pad2 = (value: number) => String(value).padStart(2, "0")

/** Ritmo em "m:ss/km". */
export function formatPace(secPerKm: number, withUnit = true): string {
  if (secPerKm <= 0) return "—"
  const rounded = Math.round(secPerKm)
  const text = `${Math.floor(rounded / 60)}:${pad2(rounded % 60)}`
  return withUnit ? `${text}/km` : text
}

/** Tempo de prova: "3:28:14" ou "22:41". */
export function formatRaceTime(totalSec: number): string {
  const { hours, minutes, seconds } = splitSeconds(totalSec)
  return hours > 0
    ? `${hours}:${pad2(minutes)}:${pad2(seconds)}`
    : `${minutes}:${pad2(seconds)}`
}

/** Diferença de tempo com sinal: "−5:58". */
export function formatTimeDelta(deltaSec: number): string {
  const sign = deltaSec < 0 ? "−" : "+"
  return `${sign}${formatRaceTime(Math.abs(deltaSec))}`
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatKm(km: number, decimals = 1): string {
  return formatNumber(km, decimals)
}

export function formatPercent(share: number): string {
  return `${Math.round(share * 100)}%`
}

/** "18 set 2026" */
export function formatDay(dayKey: string): string {
  return new Date(`${dayKey}T12:00:00Z`)
    .toLocaleDateString(LOCALE, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(/\./g, "")
    .replace(/ de /g, " ")
}

/** "abr 2025" */
export function formatMonth(month: string): string {
  return new Date(`${month}-01T12:00:00Z`)
    .toLocaleDateString(LOCALE, {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(/\./g, "")
    .replace(/ de /g, " ")
}
