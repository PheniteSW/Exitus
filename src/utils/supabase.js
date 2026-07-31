import { createClient } from '@supabase/supabase-js';

// Both values are PUBLIC and safe to expose in the browser bundle.
// - VITE_SUPABASE_URL:      your project URL (https://<ref>.supabase.co)
// - VITE_SUPABASE_ANON_KEY: the sb_publishable_... key (NOT the sb_secret_ one)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If env vars are missing (e.g. not yet set on Render), we export null so the
// app can degrade gracefully instead of crashing at import time.
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // needed so magic-link redirects log the user in
      },
    })
  : null;
