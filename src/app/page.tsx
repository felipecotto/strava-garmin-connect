import type { Metadata } from "next"
import Link from "next/link"

import { ArchiveManifesto } from "@/components/archive/archive-manifesto"
import { ArchiveView } from "@/components/archive/archive-view"
import { HomeAlerts } from "@/components/site/home-alerts"
import { SiteChrome } from "@/components/site/site-chrome"
import { Atmosphere } from "@/components/ui/atmosphere"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getHomeArchive } from "@/lib/profile/get-home-archive"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    absolute: "CTT — Arquivo de Performance",
  },
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { mode, data } = await getHomeArchive()
  const alerts = <HomeAlerts searchParams={searchParams} />

  if (data) {
    return (
      <div>
        <ArchiveView
          data={data}
          variant={mode === "owner" ? "owner" : "demo"}
          banner={alerts}
        />
        <ArchiveManifesto data={data} />
        <footer className="border-t border-[color-mix(in_srgb,var(--line)_70%,transparent)] py-6 font-mono text-xs text-[var(--label)]">
          <div className="mx-auto flex max-w-[1180px] justify-between px-6 sm:px-8">
            <span>CTT — usectt.com.br</span>
            <span>SÃO PAULO, BR — 2026</span>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="relative min-h-full text-[var(--ink)]">
      <Atmosphere className="opacity-70" />
      <div className="relative mx-auto w-full max-w-[1180px] px-6 pb-16 pt-2 sm:px-8">
        <SiteChrome isOwner={mode === "owner"} />
        <div className="mt-6">{alerts}</div>
        <div className="mt-16 max-w-xl space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--label)]">
            Arquivo de performance
          </p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl">
            O que você treinou, fica registrado.
          </h1>
          <p className="text-[var(--ink-soft)]">
            Conecte o Strava para criar seu arquivo — pace, volume e histórico,
            sem feed.
          </p>
          <Link
            href={siteConfig.connectStravaPath}
            className={cn(buttonVariants({ size: "lg" }), "inline-flex")}
          >
            Conectar Strava →
          </Link>
        </div>
        <ArchiveManifesto data={null} />
      </div>
    </div>
  )
}
