import { addDays, localDayKey, weekStartOf } from "@/lib/archive/dates"
import type { ArchiveActivity, ArchiveStreaks } from "@/lib/archive/types"

/**
 * Sequência = semanas consecutivas com pelo menos uma corrida.
 * A semana corrente sem corrida ainda não quebra a sequência atual.
 */
export function computeStreaks(
  runs: ArchiveActivity[],
  today: string
): ArchiveStreaks {
  const runWeeks = [
    ...new Set(runs.map((run) => weekStartOf(localDayKey(run.start_date_local)))),
  ].sort()

  if (runWeeks.length === 0) {
    return { longestWeeks: 0, longestFrom: null, longestTo: null, currentWeeks: 0 }
  }

  let longestWeeks = 1
  let longestFrom = runWeeks[0]
  let longestTo = runWeeks[0]
  let streakStart = runWeeks[0]
  let streakLength = 1

  for (let i = 1; i < runWeeks.length; i += 1) {
    const isConsecutive = addDays(runWeeks[i - 1], 7) === runWeeks[i]
    if (isConsecutive) {
      streakLength += 1
    } else {
      streakStart = runWeeks[i]
      streakLength = 1
    }
    if (streakLength > longestWeeks) {
      longestWeeks = streakLength
      longestFrom = streakStart
      longestTo = runWeeks[i]
    }
  }

  const runWeekSet = new Set(runWeeks)
  const currentWeek = weekStartOf(today)
  let cursor = runWeekSet.has(currentWeek) ? currentWeek : addDays(currentWeek, -7)
  let currentWeeks = 0
  while (runWeekSet.has(cursor)) {
    currentWeeks += 1
    cursor = addDays(cursor, -7)
  }

  return { longestWeeks, longestFrom, longestTo, currentWeeks }
}
