import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { CalendarSection } from "./calendar-section"
import { ClockSection } from "./clock-section"
import { FormSection } from "./form-section"
import { RecordsSection } from "./records-section"
import { SAMPLE_ARCHIVE } from "./sample-archive"
import { VolumeSection } from "./volume-section"

const archive = SAMPLE_ARCHIVE

const meta = {
  title: "Edição/Seções",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Volume: Story = {
  render: () => (
    <VolumeSection
      today={archive.today}
      months={archive.months}
      years={archive.years}
      highlights={archive.highlights}
    />
  ),
}

export const Forma: Story = {
  render: () => <FormSection load={archive.load} pauses={archive.pauses} races={archive.races} />,
}

export const Recordes: Story = {
  render: () => <RecordsSection records={archive.records} showActivityNames />,
}

export const RecordesSemNomes: Story = {
  render: () => <RecordsSection records={archive.records} showActivityNames={false} />,
}

export const Relogio: Story = {
  render: () => (
    <ClockSection hours={archive.hours} weekdays={archive.weekdays} highlights={archive.highlights} />
  ),
}

export const Calendario: Story = {
  render: () => (
    <CalendarSection daily={archive.daily} today={archive.today} streaks={archive.streaks} />
  ),
}
