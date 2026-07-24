import {
  formatPace,
  formatRaceTime,
  formatShortDate,
  type PersonalRecord,
} from "@/lib/profile/stats"
import { cn } from "@/lib/utils"

export function ProfilePrTable({
  records,
  className,
}: {
  records: PersonalRecord[]
  className?: string
}) {
  return (
    <section className={cn(className)}>
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-mono text-sm text-[var(--label)]">003</span>
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
          Recordes{" "}
          <span className="font-normal text-[var(--ink-soft)]">pessoais</span>
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
                  Sem recordes nas distâncias clássicas.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.key}
                  className="border-b border-[color-mix(in_srgb,var(--line)_80%,transparent)] last:border-b-0"
                >
                  <td className="py-5 font-heading text-[19px] font-extrabold">
                    {record.label}
                  </td>
                  <td className="py-5 font-mono text-[22px] font-bold">
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
    </section>
  )
}
