export function LandingContrast() {
  return (
    <section className="border-b border-[color-mix(in_srgb,var(--line)_70%,transparent)] py-[88px]">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="mb-11 flex items-baseline gap-6">
          <span className="min-w-10 font-mono text-sm text-[var(--label)]">
            005
          </span>
          <h2 className="font-heading text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.02em] text-[var(--ink)]">
            O que <span className="font-normal text-[var(--ink-soft)]">não é</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-soft rounded-[28px] p-9">
            <p className="mb-5 font-mono text-xs uppercase text-[var(--label)]">
              Fica de fora
            </p>
            <ul>
              {[
                "Feed com curtida e comentário",
                "Ranking contra outros atletas",
                "Frase motivacional no topo da tela",
                "Badge de streak ou gamificação",
                "Notificação pra te fazer voltar",
              ].map((item) => (
                <li
                  key={item}
                  className="border-b border-[color-mix(in_srgb,var(--line)_75%,transparent)] py-2.5 text-[15px] text-[var(--label)] line-through decoration-[var(--line)] last:border-b-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grain-surface relative overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[color-mix(in_srgb,var(--accent)_7%,white)] p-9 shadow-soft">
            <div
              className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-50 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%)",
              }}
              aria-hidden
            />
            <p className="relative mb-5 font-mono text-xs uppercase text-[var(--brand)]">
              Fica dentro
            </p>
            <ul className="relative">
              {[
                "Seu histórico completo, sempre acessível",
                "Comparação com você mesmo, por período",
                "Dado exportável, sem lock-in",
                "Link de arquivo pra compartilhar, se quiser",
                "Sync automático com o Strava",
              ].map((item) => (
                <li
                  key={item}
                  className="border-b border-[color-mix(in_srgb,var(--line)_70%,transparent)] py-2.5 text-[15px] text-[var(--ink)] last:border-b-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
