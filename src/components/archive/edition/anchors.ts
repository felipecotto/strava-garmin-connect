export type EditionAnchor = { href: `#${string}`; label: string }

export const STORY_CARD_ANCHOR = "card"

/** Capítulos da edição, na ordem da prova. A página filtra os que existem para o atleta. */
export const EDITION_ANCHORS: EditionAnchor[] = [
  { href: "#largada", label: "Largada" },
  { href: "#habito", label: "Hábito" },
  { href: "#volume", label: "Volume" },
  { href: "#recordes", label: "Recordes" },
  { href: "#muro", label: "Muro" },
  { href: "#chegada", label: "Chegada" },
]
