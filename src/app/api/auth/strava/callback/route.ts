import { after, NextResponse } from "next/server"

import { getBetaStatus } from "@/lib/beta/get-beta-status"
import {
  isConnectedAthlete,
  shouldRunInitialSync,
  upsertProfileFromAthlete,
} from "@/lib/profile/upsert-from-athlete"
import { fetchAthlete } from "@/lib/strava/api"
import { deauthorizeAccessToken, exchangeAuthorizationCode } from "@/lib/strava/auth"
import { getAppOrigin, isStravaConfigured } from "@/lib/strava/env"
import { verifyStravaOAuthState } from "@/lib/strava/oauth-state"
import { getStravaIronSession } from "@/lib/strava/session"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { expireProfileCache } from "@/lib/sync/expire-edition-cache"
import { syncInitialActivities } from "@/lib/sync/initial-sync"

export async function GET(request: Request) {
  const origin = getAppOrigin(request)
  const url = new URL(request.url)

  const redirectWith = (path: string) => {
    return NextResponse.redirect(new URL(path, origin))
  }

  if (!isStravaConfigured()) {
    return redirectWith("/?error=config")
  }

  const error = url.searchParams.get("error")
  if (error === "access_denied") {
    return redirectWith("/?error=denied")
  }

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  if (!code || !verifyStravaOAuthState(state)) {
    return redirectWith("/?error=invalid_state")
  }

  const token = await exchangeAuthorizationCode(code, request)
  if (!token) {
    return redirectWith("/?error=token")
  }

  const session = await getStravaIronSession()
  session.accessToken = token.access_token
  session.refreshToken = token.refresh_token
  session.expiresAt = token.expires_at

  let destination = "/?connected=1"

  if (isSupabaseConfigured()) {
    try {
      const athlete =
        token.athlete ?? (await fetchAthlete(token.access_token))

      // Beta lotado: só entra quem já ocupa uma vaga. O resto vai para a fila.
      const beta = await getBetaStatus()
      if (beta.phase === "lotado" && !(await isConnectedAthlete(athlete.id))) {
        try {
          await deauthorizeAccessToken(token.access_token)
        } catch {
          // A vaga no Strava não chega a ser ocupada sem o perfil; seguimos para a fila.
        }
        return redirectWith("/?error=capacity#conectar")
      }

      const { profile } = await upsertProfileFromAthlete(athlete)
      session.profileId = profile.id
      expireProfileCache(profile.id, profile.slug)

      const needsSync = await shouldRunInitialSync(profile.id)
      destination = needsSync ? `/${profile.slug}?connected=1` : `/${profile.slug}`
      if (needsSync) {
        const accessToken = token.access_token
        const profileId = profile.id
        after(async () => {
          try {
            await syncInitialActivities({ profileId, accessToken })
          } catch (syncError) {
            console.error("[strava-callback] initial sync failed", syncError)
          }
        })
      }
    } catch (profileError) {
      console.error("[strava-callback] profile upsert failed", profileError)
      await session.save()
      return redirectWith("/?error=profile")
    }
  }

  await session.save()
  return redirectWith(destination)
}
