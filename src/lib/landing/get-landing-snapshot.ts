import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { siteConfig } from "@/config/site"
import {
  getPublicProfileBySlug,
  type PublicProfileData,
} from "@/lib/profile/get-public-profile"
import { formatKm, type ActivityRow } from "@/lib/profile/stats"
import {
  computeActivityHeatmap,
  computePaceSeries,
  computeWeeklyVolume,
  type HeatmapDay,
  type PacePoint,
  type WeeklyVolumePoint,
} from "@/lib/landing/evidence"

export type LandingCollectionItem = {
  slug: string
  displayName: string
  city: string | null
  totalRuns: number
  totalDistanceKm: string
}

export type LandingEvidence = {
  paceSeries: PacePoint[]
  heatmap: HeatmapDay[]
  weeklyVolume: WeeklyVolumePoint[]
}

export type LandingSnapshot = {
  featured: PublicProfileData | null
  collections: LandingCollectionItem[]
  evidence: LandingEvidence
}

const EMPTY_EVIDENCE: LandingEvidence = {
  paceSeries: [],
  heatmap: [],
  weeklyVolume: [],
}

export async function getLandingSnapshot(): Promise<LandingSnapshot> {
  if (!isSupabaseConfigured()) {
    return { featured: null, collections: [], evidence: EMPTY_EVIDENCE }
  }

  const featuredSlug = siteConfig.exampleProfilePath.replace(/^\//, "")

  try {
    const featured = await getPublicProfileBySlug(featuredSlug)
    const supabase = createSupabaseAdminClient()

    let evidence = EMPTY_EVIDENCE
    if (featured) {
      const since = new Date()
      since.setUTCMonth(since.getUTCMonth() - 6)

      const { data: rows } = await supabase
        .from("activities")
        .select("*")
        .eq("profile_id", featured.profile.id)
        .in("sport_type", ["Run", "TrailRun", "VirtualRun"])
        .gte("start_date", since.toISOString())
        .order("start_date", { ascending: true })
        .limit(500)

      const activities = (rows ?? []) as ActivityRow[]
      evidence = {
        paceSeries: computePaceSeries(activities, 24),
        heatmap: computeActivityHeatmap(activities, 16),
        weeklyVolume: computeWeeklyVolume(activities, 12),
      }
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, slug, display_name, city, is_public")
      .eq("is_public", true)
      .order("updated_at", { ascending: false })
      .limit(8)

    const ids = (profiles ?? []).map((p) => p.id)
    const { data: statsRows } = ids.length
      ? await supabase
          .from("profile_stats")
          .select("profile_id, total_runs, total_distance_m")
          .in("profile_id", ids)
      : { data: [] }

    const statsById = new Map(
      (statsRows ?? []).map((row) => [row.profile_id, row])
    )

    const collections: LandingCollectionItem[] = (profiles ?? []).map((p) => {
      const stats = statsById.get(p.id)
      return {
        slug: p.slug,
        displayName: p.display_name,
        city: p.city,
        totalRuns: stats?.total_runs ?? 0,
        totalDistanceKm: formatKm(Number(stats?.total_distance_m ?? 0), 0),
      }
    })

    return { featured, collections, evidence }
  } catch {
    return { featured: null, collections: [], evidence: EMPTY_EVIDENCE }
  }
}
