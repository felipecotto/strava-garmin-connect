import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"
import type { Database } from "@/lib/supabase/types"

let adminClient: SupabaseClient<Database> | null = null

/**
 * Client com service_role — bypassa RLS.
 * Usar somente em sync, webhooks e cron (nunca no browser).
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> {
  if (adminClient) {
    return adminClient
  }

  adminClient = createClient<Database>(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )

  return adminClient
}
