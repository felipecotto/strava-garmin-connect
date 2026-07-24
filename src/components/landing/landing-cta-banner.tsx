import Link from "next/link"

import { Atmosphere } from "@/components/ui/atmosphere"
import { siteConfig } from "@/config/site"

export function LandingCtaBanner() {
  return (
    <section className="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--line)_70%,transparent)] py-[110px] text-center">
      <Atmosphere intensity="strong" />
      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        <h2 className="mx-auto mb-8 max-w-[760px] font-heading text-[clamp(32px,5.5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--ink)] uppercase">
          Conecte o Strava.
          <br />
          Veja o que você já fez.
        </h2>
        <Link
          href={siteConfig.connectStravaPath}
          className="cta-gradient-brand grain-surface inline-flex items-center gap-2 rounded-full px-[28px] py-4 text-sm font-bold text-white shadow-lift transition-[filter] hover:brightness-105"
        >
          Criar meu arquivo →
        </Link>
      </div>
    </section>
  )
}
