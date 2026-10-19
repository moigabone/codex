-- À exécuter dans Supabase > SQL Editor
create type media_type as enum ('film', 'serie', 'anime', 'manga', 'jeu');
create type media_status as enum ('en_cours', 'en_pause', 'a_voir', 'termine', 'abandonne');

create table media (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type           media_type not null,
  status         media_status not null default 'a_voir',
  title          text not null check (length(title) between 1 and 300),
  cover_url      text,
  year           int,
  source         text not null default 'manuel',  -- tmdb | anilist | manuel
  external_id    text,
  season         int check (season > 0),
  progress       int not null default 0 check (progress >= 0),
  progress_total int check (progress_total >= 0),
  rating         smallint check (rating between 1 and 10),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index media_status_updated on media (status, updated_at desc);

-- Sécurité : lecture publique, écriture réservée au propriétaire
alter table media enable row level security;

create policy "lecture publique" on media
  for select using (true);
create policy "ajout par le propriétaire" on media
  for insert to authenticated with check (owner_id = auth.uid());
create policy "modification par le propriétaire" on media
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "suppression par le propriétaire" on media
  for delete to authenticated using (owner_id = auth.uid());

create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger media_touch before update on media
  for each row execute function touch_updated_at();
