// src/services/supabase/studyService.js
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const studySupabaseService = {
  /**
   * Record a completed study session in Supabase
   */
  async recordStudySession(userId, session) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true, localOnly: true };
    }
    try {
      const payload = {
        user_id: userId,
        subject_name: session.subject || 'General Study',
        topic: session.topic || null,
        duration_minutes: session.durationMinutes || session.duration || 25,
        session_type: session.sessionType || 'focus',
        xp_earned: session.xpEarned || session.xp || 25,
        notes: session.notes || null,
        completed_at: session.completedAt || new Date().toISOString(),
      };

      const { data, error } = await supabase.from('study_sessions').insert(payload).select().single();
      if (error) {
        console.warn('[studySupabaseService.recordStudySession] Error:', error.message);
      }
      return { data, error };
    } catch (err) {
      console.error('[studySupabaseService.recordStudySession] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch user study sessions from Supabase
   */
  async getUserStudySessions(userId, limit = 50) {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('[studySupabaseService.getUserStudySessions] Error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('[studySupabaseService.getUserStudySessions] Exception:', err);
      return [];
    }
  },

  /**
   * Sync enrolled subjects to Supabase
   */
  async syncUserSubjects(userId, subjectsList) {
    if (!isSupabaseConfigured() || !userId || !Array.isArray(subjectsList)) {
      return { success: true };
    }
    try {
      const rows = subjectsList.map((item) => {
        const name = typeof item === 'string' ? item : item.name || item.title;
        return {
          user_id: userId,
          subject_name: name,
          color: item.color || '#2563EB',
          icon: item.icon || 'book',
          mastery_percentage: item.mastery || 0,
          study_time_minutes: item.studyTimeMinutes || 0,
        };
      });

      const { data, error } = await supabase
        .from('user_subjects')
        .upsert(rows, { onConflict: 'user_id,subject_name' });

      return { data, error };
    } catch (err) {
      console.error('[studySupabaseService.syncUserSubjects] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch enrolled subjects from Supabase
   */
  async getUserSubjects(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('user_subjects')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.warn('[studySupabaseService.getUserSubjects] Error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('[studySupabaseService.getUserSubjects] Exception:', err);
      return [];
    }
  },
};

export default studySupabaseService;
