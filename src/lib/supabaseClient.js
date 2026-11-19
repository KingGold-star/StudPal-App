import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const resolveSupabaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (envUrl && !envUrl.includes('yzyartppzcsazwkqtjbw')) {
    if (Platform.OS === 'android' && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      return envUrl.replace(/localhost|127\.0\.0\.1/, '10.0.2.2');
    }
    return envUrl;
  }
  // Auto-detect backend based on runtime platform
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    const protocol = window.location.protocol || 'http:';
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `${protocol}//${host}:3000`;
    }
  }
  return 'http://localhost:3000';
};

export const SUPABASE_URL = resolveSupabaseUrl();

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWFydHBwemNzYXp3a3F0amJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDAxMzcsImV4cCI6MjEwMjkxNjEzN30.fOlT4HitthkjNw49or384oCrMoFqtRCVq1xqGbS342c';

// Helper to determine if a valid anon key has been set
export const isSupabaseConfigured = () => {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.startsWith('http') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
  );
};

// Safe dummy client fallback when key is not yet set, avoiding crashes during startup
const createSafeClient = () => {
  if (isSupabaseConfigured()) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    });
  }

  console.warn(
    '[Supabase] Anon key not yet configured in .env. Initializing fallback client. Please provide EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );

  // Return a client with the URL and mock/safe anon key to prevent instantiation failure
  return createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_studpal',
    {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
};

export const supabase = createSafeClient();
export default supabase;
