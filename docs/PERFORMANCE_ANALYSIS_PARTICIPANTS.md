# 3-minute analysis participants and funnel

This repository owns the public speaking-analysis client, its public Edge Function, and the additive database contract. The authenticated React admin interface lives in the separate `StarSpeaker-App` repository and is intentionally not changed here.

## Safe deployment order

1. Apply `supabase/migrations/0142_add_performance_analysis_participants.sql` to the shared Supabase project. The contract uses `0142` because the shared migration history already contains unrelated migrations `0134` through `0141`.
2. Redeploy `supabase/functions/ai-speaking-coach`.
3. Deploy this website build.
4. In the app repository, update `/admin/performance-sprint` to consume the contracts below before treating its funnel as the redesigned-analysis funnel.

Do not deploy the new website client before the migration and Edge Function. Participant setup is deliberately fail-closed so a visitor cannot proceed without the required participant record.

## Participant workspace contract

Authenticated admins can read:

- `performance_analysis_participant_workspace`

The admin-only view contains one row per setup-complete participant and includes the first name, situation, self-reported and normalized level, selected question snapshot, furthest valid stage, recording/transcript/analysis statuses, both transcripts and analyses when available, related lead data, booking summaries, and a versioned analytics timeline.

The view uses `security_invoker = true`; underlying row-level security continues to require `public.is_admin()`.

Audio is not stored by the current speaking-analysis implementation, so the workspace can report recording state but cannot play an earlier recording. This is an existing retention/privacy characteristic, not a missing public URL.

## Redesigned funnel contract

Authenticated admins should call:

```sql
select * from public.get_performance_analysis_funnel(
  p_from := now() - interval '30 days',
  p_to := now(),
  p_experience_version := 'speaking_analysis_v2'
);
```

The function:

- counts distinct session IDs;
- uses one date range and one explicit experience version;
- excludes marked demo traffic;
- chains every prerequisite so a later stage cannot exceed an earlier valid stage;
- leaves all legacy events untouched;
- does not infer or fabricate missing historical stages.

The legacy app-side `FUNNEL_STAGES` calculation must not be used for `speaking_analysis_v2`: it maps `baseline_submitted`, while the redesigned client emits `first_answer_submitted`, and it aggregates a truncated mixed-version event list.

## Participant versus lead

Completing setup creates only a `performance_analysis_participants` row. A `performance_sprint_leads` row is created only when the existing post-result contact form is submitted. WhatsApp or booking intent remains visible on the participant through `contact_status`, even when no phone or email has been supplied and therefore no lead row can safely exist.
