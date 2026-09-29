"use client"

import { Download } from "lucide-react"
import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import type { StoryCards } from "./content"
import {
  DEFAULT_STORY_COLORWAY,
  STORY_COLORWAY_IDS,
  STORY_COLORWAYS,
  STORY_KIND_LABELS,
  STORY_KINDS,
  storyImagePath,
  type StoryColorwayId,
  type StoryKind,
} from "./options"
import { STORY_DESIGN_WIDTH, StoryCanvas, type StoryFonts } from "./story-canvas"

/** Na página, as larguras do Archivo saem do eixo `wdth` da fonte variável. */
const PREVIEW_FONTS: StoryFonts = {
  display: { fontFamily: "var(--font-archivo)", fontWeight: 900, fontStretch: "62.5%" },
  unit: { fontFamily: "var(--font-archivo)", fontWeight: 600, fontStretch: "87.5%" },
  body: { fontFamily: "var(--font-archivo)", fontWeight: 400 },
  mono: { fontFamily: "var(--font-geist-mono)", fontWeight: 400 },
}

/** Medidas relativas à largura da prévia (container query), para escalar como o PNG. */
function previewScale(designPx: number): string {
  return `${(designPx / STORY_DESIGN_WIDTH) * 100}cqw`
}

function firstValue<T extends string>(value: string[]): T | undefined {
  return value[0] as T | undefined
}

type StoryCardStudioProps = {
  intro: ReactNode
  cards: StoryCards
  slug: string
  athleteName: string
  canDownload: boolean
}

export function StoryCardStudio({ intro, cards, slug, athleteName, canDownload }: StoryCardStudioProps) {
  const availableKinds = STORY_KINDS.filter((kind) => cards[kind])
  const [kind, setKind] = useState<StoryKind | undefined>(availableKinds[0])
  const [colorwayId, setColorwayId] = useState<StoryColorwayId>(DEFAULT_STORY_COLORWAY)
  const content = kind ? cards[kind] : undefined

  if (!kind || !content) return null

  return (
    <div className="grid items-center gap-10 min-[860px]:grid-cols-2 lg:gap-18">
      <div>
        {intro}

        <ToggleGroup
          aria-label="Tipo de card"
          value={[kind]}
          onValueChange={(value) => {
            const next = firstValue<StoryKind>(value)
            if (next) setKind(next)
          }}
          className="mt-7 flex-wrap"
        >
          {availableKinds.map((option) => (
            <ToggleGroupItem key={option} value={option} variant="chip" className="h-9 px-3.5">
              {STORY_KIND_LABELS[option]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <ToggleGroup
          aria-label="Cor do card"
          value={[colorwayId]}
          onValueChange={(value) => {
            const next = firstValue<StoryColorwayId>(value)
            if (next) setColorwayId(next)
          }}
          className="mt-3 flex-wrap"
        >
          {STORY_COLORWAY_IDS.map((option) => (
            <ToggleGroupItem key={option} value={option} variant="chip" className="h-9 gap-2 px-3.5">
              <span
                aria-hidden
                className="size-3.5 rounded-full border border-border"
                style={{ backgroundColor: STORY_COLORWAYS[option].background }}
              />
              {STORY_COLORWAYS[option].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {canDownload ? (
          <Button
            nativeButton={false}
            render={
              <a
                href={storyImagePath(slug, kind, colorwayId)}
                download={`ctt-${slug}-${kind}-${colorwayId}.png`}
              />
            }
            className="mt-7"
          >
            <Download aria-hidden />
            Baixar PNG
          </Button>
        ) : null}
      </div>

      <Card
        role="img"
        aria-label={`Card para o Stories: ${content.kicker} ${content.value}${content.unit ? ` ${content.unit}` : ""}`}
        className="@container relative aspect-[9/16] w-full max-w-[330px] justify-self-center gap-0 rounded-[22px] py-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
      >
        <div className="absolute inset-0">
          <StoryCanvas
            content={content}
            colorway={STORY_COLORWAYS[colorwayId]}
            slug={slug}
            athleteName={athleteName}
            fonts={PREVIEW_FONTS}
            scale={previewScale}
          />
        </div>
      </Card>
    </div>
  )
}
