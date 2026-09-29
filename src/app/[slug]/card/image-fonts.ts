import { readFile } from "node:fs/promises"
import { join } from "node:path"

import type { StoryFonts } from "@/components/archive/edition/story-card/story-canvas"

/**
 * O Satori não lê eixos de fonte variável: cada largura do Archivo é um TTF estático
 * (instâncias do Google Fonts), registrado com um nome próprio.
 */
const IMAGE_FONTS = [
  { name: "Archivo ExtraCondensed", file: "archivo-extra-condensed-900.ttf", weight: 900 },
  { name: "Archivo SemiCondensed", file: "archivo-semi-condensed-600.ttf", weight: 600 },
  { name: "Archivo", file: "archivo-400.ttf", weight: 400 },
  { name: "Geist Mono", file: "geist-mono-400.ttf", weight: 400 },
] as const

const FONTS_DIR = join(process.cwd(), "assets", "fonts")

export const IMAGE_STORY_FONTS: StoryFonts = {
  display: { fontFamily: "Archivo ExtraCondensed", fontWeight: 900 },
  unit: { fontFamily: "Archivo SemiCondensed", fontWeight: 600 },
  body: { fontFamily: "Archivo", fontWeight: 400 },
  mono: { fontFamily: "Geist Mono", fontWeight: 400 },
}

type LoadedFont = {
  name: string
  data: Buffer
  weight: (typeof IMAGE_FONTS)[number]["weight"]
  style: "normal"
}

let loadedFonts: Promise<LoadedFont[]> | null = null

/** Lê os TTFs uma vez por instância do servidor. */
export function loadImageFonts(): Promise<LoadedFont[]> {
  loadedFonts ??= Promise.all(
    IMAGE_FONTS.map(async (font) => ({
      name: font.name,
      data: await readFile(join(FONTS_DIR, font.file)),
      weight: font.weight,
      style: "normal" as const,
    }))
  ).catch((error: unknown) => {
    loadedFonts = null
    throw error
  })
  return loadedFonts
}
