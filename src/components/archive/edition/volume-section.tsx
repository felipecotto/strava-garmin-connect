import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatKm, formatNumber, formatPace } from "@/lib/archive/format"
import type { ArchiveData, ArchiveYear } from "@/lib/archive/types"
import { cn } from "@/lib/utils"

import { volumeDescription, volumeTitle, yearsFootnote } from "./copy"
import { MonthlyVolumeChart } from "./monthly-volume-chart"
import { EditionSection, FinePrint } from "./section"

type VolumeSectionProps = Pick<ArchiveData, "today" | "months" | "years" | "highlights">

export function VolumeSection({ today, months, years, highlights }: VolumeSectionProps) {
  return (
    <EditionSection
      id="volume"
      label="Volume"
      title={volumeTitle(years)}
      description={volumeDescription(years, highlights)}
    >
      <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
        <MonthlyVolumeChart months={months} currentYear={today.slice(0, 4)} />
        <div>
          <YearsTable years={years} />
          <FinePrint>{yearsFootnote(today, years)}</FinePrint>
        </div>
      </div>
    </EditionSection>
  )
}

const HEAD_CLASS = "h-auto pr-0 pb-2 pl-3 text-right font-mono text-[11px] font-normal tracking-[0.06em] text-muted-foreground uppercase first:pl-0 first:text-left"
const CELL_CLASS = "py-2.5 pr-0 pl-3 text-right text-[15px] first:pl-0 first:text-left"

function YearsTable({ years }: { years: ArchiveYear[] }) {
  const maxKm = Math.max(0, ...years.map((year) => year.km))
  const newestFirst = [...years].reverse()

  return (
    <Table aria-label="Resumo por ano" className="tabular-nums">
      <TableHeader className="[&_tr]:border-foreground">
        <TableRow className="hover:bg-transparent">
          <TableHead className={HEAD_CLASS}>Ano</TableHead>
          <TableHead className={HEAD_CLASS}>km</TableHead>
          <TableHead className={HEAD_CLASS}>Corridas</TableHead>
          <TableHead className={HEAD_CLASS}>Ritmo</TableHead>
          <TableHead className={HEAD_CLASS}>Maior</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {newestFirst.map((year) => {
          const isTop = year.km === maxKm && maxKm > 0
          return (
            <TableRow
              key={year.year}
              className={cn("border-border hover:bg-transparent", isTop && "font-semibold text-signal")}
            >
              <TableCell className={CELL_CLASS}>{year.year}</TableCell>
              <TableCell className={CELL_CLASS}>
                <span className="mr-2 inline-block w-14 text-left align-middle">
                  <span
                    className={cn("block h-1.5 rounded-r-[3px]", isTop ? "bg-signal" : "bg-border")}
                    style={{ width: `${(year.km / maxKm) * 100}%` }}
                  />
                </span>
                {formatKm(year.km, 0)}
              </TableCell>
              <TableCell className={CELL_CLASS}>{formatNumber(year.runs)}</TableCell>
              <TableCell className={CELL_CLASS}>{formatPace(year.paceSecPerKm, false)}</TableCell>
              <TableCell className={CELL_CLASS}>{formatKm(year.longestKm)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
