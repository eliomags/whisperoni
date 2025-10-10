# Supabase Setup Guide

This guide will help you set up Supabase for the Match Suggestions feature.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create an account)
4. Click "New Project"
5. Fill in:
   - **Name**: `whisperoni` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Plan**: Start with Free tier
6. Click "Create new project" (takes ~2 minutes)

## Step 2: Run Database Migration

1. In your Supabase project dashboard, click the **SQL Editor** tab (left sidebar)
2. Click **New query**
3. Copy the entire contents of `supabase/migrations/20250101000000_create_match_suggestions.sql`
4. Paste into the SQL editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned"

## Step 3: Get Your API Credentials

1. In your Supabase dashboard, click **Settings** (gear icon, bottom left)
2. Click **API** in the settings menu
3. Copy these values:

   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

## Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Important**: Never commit `.env.local` to git! (It's already in `.gitignore`)

## Step 5: Install Dependencies

```bash
pnpm install
```

This will install:
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Server-side rendering helpers
- `nanoid` - For generating unique tokens

## Step 6: Verify Setup

1. Start your dev server:
   ```bash
   pnpm dev
   ```

2. Check the browser console - you should see no Supabase errors

3. (Optional) Test the connection by running this in your browser console:
   ```javascript
   fetch('/api/match/test')
   ```

## Database Schema Overview

The migration creates one main table:

### `match_suggestions`
- Stores all friend-suggested matches
- Each match has two unique tokens (one for each person)
- Tracks status: `pending` ’ `one_joined` ’ `both_joined`
- No expiration (links work forever)
- Prevents duplicate suggestions for the same pair

**Key Features:**
-  Row Level Security (RLS) enabled
-  Users can only see their own matches
-  Anyone can create suggestions (no auth required)
-  Automatic status updates via triggers
-  Phone number validation
-  Unique constraint prevents duplicate pairs

## Troubleshooting

### Error: "Invalid API key"
- Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Make sure you copied the **anon** key, not the **service_role** key

### Error: "Failed to fetch"
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that your Supabase project is active (not paused)

### Error: "relation match_suggestions does not exist"
- The migration didn't run successfully
- Go back to Step 2 and run the SQL migration again

### RLS Policy Issues
- If you can't insert/read data, check the RLS policies in the SQL editor
- Run: `SELECT * FROM pg_policies WHERE tablename = 'match_suggestions';`

## Next Steps

Once Supabase is set up:
1.  Test creating a match suggestion at `/suggest-match`
2.  Verify the data appears in Supabase dashboard ’ **Table Editor** ’ `match_suggestions`
3.  Test the match landing page with the generated token
4.  Test the full auth flow with a match link

## Supabase Dashboard Quick Links

- **Table Editor**: View/edit data directly
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users (for future auth integration)
- **Storage**: For profile images (future feature)
- **Logs**: Debug API requests

## Production Deployment

When deploying to production (Vercel/Netlify):

1. Add the same environment variables to your hosting platform
2. Update `NEXT_PUBLIC_BASE_URL` to your production domain
3. Consider upgrading to Supabase Pro for better performance
4. Enable database backups in Supabase settings
5. Monitor usage in Supabase dashboard

---

**Need help?** Check the [Supabase Docs](https://supabase.com/docs) or ask in their Discord.
