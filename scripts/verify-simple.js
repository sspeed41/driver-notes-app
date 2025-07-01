const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyMigration() {
  console.log('🔍 Verifying Supabase migration...');
  
  try {
    // Check drivers
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select('*');
    
    if (driversError) throw driversError;
    console.log(`✅ Drivers: ${drivers.length} records`);
    console.log(`   👤 Sample drivers: ${drivers.slice(0, 3).map(d => d.name).join(', ')}...`);
    
    // Check note takers
    const { data: noteTakers, error: noteTakersError } = await supabase
      .from('note_takers')
      .select('*');
    
    if (noteTakersError) throw noteTakersError;
    console.log(`✅ Note Takers: ${noteTakers.length} records`);
    console.log(`   👥 Note takers: ${noteTakers.map(nt => nt.name).join(', ')}`);
    
    // Check notes with relationships
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select(`
        *,
        driver:drivers(name),
        note_taker:note_takers(name)
      `)
      .order('created_at', { ascending: false });
    
    if (notesError) throw notesError;
    console.log(`✅ Notes: ${notes.length} records`);
    
    if (notes.length > 0) {
      console.log('   📝 Recent notes:');
      notes.slice(0, 5).forEach((note, i) => {
        console.log(`     ${i + 1}. ${note.driver.name} (${note.note_taker.name}): ${note.note.substring(0, 50)}...`);
        console.log(`        Type: ${note.type}, Tags: ${note.tags?.join(', ') || 'none'}`);
      });
    }
    
    // Check comments
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*');
    
    if (commentsError) throw commentsError;
    console.log(`✅ Comments: ${comments.length} records`);
    
    // Check reminders
    const { data: reminders, error: remindersError } = await supabase
      .from('reminders')
      .select('*');
    
    if (remindersError) throw remindersError;
    console.log(`✅ Reminders: ${reminders.length} records`);
    
    // Check migration backups
    const fs = require('fs');
    const path = require('path');
    const migrationDir = path.join(process.cwd(), 'migration');
    
    if (fs.existsSync(migrationDir)) {
      console.log('\n📁 Migration Backups:');
      const files = fs.readdirSync(migrationDir);
      files.forEach(file => {
        const filePath = path.join(migrationDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   📄 ${file} (${Math.round(stats.size / 1024)}KB)`);
      });
    }
    
    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   🏎️  Drivers: ${drivers.length}/25 expected`);
    console.log(`   👨‍💻 Note Takers: ${noteTakers.length}/4 expected`);
    console.log(`   📝 Notes: ${notes.length} migrated`);
    console.log(`   💬 Comments: ${comments.length}`);
    console.log(`   ⏰ Reminders: ${reminders.length}`);
    
    if (notes.length <= 2) {
      console.log('\n⚠️  Notice: Only 2 notes were migrated.');
      console.log('This suggests your Google Sheets API might be in mock mode.');
      console.log('If you have more notes in your actual Google Sheets:');
      console.log('1. Check your GOOGLE_SHEETS_CREDENTIALS in .env.local');
      console.log('2. Make sure your Google Sheets API is properly configured');
      console.log('3. Re-run the migration after fixing Google Sheets setup');
    }
    
    console.log('\n🎉 Supabase verification completed successfully!');
    console.log('🔗 Your data is now ready in Supabase!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env.local file has correct Supabase credentials');
    console.log('2. Make sure the migration script completed successfully');
    console.log('3. Check your Supabase dashboard for data');
  }
}

// Run verification
verifyMigration(); 