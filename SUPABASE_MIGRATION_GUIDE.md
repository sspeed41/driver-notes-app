# Supabase Migration Guide

## 🎯 Overview
This guide will help you migrate your Driver Notes app from Google Sheets to Supabase for better performance, real-time features, and scalability.

## 📋 Prerequisites
- Your current Google Sheets integration working
- A Supabase account (free tier is fine)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `driver-notes-app`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your location
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql` from this project
3. Paste it into a new SQL query
4. Click **Run** to execute the schema

This creates:
- `driver_notes` table (main notes storage)
- `reminders` table (for reminder functionality)
- Proper indexes for performance
- Row Level Security (RLS) policies

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 4: Update Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Keep your existing Google Sheets config for migration
GOOGLE_SHEETS_CREDENTIALS=your_existing_credentials
GOOGLE_SHEETS_SPREADSHEET_ID=your_existing_spreadsheet_id
```

## Step 5: Run the Migration

Execute the migration script to transfer your data:

```bash
node scripts/migrate-to-supabase.js
```

This script will:
- ✅ Fetch all data from Google Sheets
- ✅ Transform it to Supabase format
- ✅ Insert into Supabase database
- ✅ Verify the migration was successful

## Step 6: Test the New API

Test your new Supabase API endpoint:

```bash
# Test GET request
curl http://localhost:3000/api/notes

# Test POST request
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"driver":"Test Driver","noteTaker":"Test User","note":"Test note","timestamp":"1/1/2025, 12:00:00 PM","type":"Note"}'
```

## Step 7: Update Your App

Once migration is complete, update your app to use the new endpoint:

1. Replace `/api/sheets` with `/api/notes` in your frontend code
2. Test all functionality:
   - ✅ Creating notes
   - ✅ Viewing notes
   - ✅ Adding comments
   - ✅ Deleting notes
   - ✅ Focus items
   - ✅ Athlete dashboard

## Step 8: Deploy Updated App

Deploy your updated app to Vercel:

1. Make sure your `.env.local` variables are added to Vercel environment variables
2. Deploy the updated code
3. Test the production app

## 🔧 Troubleshooting

### Migration Issues

**Problem**: Migration script fails with "Missing Supabase configuration"
**Solution**: Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are in your `.env.local`

**Problem**: Database connection fails
**Solution**: Check your Supabase project is running and credentials are correct

**Problem**: Migration partially succeeds
**Solution**: The script handles this gracefully - re-run it, it will skip duplicates

### API Issues

**Problem**: `/api/notes` returns 500 error
**Solution**: Check your Supabase credentials and that the database schema was created correctly

**Problem**: Notes not appearing in app
**Solution**: Make sure you've updated the frontend to use `/api/notes` instead of `/api/sheets`

## 📊 Performance Benefits

After migration, you'll get:

- **Faster queries**: Database indexing vs Google Sheets API
- **Real-time updates**: Instant sync across devices
- **Better reliability**: Dedicated database infrastructure
- **Scalability**: Handles much larger datasets
- **Advanced features**: Full-text search, complex queries, etc.

## 🔐 Security

The migration includes:
- Row Level Security (RLS) enabled
- Secure API endpoints
- Proper data validation
- Protection against SQL injection

## 📈 Next Steps

After successful migration:

1. **Remove Google Sheets dependency** (optional)
2. **Add real-time features** using Supabase subscriptions
3. **Implement advanced search** using full-text search
4. **Add user authentication** for better security
5. **Create analytics dashboard** using Supabase's built-in analytics

## 🆘 Support

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify your Supabase project is active
3. Ensure all environment variables are correctly set
4. Test the API endpoints directly before updating the frontend

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Environment variables added
- [ ] Migration script completed successfully
- [ ] API endpoints working
- [ ] Frontend updated to use new API
- [ ] Production deployment successful
- [ ] All features working as expected

---

**Estimated Time**: 30-45 minutes
**Difficulty**: Intermediate
**Downtime**: None (gradual migration) 