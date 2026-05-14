alter table public.student_sessions
add column if not exists practice_summary text,
add column if not exists mistake_pattern text,
add column if not exists homework text,
add column if not exists next_focus text,
add column if not exists notes_added_at timestamptz,
add column if not exists notes_added_by text;

drop policy if exists "Students can view their own sessions" on public.student_sessions;

create policy "Students can view their own sessions"
on public.student_sessions
for select
to authenticated
using (auth.uid() = user_id);

grant select on public.student_sessions to authenticated;
