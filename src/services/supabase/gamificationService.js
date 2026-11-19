// src/services/supabase/gamificationService.js
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const gamificationSupabaseService = {
  /**
   * Sync gamification progress (XP, streaks, level, etc.) to Supabase
   */
  async syncProgress(userId, progress) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true, localOnly: true };
    }
    try {
      const payload = {
        user_id: userId,
        total_xp: progress.totalXp ?? 0,
        current_level: typeof progress.currentLevel === 'object' ? progress.currentLevel.level : progress.currentLevel ?? 1,
        current_streak: progress.currentStreak ?? 0,
        longest_streak: progress.longestStreak ?? 0,
        completed_sessions: progress.completedSessions ?? 0,
        completed_reviews: progress.completedReviews ?? 0,
        mastered_topics: progress.masteredTopics ?? 0,
        completed_quizzes: progress.completedQuizzes ?? 0,
        completed_goals: progress.completedGoals ?? 0,
        perfect_days: progress.perfectDays ?? 0,
        consistency_score: progress.consistencyScore ?? 50,
        highest_celebrated_level: progress.highestCelebratedLevel ?? 1,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('gamification_progress')
        .upsert(payload, { onConflict: 'user_id' });

      // Also keep profile's total_xp, current_level, streak in sync
      await supabase.from('profiles').update({
        total_xp: payload.total_xp,
        current_level: payload.current_level,
        current_streak: payload.current_streak,
        longest_streak: payload.longest_streak,
      }).eq('id', userId);

      return { data, error };
    } catch (err) {
      console.error('[gamificationSupabaseService.syncProgress] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch gamification progress from Supabase
   */
  async getProgress(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('gamification_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[gamificationSupabaseService.getProgress] Error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('[gamificationSupabaseService.getProgress] Exception:', err);
      return null;
    }
  },

  /**
   * Record XP Transaction Event
   */
  async recordXpEvent(userId, { activityType, xpAmount, title }) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true };
    }
    try {
      const payload = {
        user_id: userId,
        activity_type: activityType || 'GENERAL',
        xp_amount: xpAmount || 0,
        title: title || 'XP Earned',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('xp_history').insert(payload);
      return { data, error };
    } catch (err) {
      console.error('[gamificationSupabaseService.recordXpEvent] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch live leaderboard from Supabase
   */
  async getLiveLeaderboard(limit = 25) {
    if (!isSupabaseConfigured()) {
      return [];
    }
    try {
      // Query profiles with top total_xp
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, avatar_emoji, country, country_code, total_xp, current_level, current_streak')
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('[gamificationSupabaseService.getLiveLeaderboard] Error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('[gamificationSupabaseService.getLiveLeaderboard] Exception:', err);
      return [];
    }
  },

  /**
   * Unlock achievement for user
   */
  async unlockAchievement(userId, achievementId, title) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true };
    }
    try {
      const { data, error } = await supabase.from('user_achievements').upsert({
        user_id: userId,
        achievement_id: achievementId,
        title,
        unlocked_at: new Date().toISOString(),
      }, { onConflict: 'user_id,achievement_id' });

      return { data, error };
    } catch (err) {
      console.error('[gamificationSupabaseService.unlockAchievement] Exception:', err);
      return { data: null, error: err };
    }
  },
};

export default gamificationSupabaseService;
