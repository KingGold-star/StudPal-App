// src/services/supabase/settingsService.js
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const settingsSupabaseService = {
  /**
   * Sync settings dictionary to Supabase
   */
  async syncSettings(userId, settings) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true, localOnly: true };
    }
    try {
      const payload = {
        user_id: userId,
        settings: settings || {},
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_settings')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) {
        console.warn('[settingsSupabaseService.syncSettings] Error:', error.message);
      }
      return { data, error };
    } catch (err) {
      console.error('[settingsSupabaseService.syncSettings] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch settings from Supabase
   */
  async getUserSettings(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[settingsSupabaseService.getUserSettings] Error:', error.message);
        return null;
      }
      return data?.settings || null;
    } catch (err) {
      console.error('[settingsSupabaseService.getUserSettings] Exception:', err);
      return null;
    }
  },
};

export default settingsSupabaseService;
