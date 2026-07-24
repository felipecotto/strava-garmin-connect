import { siteConfig } from "@/config/site"
import { getOwnerProfile } from "@/lib/profile/get-owner-profile"
import {
  getArchiveByProfileId,
  getPublicProfileBySlug,
  type PublicProfileData,
} from "@/lib/profile/get-public-profile"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export type HomeArchiveMode = "owner" | "demo"

export type HomeArchiveResult = {
  mode: HomeArchiveMode
  data: PublicProfileData | null
  ownerSlug: string | null
}

/**
 * Home: se logado → arquivo do dono; senão → arquivo exemplo (demo).
 */
export async function getHomeArchive(): Promise<HomeArchiveResult> {
  if (!isSupabaseConfigured()) {
    return { mode: "demo", data: null, ownerSlug: null }
  }

  const owner = await getOwnerProfile()
  if (owner) {
    const data = await getArchiveByProfileId(owner.id)
    return { mode: "owner", data, ownerSlug: owner.slug }
  }

  const featuredSlug = siteConfig.exampleProfilePath.replace(/^\//, "")
  const data = await getPublicProfileBySlug(featuredSlug)
  return { mode: "demo", data, ownerSlug: null }
}
