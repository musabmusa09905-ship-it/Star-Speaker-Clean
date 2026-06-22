create table if not exists public.student_resources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  student_email text,
  title text not null,
  resource_type text not null default 'link',
  resource_url text,
  focus text,
  instructions text,
  speaking_task text,
  status text not null default 'assigned',
  assigned_week_start date,
  assigned_week_end date,
  notes text
);

alter table public.student_resources enable row level security;

drop policy if exists "Students can view their own resources" on public.student_resources;

create policy "Students can view their own resources"
on public.student_resources
for select
to authenticated
using (auth.uid() = user_id);

grant select on public.student_resources to authenticated;
