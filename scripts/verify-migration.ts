import { supabase } from '../lib/supabase';

// Verification script to check migration success
export const verifyMigration = async () => {
  console.log('🔍 Verifying Supabase migration...');
  
  try {
    // Check drivers
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select('*');
    
    if (driversError) throw driversError;
    console.log(`✅ Drivers: ${drivers.length} records`);
    
    // Check note takers
    const { data: noteTakers, error: noteTakersError } = await supabase
      .from('note_takers')
      .select('*');
    
    if (noteTakersError) throw noteTakersError;
    console.log(`✅ Note Takers: ${noteTakers.length} records`);
    
    // Check athlete profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('athlete_profiles')
      .select(`
        *,
        driver:drivers(name)
      `);
    
    if (profilesError) throw profilesError;
    console.log(`✅ Athlete Profiles: ${profiles.length} records`);
    
    // Check notes with relationships
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select(`
        *,
        driver:drivers(name),
        note_taker:note_takers(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (notesError) throw notesError;
    console.log(`✅ Notes: Found notes (showing recent 10):`);
    notes.forEach(note => {
      console.log(`   📝 ${note.driver.name} - ${note.note_taker.name}: ${note.note.substring(0, 50)}...`);
    });
    
    // Check comments
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select(`
        *,
        note:notes(note),
        author:note_takers(name)
      `)
      .limit(5);
    
    if (commentsError) throw commentsError;
    console.log(`✅ Comments: ${comments.length} records`);
    
    // Check reminders
    const { data: reminders, error: remindersError } = await supabase
      .from('reminders')
      .select('*');
    
    if (remindersError) throw remindersError;
    console.log(`✅ Reminders: ${reminders.length} records`);
    
    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   🏎️  Drivers: ${drivers.length}`);
    console.log(`   👨‍💻 Note Takers: ${noteTakers.length}`);
    console.log(`   📋 Athlete Profiles: ${profiles.length}`);
    console.log(`   📝 Notes: Available (check full count in Supabase dashboard)`);
    console.log(`   💬 Comments: ${comments.length}`);
    console.log(`   ⏰ Reminders: ${reminders.length}`);
    
    console.log('\n🎉 Migration verification completed successfully!');
    console.log('🔗 Next: Update your API endpoints to use Supabase');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env.local file has correct Supabase credentials');
    console.log('2. Verify you ran the database schema in Supabase SQL Editor');
    console.log('3. Make sure the migration script completed successfully');
  }
};

// Test connection
export const testConnection = async () => {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('count(*)', { count: 'exact' });
    
    if (error) throw error;
    
    console.log('✅ Connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.log('Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return false;
  }
};

// Run verification if this file is executed directly
if (require.main === module) {
  verifyMigration();
} 