import { Suspense } from "react"

import type { ProfileRow } from "@/lib/supabase/types"

import { STORY_CARD_ANCHOR } from "../anchors"
import { EDITION_SECTION_CLASS, EditionContainer, MonoLabel } from "../section"
import { OwnerSwitch } from "../viewer-slots"
import { hasStoryCards, type StoryCards } from "./content"
import { STORY_IMAGE_SIZE } from "./options"
import { StoryCardStudio } from "./story-card"

function StoryCardIntro() {
  return (
    <>
      <MonoLabel>Card para o Stories</MonoLabel>
      <h2 className="type-headline mt-2.5 text-balance">Um treino vira uma capa.</h2>
      <p className="mt-5 max-w-[56ch] text-ink-2">
        Escolha o que contar: uma prova, um mês ou a temporada inteira. O card sai em{" "}
        {STORY_IMAGE_SIZE.width} × {STORY_IMAGE_SIZE.height}, com os números no centro e fora
        das áreas que o Instagram cobre.
      </p>
    </>
  )
}

/** Todos veem a prévia; só o dono do arquivo baixa o PNG. */
export function StoryCardSection({ profile, cards }: { profile: ProfileRow; cards: StoryCards }) {
  if (!hasStoryCards(cards)) return null

  const studio = (canDownload: boolean) => (
    <StoryCardStudio
      intro={<StoryCardIntro />}
      cards={cards}
      slug={profile.slug}
      athleteName={profile.display_name}
      canDownload={canDownload}
    />
  )

  return (
    <section id={STORY_CARD_ANCHOR} className={EDITION_SECTION_CLASS}>
      <EditionContainer>
        <Suspense fallback={studio(false)}>
          <OwnerSwitch profileId={profile.id} owner={studio(true)} fallback={studio(false)} />
        </Suspense>
      </EditionContainer>
    </section>
  )
}
