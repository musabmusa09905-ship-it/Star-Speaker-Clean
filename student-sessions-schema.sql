create table if not exists public.student_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  student_email text,
  session_title text not null,
  session_type text,
  session_focus text,
  session_date date not null,
  session_time time not null,
  meeting_link text,
  status text not null default 'scheduled',
  notes text
);

alter table public.student_sessions enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_sessions'
      and policyname = 'Students can view their own sessions'
  ) then
    create policy "Students can view their own sessions"
    on public.student_sessions
    for select
    to authenticated
    using (auth.uid() = user_id);
  end if;
end
$$;
