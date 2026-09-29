import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { archiveLede, EditionPage, editionLabel } from "@/components/archive/edition/edition-page"
import { EditionSkeleton } from "@/components/archive/edition/edition-skeleton"
import { buildStoryCards, hasStoryCards } from "@/components/archive/edition/story-card/content"
import {
  OwnerOnly,
  ProfileHeroActions,
  ViewerNavActions,
  VisitorFinalCta,
} from "@/components/archive/edition/viewer-slots"
import { ConnectionAlerts } from "@/components/site/connection-alerts"
import { Skeleton } from "@/components/ui/skeleton"
import { siteConfig } from "@/config/site"
import { getArchive } from "@/lib/archive/get-archive"
import { formatKm, formatNumber } from "@/lib/archive/format"
import { getProfileBySlug } from "@/lib/profile/get-profile"
import type { ProfileRow } from "@/lib/supabase/types"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: SearchParams
}

/** O exemplo é pré-renderizado; os demais perfis são gerados na primeira visita. */
export function generateStaticParams() {
  return [{ slug: siteConfig.exampleProfileSlug }]
}

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile) return { title: "Arquivo não encontrado" }
  if (!profile.is_public) {
    return { title: profile.display_name, robots: { index: false, follow: false } }
  }

  const { totals } = await getArchive(profile.id)
  const description = [
    `${formatKm(totals.km, 0)} km`,
    `${formatNumber(totals.runs)} corridas`,
    totals.firstRunYear ? `desde ${totals.firstRunYear}` : null,
  ]
    .filter(Boolean)
    .join(" · ")

  return {
    title: profile.display_name,
    description: `${profile.display_name}, arquivo de corrida no CTT: ${description}.`,
    alternates: { canonical: `/${profile.slug}` },
    openGraph: {
      title: `${profile.display_name} · CTT`,
      description,
      url: `/${profile.slug}`,
      type: "profile",
    },
  }
}

export default async function ProfileArchivePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile) notFound()

  const edition = <ProfileEdition profile={profile} searchParams={searchParams} />
  if (profile.is_public) return edition

  return (
    <Suspense fallback={<EditionSkeleton />}>
      <OwnerOnly profileId={profile.id}>{edition}</OwnerOnly>
    </Suspense>
  )
}

async function ProfileEdition({
  profile,
  searchParams,
}: {
  profile: ProfileRow
  searchParams: SearchParams
}) {
  const archive = await getArchive(profile.id)
  const storyCards = buildStoryCards(archive)

  return (
    <EditionPage
      profile={profile}
      archive={archive}
      storyCards={storyCards}
      banner={
        <Suspense fallback={null}>
          <ConnectionAlerts searchParams={searchParams} />
        </Suspense>
      }
      navActions={
        <Suspense fallback={<Skeleton className="h-10 w-36 rounded-none" />}>
          <ViewerNavActions />
        </Suspense>
      }
      finalCta={(photo) => (
        <Suspense fallback={null}>
          <VisitorFinalCta photo={photo} />
        </Suspense>
      )}
      hero={{
        label: editionLabel(profile, false),
        title: profile.display_name,
        lede: profile.bio?.trim() || archiveLede(archive),
        actions: (
          <Suspense fallback={<Skeleton className="h-12 w-44 rounded-none" />}>
            <ProfileHeroActions profile={profile} hasStoryCard={hasStoryCards(storyCards)} />
          </Suspense>
        ),
      }}
    />
  )
}
