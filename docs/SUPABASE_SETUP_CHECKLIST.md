# Supabase Setup Checklist
## Step-by-Step Setup Guide

Follow these steps in order to set up your Supabase backend.

---

## ✅ Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name:** Chosen Arrows Foundation (or your preferred name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is sufficient to start
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to initialize

**✅ Checkpoint:** Project created and ready

---

## ✅ Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:

   **Project URL:**
   ```
   https://[your-project-ref].supabase.co
   ```

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **service_role key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **Keep this secret!** Never commit it to git.

3. Create `.env.local` file in project root:
   ```bash
   cp .env.local.example .env.local
   ```

4. Open `.env.local` and paste your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[paste-anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[paste-service-role-key]
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

**✅ Checkpoint:** Environment variables configured

---

## ✅ Step 3: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open the file: `supabase/migrations/001_initial_schema.sql`
4. Copy **ALL** the SQL code
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. Wait for execution to complete
8. You should see: **"Success. No rows returned"**

**Verify tables were created:**
- Go to **Table Editor** in sidebar
- You should see these tables:
  - ✅ content_sections
  - ✅ content_translations
  - ✅ campaigns
  - ✅ campaign_translations
  - ✅ campaign_images
  - ✅ campaign_updates
  - ✅ testimonials
  - ✅ site_settings
  - ✅ admin_users
  - ✅ content_audit_log
  - ✅ page_metadata
  - ✅ static_image_mapping
- Run **004_integration_config.sql** the same way (SQL Editor → paste → Run) so Admin → Settings → API & Integrations can store keys:
  - ✅ integration_config

**✅ Checkpoint:** Database schema created

---

## ✅ Step 4: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Configure:
   - **Name:** `images`
   - **Public bucket:** ✅ **Enable this** (check the box)
   - **File size limit:** 5MB (default is fine)
   - **Allowed MIME types:** Leave empty (allows all image types)
4. Click **"Create bucket"**

**Set up Storage Policies (Optional but Recommended):**

Go to **Storage** → **Policies** → **images** bucket, and create:

**Public Read Policy:**
```sql
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

**Admin Upload Policy:**
```sql
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);
```

**✅ Checkpoint:** Storage bucket created

---

## ✅ Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Ensure it's **Enabled**
4. (Optional) Configure email templates if needed

**✅ Checkpoint:** Email auth enabled

---

## ✅ Step 6: Create Admin User

### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email:** your-admin@email.com
   - **Password:** Create a strong password
   - **Auto Confirm User:** ✅ Check this
4. Click **"Create user"**
5. **Copy the User ID** (UUID) - you'll need this!

### Option B: Via Sign Up (Alternative)

1. Temporarily allow public signups:
   - Go to **Authentication** → **Providers** → **Email**
   - Enable **"Enable email signup"**
2. Sign up at your app's `/admin/login` page
3. Disable public signups after creating your admin

### Add User to Admin Table

1. Go to **SQL Editor**
2. Run this query (replace with your user ID and details):

```sql
INSERT INTO admin_users (id, role, full_name)
VALUES (
  'YOUR-USER-UUID-HERE',  -- Replace with actual UUID from Authentication → Users
  'super_admin',           -- or 'admin' or 'editor'
  'Your Full Name'         -- Your name
);
```

**Verify:**
- Go to **Table Editor** → **admin_users**
- You should see your user with role `super_admin`

**✅ Checkpoint:** Admin user created

---

## ✅ Step 7: Verify Setup

Run the verification script:

```bash
npx tsx scripts/verify-setup.ts
```

Or manually verify:
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin/login`
3. Try logging in with your admin credentials
4. You should be redirected to dashboard (or see auth working)

**✅ Checkpoint:** Setup verified

---

## 🎉 Setup Complete!

Your Supabase backend is now configured. You can:

1. **Start developing** the admin dashboard
2. **Migrate existing content** (see migration scripts)
3. **Upload images** to the storage bucket
4. **Create campaigns** via the admin panel

---

## Troubleshooting

### "Table does not exist" error
- **Solution:** Run the migration SQL again
- Check that all tables appear in Table Editor

### "Not an admin user" error
- **Solution:** Verify user exists in `admin_users` table
- Check that user ID matches the one in `auth.users`

### "Invalid API key" error
- **Solution:** Double-check `.env.local` values
- Ensure no extra spaces or quotes
- Restart dev server after changing env vars

### Can't connect to Supabase
- **Solution:** Check internet connection
- Verify project URL is correct
- Check Supabase project status (may be paused)

### Storage upload fails
- **Solution:** Verify bucket is public
- Check storage policies are set correctly
- Ensure user is authenticated as admin

---

## Next Steps

1. ✅ **Create admin login page** (`/app/admin/login/page.tsx`)
2. ✅ **Create admin dashboard** (`/app/admin/dashboard/page.tsx`)
3. ✅ **Build content editor** components
4. ✅ **Migrate existing content** from i18n JSON files

See `SETUP_GUIDE.md` for more details.

---

**Status:** Ready for Phase 2 - Admin Dashboard Development
