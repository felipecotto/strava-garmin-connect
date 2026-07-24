import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ArchiveView } from "@/components/archive/archive-view"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getPublicProfileBySlug } from "@/lib/profile/get-public-profile"
import { formatKm, formatRaceTime } from "@/lib/profile/stats"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { cn } from "@/lib/utils"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  if (!isSupabaseConfigured()) return { title: "Arquivo" }

  try {
    const data = await getPublicProfileBySlug(slug)
    if (!data) return { title: "Arquivo não encontrado" }

    const { profile, stats, records } = data
    const best5k = records.find((r) => r.key === "5k")
    const description = [
      `${formatKm(stats.totalDistanceM, 0)} km`,
      `${stats.totalRuns} atividades`,
      best5k ? `5K ${formatRaceTime(best5k.movingTimeS)}` : null,
    ]
      .filter(Boolean)
      .join(" · ")

    return {
      title: profile.display_name,
      description: `${profile.display_name} — arquivo CTT · ${description}`,
      alternates: { canonical: `/${profile.slug}` },
      openGraph: {
        title: `${profile.display_name} · CTT`,
        description,
        url: `/${profile.slug}`,
        type: "profile",
      },
    }
  } catch {
    return { title: "Arquivo" }
  }
}

export default async function PublicArchivePage({ params }: PageProps) {
  const { slug } = await params
  if (!isSupabaseConfigured()) notFound()

  const data = await getPublicProfileBySlug(slug)
  if (!data) notFound()

  return (
    <div>
      <ArchiveView data={data} variant="public" />
      <footer className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-6 pb-12 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-mono text-xs text-[var(--label)]">
          CTT — arquivo de performance
        </p>
        <Link
          href={siteConfig.connectStravaPath}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Criar meu arquivo
        </Link>
      </footer>
    </div>
  )
}
