import type { Metadata } from "next"
import { Suspense } from "react"

import {
  EditionFooter,
  HowItWorksSection,
} from "@/components/archive/edition/closing-sections"
import { EDITION_LEDE, EditionPage, editionLabel } from "@/components/archive/edition/edition-page"
import { EditionHero } from "@/components/archive/edition/edition-hero"
import { EditionNav } from "@/components/archive/edition/edition-nav"
import { EditionContainer } from "@/components/archive/edition/section"
import {
  DemoHeroActions,
  ViewerNavActions,
  VisitorFinalCta,
} from "@/components/archive/edition/viewer-slots"
import { HomeAlerts } from "@/components/site/home-alerts"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getExampleEdition } from "@/lib/profile/get-example-edition"

export const metadata: Metadata = {
  title: {
    absolute: "CTT — Arquivo de corrida",
  },
}

const HOME_TITLE = (
  <>
    Seu Strava, <em className="text-signal not-italic">editado.</em>
  </>
)

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const example = await getExampleEdition()
  const navActions = (
    <Suspense fallback={<Skeleton className="h-9 w-36 rounded-full" />}>
      <ViewerNavActions />
    </Suspense>
  )
  const heroActions = (
    <Suspense fallback={<Skeleton className="h-11 w-44 rounded-full" />}>
      <DemoHeroActions />
    </Suspense>
  )
  const banner = (
    <Suspense fallback={null}>
      <HomeAlerts searchParams={searchParams} />
    </Suspense>
  )
  const finalCta = (
    <Suspense fallback={null}>
      <VisitorFinalCta />
    </Suspense>
  )

  if (!example) {
    return (
      <>
        <EditionNav actions={navActions} />
        <main id="top">
          <EditionContainer className="pt-10 pb-14 md:pt-22 md:pb-28">
            {banner}
            <EditionHero label="Arquivo de corrida" title={HOME_TITLE} lede={EDITION_LEDE} actions={heroActions} />
          </EditionContainer>
          <HowItWorksSection />
          {finalCta}
        </main>
        <EditionFooter />
      </>
    )
  }

  return (
    <EditionPage
      profile={example.profile}
      archive={example.archive}
      navActions={navActions}
      banner={banner}
      finalCta={finalCta}
      hero={{
        label: editionLabel(example.profile, true),
        title: HOME_TITLE,
        lede: EDITION_LEDE,
        badge: <Badge variant="outline">Arquivo de exemplo</Badge>,
        actions: heroActions,
      }}
    />
  )
}
