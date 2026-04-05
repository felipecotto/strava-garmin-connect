import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  getAthlete,
  getActivities,
  getWeeklyStats,
  metersToKm,
  secondsToPace,
  secondsToTime,
} from "@/lib/strava"

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

function currentDate() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.accessToken) {
    redirect("/")
  }

  const [athlete, activities] = await Promise.all([
    getAthlete(session.accessToken),
    getActivities(session.accessToken, 30),
  ])

  const runs = activities.filter((a) => a.sport_type === "Run")
  const weekly = getWeeklyStats(runs)
  const recentRuns = runs.slice(0, 5)

  const metrics = [
    {
      label: "Km esta semana",
      value: `${metersToKm(weekly.totalKm * 1000)} km`,
    },
    {
      label: "Pace médio",
      value: weekly.avgPace > 0 ? `${secondsToPace(weekly.avgPace, 1000)} /km` : "--",
    },
    {
      label: "Atividades",
      value: String(weekly.count),
    },
    {
      label: "Elevação",
      value: `${Math.round(weekly.elevation)} m`,
    },
  ]

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          {greeting()}, {athlete.firstname}
        </h1>
        <p className="text-neutral-500 mt-1 capitalize">{currentDate()}</p>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white border border-black/10 rounded-2xl p-5 flex flex-col gap-2"
          >
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              {m.label}
            </span>
            <p className="text-2xl font-semibold tracking-tight text-[#0F6E56]">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activities */}
      <div className="bg-white border border-black/10 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">
          Corridas recentes
        </h2>

        {recentRuns.length === 0 ? (
          <p className="text-neutral-400 text-sm">Nenhuma corrida encontrada.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {recentRuns.map((run) => (
              <li
                key={run.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {run.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(run.start_date_local).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                    })}
                    {" · "}
                    {secondsToTime(run.moving_time)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#1D9E75]">
                    {metersToKm(run.distance)} km
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {secondsToPace(run.moving_time, run.distance)} /km
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
