# Driver Notes App - Recovery Instructions

## Date: $(date +%Y-%m-%d)
## Status: ✅ WORKING

## Quick Recovery Steps

If your app stops working with Google Sheets errors, follow these steps:

### 1. Check the Error
Look for these common errors in the terminal:
- `SyntaxError: Unterminated string in JSON`
- `Google Sheets credentials not configured, using mock data`

### 2. Fix .env.local File
The most common issue is a malformed `.env.local` file.

**Copy the working version:**
```bash
cp backups/$(date +%Y-%m-%d)/env.local.working .env.local
```

### 3. Verify File Format
Your `.env.local` should have exactly 2 lines:
```bash
wc -l .env.local
# Should output: 2 .env.local
```

### 4. Test the Fix
```bash
# Restart your dev server
npm run dev

# Test the API
curl http://localhost:3000/api/sheets
```

## What Was Fixed

### Problem
- `.env.local` file had JSON credentials split across multiple lines
- Environment variables must be on single lines
- This caused "Unterminated string in JSON" errors

### Solution
- Reformatted JSON credentials to single line
- Added better error handling in `pages/api/sheets.ts`
- Added support for base64 encoded credentials as backup

## File Structure
```
.env.local (2 lines):
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEETS_SPREADSHEET_ID=1djHfU7U64dDJQJNBtY--umGVEwzEyL8CC3iwj64XDf8
```

## Backup Files
- `env.local.working` - The fixed, working version
- `env.local.broken` - The original broken version (for reference)

## Emergency Contacts
- GitHub Repo: https://github.com/sspeed41/driver-notes-app
- Last Working Commit: 94a30fe

## Additional Notes
- Never commit `.env.local` to GitHub (contains secrets)
- Always test locally before deploying
- Keep backups of working configurations 