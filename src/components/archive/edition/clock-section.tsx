import { formatPercent } from "@/lib/archive/format"
import type { ArchiveData } from "@/lib/archive/types"

import {
  clockDescription,
  clockTitle,
  earlyShareText,
  saturdayShareText,
} from "./copy"
import { HoursChart, WeekdaysChart } from "./routine-charts"
import { EditionSection } from "./section"

type ClockSectionProps = Pick<ArchiveData, "hours" | "weekdays" | "highlights">

export function ClockSection({ hours, weekdays, highlights }: ClockSectionProps) {
  return (
    <EditionSection
      id="relogio"
      label="Relógio"
      title={clockTitle(hours)}
      description={clockDescription(weekdays)}
    >
      <div className="grid gap-10 min-[900px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <StatLine value={formatPercent(highlights.earlyShare)} text={earlyShareText()} />
          <HoursChart hours={hours} />
        </div>
        <div>
          <StatLine value={formatPercent(highlights.saturdayShare)} text={saturdayShareText()} />
          <WeekdaysChart weekdays={weekdays} />
        </div>
      </div>
    </EditionSection>
  )
}

function StatLine({ value, text }: { value: string; text: string }) {
  return (
    <p className="mb-3.5 flex flex-wrap items-baseline gap-3">
      <b className="text-5xl leading-none font-extrabold text-signal tabular-nums [font-stretch:70%]">
        {value}
      </b>
      <span className="max-w-[32ch] text-ink-2">{text}</span>
    </p>
  )
}
