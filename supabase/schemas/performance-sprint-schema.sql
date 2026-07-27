create extension if not exists pgcrypto;

create table if not exists public.performance_sprint_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text not null,
  email text,
  stage text not null default 'diagnosed'
    check (stage in ('diagnosed', 'completed', 'whatsapp_clicked')),
  professional_context jsonb not null default '{}'::jsonb,
  qualification text not null default 'low_intent'
    check (qualification in ('priority', 'nurture', 'low_intent')),
  primary_bottleneck text
    check (primary_bottleneck is null or primary_bottleneck in ('clarity', 'structure', 'pressure', 'interaction')),
  baseline_metrics jsonb,
  final_metrics jsonb,
  transcripts jsonb not null default '{}'::jsonb,
  session_id uuid,
  budget_range text,
  follow_up_status text not null default 'new'
    check (follow_up_status in ('new', 'contacted', 'call_booked', 'enrolled', 'not_qualified')),
  internal_notes text not null default '',
  source_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.performance_sprint_leads enable row level security;

-- Public browser clients never read or write this table directly.
-- The ai-speaking-coach Edge Function writes through the service role.
revoke all on table public.performance_sprint_leads from anon, authenticated;

alter table public.performance_sprint_leads
  add column if not exists session_id uuid,
  add column if not exists budget_range text,
  add column if not exists follow_up_status text not null default 'new',
  add column if not exists internal_notes text not null default '',
  add column if not exists source_data jsonb not null default '{}'::jsonb;

drop policy if exists performance_sprint_leads_admin_all on public.performance_sprint_leads;
create policy performance_sprint_leads_admin_all
  on public.performance_sprint_leads
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, update on table public.performance_sprint_leads to authenticated;

create table if not exists public.performance_sprint_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  lead_id uuid references public.performance_sprint_leads(id) on delete set null,
  event_type text not null,
  stage text not null,
  metadata jsonb not null default '{}'::jsonb,
  source_data jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

alter table public.performance_sprint_events enable row level security;
revoke all on table public.performance_sprint_events from anon, authenticated;

drop policy if exists performance_sprint_events_admin_select on public.performance_sprint_events;
create policy performance_sprint_events_admin_select
  on public.performance_sprint_events
  for select
  to authenticated
  using (public.is_admin());

grant select on table public.performance_sprint_events to authenticated;

create index if not exists performance_sprint_leads_created_at_idx
  on public.performance_sprint_leads (created_at desc);

create index if not exists performance_sprint_leads_qualification_idx
  on public.performance_sprint_leads (qualification, stage, created_at desc);

create index if not exists performance_sprint_leads_session_idx
  on public.performance_sprint_leads (session_id);

create index if not exists performance_sprint_events_session_idx
  on public.performance_sprint_events (session_id, occurred_at);

create index if not exists performance_sprint_events_type_idx
  on public.performance_sprint_events (event_type, occurred_at desc);

comment on table public.performance_sprint_leads is
  'Qualified engineer leads and training outcomes from the Star Speaker Performance Sprint.';
