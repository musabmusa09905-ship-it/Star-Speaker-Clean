-- Star Speaker private student access setup.
-- Run this in the Supabase SQL editor. Frontend code must use only the anon/publishable key.

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  program text not null default 'Spark',
  current_week integer default 1,
  current_focus text default 'Survival Mode',
  access_status text not null default 'pending',
  first_login_at timestamptz,
  last_login_at timestamptz,
  notes text,
  constraint student_profiles_access_status_check
    check (access_status in ('pending', 'active', 'paused', 'cancelled'))
);

create table if not exists public.student_portal_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  auth_user_id uuid,
  email text,
  event_type text not null,
  event_details jsonb,
  constraint student_portal_events_event_type_check
    check (event_type in ('login_success', 'login_denied', 'first_login', 'logout'))
);

create or replace function public.set_student_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists student_profiles_set_updated_at on public.student_profiles;

create trigger student_profiles_set_updated_at
before update on public.student_profiles
for each row
execute function public.set_student_profile_updated_at();

alter table public.student_profiles enable row level security;
alter table public.student_portal_events enable row level security;

revoke all on public.student_profiles from anon, authenticated;
revoke all on public.student_portal_events from anon, authenticated;

grant select on public.student_profiles to authenticated;
grant update (first_login_at, last_login_at, updated_at) on public.student_profiles to authenticated;
grant insert on public.student_portal_events to authenticated;

drop policy if exists "Students can read their own profile" on public.student_profiles;
drop policy if exists "Students can update their own login timestamps" on public.student_profiles;
drop policy if exists "Authenticated users can insert their own portal events" on public.student_portal_events;

create policy "Students can read their own profile"
on public.student_profiles
for select
to authenticated
using (
  auth.uid() = auth_user_id
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "Students can update their own login timestamps"
on public.student_profiles
for update
to authenticated
using (
  auth.uid() = auth_user_id
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  auth.uid() = auth_user_id
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "Authenticated users can insert their own portal events"
on public.student_portal_events
for insert
to authenticated
with check (auth.uid() = auth_user_id);

create index if not exists student_profiles_auth_user_id_idx
  on public.student_profiles(auth_user_id);

create unique index if not exists student_profiles_auth_user_id_unique_idx
  on public.student_profiles(auth_user_id)
  where auth_user_id is not null;

create index if not exists student_profiles_email_idx
  on public.student_profiles(lower(email));

create index if not exists student_portal_events_auth_user_id_idx
  on public.student_portal_events(auth_user_id);
