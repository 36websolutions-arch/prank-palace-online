# Claude Code Notes

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
https://xfptozziptcpvhtkezba.supabase.co/functions/v1/kofi-webhook
```

Set the verification token as a Supabase secret:
```bash
supabase secrets set KOFI_VERIFICATION_TOKEN=<token>
```

## Project Structure

- `/` - New animated homepage (Home2.tsx)
- `/home2` - Original homepage (Home.tsx)
- `/chronicles` - All chronicles with static + database entries
- `/home` - Redirects to `/`
