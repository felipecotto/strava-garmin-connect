import type { ReactNode } from "react"

import { formatNumber, formatRaceTime } from "@/lib/archive/format"
import { selectStory } from "@/lib/archive/story"
import type { ArchiveData } from "@/lib/archive/types"
import type { ProfileRow } from "@/lib/supabase/types"

import { EDITION_ANCHORS } from "./anchors"
import { CalendarSection } from "./calendar-section"
import { FinishChapter } from "./chapters/finish-chapter"
import { FirstRunChapter } from "./chapters/first-run-chapter"
import { HabitChapter } from "./chapters/habit-chapter"
import { RecordsChapter } from "./chapters/records-chapter"
import { countWord, peakHour } from "./chapters/story-copy"
import { VolumeChapter } from "./chapters/volume-chapter"
import { WallChapter } from "./chapters/wall-chapter"
import { EditionFooter } from "./closing-sections"
import { EditionEmptyState } from "./edition-empty-state"
import { EditionHero } from "./edition-hero"
import { EditionNav } from "./edition-nav"
import { editionPhotos, PHOTO_COORDINATES } from "./photos"
import { EditionContainer } from "./section"
import type { StoryCards } from "./story-card/content"
import { StoryCardSection } from "./story-card/story-card-section"
import { Ticker } from "./ticker"

export const EDITION_LEDE =
  "Anos de treino cabem num feed que ninguém relê. O CTT transforma esse histórico numa história com começo, meio e chegada."

/** Lede com os números do atleta: "Seis anos, 812 corridas e duas maratonas cabem num feed…" */
export function archiveLede(archive: ArchiveData): string {
  const { totals, today, races } = archive
  if (totals.runs === 0 || !totals.firstRunYear) return EDITION_LEDE
  const years = Math.max(1, Number(today.slice(0, 4)) - totals.firstRunYear)
  const marathons = races.filter((race) => race.label === "42K").length
  const parts = [`${capitalize(countWord(years))} ${years === 1 ? "ano" : "anos"}`, `${formatNumber(totals.runs)} corridas`]
  if (marathons > 0) parts.push(`${countWord(marathons, true)} ${marathons === 1 ? "maratona" : "maratonas"}`)
  const subject = parts.length === 3 ? `${parts[0]}, ${parts[1]} e ${parts[2]}` : parts.join(" e ")
  return `${subject} cabem num feed que ninguém relê. O CTT transforma esse histórico numa história com começo, meio e chegada.`
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function editionLabel(profile: ProfileRow, isExample: boolean): string {
  return [isExample ? "Arquivo de exemplo" : "Arquivo", profile.display_name, profile.city]
    .filter(Boolean)
    .join(" · ")
}

type EditionPageProps = {
  profile: ProfileRow
  archive: ArchiveData
  storyCards: StoryCards
  hero: {
    label: string
    title: ReactNode
    lede: string
    badge?: ReactNode
    actions: ReactNode
  }
  navActions: ReactNode
  banner?: ReactNode
  /** Convite final (só para visitantes); recebe a foto do fechamento. */
  finalCta?: (photo: ReturnType<typeof editionPhotos>["suaVez"]) => ReactNode
}

export function EditionPage({
  profile,
  archive,
  storyCards,
  hero,
  navActions,
  banner,
  finalCta,
}: EditionPageProps) {
  const hasRuns = archive.totals.runs > 0
  const story = selectStory(archive)
  const photos = editionPhotos(profile.slug)
  const coordinates = PHOTO_COORDINATES[profile.slug]

  const present = new Set([
    "#largada",
    hasRuns && "#habito",
    hasRuns && story.peakYear && "#volume",
    hasRuns && archive.records.length > 0 && "#recordes",
    hasRuns && story.wall && "#muro",
    hasRuns && story.finish && "#chegada",
  ])
  const anchors = EDITION_ANCHORS.filter((anchor) => present.has(anchor.href))

  return (
    <>
      <EditionNav actions={navActions} anchors={anchors} />
      <main id="top" className="overflow-x-clip">
        <EditionHero
          {...hero}
          banner={banner}
          photo={hasRuns ? photos.largada : undefined}
          coordinates={coordinates}
          facts={
            hasRuns
              ? {
                  totalKm: archive.totals.km,
                  peakHour: peakHour(archive.hours),
                  finishTime: story.finish ? formatRaceTime(story.finish.race.movingSec) : null,
                }
              : undefined
          }
        />

        {hasRuns ? (
          <>
            <Ticker totals={archive.totals} races={archive.races} />
            {archive.firstRun ? (
              <FirstRunChapter
                firstRun={archive.firstRun}
                years={archive.years}
                habitYear={story.habitYear?.year ?? null}
                place={coordinates ? coordinates.split("·").at(-1)?.trim() : undefined}
              />
            ) : null}
            <HabitChapter
              hours={archive.hours}
              weekdays={archive.weekdays}
              highlights={archive.highlights}
              habitYear={story.habitYear}
              photo={photos.habito}
            />
            {story.peakYear ? (
              <VolumeChapter
                weeks={archive.weeks}
                years={archive.years}
                streaks={archive.streaks}
                highlights={archive.highlights}
                peakYear={story.peakYear}
                photo={photos.volume}
              />
            ) : null}
            <RecordsChapter
              records={archive.records}
              showActivityNames={profile.show_activity_names}
              peakYear={story.peakYear?.year ?? null}
              finish={story.finish}
            />
            {story.wall ? (
              <WallChapter
                load={archive.load}
                pauses={archive.pauses}
                races={archive.races}
                wall={story.wall}
                photo={photos.muro}
              />
            ) : null}
            {story.finish ? <FinishChapter finish={story.finish} photo={photos.chegada} /> : null}
            <StoryCardSection profile={profile} cards={storyCards} />
            <CalendarSection
              daily={archive.daily}
              today={archive.today}
              streaks={archive.streaks}
              months={archive.months}
              finishDate={story.finish?.race.date ?? null}
            />
          </>
        ) : (
          <EditionContainer className="pb-16">
            <EditionEmptyState syncStatus={profile.sync_status} />
          </EditionContainer>
        )}

        {finalCta?.(photos.suaVez)}
        {hasRuns ? <Ticker totals={archive.totals} races={archive.races} /> : null}
      </main>
      <EditionFooter />
    </>
  )
}
