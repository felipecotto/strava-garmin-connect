import type { ReactNode } from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { STORY_CARD_ANCHOR } from "../anchors"

export function StoryCardLink({
  variant = "ghost",
  children,
}: {
  variant?: "default" | "ghost"
  children: ReactNode
}) {
  return (
    <a href={`#${STORY_CARD_ANCHOR}`} className={cn(buttonVariants({ variant }))}>
      {children}
    </a>
  )
}
