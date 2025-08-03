import { createClient } from '@supabase/supabase-js';

// Add your Supabase URL and anon key as environment variables
// You can find these in your Supabase project's API settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are not set. Please update them as environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
