import { createClient } from '@supabase/supabase-js';

// Test if database schema was created successfully
const testDatabaseSchema = async () => {
  console.log('🔍 Testing database schema...');
  
  const supabaseUrl = 'https://opyyahyiommabrhqflmf.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9weXlhaHlpb21tYWJyaHFmbG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjg4ODQsImV4cCI6MjA2NjkwNDg4NH0.WtALb5-lgnhIfE-wbCfxVFTOxAEXKIoB3lXkqmJG4EU';
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const tables = [
    'drivers',
    'note_takers', 
    'athlete_profiles',
    'notes',
    'comments',
    'reminders'
  ];
  
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      console.log(`🔍 Checking table: ${table}...`);
      
      // Try to select from each table (should return empty array if table exists)
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table '${table}' error:`, error.message);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${table}' exists and is accessible`);
      }
      
    } catch (error) {
      console.error(`❌ Error checking table '${table}':`, error);
      allTablesExist = false;
    }
  }
  
  console.log('\n📊 Schema Test Summary:');
  
  if (allTablesExist) {
    console.log('🎉 All tables created successfully!');
    console.log('✅ Database schema is ready for migration');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Make sure your .env.local file has all credentials');
    console.log('2. Make sure your local app is running: npm run dev');
    console.log('3. Run the migration: npm run migrate');
    
    return true;
  } else {
    console.log('❌ Some tables are missing or inaccessible');
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Go back to Supabase SQL Editor');
    console.log('2. Check for any error messages when you ran the schema');
    console.log('3. Make sure you copied the ENTIRE contents of lib/database.sql');
    console.log('4. Try running the schema again');
    
    return false;
  }
};

// Run the test
testDatabaseSchema(); 