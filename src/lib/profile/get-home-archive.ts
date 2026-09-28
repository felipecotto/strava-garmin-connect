import { unstable_rethrow } from "next/navigation"

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

const EMPTY_DEMO: HomeArchiveResult = {
  mode: "demo",
  data: null,
  ownerSlug: null,
}

/**
 * Home: se logado → arquivo do dono; senão → arquivo exemplo (demo).
 * Falha do Supabase cai no estado vazio em vez de derrubar a home.
 */
export async function getHomeArchive(): Promise<HomeArchiveResult> {
  if (!isSupabaseConfigured()) {
    return EMPTY_DEMO
  }

  try {
    const owner = await getOwnerProfile()
    if (owner) {
      const data = await getArchiveByProfileId(owner.id)
      return { mode: "owner", data, ownerSlug: owner.slug }
    }

    const featuredSlug = siteConfig.exampleProfilePath.replace(/^\//, "")
    const data = await getPublicProfileBySlug(featuredSlug)
    return { mode: "demo", data, ownerSlug: null }
  } catch (error) {
    unstable_rethrow(error)
    console.error("[home] falha ao carregar arquivo", error)
    return EMPTY_DEMO
  }
}
