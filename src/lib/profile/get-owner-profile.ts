import { fetchAthlete, getValidAccessToken } from "@/lib/strava/api"
import { getStravaIronSession } from "@/lib/strava/session"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import type { ProfileRow } from "@/lib/supabase/types"

export async function getOwnerProfile(): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const session = await getStravaIronSession()
  const supabase = createSupabaseAdminClient()

  if (session.profileId) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.profileId)
      .maybeSingle()
    if (data) return data
  }

  const token = await getValidAccessToken(session)
  if (!token) return null

  const athlete = await fetchAthlete(token)
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("strava_athlete_id", athlete.id)
    .maybeSingle()

  if (data) {
    session.profileId = data.id
    await session.save()
  }

  return data
}
