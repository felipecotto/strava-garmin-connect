-- CTT 2.0: profiles (FK) + activities + sync cursor
-- Public read path queries activities; Strava sync writes via service_role.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles (minimal identity for activity ownership + public slug)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  strava_athlete_id bigint not null unique,
  slug text not null unique,
  display_name text not null,
  bio text,
  city text,
  country text,
  avatar_url text,
  is_public boolean not null default true,
  show_activity_names boolean not null default true,
  unit_system text not null default 'metric'
    check (unit_system in ('metric', 'imperial')),
  sync_status text not null default 'pending'
    check (sync_status in ('pending', 'syncing', 'ready', 'error')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_slug_format check (
    slug ~ '^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$'
  )
);

create index if not exists profiles_slug_idx on public.profiles (slug);
create index if not exists profiles_strava_athlete_id_idx
  on public.profiles (strava_athlete_id);

-- ---------------------------------------------------------------------------
-- activities (cached Strava summary payloads)
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id bigint primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  sport_type text not null,
  distance_m numeric not null,
  moving_time_s integer not null,
  elapsed_time_s integer not null,
  total_elevation_gain_m numeric,
  average_speed_mps numeric,
  max_speed_mps numeric,
  average_heartrate numeric,
  max_heartrate numeric,
  start_date timestamptz not null,
  start_date_local timestamptz not null,
  timezone text,
  map_summary_polyline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_profile_start_idx
  on public.activities (profile_id, start_date desc);

create index if not exists activities_profile_sport_idx
  on public.activities (profile_id, sport_type);

-- ---------------------------------------------------------------------------
-- sync_cursors (backfill progress for initial + incremental sync)
-- ---------------------------------------------------------------------------
create table if not exists public.sync_cursors (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  newest_activity_at timestamptz,
  oldest_backfilled_at timestamptz,
  backfill_complete boolean not null default false,
  last_error text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

drop trigger if exists sync_cursors_set_updated_at on public.sync_cursors;
create trigger sync_cursors_set_updated_at
  before update on public.sync_cursors
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: public can read public profiles + their activities; writes via service_role
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.sync_cursors enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
  on public.profiles
  for select
  to anon, authenticated
  using (is_public = true);

drop policy if exists "Public activities are readable" on public.activities;
create policy "Public activities are readable"
  on public.activities
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = activities.profile_id
        and p.is_public = true
    )
  );

-- sync_cursors: no client policies (service_role only)
