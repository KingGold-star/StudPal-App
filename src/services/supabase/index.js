// src/services/supabase/index.js
export { supabase, isSupabaseConfigured, SUPABASE_URL } from '../../lib/supabaseClient';
export { authService } from './authService';
export { profileService } from './profileService';
export { gamificationSupabaseService } from './gamificationService';
export { studySupabaseService } from './studyService';
export { communitySupabaseService } from './communityService';
export { aiCoachSupabaseService } from './aiCoachService';
export { settingsSupabaseService } from './settingsService';
