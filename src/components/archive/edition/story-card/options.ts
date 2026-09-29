/**
 * O card é uma imagem exportada: as cores são fixas e não seguem o tema da página.
 */
export type StoryColorway = {
  label: string
  background: string
  foreground: string
  accent: string
  muted: string
  line: string
}

export const STORY_COLORWAYS = {
  papel: {
    label: "Papel",
    background: "#F2F2EE",
    foreground: "#111210",
    accent: "#2B34F5",
    muted: "#8A8C84",
    line: "#CFD0C8",
  },
  tinta: {
    label: "Tinta",
    background: "#0F100E",
    foreground: "#EFEFEA",
    accent: "#8A90FF",
    muted: "#7C7E76",
    line: "#2E302B",
  },
  ultramar: {
    label: "Ultramar",
    background: "#2B34F5",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
    muted: "#B9BCFF",
    line: "#5A61F8",
  },
} as const satisfies Record<string, StoryColorway>

export type StoryColorwayId = keyof typeof STORY_COLORWAYS

export const STORY_COLORWAY_IDS = Object.keys(STORY_COLORWAYS) as StoryColorwayId[]

export const DEFAULT_STORY_COLORWAY: StoryColorwayId = "papel"

export const STORY_KIND_LABELS = {
  prova: "Prova",
  mes: "Mês",
  temporada: "Temporada",
} as const

export type StoryKind = keyof typeof STORY_KIND_LABELS

export const STORY_KINDS = Object.keys(STORY_KIND_LABELS) as StoryKind[]

/** Tamanho do PNG exportado (Stories, 9:16). */
export const STORY_IMAGE_SIZE = { width: 1080, height: 1920 } as const

export function isStoryKind(value: string | null): value is StoryKind {
  return value !== null && Object.hasOwn(STORY_KIND_LABELS, value)
}

export function isStoryColorway(value: string | null): value is StoryColorwayId {
  return value !== null && Object.hasOwn(STORY_COLORWAYS, value)
}

/** Caminho do PNG, usado pelo botão de download. */
export function storyImagePath(slug: string, kind: StoryKind, colorway: StoryColorwayId): string {
  const query = new URLSearchParams({ tipo: kind, cor: colorway })
  return `/${slug}/card?${query.toString()}`
}
