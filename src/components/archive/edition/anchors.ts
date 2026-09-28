export type EditionAnchor = { href: `#${string}`; label: string }

export const STORY_CARD_ANCHOR = "card"

export const EDITION_ANCHORS: EditionAnchor[] = [
  { href: "#volume", label: "Volume" },
  { href: "#forma", label: "Forma" },
  { href: "#recordes", label: "Recordes" },
  { href: `#${STORY_CARD_ANCHOR}`, label: "Card" },
]
