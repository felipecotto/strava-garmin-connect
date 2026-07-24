import type { ActivityInsert } from "@/lib/supabase/types"
import type { StravaActivity } from "@/lib/strava/types"

/** Mapeia summary activity da Strava → row de `activities`. */
export function mapStravaActivityToRow(
  activity: StravaActivity,
  profileId: string
): ActivityInsert {
  return {
    id: activity.id,
    profile_id: profileId,
    name: activity.name,
    sport_type: activity.sport_type ?? activity.type,
    distance_m: activity.distance,
    moving_time_s: activity.moving_time,
    elapsed_time_s: activity.elapsed_time,
    total_elevation_gain_m: activity.total_elevation_gain ?? null,
    average_speed_mps: activity.average_speed ?? null,
    max_speed_mps: activity.max_speed ?? null,
    average_heartrate: activity.average_heartrate ?? null,
    max_heartrate: activity.max_heartrate ?? null,
    start_date: activity.start_date,
    start_date_local: activity.start_date_local,
    timezone: activity.timezone ?? null,
    map_summary_polyline: activity.map?.summary_polyline ?? null,
  }
}
