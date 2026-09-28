import type { ReactNode } from "react"

import type { ArchiveData } from "@/lib/archive/types"
import type { ProfileRow } from "@/lib/supabase/types"

import { CalendarSection } from "./calendar-section"
import { ClockSection } from "./clock-section"
import { EditionFooter, HowItWorksSection } from "./closing-sections"
import { EditionEmptyState } from "./edition-empty-state"
import { EditionHero } from "./edition-hero"
import { EditionNav } from "./edition-nav"
import { FormSection } from "./form-section"
import { Odometer } from "./odometer"
import { RecordsSection } from "./records-section"
import { EditionContainer } from "./section"
import { VolumeSection } from "./volume-section"

export const EDITION_LEDE =
  "O Strava guarda cada treino num feed. O CTT lê esse histórico e monta uma edição dele: quanto você correu, como sua forma mudou, onde estão seus recordes. No fim, vira um card pronto para o Stories."

export function editionLabel(profile: ProfileRow, isExample: boolean): string {
  return [isExample ? "Arquivo de exemplo" : "Arquivo", profile.display_name, profile.city]
    .filter(Boolean)
    .join(" · ")
}

type EditionPageProps = {
  profile: ProfileRow
  archive: ArchiveData
  hero: {
    label: string
    title: ReactNode
    lede: string
    badge?: ReactNode
    actions: ReactNode
  }
  navActions: ReactNode
  banner?: ReactNode
  finalCta?: ReactNode
}

export function EditionPage({
  profile,
  archive,
  hero,
  navActions,
  banner,
  finalCta,
}: EditionPageProps) {
  const hasRuns = archive.totals.runs > 0

  return (
    <>
      <EditionNav actions={navActions} />
      <main id="top">
        <EditionContainer className="pt-10 pb-6 md:pt-22">
          {banner}
          <EditionHero {...hero} />
          {hasRuns ? (
            <Odometer totals={archive.totals} weeks={archive.weeks} highlights={archive.highlights} />
          ) : (
            <EditionEmptyState syncStatus={profile.sync_status} />
          )}
        </EditionContainer>

        {hasRuns ? (
          <>
            <VolumeSection
              today={archive.today}
              months={archive.months}
              years={archive.years}
              highlights={archive.highlights}
            />
            <FormSection load={archive.load} pauses={archive.pauses} races={archive.races} />
            <RecordsSection records={archive.records} showActivityNames={profile.show_activity_names} />
            <ClockSection hours={archive.hours} weekdays={archive.weekdays} highlights={archive.highlights} />
            <CalendarSection daily={archive.daily} today={archive.today} streaks={archive.streaks} />
          </>
        ) : null}

        <HowItWorksSection />
        {finalCta}
      </main>
      <EditionFooter />
    </>
  )
}
