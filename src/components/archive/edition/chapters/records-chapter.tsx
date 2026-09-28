import { siteConfig } from "@/config/site"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDay, formatMonth, formatPace, formatRaceTime } from "@/lib/archive/format"
import type { FinishChapter } from "@/lib/archive/story"
import type { ArchiveRecord } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { Chapter } from "../chapter"
import { RECORD_LABEL, recordDelta, recordsFootnote } from "../copy"
import { FinePrint } from "../section"
import { recordsText, recordsTitle } from "./story-copy"

/** Escala comum de ritmo para as quatro trilhas (s/km): 7:30 à esquerda, 3:45 à direita. */
const SLOWEST_PACE = 450
const FASTEST_PACE = 225

function trackPosition(pace: number): number {
  const clamped = Math.min(SLOWEST_PACE, Math.max(FASTEST_PACE, pace))
  return ((SLOWEST_PACE - clamped) / (SLOWEST_PACE - FASTEST_PACE)) * 100
}

function mostRecent(records: ArchiveRecord[]): ArchiveRecord {
  return records.reduce((latest, record) => (record.date > latest.date ? record : latest))
}

type RecordsChapterProps = {
  records: ArchiveRecord[]
  showActivityNames: boolean
  peakYear: number | null
  finish: FinishChapter | null
}

export function RecordsChapter({ records, showActivityNames, peakYear, finish }: RecordsChapterProps) {
  if (records.length === 0) return null

  const star = mostRecent(records)
  const others = records.filter((record) => record.key !== star.key)
  const years = records.map((record) => record.date.slice(0, 7)).sort()
  const dateRange =
    years.length > 1 ? `${formatMonth(years[0])} — ${formatMonth(years.at(-1)!)}` : formatMonth(years[0])

  return (
    <Chapter
      id="recordes"
      km="21,1"
      name="Os recordes"
      date={dateRange}
      title={recordsTitle(records, peakYear)}
      text={recordsText(records, finish)}
    >
      <div className="grid border-t border-foreground md:grid-cols-12">
        <RecordCell record={star} isStar showActivityName={showActivityNames} className="md:col-span-5" />
        <div className="grid grid-cols-2 md:col-span-7 md:grid-cols-3">
          {others.map((record, index) => (
            <RecordCell
              key={record.key}
              record={record}
              isStar={false}
              showActivityName={showActivityNames}
              className={cn(
                "border-border md:border-l",
                index % 2 === 1 && "border-l md:border-l",
                index >= 2 && "border-t md:border-t-0"
              )}
            />
          ))}
        </div>
      </div>
      <div className="type-label mt-4 flex justify-between gap-4 text-muted-foreground">
        <span>← 7:30/km · mais lento</span>
        <span className="hidden sm:inline">Mesma escala nas quatro distâncias</span>
        <span>mais rápido · 3:45/km →</span>
      </div>
      <FinePrint>{recordsFootnote(records)}</FinePrint>
    </Chapter>
  )
}

type RecordCellProps = {
  record: ArchiveRecord
  isStar: boolean
  showActivityName: boolean
  className?: string
}

function RecordCell({ record, isStar, showActivityName, className }: RecordCellProps) {
  const label = RECORD_LABEL[record.key]
  const delta = isStar ? recordDelta(record) : null

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2 p-5 md:p-6",
        isStar ? "bg-signal text-white" : "bg-background",
        className
      )}
    >
      <span className={cn("type-label", isStar ? "text-white/80" : "text-muted-foreground")}>
        {formatDay(record.date)}
      </span>
      <HoverCard>
        <HoverCardTrigger
          render={<button type="button" />}
          className={cn(
            "w-fit cursor-default rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            isStar ? "type-giant text-[clamp(96px,11vw,160px)]" : "type-record"
          )}
        >
          {label}
        </HoverCardTrigger>
        <HoverCardContent align="start" className="grid gap-1.5">
          <span className="font-medium">{showActivityName ? record.activityName : `Recorde de ${label}`}</span>
          <span className="font-mono text-xs text-popover-foreground/80">
            {formatDay(record.date)} · {formatRaceTime(record.bestSec)} · {formatPace(record.bestPace)}
          </span>
          <a
            href={`${siteConfig.stravaActivityUrl}/${record.activityId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit font-semibold underline underline-offset-2"
          >
            View on Strava
          </a>
        </HoverCardContent>
      </HoverCard>
      {isStar && record.previousBestSec !== null ? (
        <span className="type-subtitle text-white/80 line-through decoration-2">
          {formatRaceTime(record.previousBestSec)}
        </span>
      ) : null}
      <span className={cn("type-title", isStar && "text-[clamp(40px,4vw,56px)]")}>{formatRaceTime(record.bestSec)}</span>
      <span className={cn("text-sm", isStar ? "text-white/90" : "text-ink-2")}>
        {formatPace(record.bestPace)}
        {delta ? <b> · {delta}</b> : null}
      </span>
      <RecordProgress record={record} label={label} onSignal={isStar} />
    </div>
  )
}

function RecordProgress({ record, label, onSignal }: { record: ArchiveRecord; label: string; onSignal: boolean }) {
  const first = trackPosition(record.firstPace)
  const best = trackPosition(record.bestPace)
  const summary = `Primeira vez nos ${label}: ${formatPace(record.firstPace)} em ${formatMonth(record.firstDate.slice(0, 7))}. Recorde: ${formatPace(record.bestPace)} em ${formatMonth(record.date.slice(0, 7))}.`

  return (
    <div className="mt-auto pt-6">
      <Tooltip>
        <TooltipTrigger
          render={<div role="img" tabIndex={0} aria-label={summary} />}
          className="relative block h-5.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <span className={cn("absolute inset-x-0 top-2.5 h-0.5", onSignal ? "bg-white/35" : "bg-border")} />
          <span
            className={cn("absolute top-2.5 h-0.5", onSignal ? "bg-white" : "bg-signal")}
            style={{ left: `${first}%`, width: `${Math.max(0, best - first)}%` }}
          />
          <span
            className={cn(
              "absolute top-1.25 -ml-1.5 size-3 rounded-full border-2",
              onSignal ? "border-white bg-signal" : "border-muted-foreground bg-background"
            )}
            style={{ left: `${first}%` }}
          />
          <span
            className={cn(
              "absolute top-1.25 -ml-1.5 size-3 rounded-full border-2",
              onSignal ? "border-signal bg-white" : "border-background bg-signal"
            )}
            style={{ left: `${best}%` }}
          />
        </TooltipTrigger>
        <TooltipContent className="font-mono text-xs">{summary}</TooltipContent>
      </Tooltip>
      <div className={cn("type-label mt-1 flex justify-between", onSignal ? "text-white/80" : "text-muted-foreground")}>
        <span>
          {formatPace(record.firstPace, false)} · {record.firstDate.slice(0, 4)}
        </span>
        <span>{formatPace(record.bestPace, false)}</span>
      </div>
    </div>
  )
}
