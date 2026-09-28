import type { ArchiveData } from "@/lib/archive/types"

import { CalendarHeatmap, HeatLegend } from "./calendar-heatmap"
import { streakText } from "./copy"
import { EditionSection } from "./section"

type CalendarSectionProps = Pick<ArchiveData, "daily" | "today" | "streaks">

export function CalendarSection({ daily, today, streaks }: CalendarSectionProps) {
  return (
    <EditionSection
      id="ano"
      label="Últimos 12 meses"
      title="Um ano, dia por dia."
      description={streakText(streaks)}
    >
      <CalendarHeatmap daily={daily} today={today} />
      <HeatLegend />
    </EditionSection>
  )
}
