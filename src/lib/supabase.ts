import { createClient } from '@supabase/supabase-js';

// Safe extraction: prevents build-time hard crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only warn during runtime/build if keys are missing
if (supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase URL is missing. Build will continue but site functionality will be limited.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
