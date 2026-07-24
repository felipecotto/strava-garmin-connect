import type { IronSession } from "iron-session"

import { refreshAccessToken } from "@/lib/strava/auth"
import type {
  StravaActivity,
  StravaAthlete,
  StravaSessionData,
  StravaTokenResponse,
} from "@/lib/strava/types"

function applyTokenResponse(
  session: IronSession<StravaSessionData>,
  data: StravaTokenResponse
) {
  session.accessToken = data.access_token
  session.refreshToken = data.refresh_token
  session.expiresAt = data.expires_at
}

export async function getValidAccessToken(
  session: IronSession<StravaSessionData>
): Promise<string | null> {
  if (!session.accessToken || !session.refreshToken) {
    return null
  }
  const now = Math.floor(Date.now() / 1000)
  const bufferSec = 300
  if (session.expiresAt && session.expiresAt > now + bufferSec) {
    return session.accessToken
  }
  const refreshed = await refreshAccessToken(session.refreshToken)
  if (!refreshed) {
    session.destroy()
    await session.save()
    return null
  }
  applyTokenResponse(session, refreshed)
  await session.save()
  return refreshed.access_token
}

export async function fetchAthlete(accessToken: string): Promise<StravaAthlete> {
  const res = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Strava athlete: ${res.status}`)
  }
  return res.json() as Promise<StravaAthlete>
}

export type FetchActivitiesPageOptions = {
  afterSec?: number
  beforeSec?: number
  page?: number
  perPage?: number
}

export async function fetchActivitiesPage(
  accessToken: string,
  options: FetchActivitiesPageOptions = {}
): Promise<StravaActivity[]> {
  const page = options.page ?? 1
  const perPage = options.perPage ?? 100
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })
  if (options.afterSec != null) {
    params.set("after", String(options.afterSec))
  }
  if (options.beforeSec != null) {
    params.set("before", String(options.beforeSec))
  }

  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  )
  if (!res.ok) {
    throw new Error(`Strava activities: ${res.status}`)
  }
  return res.json() as Promise<StravaActivity[]>
}

export async function fetchActivitiesRange(
  accessToken: string,
  afterSec: number,
  beforeSec: number,
  maxPages = 10
): Promise<StravaActivity[]> {
  const out: StravaActivity[] = []
  const perPage = 100

  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await fetchActivitiesPage(accessToken, {
      afterSec,
      beforeSec,
      page,
      perPage,
    })
    out.push(...batch)
    if (batch.length < perPage) {
      break
    }
  }

  return out
}
