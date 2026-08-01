-- Versioned, idempotent participant tracking for the 3-minute speaking analysis.
-- This migration is additive. It does not rewrite legacy Performance Sprint rows.

create table if not exists public.performance_analysis_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique,
  first_name text not null check (
    char_length(first_name) between 1 and 40
    and first_name = btrim(first_name)
    and first_name ~ '^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+([ ''-][A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+)*$'
  ),
  situation text not null check (situation in ('meeting', 'interview', 'presentation')),
  reported_level text not null check (reported_level in ('b1', 'b1_plus', 'b2', 'b2_plus', 'c1', 'unsure')),
  normalized_level text not null check (normalized_level in ('b1', 'b1_plus', 'b2', 'b2_plus', 'c1')),
  experience_version text not null default 'speaking_analysis_v2',
  question_id text not null,
  question_snapshot jsonb not null default '{}'::jsonb,
  furthest_stage text not null default 'setup_completed' check (
    furthest_stage in ('setup_completed', 'first_answer_submitted', 'correction_viewed', 'retry_submitted', 'result_viewed')
  ),
  first_recording_status text not null default 'not_started' check (
    first_recording_status in ('not_started', 'recording', 'submitted', 'analysis_failed', 'analyzed')
  ),
  retry_status text not null default 'not_started' check (
    retry_status in ('not_started', 'recording', 'submitted', 'analysis_failed', 'analyzed')
  ),
  result_status text not null default 'not_viewed' check (result_status in ('not_viewed', 'viewed')),
  contact_status text not null default 'none' check (
    contact_status in ('none', 'whatsapp_clicked', 'contact_submitted', 'booking_started', 'booked')
  ),
  first_transcript text,
  first_analysis jsonb,
  retry_transcript text,
  retry_analysis jsonb,
  primary_bottleneck text check (
    primary_bottleneck is null or primary_bottleneck in ('clarity', 'structure', 'pressure', 'interaction')
  ),
  lead_id uuid references public.performance_sprint_leads(id) on delete set null,
  is_demo boolean not null default false,
  is_internal boolean not null default false,
  source_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.performance_analysis_participants enable row level security;
revoke all on table public.performance_analysis_participants from anon, authenticated;

drop policy if exists performance_analysis_participants_admin_all on public.performance_analysis_participants;
create policy performance_analysis_participants_admin_all
  on public.performance_analysis_participants
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.performance_analysis_participants to authenticated;

create index if not exists performance_analysis_participants_created_idx
  on public.performance_analysis_participants (created_at desc);
create index if not exists performance_analysis_participants_stage_idx
  on public.performance_analysis_participants (experience_version, furthest_stage, created_at desc);
create index if not exists performance_analysis_participants_lead_idx
  on public.performance_analysis_participants (lead_id) where lead_id is not null;

alter table public.performance_sprint_leads
  add column if not exists participant_id uuid references public.performance_analysis_participants(id) on delete set null;
create unique index if not exists performance_sprint_leads_participant_unique
  on public.performance_sprint_leads (participant_id) where participant_id is not null;

alter table public.performance_sprint_events
  add column if not exists participant_id uuid references public.performance_analysis_participants(id) on delete set null,
  add column if not exists experience_version text,
  add column if not exists event_key text,
  add column if not exists is_demo boolean not null default false;

create unique index if not exists performance_sprint_events_session_event_key_unique
  on public.performance_sprint_events (session_id, event_key) where event_key is not null;
create index if not exists performance_sprint_events_version_cohort_idx
  on public.performance_sprint_events (experience_version, is_demo, occurred_at, session_id);

create or replace function public.performance_analysis_stage_rank(stage_name text)
returns integer
language sql
immutable
as $$
  select case stage_name
    when 'setup_completed' then 1
    when 'first_answer_submitted' then 2
    when 'correction_viewed' then 3
    when 'retry_submitted' then 4
    when 'result_viewed' then 5
    else 0
  end;
$$;

create or replace function public.performance_analysis_recording_rank(status_name text)
returns integer
language sql
immutable
as $$
  select case status_name
    when 'not_started' then 0
    when 'recording' then 1
    when 'submitted' then 2
    when 'analysis_failed' then 3
    when 'analyzed' then 4
    else -1
  end;
$$;

