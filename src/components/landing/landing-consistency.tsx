import { LandingHeatmap } from "@/components/landing/landing-heatmap"
import type { LandingEvidence } from "@/lib/landing/get-landing-snapshot"

export function LandingConsistency({
  evidence,
}: {
  evidence: LandingEvidence
}) {
  const activeDays = evidence.heatmap.filter((d) => d.km > 0).length

  return (
    <section
      id="dados"
      className="scroll-mt-20 border-b border-[color-mix(in_srgb,var(--line)_70%,transparent)] py-[88px]"
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="mb-11 flex items-baseline gap-6">
          <span className="min-w-10 font-mono text-sm text-[var(--label)]">
            004
          </span>
          <h2 className="font-heading text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.02em] text-[var(--ink)]">
            Consistência
          </h2>
        </div>

        <div className="surface-soft grain-surface rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-6">
            <div className="min-w-[160px] font-mono">
              <p className="text-[36px] font-extrabold text-[var(--ink)]">
                {activeDays || "—"}
              </p>
              <p className="pt-1 text-[11px] text-[var(--label)]">
                DIAS COM ATIVIDADE NO PERÍODO
              </p>
            </div>
            <LandingHeatmap
              days={evidence.heatmap}
              className="min-w-[280px] flex-1"
            />
          </div>

          <div className="flex justify-end pt-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--label)]">
              MENOS
              <span className="size-2.5 rounded-[2px] bg-[var(--line)]" />
              <span className="size-2.5 rounded-[2px] bg-[#F0D2C4]" />
              <span className="size-2.5 rounded-[2px] bg-[#F0A480]" />
              <span className="size-2.5 rounded-[2px] bg-[#EE7647]" />
              <span className="size-2.5 rounded-[2px] bg-[var(--brand)]" />
              MAIS
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
