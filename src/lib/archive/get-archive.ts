import { cacheLife, cacheTag } from "next/cache"

import { buildArchive } from "@/lib/archive/build-archive"
import { archiveCacheTag } from "@/lib/archive/cache-tags"
import type { ArchiveActivity, ArchiveData } from "@/lib/archive/types"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

/** Limite de linhas por requisição do PostgREST no Supabase. */
const PAGE_SIZE = 1000

const ARCHIVE_COLUMNS =
  "id, name, sport_type, distance_m, moving_time_s, total_elevation_gain_m, average_heartrate, max_heartrate, start_date_local, timezone, workout_type"

async function loadArchiveActivities(
  profileId: string
): Promise<ArchiveActivity[]> {
  const supabase = createSupabaseAdminClient()
  const activities: ArchiveActivity[] = []

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("activities")
      .select(ARCHIVE_COLUMNS)
      .eq("profile_id", profileId)
      .order("start_date_local", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      throw new Error(`Falha ao carregar atividades do arquivo: ${error.message}`)
    }

    activities.push(...data)
    if (data.length < PAGE_SIZE) break
  }

  return activities
}

/** Edição completa do atleta, em cache até a próxima sincronização. */
export async function getArchive(profileId: string): Promise<ArchiveData> {
  "use cache"
  cacheTag(archiveCacheTag(profileId))
  cacheLife("hours")

  const activities = await loadArchiveActivities(profileId)
  return buildArchive(activities, new Date())
}