create or replace function public.upsert_performance_analysis_participant(
  p_session_id uuid,
  p_first_name text,
  p_situation text,
  p_reported_level text,
  p_normalized_level text,
  p_experience_version text,
  p_question_id text,
  p_question_snapshot jsonb,
  p_is_demo boolean default false,
  p_is_internal boolean default false,
  p_source_data jsonb default '{}'::jsonb
)
returns public.performance_analysis_participants
language plpgsql
security definer
set search_path = ''
as $$
declare saved public.performance_analysis_participants;
begin
  if p_experience_version <> 'speaking_analysis_v2' then
    raise exception 'unsupported_experience_version';
  end if;
  if p_is_demo then
    raise exception 'demo_participants_are_not_persisted';
  end if;

  insert into public.performance_analysis_participants (
    session_id, first_name, situation, reported_level, normalized_level,
    experience_version, question_id, question_snapshot, is_demo, is_internal, source_data
  ) values (
    p_session_id, btrim(p_first_name), p_situation, p_reported_level, p_normalized_level,
    p_experience_version, p_question_id, coalesce(p_question_snapshot, '{}'::jsonb), false,
    coalesce(p_is_internal, false), coalesce(p_source_data, '{}'::jsonb)
  )
  on conflict (session_id) do update set
    first_name = excluded.first_name,
    situation = case
      when public.performance_analysis_stage_rank(performance_analysis_participants.furthest_stage) = 1
        then excluded.situation else performance_analysis_participants.situation end,
    reported_level = case
      when public.performance_analysis_stage_rank(performance_analysis_participants.furthest_stage) = 1
        then excluded.reported_level else performance_analysis_participants.reported_level end,
    normalized_level = case
      when public.performance_analysis_stage_rank(performance_analysis_participants.furthest_stage) = 1
        then excluded.normalized_level else performance_analysis_participants.normalized_level end,
    question_id = case
      when public.performance_analysis_stage_rank(performance_analysis_participants.furthest_stage) = 1
        then excluded.question_id else performance_analysis_participants.question_id end,
    question_snapshot = case
      when public.performance_analysis_stage_rank(performance_analysis_participants.furthest_stage) = 1
        then excluded.question_snapshot else performance_analysis_participants.question_snapshot end,
    is_internal = performance_analysis_participants.is_internal or excluded.is_internal,
    source_data = performance_analysis_participants.source_data || excluded.source_data,
    updated_at = now()
  returning * into saved;

  return saved;
end;
$$;

create or replace function public.advance_performance_analysis_participant(
  p_session_id uuid,
  p_stage text default null,
  p_first_recording_status text default null,
  p_retry_status text default null,
  p_result_status text default null,
  p_contact_status text default null,
  p_first_transcript text default null,
  p_first_analysis jsonb default null,
  p_retry_transcript text default null,
  p_retry_analysis jsonb default null,
  p_primary_bottleneck text default null,
  p_lead_id uuid default null
)
returns public.performance_analysis_participants
language plpgsql
security definer
set search_path = ''
as $$
declare current_row public.performance_analysis_participants;
declare saved public.performance_analysis_participants;
begin
  select * into current_row from public.performance_analysis_participants
  where session_id = p_session_id for update;
  if current_row.id is null then raise exception 'participant_not_found'; end if;
  if p_stage is not null and public.performance_analysis_stage_rank(p_stage) = 0 then
    raise exception 'invalid_participant_stage';
  end if;

  update public.performance_analysis_participants set
    furthest_stage = case
      when p_stage is not null and public.performance_analysis_stage_rank(p_stage) > public.performance_analysis_stage_rank(current_row.furthest_stage)
        then p_stage else current_row.furthest_stage end,
    first_recording_status = case
      when p_first_recording_status is not null
        and public.performance_analysis_recording_rank(p_first_recording_status) >= public.performance_analysis_recording_rank(current_row.first_recording_status)
        then p_first_recording_status else current_row.first_recording_status end,
    retry_status = case
      when p_retry_status is not null
        and public.performance_analysis_recording_rank(p_retry_status) >= public.performance_analysis_recording_rank(current_row.retry_status)
        then p_retry_status else current_row.retry_status end,
    result_status = case when p_result_status = 'viewed' then 'viewed' else current_row.result_status end,
    contact_status = case
      when p_contact_status is null then current_row.contact_status
      when array_position(array['none','whatsapp_clicked','contact_submitted','booking_started','booked'], p_contact_status)
        >= array_position(array['none','whatsapp_clicked','contact_submitted','booking_started','booked'], current_row.contact_status)
        then p_contact_status else current_row.contact_status end,
    first_transcript = coalesce(p_first_transcript, current_row.first_transcript),
    first_analysis = coalesce(p_first_analysis, current_row.first_analysis),
    retry_transcript = coalesce(p_retry_transcript, current_row.retry_transcript),
    retry_analysis = coalesce(p_retry_analysis, current_row.retry_analysis),
    primary_bottleneck = coalesce(p_primary_bottleneck, current_row.primary_bottleneck),
    lead_id = coalesce(p_lead_id, current_row.lead_id),
    updated_at = now()
  where id = current_row.id
  returning * into saved;
  return saved;
