import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { SAMPLE_ARCHIVE } from "../sample-archive"
import { MonoLabel } from "../section"
import { buildStoryCards } from "./content"
import { StoryCardStudio } from "./story-card"

const meta = {
  title: "Edição/Card do Stories",
  component: StoryCardStudio,
  parameters: { layout: "padded" },
  args: {
    intro: <MonoLabel>Card para o Stories</MonoLabel>,
    cards: buildStoryCards(SAMPLE_ARCHIVE),
    slug: "atleta",
    athleteName: "Atleta de Exemplo",
    canDownload: false,
  },
} satisfies Meta<typeof StoryCardStudio>

export default meta

type Story = StoryObj<typeof meta>

export const Visitante: Story = {}

export const Dono: Story = {
  args: { canDownload: true },
}

export const SemProva: Story = {
  args: {
    cards: { ...buildStoryCards(SAMPLE_ARCHIVE), prova: undefined },
  },
}
