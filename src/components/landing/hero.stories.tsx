import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Hero } from "@/components/landing/hero"

const meta = {
  title: "Landing/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
  args: {
    featured: null,
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
