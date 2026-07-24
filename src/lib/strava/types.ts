export type StravaSessionData = {
  accessToken?: string
  refreshToken?: string
  /** Unix timestamp (segundos) em que o access token expira */
  expiresAt?: number
  /** UUID do profile no Supabase (após OAuth + upsert) */
  profileId?: string
}

export type StravaAthlete = {
  id: number
  username: string | null
  firstname: string
  lastname: string
  city: string | null
  state: string | null
  country: string | null
  profile: string | null
  profile_medium: string | null
  created_at: string
  measurement_preference: string
}

export type StravaActivity = {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type?: string
  average_speed?: number
  max_speed?: number
  average_heartrate?: number
  max_heartrate?: number
  timezone?: string
  start_date: string
  start_date_local: string
  map?: {
    summary_polyline?: string | null
  } | null
}

export type StravaTokenResponse = {
  token_type: string
  expires_at: number
  expires_in: number
  refresh_token: string
  access_token: string
  athlete?: StravaAthlete
}
