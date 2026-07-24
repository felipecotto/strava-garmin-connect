export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          strava_athlete_id: number
          slug: string
          display_name: string
          bio: string | null
          city: string | null
          country: string | null
          avatar_url: string | null
          is_public: boolean
          show_activity_names: boolean
          unit_system: "metric" | "imperial"
          sync_status: "pending" | "syncing" | "ready" | "error"
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          strava_athlete_id: number
          slug: string
          display_name: string
          bio?: string | null
          city?: string | null
          country?: string | null
          avatar_url?: string | null
          is_public?: boolean
          show_activity_names?: boolean
          unit_system?: "metric" | "imperial"
          sync_status?: "pending" | "syncing" | "ready" | "error"
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          strava_athlete_id?: number
          slug?: string
          display_name?: string
          bio?: string | null
          city?: string | null
          country?: string | null
          avatar_url?: string | null
          is_public?: boolean
          show_activity_names?: boolean
          unit_system?: "metric" | "imperial"
          sync_status?: "pending" | "syncing" | "ready" | "error"
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          id: number
          profile_id: string
          name: string
          sport_type: string
          distance_m: number
          moving_time_s: number
          elapsed_time_s: number
          total_elevation_gain_m: number | null
          average_speed_mps: number | null
          max_speed_mps: number | null
          average_heartrate: number | null
          max_heartrate: number | null
          start_date: string
          start_date_local: string
          timezone: string | null
          map_summary_polyline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: number
          profile_id: string
          name: string
          sport_type: string
          distance_m: number
          moving_time_s: number
          elapsed_time_s: number
          total_elevation_gain_m?: number | null
          average_speed_mps?: number | null
          max_speed_mps?: number | null
          average_heartrate?: number | null
          max_heartrate?: number | null
          start_date: string
          start_date_local: string
          timezone?: string | null
          map_summary_polyline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          profile_id?: string
          name?: string
          sport_type?: string
          distance_m?: number
          moving_time_s?: number
          elapsed_time_s?: number
          total_elevation_gain_m?: number | null
          average_speed_mps?: number | null
          max_speed_mps?: number | null
          average_heartrate?: number | null
          max_heartrate?: number | null
          start_date?: string
          start_date_local?: string
          timezone?: string | null
          map_summary_polyline?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_cursors: {
        Row: {
          profile_id: string
          newest_activity_at: string | null
          oldest_backfilled_at: string | null
          backfill_complete: boolean
          last_error: string | null
          updated_at: string
        }
        Insert: {
          profile_id: string
          newest_activity_at?: string | null
          oldest_backfilled_at?: string | null
          backfill_complete?: boolean
          last_error?: string | null
          updated_at?: string
        }
        Update: {
          profile_id?: string
          newest_activity_at?: string | null
          oldest_backfilled_at?: string | null
          backfill_complete?: boolean
          last_error?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_cursors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"]
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
