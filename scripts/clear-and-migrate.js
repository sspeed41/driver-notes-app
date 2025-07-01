require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
  console.log('🧹 Clearing existing data...');
  
  // Clear in reverse order due to foreign key constraints
  await supabase.from('reminders').delete().neq('id', 0);
  await supabase.from('comments').delete().neq('id', 0);
  await supabase.from('notes').delete().neq('id', 0);
  await supabase.from('athlete_profiles').delete().neq('id', 0);
  await supabase.from('note_takers').delete().neq('id', 0);
  await supabase.from('drivers').delete().neq('id', 0);
  
  console.log('✅ Data cleared successfully');
}

async function fetchGoogleSheetsData() {
  console.log('📥 Fetching real data from Google Sheets...');
  
  const response = await fetch('http://localhost:3000/api/sheets');
  const data = await response.json();
  
  console.log(`📊 Found ${data.length} notes from Google Sheets`);
  return data;
}

function extractDrivers(notes) {
  const drivers = [...new Set(notes.map(note => note.Driver))];
  return drivers.map(name => ({ name }));
}

function extractNoteTakers(notes) {
  const noteTakers = [...new Set(notes.map(note => note['Note Taker']))];
  return noteTakers.map(name => ({ name }));
}

function processNotes(notes, drivers, noteTakers) {
  return notes.map(note => {
    const driverId = drivers.find(d => d.name === note.Driver)?.id;
    const noteTakerId = noteTakers.find(nt => nt.name === note['Note Taker'])?.id;
    
    // Parse timestamp
    let timestamp = new Date(note.Timestamp);
    if (isNaN(timestamp)) {
      timestamp = new Date(); // fallback to now if invalid
    }
    
    return {
      driver_id: driverId,
      note_taker_id: noteTakerId,
      content: note.Note,
      timestamp: timestamp.toISOString(),
      type: note.Type || 'Note',
      tags: note.Tags || ''
    };
  });
}

async function migrateData() {
  try {
    console.log('🚀 Starting fresh migration...');
    
    // Clear existing data
    await clearData();
    
    // Fetch real data from Google Sheets
    const googleSheetsData = await fetchGoogleSheetsData();
    
    // Extract unique drivers and note takers
    const driversData = extractDrivers(googleSheetsData);
    const noteTakersData = extractNoteTakers(googleSheetsData);
    
    console.log(`🏎️  Migrating ${driversData.length} drivers...`);
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .insert(driversData)
      .select();
    
    if (driversError) throw driversError;
    
    console.log(`👨‍💻 Migrating ${noteTakersData.length} note takers...`);
    const { data: noteTakers, error: noteTakersError } = await supabase
      .from('note_takers')
      .insert(noteTakersData)
      .select();
    
    if (noteTakersError) throw noteTakersError;
    
    // Process notes with proper IDs
    const notesData = processNotes(googleSheetsData, drivers, noteTakers);
    
    console.log(`📝 Migrating ${notesData.length} notes...`);
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .insert(notesData)
      .select();
    
    if (notesError) throw notesError;
    
    console.log('🎉 Migration completed successfully!');
    console.log(`   📊 Total: ${drivers.length} drivers, ${noteTakers.length} note takers, ${notes.length} notes`);
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

migrateData(); 