import { supabaseAdmin } from '../lib/supabase';
import { drivers } from '../data/drivers';
import { noteTakers } from '../data/noteTakers';
import { athleteProfiles } from '../data/athleteProfiles';
import fs from 'fs';
import path from 'path';

interface GoogleSheetsNote {
  Driver: string;
  'Note Taker': string;
  Note: string;
  Timestamp: string;
  Type?: string;
  Tags?: string;
}

// Create migration directory if it doesn't exist
const migrationDir = path.join(process.cwd(), 'migration');
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir);
}

// Step 1: Export current Google Sheets data
export const exportCurrentData = async () => {
  console.log('🔄 Exporting current Google Sheets data...');
  
  try {
    // Fetch current data from your Google Sheets API
    const response = await fetch('http://localhost:3000/api/sheets');
    const googleSheetsData: GoogleSheetsNote[] = await response.json();
    
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
    fs.writeFileSync(
      path.join(migrationDir, 'athlete-profiles-backup.json'), 
      JSON.stringify(athleteProfiles, null, 2)
    );
    
    console.log('✅ Data exported successfully!');
    console.log(`📊 Found ${googleSheetsData.length} notes to migrate`);
    
    return googleSheetsData;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
};

// Step 2: Migrate drivers
export const migrateDrivers = async () => {
  console.log('🔄 Migrating drivers...');
  
  const driversData = drivers.map(name => ({
    name,
    active: true
  }));
  
  const { data, error } = await supabaseAdmin
    .from('drivers')
    .insert(driversData)
    .select();
  
  if (error) {
    console.error('❌ Error migrating drivers:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${data.length} drivers`);
  return data;
};

// Step 3: Migrate note takers
export const migrateNoteTakers = async () => {
  console.log('🔄 Migrating note takers...');
  
  const noteTakersData = noteTakers.map(name => ({
    name,
    active: true
  }));
  
  const { data, error } = await supabaseAdmin
    .from('note_takers')
    .insert(noteTakersData)
    .select();
  
  if (error) {
    console.error('❌ Error migrating note takers:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${data.length} note takers`);
  return data;
};

// Step 4: Migrate athlete profiles
export const migrateAthleteProfiles = async (driversFromDB: any[]) => {
  console.log('🔄 Migrating athlete profiles...');
  
  const profilesData = Object.entries(athleteProfiles).map(([driverName, profile]) => {
    const driver = driversFromDB.find(d => d.name === driverName);
    if (!driver) {
      console.warn(`⚠️ Driver not found for profile: ${driverName}`);
      return null;
    }
    
    return {
      driver_id: driver.id,
      age: profile.age,
      gym_time: profile.gymTime,
      crew_chief: profile.crewChief,
      spotter: profile.spotter,
      phone: profile.phone,
      email: profile.email,
      birthday: profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : null
    };
  }).filter(Boolean);
  
  const { data, error } = await supabaseAdmin
    .from('athlete_profiles')
    .insert(profilesData)
    .select();
  
  if (error) {
    console.error('❌ Error migrating athlete profiles:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${data.length} athlete profiles`);
  return data;
};

// Step 5: Migrate notes (with comment parsing)
export const migrateNotes = async (
  googleSheetsData: GoogleSheetsNote[],
  driversFromDB: any[],
  noteTakersFromDB: any[]
) => {
  console.log('🔄 Migrating notes...');
  
  const notesData = [];
  const commentsData = [];
  
  for (const note of googleSheetsData) {
    const driver = driversFromDB.find(d => d.name === note.Driver);
    const noteTaker = noteTakersFromDB.find(nt => nt.name === note['Note Taker']);
    
    if (!driver || !noteTaker) {
      console.warn(`⚠️ Skipping note - driver or note taker not found:`, note);
      continue;
    }
    
    // Parse the note to separate main note from comments
    const noteLines = note.Note.split('\n');
    let mainNote = '';
    const comments = [];
    
    for (const line of noteLines) {
      // Check if line is a comment (contains "commented:")
      const commentMatch = line.match(/(.*?) commented: (.*?) • (.*)/);
      if (commentMatch) {
        const [_, author, comment, timestamp] = commentMatch;
        const commentAuthor = noteTakersFromDB.find(nt => nt.name === author);
        if (commentAuthor) {
          comments.push({
            author_id: commentAuthor.id,
            comment,
            created_at: new Date(timestamp === 'just now' ? Date.now() : timestamp).toISOString()
          });
        }
      } else if (line.trim()) {
        mainNote += (mainNote ? '\n' : '') + line;
      }
    }
    
    // Parse tags
    const tags = note.Tags ? note.Tags.split(',').map(tag => tag.trim()) : [];
    
    const noteData = {
      driver_id: driver.id,
      note_taker_id: noteTaker.id,
      note: mainNote,
      type: note.Type || 'Note',
      tags,
      created_at: new Date(note.Timestamp).toISOString()
    };
    
    notesData.push(noteData);
    
    // Store comments for later insertion (need note ID first)
    if (comments.length > 0) {
      commentsData.push({
        noteIndex: notesData.length - 1,
        comments
      });
    }
  }
  
  // Insert notes
  const { data: insertedNotes, error: notesError } = await supabaseAdmin
    .from('notes')
    .insert(notesData)
    .select();
  
  if (notesError) {
    console.error('❌ Error migrating notes:', notesError);
    throw notesError;
  }
  
  console.log(`✅ Migrated ${insertedNotes.length} notes`);
  
  // Insert comments
  let totalComments = 0;
  for (const commentGroup of commentsData) {
    const noteId = insertedNotes[commentGroup.noteIndex].id;
    const commentsToInsert = commentGroup.comments.map(comment => ({
      ...comment,
      note_id: noteId
    }));
    
    const { error: commentsError } = await supabaseAdmin
      .from('comments')
      .insert(commentsToInsert);
    
    if (commentsError) {
      console.error('❌ Error migrating comments:', commentsError);
    } else {
      totalComments += commentsToInsert.length;
    }
  }
  
  console.log(`✅ Migrated ${totalComments} comments`);
  
  return insertedNotes;
};

// Main migration function
export const runMigration = async () => {
  console.log('🚀 Starting data migration to Supabase...');
  
  try {
    // Step 1: Export current data
    const googleSheetsData = await exportCurrentData();
    
    // Step 2: Migrate drivers
    const driversFromDB = await migrateDrivers();
    
    // Step 3: Migrate note takers
    const noteTakersFromDB = await migrateNoteTakers();
    
    // Step 4: Migrate athlete profiles
    await migrateAthleteProfiles(driversFromDB);
    
    // Step 5: Migrate notes and comments
    await migrateNotes(googleSheetsData, driversFromDB, noteTakersFromDB);
    
    console.log('🎉 Migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Check your Supabase database to verify the data');
    console.log('2. Update your API endpoints to use Supabase');
    console.log('3. Test the application with the new database');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
} 