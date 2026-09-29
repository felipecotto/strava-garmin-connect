import type { Metadata } from "next"
import { Suspense } from "react"

import { EditionFooter, SuaVezSection } from "@/components/archive/edition/closing-sections"
import { EditionHero } from "@/components/archive/edition/edition-hero"
import { EditionNav } from "@/components/archive/edition/edition-nav"
import {
  archiveLede,
  EDITION_LEDE,
  EditionPage,
  editionLabel,
} from "@/components/archive/edition/edition-page"
import { buildStoryCards } from "@/components/archive/edition/story-card/content"
import {
  DemoHeroActions,
  ViewerNavActions,
  VisitorFinalCta,
} from "@/components/archive/edition/viewer-slots"
import { ConnectionAlerts } from "@/components/site/connection-alerts"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getExampleEdition } from "@/lib/profile/get-example-edition"

export const metadata: Metadata = {
  title: {
    absolute: "CTT — Seu Strava, editado",
  },
}

const HOME_TITLE = (
  <>
    Seu Strava,
    <br />
    editado
    <br />
    <span className="text-signal">em 42 km.</span>
  </>
)

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const example = await getExampleEdition()
  const storyCards = example ? buildStoryCards(example.archive) : {}
  const navActions = (
    <Suspense fallback={<Skeleton className="h-10 w-36 rounded-none" />}>
      <ViewerNavActions />
    </Suspense>
  )
  const heroActions = (
    <Suspense fallback={<Skeleton className="h-12 w-44 rounded-none" />}>
      <DemoHeroActions showStoryLink={Boolean(example?.archive.firstRun)} />
    </Suspense>
  )
  const banner = (
    <Suspense fallback={null}>
      <ConnectionAlerts searchParams={searchParams} />
    </Suspense>
  )

  if (!example) {
    return (
      <>
        <EditionNav actions={navActions} showSections={false} />
        <main id="top">
          <EditionHero
            label="Arquivo de corrida"
            title={HOME_TITLE}
            lede={EDITION_LEDE}
            actions={heroActions}
            banner={banner}
          />
          <SuaVezSection />
        </main>
        <EditionFooter />
      </>
    )
  }

  return (
    <EditionPage
      profile={example.profile}
      archive={example.archive}
      storyCards={storyCards}
      navActions={navActions}
      banner={banner}
      finalCta={(photo) => (
        <Suspense fallback={null}>
          <VisitorFinalCta photo={photo} />
        </Suspense>
      )}
      hero={{
        label: editionLabel(example.profile, true),
        title: HOME_TITLE,
        lede: archiveLede(example.archive),
        badge: <Badge variant="outline">Arquivo de exemplo</Badge>,
        actions: heroActions,
      }}
    />
  )
}