end;
$$;

create or replace function public.track_performance_analysis_event(
  p_session_id uuid,
  p_event_type text,
  p_stage text,
  p_event_key text,
  p_metadata jsonb default '{}'::jsonb,
  p_source_data jsonb default '{}'::jsonb,
  p_experience_version text default 'speaking_analysis_v2',
  p_is_demo boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare participant public.performance_analysis_participants;
declare required_rank integer := case p_event_type
  when 'setup_completed' then 1
  when 'first_recording_started' then 1
  when 'first_answer_submitted' then 2
  when 'personal_correction_viewed' then 3
  when 'retry_started' then 3
  when 'retry_submitted' then 4
  when 'result_viewed' then 5
  when 'contact_submitted' then 5
  when 'whatsapp_clicked' then 5
  when 'booking_intent_clicked' then 5
  when 'booking_submitted' then 5
  when 'booking_confirmed' then 5
  else 0 end;
begin
  if p_is_demo then return; end if;
  if p_experience_version <> 'speaking_analysis_v2' then raise exception 'unsupported_experience_version'; end if;
  if p_event_key is null or btrim(p_event_key) = '' then raise exception 'event_key_required'; end if;
  if required_rank > 0 then
    select * into participant from public.performance_analysis_participants where session_id = p_session_id;
    if participant.id is null or public.performance_analysis_stage_rank(participant.furthest_stage) < required_rank then
      raise exception 'event_prerequisite_not_met';
    end if;
  end if;

  insert into public.performance_sprint_events (
    session_id, participant_id, event_type, stage, metadata, source_data,
    experience_version, event_key, is_demo
  ) values (
    p_session_id, participant.id, p_event_type, p_stage,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_source_data, '{}'::jsonb),
    p_experience_version, p_event_key, false
  ) on conflict (session_id, event_key) where event_key is not null do nothing;
end;
$$;

revoke all on function public.upsert_performance_analysis_participant(uuid,text,text,text,text,text,text,jsonb,boolean,boolean,jsonb) from public;
revoke all on function public.advance_performance_analysis_participant(uuid,text,text,text,text,text,text,jsonb,text,jsonb,text,uuid) from public;
revoke all on function public.track_performance_analysis_event(uuid,text,text,text,jsonb,jsonb,text,boolean) from public;
grant execute on function public.upsert_performance_analysis_participant(uuid,text,text,text,text,text,text,jsonb,boolean,boolean,jsonb) to service_role;
grant execute on function public.advance_performance_analysis_participant(uuid,text,text,text,text,text,text,jsonb,text,jsonb,text,uuid) to service_role;
grant execute on function public.track_performance_analysis_event(uuid,text,text,text,jsonb,jsonb,text,boolean) to service_role;

