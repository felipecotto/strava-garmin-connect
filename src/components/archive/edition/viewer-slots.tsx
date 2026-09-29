import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getBetaStatus } from "@/lib/beta/get-beta-status"
import { getViewerProfile } from "@/lib/profile/get-viewer-profile"
import type { ProfileRow } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

import { ConnectStravaLink, SuaVezSection } from "./closing-sections"
import type { EditionPhoto } from "./photos"
import { ShareButton } from "./share-button"
import { StoryCardLink } from "./story-card/story-card-link"
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
  if (!viewer) {
    const beta = await getBetaStatus()
    if (beta.phase === "lotado") {
      return (
        <a href="#conectar" className={cn(buttonVariants({ size: "sm" }))}>
          Entrar na fila
        </a>
      )
    }
    return <ConnectStravaLink size="sm" />
  }
  return (
    <ViewerMenu
      viewer={{ slug: viewer.slug, displayName: viewer.display_name, avatarUrl: viewer.avatar_url }}
    />
  )
}

function SeeStoryCardLink({ hasStoryCard }: { hasStoryCard: boolean }) {
  return hasStoryCard ? <StoryCardLink>Ver o card</StoryCardLink> : null
}

/** Ações do hero na home, que sempre mostra o arquivo de exemplo. */
export async function DemoHeroActions({ showStoryLink = true }: { showStoryLink?: boolean } = {}) {
  const viewer = await getViewerProfile()
  return (
    <>
      {viewer ? <MyArchiveLink slug={viewer.slug} /> : <ConnectStravaLink />}
      {showStoryLink ? (
        <a href="#primeira" className={cn(buttonVariants({ variant: "outline" }))}>
          Ler a história do {siteConfig.author.name.split(" ")[0]}
        </a>
      ) : null}
    </>
  )
}

/** Ações do hero num perfil: o dono gera o card e compartilha; visitantes são convidados a criar o próprio arquivo. */
export async function ProfileHeroActions({
  profile,
  hasStoryCard,
}: {
  profile: ProfileRow
  hasStoryCard: boolean
}) {
  const viewer = await getViewerProfile()
  if (viewer?.id === profile.id) {
    return (
      <>
        {hasStoryCard ? <StoryCardLink variant="default">Gerar card</StoryCardLink> : null}
        <ShareButton path={`/${profile.slug}`} title={`${profile.display_name} · CTT`} />
      </>
    )
  }
  return (
    <>
      {viewer ? <MyArchiveLink slug={viewer.slug} /> : <ConnectStravaLink />}
      <SeeStoryCardLink hasStoryCard={hasStoryCard} />
    </>
  )
}

/** "Qual é a sua história?" com as vagas do beta; quem já tem arquivo não vê. */
export async function VisitorFinalCta({ photo }: { photo?: EditionPhoto }) {
  const viewer = await getViewerProfile()
  return viewer ? null : <SuaVezSection photo={photo} />
}

/** Mostra `owner` só para o dono do arquivo; os demais veem `fallback`. */
export async function OwnerSwitch({
  profileId,
  owner,
  fallback,
}: {
  profileId: string
  owner: ReactNode
  fallback: ReactNode
}) {
  const viewer = await getViewerProfile()
  return viewer?.id === profileId ? owner : fallback
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
