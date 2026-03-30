import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jkgmsxlmwydkdgqdbyzx.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZ21zeGxtd3lka2RncWRieXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDk3MTMsImV4cCI6MjA5MDE4NTcxM30.hhmvoyHjRg4uMso88jpKCoXq_Lyy8kHWY8phRMZRCYs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupAdmin() {
  console.log('Registering admin...');
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@petroapply.com',
    password: 'AdminPassword123!',
    options: {
      data: {
        full_name: 'Platform Admin',
        role: 'admin'
      }
    }
  });

  if (error) {
    console.error('Error creating admin:', error.message);
  } else {
    console.log('Admin user created successfully:', data.user?.id);
  }
}

setupAdmin();
