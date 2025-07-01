# Supabase Migration Setup Guide

## 🚀 Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Find your **DriverNotesApp** project
3. Go to **Settings** > **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - ⚠️ Keep this secret!

## 🔧 Step 2: Update Environment Variables

Add these to your `.env.local` file (create if it doesn't exist):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Keep Google Sheets for backup during migration
GOOGLE_SHEETS_CREDENTIALS=your-existing-credentials
GOOGLE_SHEETS_SPREADSHEET_ID=your-existing-sheet-id
```

## 🗄️ Step 3: Create Database Schema

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the sidebar
3. Copy and paste the entire contents of `lib/database.sql`
4. Click **Run** to create all tables, indexes, and policies

## 📊 Step 4: Run Data Migration

Make sure your app is running locally first:
```bash
npm run dev
```

Then in a new terminal, run the migration:
```bash
npx ts-node scripts/migrate-data.ts
```

This will:
- ✅ Export all your current Google Sheets data
- ✅ Migrate drivers (25 drivers)
- ✅ Migrate note takers (4 people)
- ✅ Migrate athlete profiles (complete contact info)
- ✅ Migrate all notes and parse existing comments
- ✅ Create proper relationships between all data

## 🔍 Step 5: Verify Migration

After migration completes:

1. **Check Supabase Dashboard:**
   - Go to **Table Editor**
   - Verify data in each table: `drivers`, `note_takers`, `athlete_profiles`, `notes`, `comments`

2. **Check Migration Backups:**
   - Look in the `migration/` folder for JSON backup files
   - These are your safety net!

3. **Test Query:**
   ```sql
   SELECT 
     n.note,
     d.name as driver_name,
     nt.name as note_taker_name,
     n.created_at
   FROM notes n
   JOIN drivers d ON n.driver_id = d.id
   JOIN note_takers nt ON n.note_taker_id = nt.id
   ORDER BY n.created_at DESC
   LIMIT 10;
   ```

## 🔄 Step 6: Update API Endpoints

Once migration is verified, we'll update your API endpoints to use Supabase instead of Google Sheets.

## 🚨 Rollback Plan

If anything goes wrong:
1. Your Google Sheets data remains untouched
2. JSON backups are in `migration/` folder
3. You can delete Supabase tables and re-run migration
4. Original app continues working with Google Sheets

## 🎯 Benefits After Migration

- **Real-time updates** - No more polling/refreshing
- **Better performance** - Direct database queries
- **Advanced filtering** - Complex queries by date, driver, type
- **Scalability** - Handle thousands of notes
- **Offline support** - Better caching capabilities
- **Future features** - Authentication, file uploads, analytics

## 🆘 Troubleshooting

**Migration fails?**
- Check your Supabase credentials in `.env.local`
- Make sure your local app is running (`npm run dev`)
- Check the console for specific error messages

**Missing data?**
- Check the migration logs for warnings
- Verify your Google Sheets API is working
- Look at the JSON backup files to see what was exported

**Need help?**
- Check Supabase logs in dashboard
- Review the migration script output
- All your original data is safe in Google Sheets 