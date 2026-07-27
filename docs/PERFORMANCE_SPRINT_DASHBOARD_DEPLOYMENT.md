# Performance Sprint Dashboard Deployment

Use the same Star Speaker Supabase project for the website and app.

## Required order

1. In Supabase SQL Editor, run:
   `supabase/schemas/performance-sprint-schema.sql`
2. Redeploy the Edge Function:
   `supabase/functions/ai-speaking-coach`
3. Copy this website update into the website repository, commit, and push.
4. Copy the app update into the app repository, commit, and push.
5. Wait for both Vercel deployments to finish.
6. Complete one real Performance Sprint.
7. Sign in to the app as an admin and open:
   `/admin/performance-sprint`

The existing `OPENAI_API_KEY` function secret does not need to be added again.
Keep JWT verification disabled for the public `ai-speaking-coach` function.

## Recommended commits

Website:

`feat(performance-sprint): add budget qualification and funnel tracking`

App:

`feat(admin): add Performance Sprint lead dashboard`
