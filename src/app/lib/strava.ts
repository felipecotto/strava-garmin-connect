import { StravaActivity, WeeklyStats } from "@/app/types/strava"

export async function fetchActivities(accessToken: string): Promise<StravaActivity[]> {
  const response = await fetch(
    "https://www.strava.com/api/v3/athlete/activities?per_page=60",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!response.ok) throw new Error("Failed to fetch Strava activities")
  return response.json()
}

export function getWeeklyStats(activities: StravaActivity[]): WeeklyStats {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
  startOfWeek.setHours(0, 0, 0, 0)

  const runs = activities.filter(
    (a) =>
      a.sport_type === "Run" &&
      new Date(a.start_date_local) >= startOfWeek
  )

  const totalMeters = runs.reduce((sum, a) => sum + a.distance, 0)
  const totalMovingTime = runs.reduce((sum, a) => sum + a.moving_time, 0)
  const totalElevation = runs.reduce((sum, a) => sum + a.total_elevation_gain, 0)

  const avgPaceSeconds =
    totalMeters > 0 ? totalMovingTime / (totalMeters / 1000) : 0

  return {
    totalKm: totalMeters / 1000,
    avgPaceSeconds,
    activityCount: runs.length,
    totalElevation,
  }
}

/** Formata segundos/km como "M:SS /km" */
export function formatPace(secondsPerKm: number): string {
  if (secondsPerKm === 0) return "--"
  const minutes = Math.floor(secondsPerKm / 60)
  const seconds = Math.round(secondsPerKm % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`
}
