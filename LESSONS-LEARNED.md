# Lessons Learned — Corporate Pranks

> This file is READ at the start of every session and APPENDED TO whenever a mistake is made or a non-obvious pattern is discovered.
> It accumulates institutional knowledge across sessions. Never delete entries — only mark outdated ones.

---

<!-- New lessons are appended below this line -->

### Configuration — 2026-03-14
- **MISTAKE**: Supabase `db push` failed because old migrations (applied directly via SQL editor) were not in the migration history table, so the CLI tried to replay them all.
- **FIX**: Use `supabase migration repair <version> --status applied --linked` to mark each old migration as applied before pushing new ones.
- **CONTEXT**: This happens when migrations are applied manually via dashboard instead of the CLI. Mark all existing ones as applied first.
- **DETECTION**: `npx supabase db push --dry-run` — if it lists old migrations, they need repair.

### Configuration — 2026-03-14
- **MISTAKE**: SQL migration to alter `user_id` column type failed because an RLS policy referenced that column. PostgreSQL won't alter a column type while a policy depends on it.
- **FIX**: Drop ALL policies that reference the column BEFORE altering its type, then recreate them after.
- **CONTEXT**: Order matters: DROP policies → ALTER column → CREATE new policies. The original migration tried ALTER before DROP.
- **DETECTION**: Error `cannot alter type of a column used in a policy definition`

### Dependencies — 2026-03-14
- **MISTAKE**: Instagram scraper MCP returned 401 because cookies.json was missing the `sessionid` cookie (httpOnly, not visible to JS `document.cookie`).
- **FIX**: Use Playwright's `page.context().cookies()` API (not `document.cookie`) to extract httpOnly cookies after browser login. Kill old MCP server processes after updating cookies so it reloads them.
- **CONTEXT**: The `sessionid` cookie is httpOnly and won't appear in `document.cookie`. Must use browser automation API to get it. After updating `data/cookies.json`, kill the running MCP process (`pgrep -f "insta-scraper/index.js"`) since it caches cookies in memory.
- **DETECTION**: `grep sessionid insta-scraper/data/cookies.json` — if missing, cookies are incomplete.

### Configuration — 2026-03-14
- **MISTAKE**: Supabase migration files with short date format (e.g., `20260314_name.sql`) cause version collisions when multiple migrations share the same date. The CLI extracts the version number from the filename prefix, so two files both starting with `20260314` map to the same version.
- **FIX**: Always use full timestamp format for migration filenames: `YYYYMMDDHHmmss_name.sql` (e.g., `20260314180000_name.sql`). If a short-format migration is already applied remotely, rename the local file to full timestamp and `supabase migration repair <old_version> --status reverted` then `repair <new_version> --status applied`.
- **CONTEXT**: The `supabase db push` command compares local file version numbers against the remote `supabase_migrations.schema_migrations` table. Duplicate version numbers cause "Remote migration versions not found in local migrations directory" errors.
- **DETECTION**: `ls supabase/migrations/ | awk -F_ '{print $1}' | sort | uniq -d` — any duplicates need renaming.

### Configuration — 2026-03-14
- **MISTAKE**: Supabase CLI has no `storage create` or `db execute` subcommand. Cannot create storage buckets or run arbitrary SQL via CLI alone.
- **FIX**: Create storage buckets via the Supabase Storage REST API: `POST {SUPABASE_URL}/storage/v1/bucket` with service_role key. Get service role key from `npx supabase projects api-keys --project-ref <ref> -o json`. For SQL, use idempotent migration files with `ON CONFLICT DO NOTHING` and `EXCEPTION WHEN duplicate_object THEN NULL` wrappers.
- **CONTEXT**: The service role key bypasses RLS and has full Storage Admin access. The Management API at `api.supabase.com` also works if you have the CLI access token.
- **DETECTION**: N/A — just remember there's no `supabase storage create` command.

### Configuration — 2026-03-26
- **MISTAKE**: Vercel env vars set via `<<<` heredoc (e.g. `vercel env add VAR production <<< "value"`) include a trailing newline in the value. This caused xforge login to fail with 401 because the password had `\n` appended.
- **FIX**: Use `printf 'value' | vercel env add VAR production` instead — `printf` without `\n` avoids the trailing newline.
- **CONTEXT**: `<<<` in bash always appends a newline. This is invisible but breaks auth credentials. After setting env vars, always verify with `vercel env pull` and check for `\n` in values.
- **DETECTION**: `vercel env pull .env.check --environment production && grep '\\n"' .env.check`

### Architecture — 2026-03-26
- **MISTAKE**: The xforge proxy's `validateAdmin()` checked `user.app_metadata.role === "admin"` but the Corporate Pranks Supabase project stores admin role in the `profiles` table (`role` column) and `user_roles` table, not in `app_metadata`.
- **FIX**: Query the `profiles` table via Supabase REST API using the user's own JWT (RLS allows self-read), falling back to `user_roles` table. Don't rely on `app_metadata` unless you've verified it's populated.
- **CONTEXT**: The `AuthContext.tsx` (line 83) checks `profile.role === "admin"` from the profiles table. Any server-side admin validation must mirror this check.
- **DETECTION**: `grep -n "app_metadata.*admin" api/` — if found in a proxy/serverless function, it's probably wrong for this project.

### API — 2026-03-26
- **MISTAKE**: xforge audit-log API returns camelCase fields (`actionType`, `createdAt`, `result`, `metadata`) but initial TypeScript types used snake_case (`action_type`, `created_at`, `success`, `details`). This caused the History tab to render blank cells.
- **FIX**: Always test API responses against actual data before writing types. The audit-log returns: `{id, accountId, username, actionType, result, durationMs, metadata, createdAt}`.
- **CONTEXT**: xforge uses camelCase throughout its API. Don't assume snake_case.
- **DETECTION**: Compare interface fields against actual API response JSON.

### Process — 2026-03-27
- **MISTAKE**: Deployed frontend (Vercel) and edge function (Supabase) before committing and pushing to git. User had to remind me to commit.
- **FIX**: Always commit and push BEFORE deploying. The order is: commit → push → deploy. This ensures the deployed code matches what's in the repo.
- **CONTEXT**: Deploying before committing means the live site runs code that isn't tracked in version control. If something breaks, there's no way to roll back via git.
- **DETECTION**: N/A — just always follow the commit → push → deploy sequence.

### Configuration — 2026-03-29
- **MISTAKE**: Redeployed `generate-caption` edge function to update model names, but function was missing from `supabase/config.toml`. This caused JWT verification to be enabled (the default), breaking all authenticated requests from the browser (401 errors). The curl test with anon key still worked, masking the bug.
- **FIX**: Add `[functions.generate-caption]` with `verify_jwt = false` to `supabase/config.toml` before deploying. Any edge function called from the browser via `supabase.functions.invoke()` should have `verify_jwt = false` in config.toml, OR the function needs explicit JWT handling logic.
- **CONTEXT**: The Supabase JS client sends the user's session JWT in the Authorization header. The gateway verifies this JWT when `verify_jwt = true`. The anon key used in curl tests bypasses this check. Always test edge functions from the actual browser, not just curl.
- **DETECTION**: `grep -c "generate-caption" supabase/config.toml` — if 0, the function uses default JWT verification.
