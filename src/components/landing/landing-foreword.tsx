import type { PublicProfileData } from "@/lib/profile/get-public-profile"

export function LandingForeword({
  featured,
}: {
  featured: PublicProfileData | null
}) {
  return (
    <section
      id="foreword"
      className="scroll-mt-20 border-b border-[color-mix(in_srgb,var(--line)_70%,transparent)] py-[88px]"
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="mb-11 flex items-baseline gap-6">
          <span className="min-w-10 font-mono text-sm text-[var(--label)]">
            002
          </span>
          <h2 className="font-heading text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.02em] text-[var(--ink)]">
            Foreword
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 text-[19px] leading-[1.65] text-[var(--ink)]">
            <p>O CTT começou porque um designer queria ver o que já tinha treinado.</p>
            <p className="rounded-2xl border-l-[3px] border-[var(--brand)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] py-3 pl-[18px] text-[22px] font-bold">
              Não uma frase de efeito sobre superação, nem um ranking pra
              comparar com os outros.
            </p>
            <p>
              Só o histórico — pace, volume, frequência — organizado de um jeito
              que dá pra olhar e entender, sem rolar feed nem ler legenda de
              ninguém.
            </p>
            <p>Hoje qualquer pessoa pode conectar o Strava e ter o mesmo arquivo.</p>
          </div>

          <div className="surface-soft grain-surface self-start rounded-3xl p-6 font-mono text-[13px]">
            {[
              { k: "ORIGEM", v: "São Paulo, BR" },
              { k: "FONTE DE DADOS", v: "Strava API" },
              { k: "TIPO", v: "Arquivo pessoal" },
              { k: "ACESSO", v: "Gratuito" },
              {
                k: "REGISTROS ATIVOS",
                v: featured
                  ? `${featured.stats.totalRuns.toLocaleString("pt-BR")}+`
                  : "—",
              },
              { k: "STATUS", v: "EM USO", accent: true },
            ].map((row) => (
              <div
                key={row.k}
                className="flex justify-between border-b border-[color-mix(in_srgb,var(--line)_80%,transparent)] py-2.5 last:border-b-0"
              >
                <span className="text-[var(--label)]">{row.k}</span>
                <span
                  className={
                    row.accent
                      ? "font-semibold text-[var(--brand)]"
                      : "font-semibold text-[var(--ink)]"
                  }
                >
                  {row.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
