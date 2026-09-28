import type { ArchiveActivity } from "@/lib/archive/types"

let nextId = 1

/** Corrida mínima para testes; `date` é o horário local "YYYY-MM-DDTHH:mm". */
export function makeRun(
  date: string,
  overrides: Partial<ArchiveActivity> = {}
): ArchiveActivity {
  return {
    id: nextId++,
    name: "Corrida",
    sport_type: "Run",
    distance_m: 10_000,
    moving_time_s: 3000,
    total_elevation_gain_m: 0,
    average_heartrate: null,
    max_heartrate: null,
    start_date_local: `${date}:00+00:00`,
    timezone: "(GMT-03:00) America/Sao_Paulo",
    workout_type: null,
    ...overrides,
  }
}
