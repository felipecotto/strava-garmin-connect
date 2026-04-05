import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchActivities, getWeeklyStats, formatPace } from "@/app/lib/strava"
import { MetricCard } from "@/app/components/dashdoard/metric-card"
import { Map, Timer, TrendingUp, Zap } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.accessToken) redirect("/")

  const activities = await fetchActivities(session.accessToken)
  const stats = getWeeklyStats(activities)

  const metrics = [
    {
      label: "Km esta semana",
      value: `${stats.totalKm.toFixed(1)} km`,
      sub: `${stats.activityCount} corrida${stats.activityCount !== 1 ? "s" : ""}`,
      icon: <Map size={18} />,
    },
    {
      label: "Pace médio",
      value: formatPace(stats.avgPaceSeconds),
      sub: "esta semana",
      icon: <Timer size={18} />,
    },
    {
      label: "Atividades",
      value: String(stats.activityCount),
      sub: "esta semana",
      icon: <Zap size={18} />,
    },
    {
      label: "Elevação",
      value: `${Math.round(stats.totalElevation)} m`,
      sub: "esta semana",
      icon: <TrendingUp size={18} />,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">
          Olá, {session.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Aqui está o resumo da sua semana.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>
    </div>
  )
}
