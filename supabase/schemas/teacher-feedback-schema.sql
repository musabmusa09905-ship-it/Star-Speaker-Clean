alter table public.voice_submissions
add column if not exists coach_feedback text,
add column if not exists coach_next_focus text,
add column if not exists review_status text default 'pending',
add column if not exists reviewed_at timestamptz,
add column if not exists reviewed_by text,
add column if not exists pronunciation_feedback text,
add column if not exists fluency_feedback text,
add column if not exists grammar_feedback text,
add column if not exists confidence_feedback text;

-- Students should only read their own voice submissions through the existing
-- SELECT policy. Do not add a student UPDATE policy for coach feedback.
