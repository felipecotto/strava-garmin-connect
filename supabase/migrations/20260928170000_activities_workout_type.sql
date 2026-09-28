-- workout_type do Strava (corrida: 0 padrão, 1 prova, 2 longão, 3 treino).
-- Usado para marcar provas na edição do arquivo.
alter table public.activities
  add column if not exists workout_type smallint;
