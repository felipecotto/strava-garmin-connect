import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { InsightCard } from "./insight-card"

const meta = {
  title: "Dashboard/InsightCard",
  component: InsightCard,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InsightCard>

export default meta

type Story = StoryObj<typeof InsightCard>

export const Positive: Story = {
  args: {
    title: "Volume está estável",
    body: "Sua carga semanal está alinhada às últimas 4 semanas.",
    tone: "positive",
  },
}

export const Tip: Story = {
  args: {
    title: "Oportunidade: cadência",
    body: "Em intervalos, a cadência ficou abaixo da sua média.",
    tone: "tip",
  },
}
