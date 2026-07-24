import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Json } from "@/lib/supabase/types"
import {
  computeMonthlyVolume,
  computePersonalRecords,
  computeProfileStats,
} from "@/lib/profile/stats"

/**
 * Recalcula profile_stats + personal_records a partir de activities.
 * Chamado ao final do sync inicial (e futuros webhooks).
 */
export async function recomputeProfileAggregates(
  profileId: string
): Promise<void> {
  const supabase = createSupabaseAdminClient()

  const { data: activities, error } = await supabase
    .from("activities")
    .select("*")
    .eq("profile_id", profileId)

  if (error) {
    throw new Error(`Falha ao carregar activities p/ recompute: ${error.message}`)
  }

  const rows = activities ?? []
  const stats = computeProfileStats(rows)
  const records = computePersonalRecords(rows)
  const monthly = computeMonthlyVolume(rows, 12)

  const { error: statsError } = await supabase.from("profile_stats").upsert(
    {
      profile_id: profileId,
      total_runs: stats.totalRuns,
      total_distance_m: stats.totalDistanceM,
      total_moving_time_s: stats.totalMovingTimeS,
      total_elevation_m: stats.totalElevationM,
      current_streak_days: stats.currentStreakDays,
      longest_streak_days: stats.longestStreakDays,
      ytd_distance_m: stats.ytdDistanceM,
      ytd_runs: stats.ytdRuns,
      last_30d_distance_m: stats.last30dDistanceM,
      last_30d_runs: stats.last30dRuns,
      last_activity_at: stats.lastActivityAt,
      monthly_volume: monthly as unknown as Json,
    },
    { onConflict: "profile_id" }
  )

  if (statsError) {
    throw new Error(`Falha ao upsert profile_stats: ${statsError.message}`)
  }

  const { error: deleteError } = await supabase
    .from("personal_records")
    .delete()
    .eq("profile_id", profileId)

  if (deleteError) {
    throw new Error(`Falha ao limpar personal_records: ${deleteError.message}`)
  }

  if (records.length > 0) {
    const { error: insertError } = await supabase.from("personal_records").insert(
      records.map((record) => ({
        profile_id: profileId,
        distance_key: record.key,
        distance_m: record.distanceM,
        moving_time_s: record.movingTimeS,
        activity_id: record.activityId,
        activity_name: record.name,
        achieved_at: record.achievedAt,
      }))
    )

    if (insertError) {
      throw new Error(`Falha ao inserir personal_records: ${insertError.message}`)
    }
  }
}
