"use server"

import { redirect } from "next/navigation"

import {
  buildInsights,
  filterRunsInWindow,
  getRollingWindows,
  summarizeRuns,
  type DashboardInsight,
  type PeriodStats,
} from "@/lib/strava/aggregate"
import {
  fetchActivitiesRange,
  fetchAthlete,
  getValidAccessToken,
} from "@/lib/strava/api"
import { isStravaConfigured } from "@/lib/strava/env"
import { getStravaIronSession } from "@/lib/strava/session"
import type { StravaAthlete } from "@/lib/strava/types"

export type DashboardStravaResult =
  | { ok: "config_missing" }
  | { ok: "unauthenticated" }
  | {
      ok: "success"
      periodLabel: string
      stats: PeriodStats
      insights: DashboardInsight[]
    }
  | { ok: "error"; message: string }

export async function getDashboardStravaData(): Promise<DashboardStravaResult> {
  if (!isStravaConfigured()) {
    return { ok: "config_missing" }
  }
  try {
    const session = await getStravaIronSession()
    const token = await getValidAccessToken(session)
    if (!token) {
      return { ok: "unauthenticated" }
    }

    const { current, previous } = getRollingWindows()
    const activities = await fetchActivitiesRange(
      token,
      previous.afterSec,
      current.beforeSec
    )

    const currentRuns = filterRunsInWindow(
      activities,
      current.afterSec,
      current.beforeSec
    )
    const previousRuns = filterRunsInWindow(
      activities,
      previous.afterSec,
      previous.beforeSec
    )

    const stats = summarizeRuns(currentRuns)
    const prevStats = summarizeRuns(previousRuns)
    const insights = buildInsights(stats, prevStats)

    return {
      ok: "success",
      periodLabel: "Últimos 7 dias",
      stats,
      insights,
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao buscar dados."
    return { ok: "error", message }
  }
}

export type ProfileStravaResult =
  | { ok: "config_missing" }
  | { ok: "unauthenticated" }
  | { ok: "success"; athlete: StravaAthlete }
  | { ok: "error"; message: string }

export async function getStravaProfileData(): Promise<ProfileStravaResult> {
  if (!isStravaConfigured()) {
    return { ok: "config_missing" }
  }
  try {
    const session = await getStravaIronSession()
    const token = await getValidAccessToken(session)
    if (!token) {
      return { ok: "unauthenticated" }
    }
    const athlete = await fetchAthlete(token)
    return { ok: "success", athlete }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao buscar perfil."
    return { ok: "error", message }
  }
}

export async function logoutStrava() {
  const session = await getStravaIronSession()
  session.destroy()
  await session.save()
  redirect("/dashboard?disconnected=1")
}
