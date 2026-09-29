import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

import { buildStoryCards } from "@/components/archive/edition/story-card/content"
import {
  DEFAULT_STORY_COLORWAY,
  isStoryColorway,
  isStoryKind,
  STORY_COLORWAYS,
  STORY_IMAGE_SIZE,
  STORY_KINDS,
} from "@/components/archive/edition/story-card/options"
import {
  STORY_DESIGN_WIDTH,
  StoryCanvas,
} from "@/components/archive/edition/story-card/story-canvas"
import { getArchive } from "@/lib/archive/get-archive"
import { getProfileBySlug } from "@/lib/profile/get-profile"
import { getViewerProfile } from "@/lib/profile/get-viewer-profile"

import { IMAGE_STORY_FONTS, loadImageFonts } from "./image-fonts"

const PIXELS_PER_DESIGN_PX = STORY_IMAGE_SIZE.width / STORY_DESIGN_WIDTH

function imageScale(designPx: number): string {
  return `${designPx * PIXELS_PER_DESIGN_PX}px`
}

function notFound(): Response {
  return new Response("Card não encontrado.", { status: 404 })
}

/** PNG 1080 × 1920 do card do Stories: `?tipo=prova|mes|temporada&cor=papel|tinta|ultramar`. */
export async function GET(request: NextRequest, ctx: RouteContext<"/[slug]/card">) {
  const { slug } = await ctx.params
  const kindParam = request.nextUrl.searchParams.get("tipo")
  const colorwayParam = request.nextUrl.searchParams.get("cor")

  if (
    (kindParam !== null && !isStoryKind(kindParam)) ||
    (colorwayParam !== null && !isStoryColorway(colorwayParam))
  ) {
    return new Response("Use tipo=prova|mes|temporada e cor=papel|tinta|ultramar.", {
      status: 400,
    })
  }

  const profile = await getProfileBySlug(slug)
  if (!profile) return notFound()
  if (!profile.is_public) {
    const viewer = await getViewerProfile()
    if (viewer?.id !== profile.id) return notFound()
  }

  const cards = buildStoryCards(await getArchive(profile.id))
  const kind = kindParam ?? STORY_KINDS.find((candidate) => cards[candidate])
  const content = kind ? cards[kind] : undefined
  if (!kind || !content) return notFound()

  const colorway = STORY_COLORWAYS[colorwayParam ?? DEFAULT_STORY_COLORWAY]

  return new ImageResponse(
    (
      <StoryCanvas
        content={content}
        colorway={colorway}
        slug={profile.slug}
        athleteName={profile.display_name}
        fonts={IMAGE_STORY_FONTS}
        scale={imageScale}
      />
    ),
    {
      ...STORY_IMAGE_SIZE,
      fonts: await loadImageFonts(),
      headers: {
        "Content-Disposition": `inline; filename="ctt-${profile.slug}-${kind}.png"`,
        ...(profile.is_public ? {} : { "Cache-Control": "private, no-store" }),
      },
    }
  )
}
