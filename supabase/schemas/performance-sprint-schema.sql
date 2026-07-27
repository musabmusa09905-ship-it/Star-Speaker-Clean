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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.performance_sprint_leads enable row level security;

-- Public browser clients never read or write this table directly.
-- The ai-speaking-coach Edge Function writes through the service role.
revoke all on table public.performance_sprint_leads from anon, authenticated;

create index if not exists performance_sprint_leads_created_at_idx
  on public.performance_sprint_leads (created_at desc);

create index if not exists performance_sprint_leads_qualification_idx
  on public.performance_sprint_leads (qualification, stage, created_at desc);

comment on table public.performance_sprint_leads is
  'Qualified engineer leads and training outcomes from the Star Speaker Performance Sprint.';