create or replace function public.get_performance_analysis_funnel(
  p_from timestamptz default (now() - interval '30 days'),
  p_to timestamptz default now(),
  p_experience_version text default 'speaking_analysis_v2'
)
returns table(stage_order integer, stage_key text, stage_label text, session_count bigint)
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  return query
  with cohort as (
    select e.session_id,
      bool_or(e.event_type = 'landing_viewed') as landing,
      bool_or(e.event_type = 'start_clicked') as started,
      bool_or(e.event_type = 'setup_completed') as setup,
      bool_or(e.event_type = 'first_recording_started') as first_started,
      bool_or(e.event_type = 'first_answer_submitted') as first_submitted,
      bool_or(e.event_type = 'personal_correction_viewed') as correction,
      bool_or(e.event_type = 'retry_started') as retry_started,
      bool_or(e.event_type = 'retry_submitted') as retry_submitted,
      bool_or(e.event_type = 'result_viewed') as result_viewed,
      bool_or(e.event_type in ('contact_submitted','whatsapp_clicked')) as contact_action,
      bool_or(e.event_type in ('booking_intent_clicked','booking_submitted','booking_confirmed')) as booking_action
    from public.performance_sprint_events e
    left join public.performance_analysis_participants p on p.session_id = e.session_id
    where e.experience_version = p_experience_version
      and not e.is_demo
      and not coalesce(p.is_internal, false)
      and e.occurred_at >= p_from and e.occurred_at < p_to
    group by e.session_id
  ), chained as (
    select *,
      landing and started as valid_started,
      landing and started and setup as valid_setup,
      landing and started and setup and first_started as valid_first_started,
      landing and started and setup and first_started and first_submitted as valid_first_submitted,
      landing and started and setup and first_started and first_submitted and correction as valid_correction,
      landing and started and setup and first_started and first_submitted and correction and retry_started as valid_retry_started,
      landing and started and setup and first_started and first_submitted and correction and retry_started and retry_submitted as valid_retry_submitted,
      landing and started and setup and first_started and first_submitted and correction and retry_started and retry_submitted and result_viewed as valid_result
    from cohort
  )
  select * from (values
    (1, 'landing_viewed', 'Landing viewed', (select count(*) from chained where landing)),
    (2, 'start_clicked', 'CTA clicked', (select count(*) from chained where valid_started)),
    (3, 'setup_completed', 'Setup completed', (select count(*) from chained where valid_setup)),
    (4, 'first_recording_started', 'First recording started', (select count(*) from chained where valid_first_started)),
    (5, 'first_answer_submitted', 'First answer submitted', (select count(*) from chained where valid_first_submitted)),
    (6, 'personal_correction_viewed', 'Personal correction viewed', (select count(*) from chained where valid_correction)),
    (7, 'retry_started', 'Retry started', (select count(*) from chained where valid_retry_started)),
    (8, 'retry_submitted', 'Retry submitted', (select count(*) from chained where valid_retry_submitted)),
    (9, 'result_viewed', 'Final result viewed', (select count(*) from chained where valid_result)),
    (10, 'contact_action', 'Contact or WhatsApp action', (select count(*) from chained where valid_result and contact_action)),
    (11, 'booking_action', 'Booking action', (select count(*) from chained where valid_result and booking_action))
  ) as funnel(stage_order, stage_key, stage_label, session_count);
end;
$$;

revoke all on function public.get_performance_analysis_funnel(timestamptz,timestamptz,text) from public;
grant execute on function public.get_performance_analysis_funnel(timestamptz,timestamptz,text) to authenticated;

create or replace view public.performance_analysis_participant_workspace
with (security_invoker = true)
as
select
  p.*,
  l.full_name as lead_full_name,
  l.whatsapp as lead_whatsapp,
  l.email as lead_email,
  l.qualification as lead_qualification,
  l.follow_up_status as lead_follow_up_status,
  coalesce((
    select jsonb_agg(jsonb_build_object(
      'event_type', e.event_type,
      'stage', e.stage,
      'occurred_at', e.occurred_at,
      'metadata', e.metadata
    ) order by e.occurred_at)
    from public.performance_sprint_events e
    where e.session_id = p.session_id and e.experience_version = p.experience_version
  ), '[]'::jsonb) as analytics_timeline,
  coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', b.id,
      'status', b.status,
      'appointment_start', b.appointment_start
    ) order by b.appointment_start desc)
    from public.performance_sprint_bookings b
    where b.lead_id = p.lead_id
  ), '[]'::jsonb) as bookings
from public.performance_analysis_participants p
left join public.performance_sprint_leads l on l.id = p.lead_id;

revoke all on public.performance_analysis_participant_workspace from anon, authenticated;
grant select on public.performance_analysis_participant_workspace to authenticated;

comment on table public.performance_analysis_participants is
  'Setup-complete participants in the versioned 3-minute speaking analysis; participants remain separate from leads.';
comment on view public.performance_analysis_participant_workspace is
  'Admin-only participant detail workspace with related lead, booking, transcript, analysis, and session timeline data.';
