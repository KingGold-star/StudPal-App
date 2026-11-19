// src/services/supabase/profileService.js
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const profileService = {
  /**
   * Fetch user profile from Supabase
   */
  async getProfile(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('[profileService.getProfile] Error fetching profile:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('[profileService.getProfile] Exception:', err);
      return null;
    }
  },

  /**
   * Update or upsert user profile
   */
  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured() || !userId) {
      return { data: updates, error: null };
    }
    try {
      const payload = {
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      console.error('[profileService.updateProfile] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Save onboarding preferences to Supabase
   */
  async saveOnboardingData(userId, onboardingData) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true };
    }
    try {
      const payload = {
        user_id: userId,
        name: onboardingData.name || null,
        goal: typeof onboardingData.goal === 'object' ? JSON.stringify(onboardingData.goal) : onboardingData.goal || null,
        phone_time: onboardingData.phoneTime || null,
        target_data: onboardingData.targetData || {},
        subjects: onboardingData.subjects || [],
        confidence_rating: onboardingData.confidenceRating || null,
        daily_study_time: onboardingData.dailyStudyTime || null,
        study_days: onboardingData.studyDays || ['mon', 'wed', 'fri', 'sat'],
        session_length: onboardingData.sessionLength || null,
        study_time_of_day: onboardingData.studyTimeOfDay || null,
        seriousness_level: onboardingData.seriousnessLevel || null,
        hear_about_us: onboardingData.hearAboutUs || null,
        study_protection: onboardingData.studyProtection !== false,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_onboarding')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) {
        console.warn('[profileService.saveOnboardingData] Error:', error.message);
      }
      return { data, error };
    } catch (err) {
      console.error('[profileService.saveOnboardingData] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch onboarding preferences from Supabase
   */
  async getOnboardingData(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[profileService.getOnboardingData] Error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('[profileService.getOnboardingData] Exception:', err);
      return null;
    }
  },
};

export default profileService;
