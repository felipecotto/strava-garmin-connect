import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Odometer } from "./odometer"
import { SAMPLE_ARCHIVE } from "./sample-archive"

const meta = {
  title: "Edição/Odômetro",
  component: Odometer,
  parameters: { layout: "padded" },
  args: {
    totals: SAMPLE_ARCHIVE.totals,
    weeks: SAMPLE_ARCHIVE.weeks,
    highlights: SAMPLE_ARCHIVE.highlights,
  },
} satisfies Meta<typeof Odometer>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
