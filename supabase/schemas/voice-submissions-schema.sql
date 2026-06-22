create table if not exists public.voice_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  student_email text,
  storage_path text not null,
  audio_url text,
  duration_seconds integer,
  submission_date date not null default current_date,
  status text not null default 'submitted',
  coach_feedback text,
  created_at timestamptz not null default now()
);

alter table public.voice_submissions enable row level security;

create policy "Students can insert their own voice submissions"
on public.voice_submissions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Students can view their own voice submissions"
on public.voice_submissions
for select
to authenticated
using (auth.uid() = user_id);

-- Create a private Storage bucket named `voice-submissions` in Supabase first.
-- This policy lets students upload only into their own top-level user id folder.
create policy "Students can upload their own voice files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'voice-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Students can view their own voice files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'voice-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
);
