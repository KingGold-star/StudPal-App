// src/services/supabase/aiCoachService.js
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const aiCoachSupabaseService = {
  /**
   * Save or update an AI conversation in Supabase
   */
  async saveConversation(userId, conversation) {
    if (!isSupabaseConfigured() || !userId || !conversation?.id) {
      return { success: true, localOnly: true };
    }
    try {
      const payload = {
        id: conversation.id,
        user_id: userId,
        title: conversation.title || 'Study Discussion',
        persona_id: conversation.personaId || 'all_round',
        messages: conversation.messages || [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('ai_conversations')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('[aiCoachSupabaseService.saveConversation] Error:', error.message);
      }
      return { data, error };
    } catch (err) {
      console.error('[aiCoachSupabaseService.saveConversation] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch all saved conversations for a user
   */
  async getUserConversations(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('[aiCoachSupabaseService.getUserConversations] Error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('[aiCoachSupabaseService.getUserConversations] Exception:', err);
      return [];
    }
  },

  /**
   * Delete an AI conversation
   */
  async deleteConversation(userId, conversationId) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true };
    }
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', userId);

      return { error };
    } catch (err) {
      console.error('[aiCoachSupabaseService.deleteConversation] Exception:', err);
      return { error: err };
    }
  },
};

export default aiCoachSupabaseService;
