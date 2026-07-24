-- Denormalized stats + PRs for fast public profile SSR

create table if not exists public.profile_stats (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  total_runs integer not null default 0,
  total_distance_m numeric not null default 0,
  total_moving_time_s bigint not null default 0,
  total_elevation_m numeric not null default 0,
  current_streak_days integer not null default 0,
  longest_streak_days integer not null default 0,
  ytd_distance_m numeric not null default 0,
  ytd_runs integer not null default 0,
  last_30d_distance_m numeric not null default 0,
  last_30d_runs integer not null default 0,
  last_activity_at timestamptz,
  monthly_volume jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.personal_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  distance_key text not null,
  distance_m numeric not null,
  moving_time_s integer not null,
  activity_id bigint references public.activities (id) on delete set null,
  activity_name text,
  achieved_at timestamptz not null,
  unique (profile_id, distance_key)
);

create index if not exists personal_records_profile_idx
  on public.personal_records (profile_id);

drop trigger if exists profile_stats_set_updated_at on public.profile_stats;
create trigger profile_stats_set_updated_at
  before update on public.profile_stats
  for each row execute function public.set_updated_at();

alter table public.profile_stats enable row level security;
alter table public.personal_records enable row level security;

drop policy if exists "Public profile_stats are readable" on public.profile_stats;
create policy "Public profile_stats are readable"
  on public.profile_stats
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = profile_stats.profile_id
        and p.is_public = true
    )
  );

drop policy if exists "Public personal_records are readable" on public.personal_records;
create policy "Public personal_records are readable"
  on public.personal_records
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = personal_records.profile_id
        and p.is_public = true
    )
  );
