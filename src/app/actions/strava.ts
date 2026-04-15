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
import { deauthorizeAccessToken } from "@/lib/strava/auth"
import { isStravaConfigured } from "@/lib/strava/env"
import { getStravaIronSession } from "@/lib/strava/session"
import type { StravaActivity, StravaAthlete } from "@/lib/strava/types"

export type DashboardStravaResult =
  | { ok: "config_missing" }
  | { ok: "unauthenticated" }
  | {
      ok: "success"
      periodLabel: string
      stats: PeriodStats
      insights: DashboardInsight[]
      recentRuns: StravaActivity[]
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
    const recentRuns = [...currentRuns]
      .sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      )
      .slice(0, 12)

    return {
      ok: "success",
      periodLabel: "Últimos 7 dias",
      stats,
      insights,
      recentRuns,
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
  const token = await getValidAccessToken(session)

  if (token) {
    try {
      await deauthorizeAccessToken(token)
    } catch {
      // Ainda limpamos a sessão local para garantir logout no app.
    }
  }

  session.destroy()
  await session.save()
  redirect("/dashboard?disconnected=1")
}
