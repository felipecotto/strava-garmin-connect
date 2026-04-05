export interface StravaActivity {
  id: number
  name: string
  sport_type: string
  start_date_local: string
  distance: number           // metros
  moving_time: number        // segundos
  elapsed_time: number       // segundos
  total_elevation_gain: number // metros
  average_speed: number      // m/s
  max_speed: number          // m/s
  average_heartrate?: number
  max_heartrate?: number
  map?: {
    summary_polyline: string
  }
}

export interface WeeklyStats {
  totalKm: number
  avgPaceSeconds: number     // segundos por km
  activityCount: number
  totalElevation: number     // metros
}
