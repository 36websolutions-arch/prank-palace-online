# Corporate Pranks (corporatepranks.com)

## Supabase

- **Project:** `kywwyzoxegmehfdzqokx`
- **URL:** `https://kywwyzoxegmehfdzqokx.supabase.co`
- **Dashboard:** `https://supabase.com/dashboard/project/kywwyzoxegmehfdzqokx`

## Deploy Fix

When pushing to GitHub, if you get permission denied errors, unset the `GITHUB_TOKEN` env var first:

```bash
unset GITHUB_TOKEN && git push
```

The `GITHUB_TOKEN` env var overrides the correct credentials from the keyring.

## Vercel Deploy

Direct deploy to Vercel production:

```bash
vercel --prod
```

## Ko-fi Webhook

The correct webhook URL for Ko-fi is:
```
https://kywwyzoxegmehfdzqokx.supabase.co/functions/v1/kofi-webhook
```

Set the verification token as a Supabase secret:
```bash
supabase secrets set KOFI_VERIFICATION_TOKEN=<token> --project-ref kywwyzoxegmehfdzqokx
```

## Edge Functions

Deploy all edge functions:
```bash
SUPABASE_ACCESS_TOKEN=<token> npx supabase functions deploy --project-ref kywwyzoxegmehfdzqokx
```

## Project Structure

- `/` - New animated homepage (Home2.tsx)
- `/home2` - Original homepage (Home.tsx)
- `/chronicles` - All chronicles with static + database entries
- `/home` - Redirects to `/`
- `/you-smell-like-shit` - YSLS solid cologne product page
- `/your-breath-stinks` - YBS sour mints product page
- `/forum-economicus` - Financial news in Roman satire style
- `/checkout` - Unified checkout (supports `?from=ysls` and `?from=ybs` funnels)

## Companion: Chronicle Commenter

Auto-engagement bot that generates Roman satirical comments on corporate culture posts.

- **Location:** `/Users/statusmacbook2024/Projects (Code)/chronicle-commenter/`
- **Shared Supabase table:** `pending_comments` — bot pushes pending comments, admin approves from Comments tab
- **Flow:** Bot generates → Supabase → Admin approves → Bot polls & posts via Bird CLI
- **Twitter account:** @CorporatePranks (Chrome Profile 13)
- **Admin tab:** Comments (10th tab) — approve/reject pending comments with stats

### Comment Review Pipeline

The `pending_comments` table bridges both projects:
- **chronicle-commenter** writes rows with `status: pending` via service_role key
- **Admin dashboard** reads/updates via RLS (admin role required)
- `post-approved` CLI command in chronicle-commenter polls for `status: approved` and posts via Bird CLI

### Twitter Profile (@CorporatePranks)

- Chrome Profile 13 = @CorporatePranks auth for Bird CLI
- Bio: "Satire since Rome. Dispatches from the Corporate Empire. Chronicles, cologne that insults you, and mints for the socially unaware."
- Location: Imperium Corporatum
- Website: corporatepranks.com
- Profile pic: `src/assets/logo.png` | Banner: `public/festival_of_the_superb_owl.png`
- Seed tweets: `chronicle-commenter/scripts/seed_tweets.py`
