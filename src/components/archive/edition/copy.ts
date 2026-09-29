import { formatMonth, formatPercent, formatTimeDelta } from "@/lib/archive/format"
import { HALF_MARATHON_LABEL, MARATHON_LABEL } from "@/lib/archive/races"
import { MAX_DISTANCE_RATIO } from "@/lib/archive/records"
import type { ArchiveRecord, ArchiveWeek, RecordKey, Weekday } from "@/lib/archive/types"

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

export function stripRangeLabel(weeks: ArchiveWeek[]): string {
  const first = weeks[0]
  const last = weeks.at(-1)
  if (!first || !last) return "Cada barra é uma semana"
  return `Cada barra é uma semana · ${formatMonth(first.weekStart.slice(0, 7))} → ${formatMonth(last.weekStart.slice(0, 7))}`
}

export function raceMarkerLabel(label: string, date: string): string {
  const name =
    label === MARATHON_LABEL ? "Maratona" : label === HALF_MARATHON_LABEL ? "Meia" : label
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
