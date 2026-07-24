import Link from "next/link"

import { Atmosphere } from "@/components/ui/atmosphere"
import { siteConfig } from "@/config/site"
import type { PublicProfileData } from "@/lib/profile/get-public-profile"
import {
  formatDuration,
  formatKm,
  formatPace,
} from "@/lib/profile/stats"

function formatLogDate(iso: string) {
  const d = new Date(iso)
  return d
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "")
    .toUpperCase()
}

export function Hero({ featured }: { featured: PublicProfileData | null }) {
  const stats = featured?.stats
  const recent = featured?.recentRuns.slice(0, 4) ?? []

  return (
    <section className="relative border-b-0 pb-0 pt-14">
      <Atmosphere intensity="strong" className="opacity-90" />

      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="flex justify-between pb-8 font-mono text-xs tracking-[0.02em] text-[var(--label)]">
          <span>ARQUIVO DE PERFORMANCE</span>
          <span className="inline-flex items-center gap-1.5 text-[var(--brand)]">
            <span className="size-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_10px_var(--brand)]" />
            SYNC ATIVO — STRAVA API
          </span>
        </div>

        <h1 className="font-heading text-[clamp(52px,10vw,128px)] font-extrabold leading-[0.88] tracking-[-0.04em] text-[var(--ink)] uppercase">
          O QUE VOCÊ
          <br />
          TREINOU,
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_var(--ink)]">
            FICA
          </span>{" "}
          REGISTRADO.
        </h1>

        <p className="max-w-[520px] py-6 font-mono text-[13px] leading-relaxed tracking-[0.01em] text-[var(--label)]">
          SEM FEED. SEM RANKING. SEM FRASE DE EFEITO.
          <br />
          SÓ O HISTÓRICO — PACE, VOLUME, FREQUÊNCIA — DO JEITO QUE ACONTECEU.
        </p>

        <div className="surface-soft rounded-[28px] px-5 py-7 sm:px-7">
          <div className="mb-4 flex flex-wrap justify-between gap-2 font-mono text-[11px] text-[var(--label)]">
            <span>
              EXEMPLO DE ARQUIVO
              {featured ? ` — ${featured.profile.display_name.toUpperCase()}` : ""}
            </span>
            <span>CONECTE O SEU STRAVA PRA VER O SEU PRÓPRIO</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[clamp(28px,4vw,46px)] font-extrabold leading-none tracking-[-0.02em] text-[var(--ink)]">
                {stats ? stats.totalRuns.toLocaleString("pt-BR") : "—"}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase text-[var(--label)]">
                Atividades
              </p>
            </div>
            <div className="sm:border-l sm:border-[color-mix(in_srgb,var(--line)_80%,transparent)] sm:pl-6">
              <p className="font-mono text-[clamp(28px,4vw,46px)] font-extrabold leading-none tracking-[-0.02em] text-[var(--ink)]">
                {stats ? formatKm(stats.totalDistanceM, 0) : "—"}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase text-[var(--label)]">
                Km percorridos
              </p>
            </div>
            <div className="sm:border-l sm:border-[color-mix(in_srgb,var(--line)_80%,transparent)] sm:pl-6">
              <p className="font-mono text-[clamp(28px,4vw,46px)] font-extrabold leading-none tracking-[-0.02em] text-[var(--ink)]">
                {stats
                  ? Math.round(stats.totalMovingTimeS / 3600).toLocaleString(
                      "pt-BR"
                    )
                  : "—"}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase text-[var(--label)]">
                Horas treinadas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-10">
          <Link
            href={siteConfig.connectStravaPath}
            className="cta-gradient grain-surface inline-flex items-center gap-2 rounded-full px-[28px] py-4 text-sm font-bold text-[var(--bg)] shadow-lift transition-[filter] hover:brightness-110"
          >
            Criar meu arquivo →
          </Link>
          <a
            href="#foreword"
            className="font-mono text-[13px] text-[var(--ink-soft)] underline decoration-[color-mix(in_srgb,var(--line)_90%,transparent)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
          >
            por que existe ↓
          </a>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-t-[28px] bg-[var(--ink)] font-mono text-[12.5px] text-[#EDEDE8] shadow-lift sm:mx-6 lg:mx-auto lg:max-w-[1180px]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:var(--noise)] [background-size:140px]" />
        <div className="relative">
          <div className="mx-auto flex max-w-[1180px] justify-between border-b border-[#333330] px-6 py-3.5 text-[11px] text-[#8A8A82] sm:px-8">
            <span>LOG // ÚLTIMAS ATIVIDADES</span>
            <span>REGISTRO CONTÍNUO</span>
          </div>
          <div className="mx-auto max-w-[1180px] overflow-x-auto px-6 sm:px-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#333330] text-left text-[11px] font-medium text-[#7A7A72]">
                  <th className="py-3.5 pr-4">DATA</th>
                  <th className="py-3.5 pr-4">TIPO</th>
                  <th className="py-3.5 pr-4">DIST.</th>
                  <th className="py-3.5 pr-4">PACE</th>
                  <th className="py-3.5 pr-4">DUR.</th>
                  <th className="py-3.5">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-[#8A8A82]">
                      Sem atividades sincronizadas.
                    </td>
                  </tr>
                ) : (
                  recent.map((run) => (
                    <tr
                      key={run.id}
                      className="border-b border-[#262623] last:border-b-0"
                    >
                      <td className="py-3.5 pr-4 font-medium text-[#EDEDE8]">
                        {formatLogDate(run.start_date_local)}
                      </td>
                      <td className="py-3.5 pr-4 text-[#D8D8D2]">
                        {run.sport_type}
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-[#EDEDE8]">
                        {formatKm(Number(run.distance_m))} KM
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-[#EDEDE8]">
                        {formatPace(
                          Number(run.distance_m),
                          run.moving_time_s
                        ).toUpperCase()}
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-[#EDEDE8]">
                        {formatDuration(run.moving_time_s)}
                      </td>
                      <td className="py-3.5 text-[11px] text-[var(--brand)]">
                        OK
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mx-auto flex max-w-[1180px] justify-between px-6 py-4 text-[11px] text-[#6E6E66] sm:px-8">
            <span>
              MOSTRANDO {recent.length}
              {stats ? ` DE ${stats.totalRuns.toLocaleString("pt-BR")}` : ""}{" "}
              REGISTROS
            </span>
            <span>
              {featured
                ? `ATLETA: ${featured.profile.display_name.toUpperCase()}${
                    featured.profile.city
                      ? ` — ${featured.profile.city.toUpperCase()}`
                      : ""
                  }`
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
