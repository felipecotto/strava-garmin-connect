import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { LandingHero } from "./landing-hero"

const meta = {
  title: "Landing/LandingHero",
  component: LandingHero,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LandingHero>

export default meta

type Story = StoryObj<typeof LandingHero>

export const Default: Story = {}
