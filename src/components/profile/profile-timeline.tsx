import {
  formatDuration,
  formatKm,
  formatPace,
  type ActivityRow,
} from "@/lib/profile/stats"
import { cn } from "@/lib/utils"

function formatLogDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "")
    .toUpperCase()
}

export function ProfileTimeline({
  runs,
  showNames,
  className,
}: {
  runs: ActivityRow[]
  showNames: boolean
  className?: string
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-[var(--ink)] font-mono text-[12.5px] text-[#EDEDE8] shadow-lift",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:var(--noise)] [background-size:140px]" />
      <div className="relative">
        <div className="flex justify-between border-b border-[#333330] px-4 py-3.5 text-[11px] text-[#8A8A82] sm:px-5">
          <span>LOG // ÚLTIMAS ATIVIDADES</span>
          <span>REGISTRO CONTÍNUO</span>
        </div>

        {runs.length === 0 ? (
          <p className="px-4 py-6 text-[#8A8A82] sm:px-5">
            Nenhuma corrida sincronizada.
          </p>
        ) : (
          <div className="overflow-x-auto px-4 sm:px-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#333330] text-left text-[11px] font-medium text-[#7A7A72]">
                  <th className="py-3 pr-4">DATA</th>
                  <th className="py-3 pr-4">TIPO</th>
                  <th className="py-3 pr-4">DIST.</th>
                  <th className="py-3 pr-4">PACE</th>
                  <th className="py-3">DUR.</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-[#262623] last:border-b-0"
                  >
                    <td className="py-3.5 pr-4 font-medium text-[#EDEDE8]">
                      {formatLogDate(run.start_date_local)}
                    </td>
                    <td className="max-w-[12rem] truncate py-3.5 pr-4 text-[#D8D8D2]">
                      {showNames ? run.name : run.sport_type}
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
                    <td className="py-3.5 font-medium text-[#EDEDE8]">
                      {formatDuration(run.moving_time_s)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
