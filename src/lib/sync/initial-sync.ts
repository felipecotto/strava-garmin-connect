import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { fetchActivitiesPage } from "@/lib/strava/api"
import { mapStravaActivityToRow } from "@/lib/strava/map-activity"
import type { StravaActivity } from "@/lib/strava/types"

/** ~2 anos — suficiente para PRs e volume sem estourar rate limit no onboarding. */
const DEFAULT_LOOKBACK_DAYS = 730
const PER_PAGE = 100
/** 50 × 100 = até 5.000 activities por sync inicial. */
const MAX_PAGES = 50
const UPSERT_CHUNK_SIZE = 100

export type InitialSyncOptions = {
  profileId: string
  accessToken: string
  /** Unix seconds. Default: now − 730 days. */
  afterSec?: number
  /** Unix seconds. Default: now. */
  beforeSec?: number
}

export type InitialSyncResult = {
  synced: number
  pages: number
  oldestActivityAt: string | null
  newestActivityAt: string | null
  truncated: boolean
}

function chunkBy<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

function defaultAfterSec(): number {
  const ms = DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
  return Math.floor((Date.now() - ms) / 1000)
}

/**
 * Backfill inicial: busca activities na Strava e faz upsert em `activities`.
 * Atualiza `profiles.sync_status` e `sync_cursors`.
 *
 * Deve rodar apenas no server (service_role). Não chamar no client.
 */
export async function syncInitialActivities(
  options: InitialSyncOptions
): Promise<InitialSyncResult> {
  const { profileId, accessToken } = options
  const afterSec = options.afterSec ?? defaultAfterSec()
  const beforeSec = options.beforeSec ?? Math.floor(Date.now() / 1000)

  const supabase = createSupabaseAdminClient()

  const { error: statusError } = await supabase
    .from("profiles")
    .update({ sync_status: "syncing" })
    .eq("id", profileId)

  if (statusError) {
    throw new Error(`Falha ao marcar syncing: ${statusError.message}`)
  }

  try {
    const collected: StravaActivity[] = []
    let pages = 0
    let truncated = false

    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const batch = await fetchActivitiesPage(accessToken, {
        afterSec,
        beforeSec,
        page,
        perPage: PER_PAGE,
      })
      pages = page
      collected.push(...batch)

      if (batch.length < PER_PAGE) {
        break
      }
      if (page === MAX_PAGES) {
        truncated = true
      }
    }

    const rows = collected.map((activity) =>
      mapStravaActivityToRow(activity, profileId)
    )

    for (const chunk of chunkBy(rows, UPSERT_CHUNK_SIZE)) {
      const { error: upsertError } = await supabase
        .from("activities")
        .upsert(chunk, { onConflict: "id" })

      if (upsertError) {
        throw new Error(`Falha no upsert de activities: ${upsertError.message}`)
      }
    }

    const startDates = rows.map((row) => row.start_date)
    const newestActivityAt =
      startDates.length > 0
        ? startDates.reduce((a, b) => (a > b ? a : b))
        : null
    const oldestActivityAt =
      startDates.length > 0
        ? startDates.reduce((a, b) => (a < b ? a : b))
        : null

    const { error: cursorError } = await supabase.from("sync_cursors").upsert(
      {
        profile_id: profileId,
        newest_activity_at: newestActivityAt,
        oldest_backfilled_at: oldestActivityAt,
        backfill_complete: !truncated,
        last_error: truncated
          ? `Backfill truncado em ${MAX_PAGES} páginas (${PER_PAGE}/página).`
          : null,
      },
      { onConflict: "profile_id" }
    )

    if (cursorError) {
      throw new Error(`Falha ao atualizar sync_cursors: ${cursorError.message}`)
    }

    const { error: readyError } = await supabase
      .from("profiles")
      .update({
        sync_status: "ready",
        last_synced_at: new Date().toISOString(),
      })
      .eq("id", profileId)

    if (readyError) {
      throw new Error(`Falha ao marcar ready: ${readyError.message}`)
    }

    return {
      synced: rows.length,
      pages,
      oldestActivityAt,
      newestActivityAt,
      truncated,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido no sync"

    await supabase
      .from("profiles")
      .update({ sync_status: "error" })
      .eq("id", profileId)

    await supabase.from("sync_cursors").upsert(
      {
        profile_id: profileId,
        backfill_complete: false,
        last_error: message,
      },
      { onConflict: "profile_id" }
    )

    throw error
  }
}
