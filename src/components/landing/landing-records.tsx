import type { PublicProfileData } from "@/lib/profile/get-public-profile"
import {
  formatPace,
  formatRaceTime,
  formatShortDate,
} from "@/lib/profile/stats"

export function LandingRecords({
  featured,
}: {
  featured: PublicProfileData | null
}) {
  const records = featured?.records ?? []

  return (
    <section
      id="recordes"
      className="scroll-mt-20 border-b border-[color-mix(in_srgb,var(--line)_70%,transparent)] py-[88px]"
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="mb-11 flex items-baseline gap-6">
          <span className="min-w-10 font-mono text-sm text-[var(--label)]">
            003
          </span>
          <h2 className="font-heading text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.02em] text-[var(--ink)]">
            Recordes <span className="font-normal text-[var(--ink-soft)]">pessoais</span>
          </h2>
        </div>

        <div className="surface-soft overflow-hidden rounded-[28px] px-5 sm:px-7">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color-mix(in_srgb,var(--ink)_55%,transparent)] text-left font-mono text-[11px] uppercase text-[var(--label)]">
              <th className="py-3">Distância</th>
              <th className="py-3">Tempo</th>
              <th className="py-3">Pace</th>
              <th className="py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-5 font-mono text-sm text-[var(--label)]"
                >
                  Sem recordes nas distâncias clássicas ainda.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.key}
                  className="border-b border-[var(--line)] last:border-b-0"
                >
                  <td className="py-5 font-heading text-[19px] font-extrabold text-[var(--ink)]">
                    {record.label}
                  </td>
                  <td className="py-5 font-mono text-[22px] font-bold text-[var(--ink)]">
                    {formatRaceTime(record.movingTimeS)}
                  </td>
                  <td className="py-5 font-mono text-[13px] text-[var(--label)]">
                    {formatPace(record.distanceM, record.movingTimeS)}
                  </td>
                  <td className="py-5 font-mono text-[13px] text-[var(--label)]">
                    {formatShortDate(record.achievedAt).toUpperCase()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  )
}
