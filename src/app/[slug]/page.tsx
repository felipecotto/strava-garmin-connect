import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { EDITION_LEDE, EditionPage, editionLabel } from "@/components/archive/edition/edition-page"
import { EditionSkeleton } from "@/components/archive/edition/edition-skeleton"
import {
  OwnerOnly,
  ProfileHeroActions,
  ViewerNavActions,
} from "@/components/archive/edition/viewer-slots"
import { Skeleton } from "@/components/ui/skeleton"
import { siteConfig } from "@/config/site"
import { getArchive } from "@/lib/archive/get-archive"
import { formatKm, formatNumber } from "@/lib/archive/format"
import { getProfileBySlug } from "@/lib/profile/get-profile"
import type { ProfileRow } from "@/lib/supabase/types"

type PageProps = {
  params: Promise<{ slug: string }>
}

/** O exemplo é pré-renderizado; os demais perfis são gerados na primeira visita. */
export function generateStaticParams() {
  return [{ slug: siteConfig.exampleProfileSlug }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

export default async function ProfileArchivePage({ params }: PageProps) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile) notFound()

  const edition = <ProfileEdition profile={profile} />
  if (profile.is_public) return edition

  return (
    <Suspense fallback={<EditionSkeleton />}>
      <OwnerOnly profileId={profile.id}>{edition}</OwnerOnly>
    </Suspense>
  )
}

async function ProfileEdition({ profile }: { profile: ProfileRow }) {
  const archive = await getArchive(profile.id)

  return (
    <EditionPage
      profile={profile}
      archive={archive}
      navActions={
        <Suspense fallback={<Skeleton className="h-9 w-36 rounded-full" />}>
          <ViewerNavActions />
        </Suspense>
      }
      hero={{
        label: editionLabel(profile, false),
        title: profile.display_name,
        lede: profile.bio?.trim() || EDITION_LEDE,
        actions: (
          <Suspense fallback={<Skeleton className="h-11 w-44 rounded-full" />}>
            <ProfileHeroActions profile={profile} />
          </Suspense>
        ),
      }}
    />
  )
}
