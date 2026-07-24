import Link from "next/link"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfilePrTable } from "@/components/profile/profile-pr-table"
import { ProfileShareButton } from "@/components/profile/profile-share-button"
import { ProfileTimeline } from "@/components/profile/profile-timeline"
import { SiteChrome } from "@/components/site/site-chrome"
import { Atmosphere } from "@/components/ui/atmosphere"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import type { PublicProfileData } from "@/lib/profile/get-public-profile"
import { formatKm } from "@/lib/profile/stats"
import { cn } from "@/lib/utils"

export type ArchiveViewProps = {
  data: PublicProfileData
  /** owner = home logada; demo = home anônima; public = /[slug] */
  variant: "owner" | "demo" | "public"
  banner?: React.ReactNode
}

export function ArchiveView({ data, variant, banner }: ArchiveViewProps) {
  const { profile, stats, records, recentRuns } = data
  const isOwner = variant === "owner"
  const isDemo = variant === "demo"

  return (
    <div className="relative min-h-full text-[var(--ink)]">
      <Atmosphere className="opacity-70" />
      <div className="relative mx-auto w-full max-w-[1180px] px-6 pb-16 pt-2 sm:px-8">
        <SiteChrome
          isOwner={isOwner}
          showConnect={!isDemo}
          trailing={
            isOwner || variant === "public" ? (
              <ProfileShareButton path={`/${profile.slug}`} />
            ) : null
          }
        />

        {banner}
        {isDemo ? (
          <div className="mt-8 surface-soft grain-surface flex flex-col gap-4 rounded-[28px] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="space-y-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
                Exemplo de arquivo
              </p>
              <p className="max-w-xl text-sm text-[var(--ink-soft)]">
                Conecte o Strava para ver o seu — pace, volume e histórico no
                mesmo formato.
              </p>
            </div>
            <Link
              href={siteConfig.connectStravaPath}
              className={cn(
                buttonVariants({ size: "lg" }),
                "shrink-0 inline-flex"
              )}
            >
              Conectar Strava →
            </Link>
          </div>
        ) : null}

        {isOwner && !profile.is_public ? (
          <div className="mt-8 rounded-[20px] border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] px-4 py-3 text-sm text-[var(--ink-soft)]">
            Seu arquivo está privado.{" "}
            <Link
              href="/perfil"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Tornar público no perfil
            </Link>
          </div>
        ) : null}

        <div className="mt-10 space-y-12">
          <ProfileHeader
            displayName={profile.display_name}
            slug={profile.slug}
            bio={profile.bio}
            city={profile.city}
            country={profile.country}
            avatarUrl={profile.avatar_url}
            lastSyncedAt={profile.last_synced_at}
          />

          <div className="surface-soft grain-surface rounded-[28px] px-5 py-7 sm:px-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[clamp(28px,4vw,40px)] font-extrabold leading-none tracking-tight text-[var(--ink)]">
                  {stats.totalRuns.toLocaleString("pt-BR")}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase text-[var(--label)]">
                  Atividades
                </p>
              </div>
              <div className="sm:border-l sm:border-[color-mix(in_srgb,var(--line)_80%,transparent)] sm:pl-6">
                <p className="font-mono text-[clamp(28px,4vw,40px)] font-extrabold leading-none tracking-tight text-[var(--ink)]">
                  {formatKm(stats.totalDistanceM, 0)}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase text-[var(--label)]">
                  Km percorridos
                </p>
              </div>
              <div className="sm:border-l sm:border-[color-mix(in_srgb,var(--line)_80%,transparent)] sm:pl-6">
                <p className="font-mono text-[clamp(28px,4vw,40px)] font-extrabold leading-none tracking-tight text-[var(--ink)]">
                  {Math.round(stats.totalMovingTimeS / 3600).toLocaleString(
                    "pt-BR"
                  )}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase text-[var(--label)]">
                  Horas treinadas
                </p>
              </div>
            </div>
          </div>

          <ProfilePrTable records={records} />
          <ProfileTimeline
            runs={recentRuns}
            showNames={
              isOwner ? true : profile.show_activity_names
            }
          />
        </div>
      </div>
    </div>
  )
}
