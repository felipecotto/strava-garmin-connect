-- Beta limitado pela capacidade de atletas do app no Strava (10 no modo inicial).
-- Conta como conectado todo perfil sem `strava_revoked_at`.

alter table public.profiles
  add column if not exists strava_revoked_at timestamptz;

create table if not exists public.beta_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'waiting'
    check (status in ('waiting', 'invited', 'joined', 'left', 'expired')),
  invited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists beta_waitlist_email_idx
  on public.beta_waitlist (lower(email));

create index if not exists beta_waitlist_status_created_idx
  on public.beta_waitlist (status, created_at);

drop trigger if exists beta_waitlist_set_updated_at on public.beta_waitlist;
create trigger beta_waitlist_set_updated_at
  before update on public.beta_waitlist
  for each row execute function public.set_updated_at();

-- Sem políticas: só o service_role (servidor) lê e escreve a fila.
alter table public.beta_waitlist enable row level security;
