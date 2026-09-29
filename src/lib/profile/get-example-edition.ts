import { unstable_rethrow } from "next/navigation"

import { siteConfig } from "@/config/site"
import { getArchive } from "@/lib/archive/get-archive"
import type { ArchiveData } from "@/lib/archive/types"
import { getProfileBySlug } from "@/lib/profile/get-profile"
import type { ProfileRow } from "@/lib/supabase/types"

export type ExampleEdition = { profile: ProfileRow; archive: ArchiveData }

/**
 * Arquivo de exemplo exibido na home.
 * Falha do Supabase cai na home sem dados em vez de derrubar a página.
 */
export async function getExampleEdition(): Promise<ExampleEdition | null> {
  try {
    const profile = await getProfileBySlug(siteConfig.exampleProfileSlug)
    if (!profile?.is_public) return null
    return { profile, archive: await getArchive(profile.id) }
  } catch (error) {
    unstable_rethrow(error)
    console.error("[home] falha ao carregar o arquivo de exemplo", error)
    return null
  }
}
