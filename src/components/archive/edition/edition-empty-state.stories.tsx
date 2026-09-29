import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { EditionEmptyState } from "./edition-empty-state"

const meta = {
  title: "Edição/Estado vazio",
  component: EditionEmptyState,
  parameters: { layout: "padded" },
  argTypes: {
    syncStatus: { control: "select", options: ["pending", "syncing", "ready", "error"] },
  },
} satisfies Meta<typeof EditionEmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Importando: Story = {
  args: { syncStatus: "syncing" },
}

export const SemCorridas: Story = {
  args: { syncStatus: "ready" },
}
