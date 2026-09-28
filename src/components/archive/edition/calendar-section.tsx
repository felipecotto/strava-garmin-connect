import { formatMonth, formatNumber } from "@/lib/archive/format"
import type { ArchiveData } from "@/lib/archive/types"

import { CalendarHeatmap, HeatLegend } from "./calendar-heatmap"
import { EditionContainer, MonoLabel } from "./section"

type CalendarSectionProps = Pick<ArchiveData, "daily" | "today" | "streaks" | "months"> & {
  /** Data da prova da chegada; se houver, o título fala do que veio depois. */
  finishDate?: string | null
}

function calendarText(months: ArchiveData["months"], today: string, finishDate?: string | null): string {
  const lastFull = months.filter((month) => month.month < today.slice(0, 7)).at(-1)
  const sentences = ["Cada quadrado é um dia, mais escuro quanto mais longe."]
  if (lastFull && lastFull.km > 0) {
    sentences.push(
      `${finishDate ? "Depois da chegada, a rotina voltou: " : "No último mês fechado, "}${formatNumber(Math.round(lastFull.km))} km em ${formatMonth(lastFull.month)}.`
    )
  }
  return sentences.join(" ")
}

export function CalendarSection({ daily, today, streaks, months, finishDate }: CalendarSectionProps) {
  return (
    <section id="ano" data-km="42,2" aria-labelledby="ano-titulo" className="scroll-mt-16 py-16 md:py-28">
      <EditionContainer>
        <div className="grid gap-5 border-t border-foreground pt-8 min-[860px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] min-[860px]:items-end lg:gap-16">
          <div>
            <MonoLabel>Pós-prova · Últimos 12 meses</MonoLabel>
            <h2 id="ano-titulo" className="type-headline mt-3 text-balance">
              {finishDate ? "O treino continua." : "Um ano, dia por dia."}
            </h2>
          </div>
          <p className="max-w-[52ch] text-[17px] text-ink-2">{calendarText(months, today, finishDate)}</p>
        </div>

        <div className="mt-12">
          <CalendarHeatmap daily={daily} today={today} />
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <HeatLegend />
          {streaks.longestFrom && streaks.longestTo && streaks.longestWeeks >= 2 ? (
            <div className="border-t border-foreground pt-3 text-right">
              <p className="type-label text-muted-foreground">
                Semanas seguidas · {formatMonth(streaks.longestFrom.slice(0, 7))} a {formatMonth(streaks.longestTo.slice(0, 7))}
              </p>
              <p className="type-title mt-1 text-signal">{formatNumber(streaks.longestWeeks)}</p>
            </div>
          ) : null}
        </div>
      </EditionContainer>
    </section>
  )
}
