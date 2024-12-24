import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wtlyxnubyejsunqccadd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Key is missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);