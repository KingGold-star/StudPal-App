// src/services/timetable/timetableSupabase.js
// Cloud synchronization for StudPal intelligent timetable using Supabase.
// Integrates with PostgreSQL tables 'study_timetable_sessions' and 'user_timetable_preferences'
// with Row Level Security (RLS) enforcement.

import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const timetableSupabase = {
  /**
   * Syncs timetable sessions to Supabase
   */
  async syncSessions(userId, sessions = []) {
    if (!isSupabaseConfigured() || !userId || !Array.isArray(sessions) || sessions.length === 0) {
      return { success: true, count: sessions.length, synced: false };
    }

    try {
      const rows = sessions.map((s) => ({
        id: s.id.length === 36 ? s.id : undefined, // pass uuid if matches format
        user_id: userId,
        subject_name: s.subject,
        topic: s.topic,
        session_date: s.date,
        start_time: s.startTime,
        end_time: s.endTime,
        duration_minutes: s.durationMinutes || 25,
        session_type: s.sessionType || 'Pomodoro',
        status: s.status || 'upcoming',
        priority: typeof s.priority === 'number' ? s.priority : 0.5,
        is_pomodoro: s.isPomodoro !== false,
        break_minutes: s.breakMinutes || 5,
        cycle_index: s.cycleIndex || 1,
        notes: s.notes || null,
        updated_at: new Date().toISOString(),
      }));

      // Upsert sessions
      const { data, error } = await supabase
        .from('study_timetable_sessions')
        .upsert(rows, { onConflict: 'user_id,session_date,start_time' });

      if (error) {
        console.warn('[timetableSupabase.syncSessions] Supabase error:', error.message);
        return { success: false, error };
      }

      return { success: true, count: rows.length, synced: true };
    } catch (err) {
      console.error('[timetableSupabase.syncSessions] Exception:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Fetches timetable sessions from Supabase for a given user
   */
  async fetchSessions(userId, limit = 100) {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('study_timetable_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(limit);

      if (error) {
        console.warn('[timetableSupabase.fetchSessions] Supabase error:', error.message);
        return [];
      }

      if (!data) return [];

      // Map DB row to app format
      return data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        subject: row.subject_name,
        topic: row.topic,
        date: row.session_date,
        dayName: new Date(row.session_date).toLocaleDateString('en-US', { weekday: 'short' }),
        startTime: row.start_time,
        endTime: row.end_time,
        durationMinutes: row.duration_minutes,
        sessionType: row.session_type,
        status: row.status,
        priority: row.priority,
        isPomodoro: row.is_pomodoro,
        breakMinutes: row.break_minutes,
        cycleIndex: row.cycle_index,
        notes: row.notes,
      }));
    } catch (err) {
      console.error('[timetableSupabase.fetchSessions] Exception:', err);
      return [];
    }
  },

  /**
   * Updates session status in Supabase
   */
  async updateStatus(userId, sessionId, status) {
    if (!isSupabaseConfigured() || !userId) return { success: true };

    try {
      const { error } = await supabase
        .from('study_timetable_sessions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', sessionId)
        .eq('user_id', userId);

      return { success: !error, error };
    } catch (err) {
      console.error('[timetableSupabase.updateStatus] Exception:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Delete session from Supabase
   */
  async deleteSession(userId, sessionId) {
    if (!isSupabaseConfigured() || !userId) return { success: true };

    try {
      const { error } = await supabase
        .from('study_timetable_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      return { success: !error, error };
    } catch (err) {
      console.error('[timetableSupabase.deleteSession] Exception:', err);
      return { success: false, error: err };
    }
  },
};

export default timetableSupabase;
