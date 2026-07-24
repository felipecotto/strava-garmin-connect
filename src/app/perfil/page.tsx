import type { Metadata } from "next"
import Link from "next/link"

import { getStravaProfileData, logoutStrava } from "@/app/actions/strava"
import { SettingsForm } from "@/components/settings/settings-form"
import { SiteChrome } from "@/components/site/site-chrome"
import { StravaRevokeAccessDialog } from "@/components/dashboard/strava-revoke-access-dialog"
import { Atmosphere } from "@/components/ui/atmosphere"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getOwnerProfile } from "@/lib/profile/get-owner-profile"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Perfil",
}

function formatMemberSince(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}

export default async function PerfilPage() {
  const [profile, strava] = await Promise.all([
    getOwnerProfile(),
    getStravaProfileData(),
  ])

  const isOwner = Boolean(profile) || strava.ok === "success"

  return (
    <div className="relative min-h-full text-[var(--ink)]">
      <Atmosphere className="opacity-60" />
      <div className="relative mx-auto w-full max-w-[1180px] px-6 pb-16 pt-2 sm:px-8">
        <SiteChrome isOwner={isOwner} />

        <div className="mt-10 max-w-2xl space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--label)]">
            Conta
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--ink)]">
            Perfil
          </h1>
          <p className="text-[var(--ink-soft)]">
            Slug, privacidade e conexão Strava.
          </p>
        </div>

        <div className="my-8 h-px bg-[color-mix(in_srgb,var(--line)_80%,transparent)]" />

        {!isOwner ? (
          <div className="max-w-xl space-y-4">
            <p className="text-[var(--ink-soft)]">
              Conecte o Strava para configurar seu arquivo.
            </p>
            <Link
              href={siteConfig.connectStravaPath}
              className={cn(buttonVariants({ size: "lg" }), "inline-flex")}
            >
              Conectar Strava →
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <div className="space-y-10">
              {profile ? (
                <section className="space-y-4">
                  <h2 className="font-heading text-lg font-semibold text-[var(--ink)]">
                    Arquivo público
                  </h2>
                  <SettingsForm profile={profile} />
                </section>
              ) : (
                <p className="text-sm text-[var(--ink-soft)]">
                  Perfil ainda não criado no banco. Reconecte o Strava.
                </p>
              )}
            </div>

            <aside className="space-y-3">
              {strava.ok === "success" ? (
                <div className="surface-soft overflow-hidden rounded-[28px]">
                  <div className="space-y-2 border-b border-[color-mix(in_srgb,var(--line)_75%,transparent)] px-4 py-5">
                    <p className="font-heading text-lg font-semibold text-[var(--ink)]">
                      {strava.athlete.firstname} {strava.athlete.lastname}
                    </p>
                    <p className="font-mono text-[13px] text-[var(--label)]">
                      @{strava.athlete.username ?? "atleta"}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
                      Strava ativo
                    </p>
                    <p className="font-mono text-xs text-[var(--label)]">
                      Desde {formatMemberSince(strava.athlete.created_at)}
                    </p>
                  </div>
                  <div className="space-y-3 px-4 py-4">
                    {profile ? (
                      <Link
                        href={`/${profile.slug}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "w-full"
                        )}
                      >
                        Ver link público
                      </Link>
                    ) : null}
                    <StravaRevokeAccessDialog action={logoutStrava} />
                  </div>
                </div>
              ) : strava.ok === "error" ? (
                <p className="text-sm text-destructive">{strava.message}</p>
              ) : null}
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
