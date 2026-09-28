import { cache } from "react"

import { getProfileById } from "@/lib/profile/get-profile"
import { getStravaIronSession } from "@/lib/strava/session"
import type { ProfileRow } from "@/lib/supabase/types"

/**
 * Perfil de quem está vendo a página, a partir do `profileId` gravado na sessão pelo callback do OAuth.
 * Não chama a API do Strava nem regrava o cookie, então pode rodar durante o render.
 */
export const getViewerProfile = cache(async (): Promise<ProfileRow | null> => {
  const session = await getStravaIronSession()
  if (!session.profileId) return null
  return getProfileById(session.profileId)
})
