# Engineering English Performance Sprint

## Production setup

1. Run `supabase/schemas/performance-sprint-schema.sql` in the existing Supabase project.
2. Deploy the `ai-speaking-coach` Edge Function.
3. Add `OPENAI_API_KEY` as a Supabase Edge Function secret.
4. Optional: set `OPENAI_EVALUATION_MODEL`. The default is `gpt-5.6-luna`.
5. Open `/tr/performans-testi/` and complete one real microphone test.

The browser never receives the OpenAI key. Audio is sent to the Edge Function for transcription and evaluation and is not stored by this implementation. Lead contact details, professional context, transcripts, scores, and funnel stage are stored in `performance_sprint_leads`.

## Local experience demo

Run the existing preview server, then open:

`http://127.0.0.1:4173/tr/performans-testi/?demo=1`

Demo mode preserves the complete interface and timing flow but returns fixed analysis fixtures. It is intended only for visual and interaction QA.

## Recommended production checks

- Test microphone permission on Android Chrome, iOS Safari, and desktop Chrome/Edge.
- Confirm the Edge Function allows the production origin.
- Confirm a completed session creates and then updates one lead row.
- Confirm the final WhatsApp message includes the engineer's bottleneck and before/after score.
- Measure median analysis latency separately for transcription and evaluation.
- Pilot the scoring with at least 10 engineers before treating score bands as calibrated.
