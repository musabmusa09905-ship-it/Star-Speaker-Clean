alter table public.student_resources
add column if not exists display_order integer default 1;

drop policy if exists "Students can view their own resources" on public.student_resources;

create policy "Students can view their own resources"
on public.student_resources
for select
to authenticated
using (auth.uid() = user_id);

grant select on public.student_resources to authenticated;
