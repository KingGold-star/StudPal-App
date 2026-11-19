// src/services/supabase/communityService.js
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const communitySupabaseService = {
  /**
   * Fetch all communities from Supabase
   */
  async getCommunities() {
    if (!isSupabaseConfigured()) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) {
        console.warn('[communitySupabaseService.getCommunities] Error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('[communitySupabaseService.getCommunities] Exception:', err);
      return [];
    }
  },

  /**
   * Fetch list of community IDs joined by user
   */
  async getUserJoinedCommunityIds(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId);

      if (error) {
        console.warn('[communitySupabaseService.getUserJoinedCommunityIds] Error:', error.message);
        return [];
      }
      return (data || []).map((row) => row.community_id);
    } catch (err) {
      console.error('[communitySupabaseService.getUserJoinedCommunityIds] Exception:', err);
      return [];
    }
  },

  /**
   * Join a community
   */
  async joinCommunity(userId, communityId) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true };
    }
    try {
      const { data, error } = await supabase
        .from('community_members')
        .upsert({
          community_id: communityId,
          user_id: userId,
          joined_at: new Date().toISOString(),
        }, { onConflict: 'community_id,user_id' });

      // Increment community member count via RPC or direct update
      const { data: comm } = await supabase
        .from('communities')
        .select('member_count')
        .eq('id', communityId)
        .single();

      if (comm) {
        await supabase
          .from('communities')
          .update({ member_count: (comm.member_count || 0) + 1 })
          .eq('id', communityId);
      }

      return { data, error };
    } catch (err) {
      console.error('[communitySupabaseService.joinCommunity] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Leave a community
   */
  async leaveCommunity(userId, communityId) {
    if (!isSupabaseConfigured() || !userId) {
      return { success: true };
    }
    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);

      // Decrement member count
      const { data: comm } = await supabase
        .from('communities')
        .select('member_count')
        .eq('id', communityId)
        .single();

      if (comm && comm.member_count > 0) {
        await supabase
          .from('communities')
          .update({ member_count: Math.max(0, comm.member_count - 1) })
          .eq('id', communityId);
      }

      return { error };
    } catch (err) {
      console.error('[communitySupabaseService.leaveCommunity] Exception:', err);
      return { error: err };
    }
  },

  /**
   * Create a new community
   */
  async createCommunity(userId, community) {
    if (!isSupabaseConfigured()) {
      return { data: community, error: null };
    }
    try {
      const payload = {
        id: community.id || 'comm_' + Date.now(),
        title: community.name || community.title,
        category: community.category || 'General',
        description: community.description || '',
        member_count: 1,
        icon_name: community.iconName || 'users',
        color: community.color || '#2563EB',
        is_verified: false,
        created_by: userId || null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('communities').insert(payload).select().single();

      if (userId && !error) {
        await supabase.from('community_members').insert({
          community_id: payload.id,
          user_id: userId,
          joined_at: new Date().toISOString(),
        });
      }

      return { data, error };
    } catch (err) {
      console.error('[communitySupabaseService.createCommunity] Exception:', err);
      return { data: null, error: err };
    }
  },
};

export default communitySupabaseService;
