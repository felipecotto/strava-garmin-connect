import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Footprints } from "lucide-react"

import { StatCard } from "./stat-card"

const meta = {
  title: "Dashboard/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof StatCard>

export default meta

type Story = StoryObj<typeof StatCard>

export const Default: Story = {
  args: {
    title: "Distância",
    value: "42,3 km",
    hint: "Somatório das atividades de corrida registradas.",
    icon: Footprints,
  },
}
