const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Google Sheets configuration
let credentials = null;
try {
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
  } else if (process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64) {
    const decodedCredentials = Buffer.from(process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    credentials = JSON.parse(decodedCredentials);
  }
} catch (error) {
  console.error('Error parsing Google Sheets credentials:', error);
  process.exit(1);
}

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

async function fetchGoogleSheetsData() {
  try {
    console.log('🔍 Fetching data from Google Sheets...');
    
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:F',
    });

    const rows = response.data.values || [];
    
    if (rows.length === 0) {
      console.log('📭 No data found in Google Sheets');
      return [];
    }

    // Convert rows to objects (assuming first row is headers)
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    console.log(`✅ Found ${data.length} records in Google Sheets`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching Google Sheets data:', error);
    throw error;
  }
}

async function migrateToSupabase(data) {
  try {
    console.log('🚀 Starting migration to Supabase...');
    
    // Transform Google Sheets data to Supabase format
    const supabaseData = data.map(row => ({
      driver: row.Driver || '',
      note_taker: row['Note Taker'] || '',
      note: row.Note || '',
      timestamp: row.Timestamp || new Date().toLocaleString(),
      type: row.Type || 'Note',
      tags: row.Tags || null
    }));

    // Filter out empty records
    const validData = supabaseData.filter(row => 
      row.driver.trim() !== '' && 
      row.note_taker.trim() !== '' && 
      row.note.trim() !== ''
    );

    console.log(`📊 Migrating ${validData.length} valid records...`);

    if (validData.length === 0) {
      console.log('⚠️ No valid data to migrate');
      return;
    }

    // Insert data in batches to avoid API limits
    const batchSize = 100;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < validData.length; i += batchSize) {
      const batch = validData.slice(i, i + batchSize);
      
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(validData.length / batchSize)}...`);

      const { data: insertedData, error } = await supabase
        .from('driver_notes')
        .insert(batch)
        .select();

      if (error) {
        console.error('❌ Error inserting batch:', error);
        errorCount += batch.length;
        
        // Try inserting records individually to identify problematic ones
        for (const record of batch) {
          const { error: singleError } = await supabase
            .from('driver_notes')
            .insert(record);
          
          if (singleError) {
            console.error('❌ Failed to insert record:', record.driver, '-', singleError.message);
          } else {
            successCount++;
          }
        }
      } else {
        successCount += insertedData.length;
        console.log(`✅ Successfully inserted ${insertedData.length} records`);
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} records`);
    console.log(`❌ Failed to migrate: ${errorCount} records`);
    console.log(`📊 Total processed: ${successCount + errorCount} records`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

async function verifyMigration() {
  try {
    console.log('\n🔍 Verifying migration...');
    
    const { data: notes, error } = await supabase
      .from('driver_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error verifying migration:', error);
      return;
    }

    console.log(`✅ Verification complete: ${notes.length} records found in Supabase`);
    
    // Show a sample of migrated data
    if (notes.length > 0) {
      console.log('\n📋 Sample migrated data:');
      notes.slice(0, 3).forEach((note, index) => {
        console.log(`${index + 1}. ${note.driver} - ${note.note_taker}: ${note.note.substring(0, 50)}...`);
      });
    }
  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

async function main() {
  try {
    console.log('🎯 Driver Notes Migration Script');
    console.log('================================\n');

    // Check Supabase connection
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase configuration. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file');
      process.exit(1);
    }

    // Check Google Sheets connection
    if (!credentials || !spreadsheetId) {
      console.error('❌ Missing Google Sheets configuration');
      process.exit(1);
    }

    // Fetch data from Google Sheets
    const googleSheetsData = await fetchGoogleSheetsData();
    
    if (googleSheetsData.length === 0) {
      console.log('✅ Migration complete - no data to migrate');
      return;
    }

    // Migrate to Supabase
    await migrateToSupabase(googleSheetsData);
    
    // Verify migration
    await verifyMigration();

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your app to use the new /api/notes endpoint');
    console.log('2. Test the Supabase integration');
    console.log('3. Update your .env.local with Supabase credentials');

  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main(); 