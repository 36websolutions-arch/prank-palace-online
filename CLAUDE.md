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
