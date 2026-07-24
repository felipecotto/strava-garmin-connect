import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { ProfileRow } from "@/lib/supabase/types"
import { buildSlugCandidates } from "@/lib/profile/slug"
import type { StravaAthlete } from "@/lib/strava/types"

export type UpsertProfileResult = {
  profile: ProfileRow
  created: boolean
}

function displayNameFromAthlete(athlete: StravaAthlete): string {
  return `${athlete.firstname} ${athlete.lastname}`.trim() || "Runner"
}

async function allocateUniqueSlug(
  athlete: StravaAthlete
): Promise<string> {
  const supabase = createSupabaseAdminClient()
  const candidates = buildSlugCandidates({
    username: athlete.username,
    firstname: athlete.firstname,
    lastname: athlete.lastname,
    athleteId: athlete.id,
  })

  for (const candidate of candidates) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle()

    if (!data) {
      return candidate
    }
  }

  for (let i = 2; i < 100; i += 1) {
    const base = candidates[0] ?? `athlete-${athlete.id}`
    const suffix = `-${i}`
    const slug = `${base.slice(0, Math.max(3, 30 - suffix.length))}${suffix}`
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()

    if (!data) {
      return slug
    }
  }

  return `athlete-${athlete.id}-${Date.now().toString(36)}`.slice(0, 30)
}

/**
 * Cria ou atualiza o profile a partir do athlete Strava.
 * Slug só é definido na criação (rename fica em settings depois).
 */
export async function upsertProfileFromAthlete(
  athlete: StravaAthlete
): Promise<UpsertProfileResult> {
  const supabase = createSupabaseAdminClient()

  const { data: existing, error: lookupError } = await supabase
    .from("profiles")
    .select("*")
    .eq("strava_athlete_id", athlete.id)
    .maybeSingle()

  if (lookupError) {
    throw new Error(`Falha ao buscar profile: ${lookupError.message}`)
  }

  const unitSystem =
    athlete.measurement_preference === "feet" ? "imperial" : "metric"

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayNameFromAthlete(athlete),
        city: athlete.city,
        country: athlete.country,
        avatar_url: athlete.profile || athlete.profile_medium,
        unit_system: unitSystem,
      })
      .eq("id", existing.id)
      .select("*")
      .single()

    if (updateError || !updated) {
      throw new Error(
        `Falha ao atualizar profile: ${updateError?.message ?? "sem dados"}`
      )
    }

    return { profile: updated, created: false }
  }

  const slug = await allocateUniqueSlug(athlete)

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      strava_athlete_id: athlete.id,
      slug,
      display_name: displayNameFromAthlete(athlete),
      city: athlete.city,
      country: athlete.country,
      avatar_url: athlete.profile || athlete.profile_medium,
      unit_system: unitSystem,
      sync_status: "pending",
    })
    .select("*")
    .single()

  if (insertError || !created) {
    throw new Error(
      `Falha ao criar profile: ${insertError?.message ?? "sem dados"}`
    )
  }

  return { profile: created, created: true }
}

export async function shouldRunInitialSync(profileId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient()

  const { data: cursor } = await supabase
    .from("sync_cursors")
    .select("backfill_complete")
    .eq("profile_id", profileId)
    .maybeSingle()

  if (cursor?.backfill_complete) {
    return false
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("sync_status")
    .eq("id", profileId)
    .maybeSingle()

  return profile?.sync_status !== "ready"
}
