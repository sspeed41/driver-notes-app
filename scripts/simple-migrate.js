const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually since we're not using Next.js context
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure your .env.local file contains:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Static data (copying from your data files)
const drivers = [
  'Kyle Larson', 'Alex Bowman', 'Ross Chastain', 'Daniel Suarez', 'Austin Dillon',
  'Connor Zilisch', 'Carson Kvapil', 'Austin Hill', 'Jesse Love', 'Nick Sanchez',
  'Daniel Dye', 'Grant Enfinger', 'Daniel Hemric', 'Connor Mosack', 'Kaden Honeycutt',
  'Rajah Caruth', 'Andres Perez', 'Matt Mills', 'Dawson Sutton', 'Tristan McKee',
  'Helio Meza', 'Corey Day', 'Ben Maier', 'Tyler Reif', 'Brenden Queen'
];

const noteTakers = ['Scott Speed', 'Josh Wise', 'Dan Jansen', 'Dan Stratton'];

// Create migration directory
const migrationDir = path.join(process.cwd(), 'migration');
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir);
}

// Step 1: Export current Google Sheets data
async function exportCurrentData() {
  console.log('🔄 Exporting current Google Sheets data...');
  
  try {
    const response = await fetch('http://localhost:3000/api/sheets');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const googleSheetsData = await response.json();
    
    // Save backups
    fs.writeFileSync(
      path.join(migrationDir, 'notes-backup.json'), 
      JSON.stringify(googleSheetsData, null, 2)
    );
    fs.writeFileSync(
      path.join(migrationDir, 'drivers-backup.json'), 
      JSON.stringify(drivers, null, 2)
    );
    fs.writeFileSync(
      path.join(migrationDir, 'note-takers-backup.json'), 
      JSON.stringify(noteTakers, null, 2)
    );
    
    console.log('✅ Data exported successfully!');
    console.log(`📊 Found ${googleSheetsData.length} notes to migrate`);
    
    return googleSheetsData;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
}

// Step 2: Migrate drivers
async function migrateDrivers() {
  console.log('🔄 Migrating drivers...');
  
  const driversData = drivers.map(name => ({
    name,
    active: true
  }));
  
  const { data, error } = await supabase
    .from('drivers')
    .insert(driversData)
    .select();
  
  if (error) {
    console.error('❌ Error migrating drivers:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${data.length} drivers`);
  return data;
}

// Step 3: Migrate note takers
async function migrateNoteTakers() {
  console.log('🔄 Migrating note takers...');
  
  const noteTakersData = noteTakers.map(name => ({
    name,
    active: true
  }));
  
  const { data, error } = await supabase
    .from('note_takers')
    .insert(noteTakersData)
    .select();
  
  if (error) {
    console.error('❌ Error migrating note takers:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${data.length} note takers`);
  return data;
}

// Step 4: Migrate notes
async function migrateNotes(googleSheetsData, driversFromDB, noteTakersFromDB) {
  console.log('🔄 Migrating notes...');
  
  const notesData = [];
  
  for (const note of googleSheetsData) {
    const driver = driversFromDB.find(d => d.name === note.Driver);
    const noteTaker = noteTakersFromDB.find(nt => nt.name === note['Note Taker']);
    
    if (!driver || !noteTaker) {
      console.warn(`⚠️ Skipping note - driver or note taker not found:`, note);
      continue;
    }
    
    // Parse tags
    const tags = note.Tags ? note.Tags.split(',').map(tag => tag.trim()) : [];
    
    const noteData = {
      driver_id: driver.id,
      note_taker_id: noteTaker.id,
      note: note.Note,
      type: note.Type || 'Note',
      tags,
      created_at: new Date(note.Timestamp).toISOString()
    };
    
    notesData.push(noteData);
  }
  
  // Insert notes in batches
  const batchSize = 50;
  let totalInserted = 0;
  
  for (let i = 0; i < notesData.length; i += batchSize) {
    const batch = notesData.slice(i, i + batchSize);
    
    const { data: insertedNotes, error: notesError } = await supabase
      .from('notes')
      .insert(batch)
      .select();
    
    if (notesError) {
      console.error('❌ Error migrating notes batch:', notesError);
      throw notesError;
    }
    
    totalInserted += insertedNotes.length;
    console.log(`📝 Migrated batch: ${insertedNotes.length} notes (${totalInserted}/${notesData.length})`);
  }
  
  console.log(`✅ Migrated ${totalInserted} notes total`);
  return totalInserted;
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting data migration to Supabase...');
  
  try {
    // Test connection first
    console.log('🔌 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('drivers')
      .select('*')
      .limit(1);
    
    if (testError) {
      throw new Error(`Connection test failed: ${testError.message}`);
    }
    
    console.log('✅ Supabase connection successful');
    
    // Step 1: Export current data
    const googleSheetsData = await exportCurrentData();
    
    // Step 2: Migrate drivers
    const driversFromDB = await migrateDrivers();
    
    // Step 3: Migrate note takers
    const noteTakersFromDB = await migrateNoteTakers();
    
    // Step 4: Migrate notes
    await migrateNotes(googleSheetsData, driversFromDB, noteTakersFromDB);
    
    console.log('🎉 Migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Check your Supabase database to verify the data');
    console.log('2. Run: npm run migrate:verify');
    console.log('3. Update your API endpoints to use Supabase');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration(); 