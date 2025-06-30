# Google Sheets API Setup Guide

Follow these steps to set up Google Sheets integration for your Driver Notes App:

## Step 1: Set Up a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API for your project:
   - In the sidebar, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create a Service Account

1. In the sidebar, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "Service Account"
3. Fill in the details for your service account (e.g., "driver-notes-app")
4. Grant the service account the "Editor" role
5. Complete the setup and return to the credentials page

## Step 3: Create a Key for the Service Account

1. On the credentials page, click on your new service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" and click "Create"
5. The key file will download automatically - keep this safe!

## Step 4: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Add headers to the first row: "Driver", "Note Taker", "Note", "Timestamp", "Tags"
4. Share the spreadsheet with the service account email (found in your JSON key file under "client_email")
   - Click the "Share" button
   - Enter the service account email
   - Set permission to "Editor"
   - Uncheck "Notify people"
   - Click "Share"

## Step 5: Configure Your App

Create a file named `.env.local` in the root of your project with:

```
# Paste the entire contents of the JSON key file as a single line
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# The ID from your Google Sheet URL: https://docs.google.com/spreadsheets/d/YOUR-SPREADSHEET-ID/edit
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

## Step 6: Restart Your App

After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
```

Now you should be able to click the "Save to Sheets" button to export your notes directly to Google Sheets! 