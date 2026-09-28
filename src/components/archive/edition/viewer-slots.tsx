import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { buttonVariants } from "@/components/ui/button"
import { getViewerProfile } from "@/lib/profile/get-viewer-profile"
import type { ProfileRow } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

import { ConnectStravaLink, FinalCta } from "./closing-sections"
import { ShareButton } from "./share-button"
import { ViewerMenu } from "./viewer-menu"

function MyArchiveLink({ slug }: { slug: string }) {
  return (
    <Link href={`/${slug}`} className={cn(buttonVariants())}>
      Ver meu arquivo
    </Link>
  )
}

/** Canto direito do nav: avatar com menu para quem está logado, "Conectar Strava" para visitantes. */
export async function ViewerNavActions() {
  const viewer = await getViewerProfile()
  if (!viewer) return <ConnectStravaLink size="sm" />
  return (
    <ViewerMenu
      viewer={{ slug: viewer.slug, displayName: viewer.display_name, avatarUrl: viewer.avatar_url }}
    />
  )
}

/** Ações do hero na home, que sempre mostra o arquivo de exemplo. */
export async function DemoHeroActions() {
  const viewer = await getViewerProfile()
  return viewer ? <MyArchiveLink slug={viewer.slug} /> : <ConnectStravaLink />
}

/** Ações do hero num perfil: o dono compartilha; visitantes são convidados a criar o próprio arquivo. */
export async function ProfileHeroActions({ profile }: { profile: ProfileRow }) {
  const viewer = await getViewerProfile()
  if (viewer?.id === profile.id) {
    return <ShareButton path={`/${profile.slug}`} title={`${profile.display_name} · CTT`} />
  }
  return viewer ? <MyArchiveLink slug={viewer.slug} /> : <ConnectStravaLink />
}

export async function VisitorFinalCta() {
  const viewer = await getViewerProfile()
  return viewer ? null : <FinalCta />
}

/** Perfis privados só existem para o próprio dono. */
export async function OwnerOnly({
  profileId,
  children,
}: {
  profileId: string
  children: ReactNode
}) {
  const viewer = await getViewerProfile()
  if (viewer?.id !== profileId) notFound()
  return children
}
