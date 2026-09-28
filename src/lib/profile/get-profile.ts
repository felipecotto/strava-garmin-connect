import { cacheLife, cacheTag } from "next/cache"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import type { ProfileRow } from "@/lib/supabase/types"

export function profileCacheTag(profileId: string): string {
  return `profile:${profileId}`
}

export function profileSlugCacheTag(slug: string): string {
  return `profile-slug:${slug}`
}

export async function getProfileById(profileId: string): Promise<ProfileRow | null> {
  "use cache"
  cacheTag(profileCacheTag(profileId))
  cacheLife("hours")

  if (!isSupabaseConfigured()) return null

  const { data, error } = await createSupabaseAdminClient()
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle()

  if (error) {
    throw new Error(`Falha ao buscar perfil ${profileId}: ${error.message}`)
  }
  return data
}

/** Perfil pelo slug (público ou não), em cache até a próxima alteração nas configurações. */
export async function getProfileBySlug(slug: string): Promise<ProfileRow | null> {
  "use cache"
  cacheTag(profileSlugCacheTag(slug))
  cacheLife("hours")

  if (!isSupabaseConfigured()) return null

  const { data, error } = await createSupabaseAdminClient()
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Falha ao buscar perfil "${slug}": ${error.message}`)
  }
  if (data) cacheTag(profileCacheTag(data.id))
  return data
}
