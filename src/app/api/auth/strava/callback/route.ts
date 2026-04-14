import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { exchangeAuthorizationCode } from "@/lib/strava/auth"
import { getAppOrigin, isStravaConfigured } from "@/lib/strava/env"
import { STRAVA_OAUTH_STATE_COOKIE } from "@/lib/strava/oauth-state"
import { getStravaIronSession } from "@/lib/strava/session"

export async function GET(request: Request) {
  const origin = getAppOrigin()
  const url = new URL(request.url)

  const redirectWith = (path: string) => {
    const res = NextResponse.redirect(new URL(path, origin))
    res.cookies.delete(STRAVA_OAUTH_STATE_COOKIE)
    return res
  }

  if (!isStravaConfigured()) {
    return redirectWith("/dashboard?error=config")
  }

  const error = url.searchParams.get("error")
  if (error === "access_denied") {
    return redirectWith("/dashboard?error=denied")
  }

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const jar = await cookies()
  const expected = jar.get(STRAVA_OAUTH_STATE_COOKIE)?.value

  if (!code || !state || !expected || state !== expected) {
    return redirectWith("/dashboard?error=invalid_state")
  }

  const token = await exchangeAuthorizationCode(code)
  if (!token) {
    return redirectWith("/dashboard?error=token")
  }

  const session = await getStravaIronSession()
  session.accessToken = token.access_token
  session.refreshToken = token.refresh_token
  session.expiresAt = token.expires_at
  await session.save()

  return redirectWith("/dashboard?connected=1")
}
