import type { CSSProperties } from "react"

import { siteConfig } from "@/config/site"

import type { StoryBar, StoryCardContent } from "./content"
import type { StoryColorway } from "./options"

/**
 * Mesmo desenho para a prévia (DOM) e para o PNG (Satori): só flexbox e estilos inline.
 * As medidas são px de um card de 330 de largura; `scale` converte para cada destino.
 */
export const STORY_DESIGN_WIDTH = 330
const STORY_DESIGN_HEIGHT = (STORY_DESIGN_WIDTH * 16) / 9

/** Topo e rodapé que o Instagram cobre ficam livres. */
const SAFE_AREA_SHARE = 0.12
const SIDE_PADDING_SHARE = 0.09

const CHART_HEIGHT = 110
const MIN_BAR_HEIGHT = 2
const BAR_WIDTH_SHARE = "62%"
const BAR_RADIUS = 1.5
const REGULAR_BAR_OPACITY = 0.85

/** Converte px do desenho em uma medida CSS com unidade ("12px", "3.6cqw"). */
export type StoryScale = (designPx: number) => string

export type StoryFonts = {
  display: CSSProperties
  unit: CSSProperties
  body: CSSProperties
  mono: CSSProperties
}

type StoryCanvasProps = {
  content: StoryCardContent
  colorway: StoryColorway
  slug: string
  athleteName: string
  fonts: StoryFonts
  scale: StoryScale
}

function StoryChart({
  bars,
  colorway,
  scale,
}: {
  bars: StoryBar[]
  colorway: StoryColorway
  scale: StoryScale
}) {
  const max = Math.max(...bars.map((bar) => bar.value), 0)
  const usableHeight = CHART_HEIGHT - 4

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: scale(CHART_HEIGHT),
        marginTop: scale(22),
        borderBottomWidth: scale(1),
        borderBottomStyle: "solid",
        borderBottomColor: colorway.line,
      }}
    >
      {bars.map((bar, index) => {
        const height =
          bar.value > 0 && max > 0
            ? Math.max(MIN_BAR_HEIGHT, (bar.value / max) * usableHeight)
            : 0
        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
              height: "100%",
            }}
          >
            <div
              style={{
                width: BAR_WIDTH_SHARE,
                height: scale(height),
                borderTopLeftRadius: scale(BAR_RADIUS),
                borderTopRightRadius: scale(BAR_RADIUS),
                backgroundColor: bar.highlight ? colorway.accent : colorway.foreground,
                opacity: bar.highlight ? 1 : REGULAR_BAR_OPACITY,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function footStyle(
  colorway: StoryColorway,
  fonts: StoryFonts,
  scale: StoryScale,
  marginTop: number
): CSSProperties {
  return {
    ...fonts.mono,
    display: "flex",
    marginTop: scale(marginTop),
    fontSize: scale(9.5),
    letterSpacing: scale(9.5 * 0.06),
    textTransform: "uppercase",
    color: colorway.muted,
  }
}

/** Com um rótulo por barra, cada um fica centrado sob a sua; senão, vão de ponta a ponta. */
function ChartAxis({
  labels,
  barsCount,
  colorway,
  fonts,
  scale,
}: {
  labels: string[]
  barsCount: number
  colorway: StoryColorway
  fonts: StoryFonts
  scale: StoryScale
}) {
  const alignedToBars = labels.length === barsCount
  return (
    <div
      style={{
        ...footStyle(colorway, fonts, scale, 12),
        justifyContent: "space-between",
      }}
    >
      {labels.map((label, index) => (
        <span
          key={index}
          style={
            alignedToBars
              ? { display: "flex", justifyContent: "center", flexGrow: 1, flexBasis: 0 }
              : undefined
          }
        >
          {label}
        </span>
      ))}
    </div>
  )
}

function Signature({
  slug,
  athleteName,
  colorway,
  fonts,
  scale,
}: {
  slug: string
  athleteName: string
  colorway: StoryColorway
  fonts: StoryFonts
  scale: StoryScale
}) {
  return (
    <div
      style={{
        ...footStyle(colorway, fonts, scale, 14),
        flexWrap: "wrap",
        justifyContent: "space-between",
        columnGap: scale(12),
        rowGap: scale(4),
      }}
    >
      <span>{`${siteConfig.domain}/${slug}`}</span>
      <span>{athleteName}</span>
    </div>
  )
}

export function StoryCanvas({
  content,
  colorway,
  slug,
  athleteName,
  fonts,
  scale,
}: StoryCanvasProps) {
  return (
    <div
      style={{
        ...fonts.body,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: `${scale(STORY_DESIGN_HEIGHT * SAFE_AREA_SHARE)} ${scale(STORY_DESIGN_WIDTH * SIDE_PADDING_SHARE)}`,
        backgroundColor: colorway.background,
        color: colorway.foreground,
      }}
    >
      <div
        style={{
          ...fonts.mono,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: scale(10),
          letterSpacing: scale(10 * 0.08),
          textTransform: "uppercase",
        }}
      >
        <span style={{ ...fonts.display, fontSize: scale(16), letterSpacing: 0 }}>
          {siteConfig.name}
        </span>
        <span>{content.heading}</span>
      </div>

      <div style={{ display: "flex", flexGrow: 1 }} />

      <div
        style={{
          ...fonts.mono,
          fontSize: scale(10.5),
          letterSpacing: scale(10.5 * 0.08),
          textTransform: "uppercase",
          color: colorway.muted,
        }}
      >
        {content.kicker}
      </div>

      <div
        style={{
          ...fonts.display,
          display: "flex",
          alignItems: "baseline",
          marginTop: scale(6),
          fontSize: scale(76),
          lineHeight: 0.85,
          letterSpacing: scale(76 * -0.03),
        }}
      >
        <span>{content.value}</span>
        {content.unit ? (
          <span
            style={{
              ...fonts.unit,
              marginLeft: scale(4),
              fontSize: scale(76 * 0.32),
              letterSpacing: 0,
            }}
          >
            {content.unit}
          </span>
        ) : null}
      </div>

      <div style={{ marginTop: scale(10), fontSize: scale(13) }}>{content.summary}</div>

      {content.highlight ? (
        <div style={{ display: "flex", marginTop: scale(10) }}>
          <div
            style={{
              ...fonts.mono,
              padding: `${scale(4)} ${scale(8)}`,
              borderWidth: scale(1),
              borderStyle: "solid",
              borderColor: colorway.accent,
              borderRadius: 999,
              fontSize: scale(10.5),
              letterSpacing: scale(10.5 * 0.06),
              textTransform: "uppercase",
              color: colorway.accent,
            }}
          >
            {content.highlight}
          </div>
        </div>
      ) : null}

      <StoryChart bars={content.bars} colorway={colorway} scale={scale} />
      <ChartAxis
        labels={content.axis}
        barsCount={content.bars.length}
        colorway={colorway}
        fonts={fonts}
        scale={scale}
      />
      <Signature
        slug={slug}
        athleteName={athleteName}
        colorway={colorway}
        fonts={fonts}
        scale={scale}
      />
    </div>
  )
}
