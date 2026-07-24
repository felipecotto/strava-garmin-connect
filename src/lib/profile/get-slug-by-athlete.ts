import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export async function getPublicSlugByStravaAthleteId(
  athleteId: number
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from("profiles")
    .select("slug")
    .eq("strava_athlete_id", athleteId)
    .eq("is_public", true)
    .maybeSingle()

  return data?.slug ?? null
}
