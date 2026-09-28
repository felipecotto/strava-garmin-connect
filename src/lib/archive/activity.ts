import { isRunActivity } from "@/lib/profile/stats"
import type { ArchiveActivity } from "@/lib/archive/types"

export function onlyRuns(activities: ArchiveActivity[]): ArchiveActivity[] {
  return activities.filter((activity) => isRunActivity(activity.sport_type))
}

export function paceSecPerKm(distanceM: number, movingSec: number): number {
  if (distanceM <= 0 || movingSec <= 0) return 0
  return movingSec / (distanceM / 1000)
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function metersToKm(meters: number, decimals = 1): number {
  return roundTo(meters / 1000, decimals)
}
