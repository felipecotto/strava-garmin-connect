import { siteConfig } from "@/config/site"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDay, formatMonth, formatPace, formatRaceTime } from "@/lib/archive/format"
import type { ArchiveRecord } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { RECORD_LABEL, recordDelta, recordsFootnote } from "./copy"
import { EditionSection, FinePrint } from "./section"

/** Folga nas pontas da trilha para os pontos não encostarem na borda. */
const TRACK_PADDING_SHARE = 0.06

type PaceScale = { slowest: number; fastest: number }

function paceScale(records: ArchiveRecord[]): PaceScale {
  const slowest = Math.max(...records.map((record) => record.firstPace))
  const fastest = Math.min(...records.map((record) => record.bestPace))
  const padding = Math.max(1, (slowest - fastest) * TRACK_PADDING_SHARE)
  return { slowest: slowest + padding, fastest: fastest - padding }
}

function trackPosition(pace: number, scale: PaceScale): number {
  return ((scale.slowest - pace) / (scale.slowest - scale.fastest)) * 100
}

function mostRecentKey(records: ArchiveRecord[]) {
  return records.reduce((latest, record) => (record.date > latest.date ? record : latest)).key
}

function recordCellClass(index: number, count: number): string {
  const isLeftColumnOnMobile = index % 2 === 0
  return cn(
    "flex min-w-0 flex-col gap-1.5 border-border py-4.5 pr-4.5",
    isLeftColumnOnMobile ? "border-r" : "border-r-0 pl-4.5",
    index >= 2 && "border-t min-[900px]:border-t-0",
    index > 0 && "min-[900px]:pl-4.5",
    index < count - 1 ? "min-[900px]:border-r" : "min-[900px]:border-r-0"
  )
}

export function RecordsSection({
  records,
  showActivityNames,
}: {
  records: ArchiveRecord[]
  showActivityNames: boolean
}) {
  if (records.length === 0) return null

  const scale = paceScale(records)
  const starKey = mostRecentKey(records)

  return (
    <EditionSection
      id="recordes"
      label="Recordes"
      title="Do primeiro ao melhor."
      description="Cada distância mostra o melhor ritmo já feito e de onde ele saiu: o ponto vazado é a primeira vez nessa distância, o cheio é o recorde atual."
    >
      <div className="grid grid-cols-2 border-t border-foreground min-[900px]:grid-cols-4">
        {records.map((record, index) => (
          <RecordCell
            key={record.key}
            record={record}
            scale={scale}
            isStar={record.key === starKey}
            showActivityName={showActivityNames}
            className={recordCellClass(index, records.length)}
          />
        ))}
      </div>
      <FinePrint>{recordsFootnote(records)}</FinePrint>
    </EditionSection>
  )
}

type RecordCellProps = {
  record: ArchiveRecord
  scale: PaceScale
  isStar: boolean
  showActivityName: boolean
  className: string
}

function RecordCell({ record, scale, isStar, showActivityName, className }: RecordCellProps) {
  const label = RECORD_LABEL[record.key]
  const delta = isStar ? recordDelta(record) : null

  return (
    <div className={className}>
      <span className="type-label text-muted-foreground">{formatDay(record.date)}</span>
      <HoverCard>
        <HoverCardTrigger
          render={<button type="button" />}
          className={cn(
            "type-record w-fit cursor-default rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            isStar && "text-signal"
          )}
        >
          {label}
        </HoverCardTrigger>
        <HoverCardContent align="start" className="grid gap-1.5">
          <span className="font-medium">
            {showActivityName ? record.activityName : `Recorde de ${label}`}
          </span>
          <span className="font-mono text-[11px] text-popover-foreground/70">
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
      <span className={cn("text-[26px] font-semibold tabular-nums [font-stretch:80%]", isStar && "text-signal")}>
        {formatRaceTime(record.bestSec)}
      </span>
      <span className="text-sm text-ink-2">
        {formatPace(record.bestPace)}
        {delta ? <b className="text-signal"> · {delta}</b> : null}
      </span>
      <RecordProgress record={record} scale={scale} label={label} />
    </div>
  )
}

function RecordProgress({
  record,
  scale,
  label,
}: {
  record: ArchiveRecord
  scale: PaceScale
  label: string
}) {
  const first = trackPosition(record.firstPace, scale)
  const best = trackPosition(record.bestPace, scale)
  const summary = `Primeira vez nos ${label}: ${formatPace(record.firstPace)} em ${formatMonth(record.firstDate.slice(0, 7))}. Recorde: ${formatPace(record.bestPace)} em ${formatMonth(record.date.slice(0, 7))}.`

  return (
    <div className="mt-2.5">
      <Tooltip>
        <TooltipTrigger
          render={<div role="img" tabIndex={0} aria-label={summary} />}
          className="relative block h-5.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <span className="absolute inset-x-0 top-2.5 h-0.5 bg-border" />
          <span
            className="absolute top-2.5 h-0.5 bg-signal"
            style={{ left: `${first}%`, width: `${Math.max(0, best - first)}%` }}
          />
          <span
            className="absolute top-1.25 -ml-1.5 size-3 rounded-full border-2 border-muted-foreground bg-background"
            style={{ left: `${first}%` }}
          />
          <span
            className="absolute top-1.25 -ml-1.5 size-3 rounded-full border-2 border-background bg-signal"
            style={{ left: `${best}%` }}
          />
        </TooltipTrigger>
        <TooltipContent className="font-mono text-[11px]">{summary}</TooltipContent>
      </Tooltip>
      <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>
          {formatPace(record.firstPace, false)} · {record.firstDate.slice(0, 4)}
        </span>
        <span>{formatPace(record.bestPace, false)}</span>
      </div>
    </div>
  )
}
