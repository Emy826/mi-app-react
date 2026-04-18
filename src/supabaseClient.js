import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nlykdrcemswodbbyhlwi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5seWtkcmNlbXN3b2RiYnlobHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDYwNjgsImV4cCI6MjA5MjAyMjA2OH0.g8sMyr8OgikGK_TOokA_NfgeWJtfEF-B1EA53sFzs6E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
