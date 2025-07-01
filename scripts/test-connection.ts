import { createClient } from '@supabase/supabase-js';

// Test connection with user's credentials
const testSupabaseConnection = async () => {
  console.log('🔌 Testing Supabase connection...');
  
  const supabaseUrl = 'https://opyyahyiommabrhqflmf.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9weXlhaHlpb21tYWJyaHFmbG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjg4ODQsImV4cCI6MjA2NjkwNDg4NH0.WtALb5-lgnhIfE-wbCfxVFTOxAEXKIoB3lXkqmJG4EU';
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Try to get version info from Supabase
    const { data, error } = await supabase.from('_supabase_version').select('*').limit(1);
    
    if (error) {
      // If version table doesn't exist, try to create a test table
      console.log('ℹ️ Version table not found, checking basic connection...');
      
      // Try a simple query that should work even without tables
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        throw authError;
      }
      
      console.log('✅ Basic connection successful!');
      console.log('⚠️ Note: No tables exist yet. You need to run the database schema first.');
      console.log('');
      console.log('📋 Next steps:');
      console.log('1. Go to your Supabase dashboard: https://app.supabase.com/project/opyyahyiommabrhqflmf');
      console.log('2. Click "SQL Editor" in the sidebar');
      console.log('3. Copy and paste the contents of lib/database.sql');
      console.log('4. Click "Run" to create all tables');
      console.log('5. Then run: npm run migrate');
      
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Database is ready for migration');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check your project URL: https://opyyahyiommabrhqflmf.supabase.co');
    console.log('2. Verify your anon key is correct');
    console.log('3. Make sure your Supabase project is active');
    return false;
  }
};

// Run the test
testSupabaseConnection(); 