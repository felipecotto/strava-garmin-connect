import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { selectStory } from "@/lib/archive/story"

import { CalendarSection } from "./calendar-section"
import { FinishChapter } from "./chapters/finish-chapter"
import { FirstRunChapter } from "./chapters/first-run-chapter"
import { HabitChapter } from "./chapters/habit-chapter"
import { RecordsChapter } from "./chapters/records-chapter"
import { VolumeChapter } from "./chapters/volume-chapter"
import { WallChapter } from "./chapters/wall-chapter"
import { SAMPLE_ARCHIVE } from "./sample-archive"
import { Ticker } from "./ticker"

const archive = SAMPLE_ARCHIVE
const story = selectStory(archive)

const meta = {
  title: "Edição/Capítulos",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Faixa: Story = {
  render: () => <Ticker totals={archive.totals} races={archive.races} />,
}

export const APrimeira: Story = {
  render: () =>
    archive.firstRun ? (
      <FirstRunChapter firstRun={archive.firstRun} years={archive.years} habitYear={story.habitYear?.year ?? null} />
    ) : (
      <></>
    ),
}

export const OHabito: Story = {
  render: () => (
    <HabitChapter
      hours={archive.hours}
      weekdays={archive.weekdays}
      highlights={archive.highlights}
      habitYear={story.habitYear}
    />
  ),
}

export const OVolume: Story = {
  render: () =>
    story.peakYear ? (
      <VolumeChapter
        weeks={archive.weeks}
        years={archive.years}
        streaks={archive.streaks}
        highlights={archive.highlights}
        peakYear={story.peakYear}
      />
    ) : (
      <></>
    ),
}

export const OsRecordes: Story = {
  render: () => (
    <RecordsChapter records={archive.records} showActivityNames peakYear={story.peakYear?.year ?? null} finish={story.finish} />
  ),
}

export const OMuro: Story = {
  render: () =>
    story.wall ? (
      <WallChapter load={archive.load} pauses={archive.pauses} races={archive.races} wall={story.wall} />
    ) : (
      <></>
    ),
}

export const AChegada: Story = {
  render: () => (story.finish ? <FinishChapter finish={story.finish} /> : <></>),
}

export const Calendario: Story = {
  render: () => (
    <CalendarSection
      daily={archive.daily}
      today={archive.today}
      streaks={archive.streaks}
      months={archive.months}
      finishDate={story.finish?.race.date ?? null}
    />
  ),
}
