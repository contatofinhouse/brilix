
import { createClient } from '@supabase/supabase-js';

const supabasuarl = 'https://xznzppgkkkkpzyvzemlr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bnpwcGdra2trcHp5dnplbWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDIxNjMsImV4cCI6MjA3ODAxODE2M30.R7e76191bM6gsabfHh39aO6I6DCUrPGhy_K1HYIm8Sk';

if (!supabasuarl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabasuarl, supabaseAnonKey);
