import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://udotrsvrpojzflydpfjp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_19_gBONi7axENhVqxvVBMA_SsFMMTIU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
