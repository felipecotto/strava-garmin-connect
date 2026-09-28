/**
 * Datas do arquivo são chaves de calendário "YYYY-MM-DD" no fuso do atleta.
 * `start_date_local` chega como horário local com sufixo UTC, então lemos com getters UTC.
 */

const DAY_MS = 24 * 60 * 60 * 1000

function toUtcDate(dayKey: string): Date {
  return new Date(`${dayKey}T00:00:00Z`)
}

function formatDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function localDayKey(startDateLocal: string): string {
  return formatDayKey(new Date(startDateLocal))
}

export function localHour(startDateLocal: string): number {
  return new Date(startDateLocal).getUTCHours()
}

export function monthKey(dayKey: string): string {
  return dayKey.slice(0, 7)
}

export function addDays(dayKey: string, days: number): string {
  return formatDayKey(new Date(toUtcDate(dayKey).getTime() + days * DAY_MS))
}

/** 0 = segunda … 6 = domingo. */
export function weekdayIndex(dayKey: string): number {
  return (toUtcDate(dayKey).getUTCDay() + 6) % 7
}

/** Segunda-feira da semana ISO que contém o dia. */
export function weekStartOf(dayKey: string): string {
  return addDays(dayKey, -weekdayIndex(dayKey))
}

export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round(
    (toUtcDate(toKey).getTime() - toUtcDate(fromKey).getTime()) / DAY_MS
  )
}

/** Segundas-feiras de `fromKey` até `toKey`, inclusive. */
export function eachWeekStart(fromKey: string, toKey: string): string[] {
  const weeks: string[] = []
  for (
    let week = weekStartOf(fromKey);
    week <= toKey;
    week = addDays(week, 7)
  ) {
    weeks.push(week)
  }
  return weeks
}

/** Meses "YYYY-MM" de `fromMonth` até `toMonth`, inclusive. */
export function eachMonth(fromMonth: string, toMonth: string): string[] {
  const months: string[] = []
  let [year, month] = fromMonth.split("-").map(Number)
  const [endYear, endMonth] = toMonth.split("-").map(Number)
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`)
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return months
}

/** Dias "YYYY-MM-DD" do mês "YYYY-MM". */
export function eachDayOfMonth(month: string): string[] {
  const days: string[] = []
  for (let day = `${month}-01`; monthKey(day) === month; day = addDays(day, 1)) {
    days.push(day)
  }
  return days
}

/** Extrai o fuso IANA do formato do Strava: "(GMT-03:00) America/Sao_Paulo". */
export function ianaTimeZone(stravaTimeZone: string | null): string | null {
  const match = stravaTimeZone?.match(/\)\s*(\S+)$/)
  return match ? match[1] : null
}

/** Dia de hoje no fuso informado (UTC se o fuso for inválido ou ausente). */
export function todayKey(now: Date, timeZone: string | null): string {
  if (timeZone) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(now)
    } catch {
      // fuso desconhecido pelo runtime: cai para UTC
    }
  }
  return formatDayKey(now)
}
