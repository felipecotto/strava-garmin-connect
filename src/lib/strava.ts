import { StravaActivity, StravaAthlete } from "@/types/strava"

const BASE = "https://www.strava.com/api/v3"

export async function getAthlete(accessToken: string): Promise<StravaAthlete> {
  const res = await fetch(`${BASE}/athlete`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error("Failed to fetch athlete")
  return res.json()
}

export async function getActivities(
  accessToken: string,
  perPage = 30,
): Promise<StravaActivity[]> {
  const res = await fetch(`${BASE}/athlete/activities?per_page=${perPage}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error("Failed to fetch activities")
  return res.json()
}

export function metersToKm(meters: number): string {
  return (meters / 1000).toFixed(1)
}

export function secondsToPace(seconds: number, meters: number): string {
  if (meters === 0) return "--"
  const secPerKm = seconds / (meters / 1000)
  const min = Math.floor(secPerKm / 60)
  const sec = Math.round(secPerKm % 60)
  return `${min}:${sec.toString().padStart(2, "0")}`
}

export function secondsToTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${min}min` : `${min}min`
}

export function getWeeklyStats(activities: StravaActivity[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  const day = now.getDay()
  startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  startOfWeek.setHours(0, 0, 0, 0)

  const runs = activities.filter(
    (a) => a.sport_type === "Run" && new Date(a.start_date_local) >= startOfWeek,
  )

  const totalMeters = runs.reduce((sum, a) => sum + a.distance, 0)
  const totalMovingTime = runs.reduce((sum, a) => sum + a.moving_time, 0)
  const elevation = runs.reduce((sum, a) => sum + a.total_elevation_gain, 0)
  const avgPace = totalMeters > 0 ? totalMovingTime / (totalMeters / 1000) : 0

  return {
    count: runs.length,
    totalKm: totalMeters / 1000,
    elevation,
    avgPace,
  }
}
