# Database Migration Plan - Sunday

## Current Supabase Instance
- **Project ID:** `xfptozziptcpvhtkezba`
- **URL:** `https://xfptozziptcpvhtkezba.supabase.co`
- **Dashboard:** `https://supabase.com/dashboard/project/xfptozziptcpvhtkezba`

---

## Tables to Export (ALL DATA)
- [ ] `products`
- [ ] `blogs`
- [ ] `profiles`
- [ ] `digital_orders`
- [ ] `physical_orders`
- [ ] `subscription_orders`
- [ ] Any other tables in schema

---

## What's Needed on Sunday
1. **Service role key** (to bypass RLS and export all data)
   - OR access to Supabase dashboard to export CSVs manually

2. **New database connection info** for import

---

## Migration Steps

### Step 1: Export from Current DB
- Dump all tables to JSON/CSV files
- Include any storage bucket files (product images, blog images)

### Step 2: Create Schema in New DB
- Run migrations or create tables manually

### Step 3: Import Data
- Import all exported data into new tables
- Upload storage files to new bucket

### Step 4: Update Environment Variables
- Update `.env` with new Supabase URL and keys
- Update `supabase/config.toml` with new project ID

### Step 5: Verify
- Test all pages load correctly
- Verify orders, products, blogs all display
- Test admin panel functionality

---

## Pending Setup (After Migration)

### Chronicle Auto-Generation
- [ ] Add `XAI_API_KEY` to new Supabase Edge Function secrets
- [ ] Add `CRON_SECRET` to new Supabase Edge Function secrets
- [ ] Add `CRON_SECRET` to GitHub repo secrets
- [ ] Deploy `generate-chronicle` edge function
- [ ] Verify GitHub Actions workflow runs

### ManyChat
- [ ] Add ManyChat integration (page + bot connection)
- [ ] Configure webhook URL for Messenger flows
- [ ] Store ManyChat API key/secret in the new environment

**Secrets to add:**
```
XAI_API_KEY = <set in environment>
CRON_SECRET = <set in environment>
```

---

## Notes
- Grok API rate limit: 10 requests/minute (only using 1/day)
- Chronicles save as DRAFT for human review before publishing
