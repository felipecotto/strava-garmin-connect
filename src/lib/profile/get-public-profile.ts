import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { ProfileRow } from "@/lib/supabase/types"
import {
  isRunActivity,
  PR_LABEL_BY_KEY,
  type ActivityRow,
  type MonthlyVolumePoint,
  type PersonalRecord,
  type ProfileStats,
} from "@/lib/profile/stats"
import { recomputeProfileAggregates } from "@/lib/sync/recompute-stats"

export type PublicProfileData = {
  profile: ProfileRow
  stats: ProfileStats
  records: PersonalRecord[]
  recentRuns: ActivityRow[]
  monthlyVolume: MonthlyVolumePoint[]
}

function parseMonthlyVolume(raw: unknown): MonthlyVolumePoint[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is MonthlyVolumePoint => {
    return (
      typeof item === "object" &&
      item !== null &&
      "month" in item &&
      "label" in item &&
      "distanceKm" in item &&
      "runs" in item
    )
  })
}

function statsFromRow(row: {
  total_runs: number
  total_distance_m: number
  total_moving_time_s: number
  total_elevation_m: number
  current_streak_days: number
  longest_streak_days: number
  ytd_distance_m: number
  ytd_runs: number
  last_30d_distance_m: number
  last_30d_runs: number
  last_activity_at: string | null
  monthly_volume?: unknown
}): ProfileStats {
  return {
    totalRuns: row.total_runs,
    totalDistanceM: Number(row.total_distance_m),
    totalMovingTimeS: Number(row.total_moving_time_s),
    totalElevationM: Number(row.total_elevation_m),
    currentStreakDays: row.current_streak_days,
    longestStreakDays: row.longest_streak_days,
    ytdDistanceM: Number(row.ytd_distance_m),
    ytdRuns: row.ytd_runs,
    last30dDistanceM: Number(row.last_30d_distance_m),
    last30dRuns: row.last_30d_runs,
    lastActivityAt: row.last_activity_at,
  }
}

async function loadArchiveForProfile(
  profile: ProfileRow
): Promise<PublicProfileData> {
  const supabase = createSupabaseAdminClient()

  let { data: statsRow } = await supabase
    .from("profile_stats")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle()

  if (!statsRow) {
    await recomputeProfileAggregates(profile.id)
    const refreshed = await supabase
      .from("profile_stats")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle()
    statsRow = refreshed.data
  }

  const { data: prRows, error: prError } = await supabase
    .from("personal_records")
    .select("*")
    .eq("profile_id", profile.id)

  if (prError) {
    throw new Error(`Falha ao buscar PRs: ${prError.message}`)
  }

  const { data: recentRuns, error: runsError } = await supabase
    .from("activities")
    .select("*")
    .eq("profile_id", profile.id)
    .in("sport_type", ["Run", "TrailRun", "VirtualRun"])
    .order("start_date", { ascending: false })
    .limit(12)

  if (runsError) {
    throw new Error(`Falha ao buscar recent runs: ${runsError.message}`)
  }

  const records: PersonalRecord[] = (prRows ?? [])
    .map((row) => ({
      key: row.distance_key,
      label: PR_LABEL_BY_KEY[row.distance_key] ?? row.distance_key,
      distanceM: Number(row.distance_m),
      movingTimeS: row.moving_time_s,
      activityId: row.activity_id ?? 0,
      achievedAt: row.achieved_at,
      name: row.activity_name ?? "",
    }))
    .sort((a, b) => a.distanceM - b.distanceM)

  const stats = statsRow
    ? statsFromRow(statsRow)
    : {
        totalRuns: 0,
        totalDistanceM: 0,
        totalMovingTimeS: 0,
        totalElevationM: 0,
        ytdDistanceM: 0,
        ytdRuns: 0,
        last30dDistanceM: 0,
        last30dRuns: 0,
        currentStreakDays: 0,
        longestStreakDays: 0,
        lastActivityAt: null,
      }

  return {
    profile,
    stats,
    records,
    recentRuns: (recentRuns ?? []).filter((a) => isRunActivity(a.sport_type)),
    monthlyVolume: parseMonthlyVolume(statsRow?.monthly_volume),
  }
}

/** Arquivo público (só se is_public). */
export async function getPublicProfileBySlug(
  slug: string
): Promise<PublicProfileData | null> {
  const supabase = createSupabaseAdminClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle()

  if (error) {
    throw new Error(`Falha ao buscar profile: ${error.message}`)
  }
  if (!profile) {
    return null
  }

  return loadArchiveForProfile(profile)
}

/** Arquivo do dono — mesmo privado (home logada). */
export async function getArchiveByProfileId(
  profileId: string
): Promise<PublicProfileData | null> {
  const supabase = createSupabaseAdminClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle()

  if (error) {
    throw new Error(`Falha ao buscar profile: ${error.message}`)
  }
  if (!profile) {
    return null
  }

  return loadArchiveForProfile(profile)
}
